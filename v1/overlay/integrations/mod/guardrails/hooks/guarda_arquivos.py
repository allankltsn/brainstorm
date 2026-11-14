#!/usr/bin/env python3
"""PreToolUse (Read, Edit, Write, MultiEdit, NotebookEdit, Grep): protege segredos e o estado.

- nega ler ou editar arquivos sensíveis (.env, chaves, credenciais);
- nega gravar segredos em qualquer arquivo (informa a classe do padrão, nunca o valor);
- nega editar o estado em .claude/guardrails/ (limites e orçamento só mudam pelo script).
"""
from __future__ import annotations

import fnmatch
import re
import sys

from comum import SENSIVEIS, arquivo_de_estado, entrada, negar, sensivel

PADROES = {
    "chave privada": r"-----BEGIN (?:RSA |EC |OPENSSH |DSA |PGP )?PRIVATE KEY-----",
    "chave de acesso AWS": r"\bAKIA[0-9A-Z]{16}\b",
    "token do GitHub": r"\b(?:gh[pousr]_[A-Za-z0-9]{36,}|github_pat_[A-Za-z0-9_]{50,})\b",
    "chave Stripe de produção": r"\b[sr]k_live_[0-9A-Za-z]{20,}\b",
    "chave de API Anthropic": r"\bsk-ant-[A-Za-z0-9_-]{20,}",
    "chave de API (sk-)": r"\bsk-[A-Za-z0-9]{40,}\b",
    "token do Slack": r"\bxox[baprs]-[A-Za-z0-9-]{10,}",
    "chave de API Google": r"\bAIza[0-9A-Za-z_-]{35}\b",
}


def texto_gravado(ferramenta: str, ti: dict) -> str:
    if ferramenta == "Write":
        return str(ti.get("content") or "")
    if ferramenta == "Edit":
        return str(ti.get("new_string") or "")
    if ferramenta == "MultiEdit":
        return "\n".join(str(e.get("new_string") or "") for e in ti.get("edits") or [] if isinstance(e, dict))
    if ferramenta == "NotebookEdit":
        return str(ti.get("new_source") or "")
    return ""


def main():
    dados = entrada()
    ferramenta = dados.get("tool_name") or ""
    ti = dados.get("tool_input") or {}
    caminho = str(ti.get("file_path") or ti.get("notebook_path") or ti.get("path") or "")
    escrita = ferramenta in ("Write", "Edit", "MultiEdit", "NotebookEdit")

    if ferramenta == "Grep":
        modo = ti.get("output_mode") or "files_with_matches"
        glob = str(ti.get("glob") or "")
        alvo_sensivel = sensivel(caminho) or any(fnmatch.fnmatch(glob.lower().lstrip("*/"), p) for p in SENSIVEIS if glob)
        if alvo_sensivel and modo == "content":
            negar("busca com conteúdo em arquivo sensível; use output_mode files_with_matches ou count "
                  "(reporte onde, nunca o quê)")
        sys.exit(0)

    if sensivel(caminho):
        nome = caminho.replace("\\", "/").rsplit("/", 1)[-1]
        negar(f"'{nome}' é arquivo sensível: o agente não lê nem edita segredos. "
              "Peça ao humano para ajustar o arquivo ou use um arquivo de exemplo (.env.example)")
    if escrita and arquivo_de_estado(caminho):
        negar("o estado em .claude/guardrails/ só muda pelo script guardrails.py (limites e orçamento são decisão humana)")
    if escrita:
        texto = texto_gravado(ferramenta, ti)
        achados = [nome for nome, p in PADROES.items() if re.search(p, texto)]
        if achados:
            negar("o conteúdo a gravar parece conter segredo (" + ", ".join(achados) + "). "
                  "Use variável de ambiente ou gerenciador de segredos; nunca grave o valor no repositório")
    sys.exit(0)


if __name__ == "__main__":
    try:
        main()
    except SystemExit:
        raise
    except Exception as e:
        print(f"[guardrails] aviso: guarda_arquivos falhou ({e.__class__.__name__})", file=sys.stderr)
        sys.exit(0)
