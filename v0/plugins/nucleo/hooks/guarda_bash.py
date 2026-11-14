#!/usr/bin/env python3
"""PreToolUse (Bash): bloqueia comandos destrutivos e pede confirmação para produção.

É uma barreira de proteção, não um sandbox: comandos ofuscados podem escapar.
"""
from __future__ import annotations

import re
import shlex
import subprocess
import sys

from comum import (caminho_sessao, config, entrada, ler_json, negar, perguntar,
                   raiz_projeto, sensivel)

PREFIXOS = {"sudo", "command", "time", "nohup", "exec", "builtin"}
SHELLS = {"sh", "bash", "zsh", "dash"}
SEM_EXPOR = {"ls", "touch", "test", "[", "rm", "chmod", "chown", "stat", "mkdir", "source", "."}
LEITORES_ESTADO = {"cat", "less", "head", "tail", "jq", "ls", "stat", "wc", "grep", "rg"}
PRODUCAO = {
    "kubectl": {"apply", "delete", "scale", "rollout", "patch", "edit", "drain", "cordon", "replace", "set",
                "create", "annotate", "label", "exec"},
    "helm": {"upgrade", "install", "uninstall", "rollback", "delete"},
    "terraform": {"apply", "destroy", "import", "state", "taint"},
    "tofu": {"apply", "destroy", "import", "state", "taint"},
    "wrangler": {"deploy", "publish", "delete", "rollback", "secret"},
    "docker": {"push"},
    "ssh": None,
    "scp": None,
}


class Decisao:
    def __init__(self):
        self.negar: list[str] = []
        self.perguntar: list[str] = []


def segmentos(cmd: str):
    """Divide o comando em comandos simples. Devolve None se não der para analisar."""
    try:
        lex = shlex.shlex(cmd.replace("\n", " ; "), posix=True, punctuation_chars=True)
        lex.whitespace_split = True
        toks = list(lex)
    except ValueError:
        return None
    segs, cur = [], []
    for t in toks:
        if t and set(t) <= set(";&|()"):
            if cur:
                segs.append(cur)
            cur = []
        else:
            cur.append(t)
    if cur:
        segs.append(cur)
    return segs


def normalizar(seg: list[str]) -> list[str]:
    """Remove prefixos (sudo, VAR=valor, npx, pnpm exec) para achar o comando real."""
    s = list(seg)
    while s:
        t = s[0]
        if t in PREFIXOS or (re.match(r"^[A-Za-z_][A-Za-z0-9_]*=", t) and len(s) > 1):
            s = s[1:]
        elif t == "env" and len(s) > 1:
            s = s[1:]
        elif t in ("npx", "bunx"):
            s = [x for x in s[1:] if x not in ("-y", "--yes")]
        elif t in ("pnpm", "yarn", "npm") and len(s) > 2 and s[1] in ("exec", "dlx", "x"):
            s = s[2:]
        elif t == "xargs":
            s = [x for x in s[1:] if not x.startswith("-")]
        else:
            break
    return s


def ramo_atual(cwd: str | None) -> str:
    try:
        r = subprocess.run(["git", "symbolic-ref", "--short", "HEAD"], cwd=cwd or None, capture_output=True,
                           text=True, timeout=5)
        return r.stdout.strip()
    except Exception:
        return ""


def sub_git(s: list[str]):
    i = 1
    while i < len(s):
        if s[i] in ("-C", "-c", "--git-dir", "--work-tree"):
            i += 2
        elif s[i].startswith("-"):
            i += 1
        else:
            return s[i], s[i + 1:]
    return "", []


def analisar_git(s, d: Decisao, cfg, cwd):
    sub, args = sub_git(s)
    protegidos = set(cfg["ramos_protegidos"])
    if sub == "push":
        if "--no-verify" in args:
            d.negar.append("git push --no-verify pula as verificações")
        if any(a in ("-f", "--force", "--all", "--mirror") for a in args):
            d.negar.append("push forçado ou em massa (--force, --all, --mirror)")
        if any(a.startswith("--force-with-lease") for a in args):
            d.perguntar.append("push com --force-with-lease reescreve histórico remoto")
        if any(a in ("--delete", "-d") for a in args):
            d.perguntar.append("apagar ramo remoto")
        pos = [a for a in args if not a.startswith("-")]
        refs = pos[1:]
        for r in refs:
            if r.startswith("+"):
                d.negar.append("refspec com + força o push")
            if r.startswith(":"):
                d.perguntar.append("apagar ramo remoto")
            destino = r.lstrip("+").split(":")[-1].replace("refs/heads/", "")
            if destino in protegidos:
                d.negar.append(f"push direto no ramo protegido '{destino}': abra um pull request")
        if not refs and ramo_atual(cwd) in protegidos:
            d.negar.append("push a partir de um ramo protegido: crie um ramo de trabalho e abra um pull request")
    elif sub == "commit":
        if "--no-verify" in args or any(re.fullmatch(r"-[a-zA-Z]*n[a-zA-Z]*", a) for a in args):
            d.negar.append("git commit --no-verify pula as verificações")
    elif sub == "reset" and "--hard" in args:
        d.perguntar.append("git reset --hard descarta alterações locais")
    elif sub == "clean" and any(a.startswith("-") and "f" in a for a in args):
        d.perguntar.append("git clean -f apaga arquivos não rastreados")
    elif sub == "branch" and "-D" in args:
        d.perguntar.append("git branch -D apaga ramo sem conferir o merge")
    return sub


