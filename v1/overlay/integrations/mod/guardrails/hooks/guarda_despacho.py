#!/usr/bin/env python3
"""PreToolUse (Agent, Task): nenhum especialista é despachado sem referência a um card.

O briefing precisa de uma linha 'Card: dono/repo#N' (ou 'Card: #N'). Só confere a presença:
não consulta o GitHub. O estado do card é verificado pela auditoria do quadro.
Desligue com "exigir_card": false em .claude/guardrails/config.json.
"""
from __future__ import annotations

import re
import sys

from comum import config, entrada, negar, raiz_projeto

CARD = re.compile(r"(?im)^\s*(?:[-*]\s*)?\**card\**\s*:\**\s*(?:[\w.-]+/[\w.-]+)?#\d+")


def main():
    dados = entrada()
    cfg = config(raiz_projeto(dados))
    if not cfg.get("exigir_card", True):
        sys.exit(0)
    ti = dados.get("tool_input") or {}
    tipo = str(ti.get("subagent_type") or "")
    isentos = {x.lower() for x in cfg.get("card_isentos", [])}
    if tipo.lower() in isentos:
        sys.exit(0)
    if CARD.search(str(ti.get("prompt") or "")):
        sys.exit(0)
    negar(f"despacho de '{tipo or 'agente'}' sem card. Inclua no briefing uma linha 'Card: dono/repo#N' com a issue "
          "desta tarefa. Se o card não existe, crie-o primeiro (product-owner) e passe pela auditoria do quadro")


if __name__ == "__main__":
    try:
        main()
    except SystemExit:
        raise
    except Exception as e:
        print(f"[guardrails] aviso: guarda_despacho falhou ({e.__class__.__name__})", file=sys.stderr)
        sys.exit(0)
