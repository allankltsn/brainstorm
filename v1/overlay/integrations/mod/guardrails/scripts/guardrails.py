#!/usr/bin/env python3
"""Consulta e renova o orçamento de sessão do mod guardrails. Só biblioteca padrão.

Uso (na raiz do projeto):
    python .claude/scripts/guardrails.py status
    python .claude/scripts/guardrails.py renovar --chamadas 200 --por "Seu Nome"
    python .claude/scripts/guardrails.py limites --max-chamadas 600

Renovar e mudar limites são decisões humanas: rode você mesmo no terminal.
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
import os
import sys
import tempfile
from pathlib import Path

ESTADO = Path(".claude") / "guardrails"
PADRAO = {"max_chamadas": 400, "max_subagentes": 30, "max_repeticoes": 5, "max_tokens": 0}


def gravar(caminho: Path, dados) -> None:
    caminho.parent.mkdir(parents=True, exist_ok=True)
    fd, tmp = tempfile.mkstemp(dir=str(caminho.parent), suffix=".tmp")
    with os.fdopen(fd, "w", encoding="utf-8") as f:
        json.dump(dados, f, ensure_ascii=False, indent=2)
        f.write("\n")
    os.replace(tmp, caminho)


def ler(caminho: Path) -> dict:
    try:
        return json.loads(caminho.read_text(encoding="utf-8"))
    except Exception:
        return {}


def erro(msg: str):
    print(f"erro: {msg}", file=sys.stderr)
    sys.exit(1)


def main(argv=None):
    ap = argparse.ArgumentParser(prog="guardrails.py", description=__doc__.split("\n")[0])
    ap.add_argument("--projeto", default=".", help="raiz do projeto (padrão: diretório atual)")
    sub = ap.add_subparsers(dest="cmd", required=True)
    sub.add_parser("status")
    p = sub.add_parser("renovar")
    p.add_argument("--sessao")
    p.add_argument("--chamadas", type=int, default=0)
    p.add_argument("--subagentes", type=int, default=0)
    p.add_argument("--tokens", type=int, default=0)
    p.add_argument("--por")
    p = sub.add_parser("limites")
    for k in PADRAO:
        p.add_argument("--" + k.replace("_", "-"), type=int)
    a = ap.parse_args(argv)

    base = Path(a.projeto).resolve() / ESTADO
    cfg_arq = base / "config.json"
    cfg = ler(cfg_arq)
    limites = {**PADRAO, **cfg.get("orcamento", {})}
    arquivos = sorted((base / "sessoes").glob("*.json"), key=lambda x: x.stat().st_mtime) if (base / "sessoes").is_dir() else []

    if a.cmd == "status":
        print(f"Limites: {limites}")
        if not arquivos:
            print("Nenhuma sessão registrada.")
        for arq in arquivos[-10:]:
            s = ler(arq)
            print(f"  {arq.stem}: chamadas {s.get('chamadas', 0)}, subagentes {s.get('subagentes', 0)}, "
                  f"tokens ~{s.get('tokens', 0)}, crédito {s.get('credito', {})}, "
                  f"conteúdo externo {'sim' if s.get('conteudo_externo') else 'não'}, "
                  f"alertas de injeção {s.get('injecao_suspeita', 0)}")
        return
    if a.cmd == "limites":
        novos = {k: getattr(a, k) for k in PADRAO if getattr(a, k) is not None}
        if not novos:
            erro("informe ao menos um limite, por exemplo --max-chamadas 600")
        cfg.setdefault("orcamento", {}).update(novos)
        gravar(cfg_arq, cfg)
        print(f"Limites gravados: {dict(PADRAO, **cfg['orcamento'])}")
        return
    if not a.por:
        erro("informe quem autoriza com --por NOME (decisão humana)")
    if not (a.chamadas or a.subagentes or a.tokens):
        erro("informe ao menos um de --chamadas, --subagentes ou --tokens")
    alvo = base / "sessoes" / f"{a.sessao}.json" if a.sessao else (arquivos[-1] if arquivos else None)
    if not alvo or not alvo.is_file():
        erro("sessão não encontrada")
    s = ler(alvo)
    c = s.setdefault("credito", {})
    for k in ("chamadas", "subagentes", "tokens"):
        c[k] = int(c.get(k, 0)) + int(getattr(a, k))
    s["avisou_80"] = False
    agora = dt.datetime.now(dt.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    s.setdefault("renovacoes", []).append({"por": a.por, "quando": agora, "chamadas": a.chamadas,
                                           "subagentes": a.subagentes, "tokens": a.tokens})
    gravar(alvo, s)
    print(f"Orçamento da sessão {alvo.stem} renovado por {a.por}: crédito {c}")


if __name__ == "__main__":
    main()