def analisar_rm(s, d: Decisao):
    flags = "".join(a.lstrip("-") for a in s[1:] if a.startswith("-") and not a.startswith("--"))
    recursivo = "r" in flags or "R" in flags or "--recursive" in s
    if not recursivo:
        return
    for a in s[1:]:
        if a.startswith("-"):
            continue
        t = a.rstrip("/")
        if (t in ("", "~", ".", "..", "*", "$HOME", "${HOME}", ".git", "~/*", "./*", "/*")
                or re.fullmatch(r"/[^/]+(/\*)?", t)):
            d.negar.append(f"rm recursivo em alvo amplo ('{a}')")


def analisar_sensiveis(s, sub, d: Decisao):
    cmd = s[0].rsplit("/", 1)[-1]
    if cmd in SEM_EXPOR or (cmd == "git" and sub in ("check-ignore", "rm", "ls-files", "status")):
        return
    if cmd in ("grep", "rg"):
        flags = [a for a in s[1:] if a.startswith("-")]
        curtos = "".join(a[1:] for a in flags if not a.startswith("--"))
        so_onde = (any(c in curtos for c in "lcq")
                   or any(a in ("--count", "--files-with-matches", "--quiet") for a in flags))
        if so_onde and not any(c in curtos for c in "nABCo"):
            return
    pos = [a for a in s[1:] if not a.startswith("-")]
    for i, a in enumerate(s[1:], start=1):
        alvo = a.split("=", 1)[1] if a.startswith("--") and "=" in a else a.lstrip("@<")
        if not sensivel(alvo):
            continue
        anterior = s[i - 1]
        if anterior in (">", ">>", "--env-file") or a.startswith("--env-file="):
            continue
        if cmd == "cp" and pos and a == pos[-1] and len(pos) > 1 and not any(sensivel(p) for p in pos[:-1]):
            continue
        nome = alvo.rsplit("/", 1)[-1]
        d.negar.append(f"comando expõe ou versiona arquivo sensível ('{nome}'); "
                       "para procurar segredos use só listagem ou contagem (grep -l, grep -c)")


def analisar_estado(s, d: Decisao):
    def cita(a):  # o caminho pode vir dentro de código (python -c, node -e)
        return bool(re.search(r"\.agentes/(estado\.json|config\.json|sessoes)", a))

    if not any(cita(a) for a in s):
        return
    cmd = s[0].rsplit("/", 1)[-1]
    escreve = any(s[i] in (">", ">>") and cita(s[i + 1]) for i in range(len(s) - 1))
    if cmd not in LEITORES_ESTADO or escreve:
        d.negar.append("o estado em .agentes/ só muda pela CLI 'agentes' (portões e orçamento são decisão humana)")


def analisar_producao(s, d: Decisao):
    cmd = s[0].rsplit("/", 1)[-1]
    resto = s[1:]
    if cmd in PRODUCAO:
        subs = PRODUCAO[cmd]
        if subs is None or any(a in subs for a in resto):
            d.perguntar.append(f"'{cmd}' altera ambiente remoto ou de produção")
    elif cmd == "vercel":
        if any(a in ("--prod", "--production") for a in resto) or any(
                a in ("promote", "rollback", "remove", "rm", "alias", "domains", "dns") for a in resto):
            d.perguntar.append("comando da Vercel que afeta produção, domínio ou DNS")
    elif cmd == "prisma":
        if "migrate" in resto and any(a in ("deploy", "reset") for a in resto):
            d.perguntar.append("migração de banco (prisma migrate deploy/reset)")
        if resto[:2] == ["db", "push"]:
            d.perguntar.append("prisma db push altera o esquema do banco")
    elif cmd in ("npm", "pnpm", "yarn") and resto[:1] == ["publish"]:
        d.perguntar.append("publicar pacote")
    elif cmd == "gh":
        par = resto[:2]
        if par in (["pr", "merge"], ["release", "create"], ["release", "delete"], ["repo", "delete"],
                   ["secret", "set"], ["workflow", "run"]):
            d.perguntar.append(f"gh {' '.join(par)} tem efeito externo")
    elif cmd in ("agentes", "agentes.py") or (cmd.startswith("python") and any(
            a.rsplit("/", 1)[-1] in ("agentes", "agentes.py") for a in resto)):
        junto = " ".join(resto)
        if re.search(r"\bportao\s+(aprovar|rejeitar)\b", junto):
            d.perguntar.append("aprovar ou rejeitar um portão é decisão humana")
        if re.search(r"\borcamento\s+renovar\b", junto):
            d.perguntar.append("renovar o orçamento da sessão é decisão humana")


