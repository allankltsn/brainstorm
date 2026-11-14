#!/usr/bin/env python3
"""Monta e instala a v1: o guilda oficial mais a sobreposição desta pasta.

    python scripts/guilda_v1.py montar [--guilda CAMINHO | --clonar] [--python python3]
    python scripts/guilda_v1.py instalar <projeto> [--dry-run] [--sem-mod] [--perfis a,b]
    python scripts/guilda_v1.py verificar

A sobreposição é só aditiva: nenhum arquivo do guilda é alterado, exceto três junções
mecânicas (catálogo, lista de payload e registro do mod), que falham se o guilda mudar de forma.
Python 3.11+, só biblioteca padrão.
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

V1 = Path(__file__).resolve().parents[1]
OVERLAY = V1 / "overlay"
BUILD = V1 / "build" / "guilda"
BASE_VERSAO = "2.0.0"
BASE_TAG = "v2.0.0"
REPO = "https://github.com/allankltsn/guilda"
SUFIXO = "+v1"
COPIAR = ("guilda", "core", "profiles", "adapters", "integrations", "scripts")
ARQUIVOS = ("template.json", "install.py", "LICENSE")
PERFIS = ("base,product-team,github-projects,polyrepo,vps-k3s,"
          "external-first,product-discovery,nestjs-prisma,edge-cloudflare-vercel,guardrails")
MOD = '''    "guardrails": {
        "summary": "bloqueia comandos destrutivos e leitura de segredos, pede confirmação para produção, aplica teto de custo por sessão e alerta sobre prompt injection",
        "warning": "este mod BLOQUEIA comandos e leituras (segredos, destrutivos, push em ramo protegido) e INTERROMPE o trabalho ao atingir o teto de chamadas da sessão",
        "scripts": {"scripts/guardrails.py": "guardrails.py"},
    },
'''


class Erro(Exception):
    pass


def achar_guilda(informado: str | None) -> Path:
    candidatos = [informado, os.environ.get("GUILDA_SRC"), V1.parents[1] / "guilda",
                  V1.parents[1] / "allankltsn" / "guilda", V1 / "build" / "_fonte"]
    for c in candidatos:
        if c and (Path(c) / "template.json").is_file() and (Path(c) / "guilda" / "engine.py").is_file():
            return Path(c).resolve()
    raise Erro("checkout do guilda não encontrado. Informe --guilda CAMINHO, defina GUILDA_SRC ou use --clonar")


def clonar() -> Path:
    destino = V1 / "build" / "_fonte"
    if (destino / "template.json").is_file():
        return destino
    destino.parent.mkdir(parents=True, exist_ok=True)
    r = subprocess.run(["git", "clone", "--quiet", "--depth", "1", "--branch", BASE_TAG, REPO, str(destino)],
                       capture_output=True, text=True)
    if r.returncode != 0:
        raise Erro(f"não foi possível clonar {REPO} na tag {BASE_TAG}: {r.stderr.strip()[:200]}")
    return destino


def arquivos_overlay() -> list[str]:
    return sorted(p.relative_to(OVERLAY).as_posix() for p in OVERLAY.rglob("*")
                  if p.is_file() and p.name != "catalog-additions.json" and "__pycache__" not in p.parts)


def montar(fonte: Path, destino: Path = BUILD, python: str = "python3", aceitar_versao: bool = False) -> dict:
    base = json.loads((fonte / "template.json").read_text(encoding="utf-8"))
    if base.get("name") != "guilda":
        raise Erro(f"{fonte} não é o guilda (name = {base.get('name')!r})")
    if base.get("version") != BASE_VERSAO and not aceitar_versao:
        raise Erro(f"a sobreposição foi escrita para o guilda {BASE_VERSAO}; a fonte está em {base.get('version')}. "
                   "Revise a sobreposição e use --aceitar-versao para montar mesmo assim")

    if destino.exists():
        shutil.rmtree(destino)
    destino.mkdir(parents=True)
    ignorar = shutil.ignore_patterns("__pycache__", "_data", "graphify-out", "*.pyc")
    for nome in COPIAR:
        shutil.copytree(fonte / nome, destino / nome, ignore=ignorar)
    for nome in ARQUIVOS:
        if (fonte / nome).is_file():
            shutil.copy2(fonte / nome, destino / nome)

    # 1. arquivos novos (nunca sobrescreve um arquivo do guilda)
    novos = arquivos_overlay()
    for rel in novos:
        alvo = destino / rel
        if alvo.exists():
            raise Erro(f"conflito: o guilda já tem '{rel}'. Renomeie na sobreposição ou proponha a mudança ao guilda")
        alvo.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(OVERLAY / rel, alvo)

    # 2. catálogo: acrescenta papéis e ações
    extra = json.loads((OVERLAY / "catalog-additions.json").read_text(encoding="utf-8"))
    for tipo in ("roles", "actions"):
        existentes = {x["id"] for x in base[tipo]}
        for item in extra[tipo]:
            if item["id"] in existentes:
                raise Erro(f"conflito: o guilda já tem {tipo[:-1]} '{item['id']}'")
            base[tipo].append(item)
    base["version"] = base["version"] + SUFIXO
    (destino / "template.json").write_text(json.dumps(base, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    # 3. lista de payload
    lista = destino / "guilda" / "payload.txt"
    entradas = {l.strip() for l in lista.read_text(encoding="utf-8").splitlines() if l.strip()} | set(novos)
    lista.write_text("".join(f"{e}\n" for e in sorted(entradas)), encoding="utf-8", newline="\n")

    # 4. registro do mod (o guilda mantém a lista de mods no código)
    mods = destino / "guilda" / "mods.py"
    texto = mods.read_text(encoding="utf-8")
    ancora = "MODS = {\n"
    if texto.count(ancora) != 1:
        raise Erro("guilda/mods.py mudou de forma: âncora 'MODS = {' não encontrada uma única vez")
    mods.write_text(texto.replace(ancora, ancora + MOD), encoding="utf-8")

    # 5. interpretador dos hooks
    hj = destino / "integrations" / "mod" / "guardrails" / "hooks" / "hooks.json"
    hj.write_text(hj.read_text(encoding="utf-8").replace('"python3 ', f'"{python} '), encoding="utf-8")

    commit = subprocess.run(["git", "-C", str(fonte), "rev-parse", "HEAD"], capture_output=True, text=True).stdout.strip()
    info = {"base": {"version": BASE_VERSAO, "commit": commit or "desconhecido"}, "version": base["version"],
            "montado_em": dt.datetime.now(dt.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
            "papeis_novos": [r["id"] for r in extra["roles"]], "acoes_novas": [a["id"] for a in extra["actions"]],
            "arquivos_novos": novos}
    (destino / "BUILD.json").write_text(json.dumps(info, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    validar(destino)
    return info


def validar(destino: Path) -> None:
    """Carrega a árvore com o motor do próprio guilda e confere a tabela de resolução."""
    codigo = ("import sys, json; sys.path.insert(0, '.'); from guilda import engine, mods; "
              "s, c, f = engine.load_source('.'); assert 'guardrails' in mods.MODS; "
              "print(json.dumps([r['id'] for r in c['roles']]))")
    r = subprocess.run([sys.executable, "-c", codigo], cwd=destino, capture_output=True, text=True)
    if r.returncode != 0:
        raise Erro("o motor do guilda rejeitou a árvore montada: " + (r.stderr.strip().splitlines() or ["?"])[-1])
    papeis = set(json.loads(r.stdout.strip().splitlines()[-1]))
    res = json.loads((destino / "integrations" / "plugins" / "resolution.json").read_text(encoding="utf-8"))
    if set(res["roles"]) != papeis:
        raise Erro(f"resolution.json difere do catálogo: faltam {sorted(papeis - set(res['roles']))}, "
                   f"sobram {sorted(set(res['roles']) - papeis)}")
    for nome, item in res["roles"].items():
        if item["prefer"] not in ("external", "canonical"):
            raise Erro(f"resolution.json: prefer inválido em {nome}")
        if item["prefer"] == "external" and not item["external"]:
            raise Erro(f"resolution.json: {nome} prefere externo mas não lista candidatos")
    for n in res["needs"]:
        if n["fallback"] is not None and n["fallback"] not in papeis:
            raise Erro(f"resolution.json: fallback '{n['fallback']}' da necessidade '{n['need']}' não existe")


def instalar(projeto: Path, perfis: str | None, mod: bool, dry_run: bool, destino: Path = BUILD) -> int:
    if not (destino / "BUILD.json").is_file():
        raise Erro("rode 'montar' antes de instalar")
    manifesto = projeto / ".engineering" / "manifest.json"
    cmd = [sys.executable, str(destino / "install.py"), str(projeto)]
    if not manifesto.is_file() or perfis:
        cmd += ["--providers", "claude", "--profiles", perfis or PERFIS]
    if mod:
        cmd += ["--mod", "guardrails"]
    if dry_run:
        cmd.append("--dry-run")
    return subprocess.run(cmd, cwd=destino).returncode


def verificar(fonte: Path) -> None:
    with tempfile.TemporaryDirectory() as tmp:
        arvore, projeto = Path(tmp) / "guilda", Path(tmp) / "projeto"
        info = montar(fonte, arvore)
        projeto.mkdir()
        r = subprocess.run([sys.executable, str(arvore / "install.py"), str(projeto), "--providers", "claude",
                            "--profiles", PERFIS], cwd=arvore, capture_output=True, text=True)
        if r.returncode != 0:
            raise Erro("instalação de teste falhou: " + (r.stderr or r.stdout).strip()[-300:])
        agentes = sorted(p.stem for p in (projeto / ".claude" / "agents").glob("*.md"))
        faltam = [x for x in info["papeis_novos"] if x not in agentes]
        if faltam:
            raise Erro(f"papéis novos não foram gerados: {faltam}")
        print(f"ok: guilda {info['version']} montado sobre {info['base']['commit'][:7]}; "
              f"{len(info['arquivos_novos'])} arquivos novos; {len(agentes)} agentes instalados no projeto de teste")


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(prog="guilda_v1.py", description=__doc__.split("\n")[0])
    sub = ap.add_subparsers(dest="cmd", required=True)
    p = sub.add_parser("montar", help="gera build/guilda (guilda + sobreposição)")
    p.add_argument("--guilda")
    p.add_argument("--clonar", action="store_true", help=f"clona {REPO} na tag {BASE_TAG}")
    p.add_argument("--python", default="python3", help="interpretador usado pelos hooks (no Windows: python)")
    p.add_argument("--aceitar-versao", action="store_true")
    p = sub.add_parser("instalar", help="instala a árvore montada num projeto")
    p.add_argument("projeto", type=Path)
    p.add_argument("--perfis")
    p.add_argument("--sem-mod", action="store_true")
    p.add_argument("--dry-run", action="store_true")
    p = sub.add_parser("verificar", help="monta e instala num diretório temporário")
    p.add_argument("--guilda")
    a = ap.parse_args(argv)
    try:
        if a.cmd == "montar":
            fonte = clonar() if a.clonar else achar_guilda(a.guilda)
            info = montar(fonte, python=a.python, aceitar_versao=a.aceitar_versao)
            print(f"montado em {BUILD}: guilda {info['version']} (base {info['base']['commit'][:7]}), "
                  f"{len(info['papeis_novos'])} papéis, {len(info['acoes_novas'])} ações e "
                  f"{len(info['arquivos_novos'])} arquivos novos")
            return 0
        if a.cmd == "instalar":
            return instalar(a.projeto.resolve(), a.perfis, not a.sem_mod, a.dry_run)
        verificar(achar_guilda(a.guilda))
        return 0
    except Erro as e:
        print(f"erro: {e}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
