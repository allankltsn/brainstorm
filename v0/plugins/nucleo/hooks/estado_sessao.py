#!/usr/bin/env python3
"""SessionStart: mostra ao agente a fase atual, o portão e onde está a CLI."""
from __future__ import annotations

import sys
from pathlib import Path

from comum import contexto, entrada, ler_json, raiz_projeto

PLUGIN = Path(__file__).resolve().parents[1]


def main():
    dados = entrada()
    raiz = raiz_projeto(dados)
    if not raiz:
        sys.exit(0)
    est = ler_json(raiz / ".agentes" / "estado.json", {})
    if not est:
        sys.exit(0)
    fluxo = ler_json(PLUGIN / "skills" / "orquestrar" / "fluxo.json", {})
    fases = {f["id"]: f for f in fluxo.get("fases", [])}
    cli = f'python3 "{PLUGIN / "scripts" / "agentes.py"}"'
    if est.get("concluido"):
        situacao = "Ciclo concluído (todos os portões aprovados)."
    else:
        f = fases.get(est.get("fase_atual"), {})
        situacao = (f"Fase atual: {f.get('id')} {f.get('nome')}. Portão: {f.get('portao')}. "
                    f"Artefatos exigidos: {', '.join(f.get('artefatos', []))}.")
    contexto("SessionStart",
             f"[nucleo] Projeto com fluxo de agentes (perfil {est.get('perfil')}, autonomia {est.get('autonomia')}). "
             f"{situacao} Use a skill nucleo:orquestrar para conduzir o trabalho. CLI: {cli} "
             "(status, papeis, portao verificar). Aprovar portão e renovar orçamento são decisões humanas.")


if __name__ == "__main__":
    try:
        main()
    except SystemExit:
        raise
    except Exception as e:
        print(f"[nucleo] aviso: estado_sessao falhou ({e.__class__.__name__})", file=sys.stderr)
        sys.exit(0)