def analisar_segmento(seg, d: Decisao, cfg, cwd, nivel=0):
    s = normalizar(seg)
    if not s:
        return
    cmd = s[0].rsplit("/", 1)[-1]
    if cmd in SHELLS and "-c" in s and nivel < 3:
        i = s.index("-c")
        if i + 1 < len(s):
            analisar(s[i + 1], d, cfg, cwd, nivel + 1)
        return
    if s == ["env"] or cmd == "printenv" or s == ["set"] or s[:2] == ["export", "-p"]:
        d.negar.append("despejar variáveis de ambiente expõe segredos; consulte uma variável específica")
    if cmd == "rm":
        analisar_rm(s, d)
    if cmd == "chmod" and any(a.startswith("-") and "R" in a for a in s[1:]) and "777" in s:
        d.negar.append("chmod -R 777")
    if cmd in ("mkfs", "dd") and (cmd == "mkfs" or any(a.startswith("of=/dev/") for a in s[1:])):
        d.negar.append("escrita direta em dispositivo")
    sub = analisar_git(s, d, cfg, cwd) if cmd == "git" else ""
    analisar_sensiveis(s, sub, d)
    analisar_estado(s, d)
    analisar_producao(s, d)


def analisar(cmd: str, d: Decisao, cfg, cwd, nivel=0):
    if re.search(r"\b(curl|wget)\b[^|;&]*\|\s*(sudo\s+)?(ba|z|da)?sh\b", cmd):
        d.negar.append("baixar e executar script direto no shell (curl | sh): baixe, leia e só então execute")
    if re.search(r"\b(drop\s+(database|schema|table)|truncate\s+table)\b", cmd, re.I):
        d.perguntar.append("comando SQL destrutivo")
    for p in cfg.get("bash_negar", []):
        if re.search(p, cmd):
            d.negar.append(f"regra do projeto (bash_negar): {p}")
    for p in cfg.get("bash_perguntar", []):
        if re.search(p, cmd):
            d.perguntar.append(f"regra do projeto (bash_perguntar): {p}")
    segs = segmentos(cmd)
    if segs is None:  # aspas desbalanceadas: checagem mínima no texto bruto
        if re.search(r"--no-verify|\brm\s+-[a-zA-Z]*r[a-zA-Z]*\s+(/|~)(\s|$)", cmd):
            d.negar.append("comando não analisável com padrão perigoso")
        return
    for seg in segs:
        analisar_segmento(seg, d, cfg, cwd, nivel)


def main():
    dados = entrada()
    cmd = (dados.get("tool_input") or {}).get("command") or ""
    if not cmd.strip():
        sys.exit(0)
    raiz = raiz_projeto(dados)
    cfg = config(raiz)
    d = Decisao()
    analisar(cmd, d, cfg, dados.get("cwd"))
    if d.negar:
        negar("; ".join(dict.fromkeys(d.negar)))
    if d.perguntar:
        motivo = "; ".join(dict.fromkeys(d.perguntar))
        if raiz and ler_json(caminho_sessao(raiz, dados), {}).get("conteudo_externo"):
            aviso = "esta sessão leu conteúdo externo (web ou MCP), que pode conter instruções maliciosas"
            if cfg.get("producao_apos_conteudo_externo") == "negar":
                negar(f"{motivo}; {aviso}. Rode o comando você mesmo, fora do agente")
            motivo += f". ATENÇÃO: {aviso}"
        perguntar(motivo)
    sys.exit(0)


if __name__ == "__main__":
    try:
        main()
    except SystemExit:
        raise
    except Exception as e:  # falha do hook não deve travar o trabalho
        print(f"[nucleo] aviso: guarda_bash falhou ({e.__class__.__name__})", file=sys.stderr)
        sys.exit(0)
