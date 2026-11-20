#!/usr/bin/env python3
"""PreToolUse (todas as ferramentas): teto de custo por sessão e detecção de loop.

Guarda o estado em .claude/guardrails/sessoes. Conta chamadas de ferramenta e subagentes,
detecta a mesma chamada repetida em sequência e soma tokens da transcrição principal
(aproximação: transcrições de subagentes não entram na soma).
"""
from __future__ import annotations

import hashlib
import json
import os
import sys

from comum import caminho_sessao, config, entrada, ler_json, negar, raiz_projeto, salvar_json


def somar_tokens(dados: dict, st: dict) -> None:
    p = dados.get("transcript_path")
    if not p or not os.path.isfile(p):
        return
    off = int(st.get("offset", 0))
    if os.path.getsize(p) < off:
        off, st["tokens"] = 0, 0
    with open(p, "rb") as f:
        f.seek(off)
        bloco = f.read()
    fim = bloco.rfind(b"\n") + 1
    vistos = list(st.get("ids_recentes", []))
    total = 0
    for linha in bloco[:fim].splitlines():
        try:
            m = json.loads(linha).get("message")
        except Exception:
            continue
        if not isinstance(m, dict) or not isinstance(m.get("usage"), dict):
            continue
        mid = m.get("id")
        if mid and mid in vistos:
            continue
        if mid:
            vistos.append(mid)
        u = m["usage"]
        total += sum(int(u.get(k) or 0) for k in ("input_tokens", "output_tokens", "cache_creation_input_tokens"))
    st["offset"] = off + fim
    st["tokens"] = int(st.get("tokens", 0)) + total
    st["ids_recentes"] = vistos[-50:]


def main():
    dados = entrada()
    raiz = raiz_projeto(dados)
    lim = config(raiz)["orcamento"]
    caminho = caminho_sessao(raiz, dados)
    st = ler_json(caminho, {})
    credito = st.get("credito", {})
    ferramenta = dados.get("tool_name") or ""
    eh_subagente = ferramenta in ("Agent", "Task")

    h = hashlib.sha1((ferramenta + json.dumps(dados.get("tool_input"), sort_keys=True, default=str)).encode()).hexdigest()
    rep = int(st.get("repeticoes", 0)) + 1 if st.get("ultimo_hash") == h else 1
    st["ultimo_hash"], st["repeticoes"] = h, rep
    try:
        somar_tokens(dados, st)
    except Exception:
        pass

    chamadas = int(st.get("chamadas", 0)) + 1
    subs = int(st.get("subagentes", 0)) + (1 if eh_subagente else 0)
    motivo = None
    if lim["max_repeticoes"] and rep > lim["max_repeticoes"]:
        motivo = (f"loop detectado: a mesma chamada de {ferramenta} foi repetida {rep} vezes seguidas. "
                  "Mude a abordagem ou peça ajuda ao humano")
    elif lim["max_chamadas"] and chamadas > lim["max_chamadas"] + int(credito.get("chamadas", 0)):
        motivo = f"teto de {lim['max_chamadas']} chamadas de ferramenta por sessão atingido"
    elif eh_subagente and lim["max_subagentes"] and subs > lim["max_subagentes"] + int(credito.get("subagentes", 0)):
        motivo = f"teto de {lim['max_subagentes']} subagentes por sessão atingido"
    elif lim["max_tokens"] and int(st.get("tokens", 0)) > lim["max_tokens"] + int(credito.get("tokens", 0)):
        motivo = f"teto de {lim['max_tokens']} tokens por sessão atingido"

    if motivo:
        salvar_json(caminho, st)
        if not motivo.startswith("loop"):
            motivo += (". Pare, grave um handoff e avise o humano. Só ele pode liberar mais orçamento, "
                       "rodando 'python .claude/scripts/guardrails.py renovar' no terminal")
        negar(motivo)

    st["chamadas"], st["subagentes"] = chamadas, subs
    aviso = None
    if lim["max_chamadas"] and not st.get("avisou_80") and chamadas >= 0.8 * (lim["max_chamadas"] + int(credito.get("chamadas", 0))):
        st["avisou_80"] = True
        aviso = f"[guardrails] 80% do orçamento de chamadas da sessão usado ({chamadas})."
    salvar_json(caminho, st)
    if aviso:
        print(json.dumps({"systemMessage": aviso}, ensure_ascii=False))
    sys.exit(0)


if __name__ == "__main__":
    try:
        main()
    except SystemExit:
        raise
    except Exception as e:
        print(f"[guardrails] aviso: orcamento falhou ({e.__class__.__name__})", file=sys.stderr)
        sys.exit(0)
