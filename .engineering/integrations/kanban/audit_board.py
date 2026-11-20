#!/usr/bin/env python3
"""Audita o quadro Kanban (GitHub Projects) contra o contrato workflow/kanban-board.md.

    python audit_board.py --arquivo quadro.json                 # audita um export (formato no README)
    python audit_board.py --owner DONO --projeto N              # lê o quadro com o gh (precisa de gh autenticado)
    python audit_board.py ... --json                            # saída para máquinas
    python audit_board.py --owner DONO --projeto N --aplicar    # corrige SÓ campos derivados (Etapa, Precisa de você, Gates)

Regras determinísticas, sem IA. Conteúdo (evidência, veredito, critério) nunca é corrigido: é cobrado do
responsável. Código de saída: 0 sem erros, 1 com erros, 2 em falha de leitura. Só biblioteca padrão.
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
import re
import subprocess
import sys
import unicodedata

STATUS = ["open", "pending", "in-progress", "in-review", "rejected", "blocked", "completed", "accepted", "closed"]
ETAPA = {"open": "A fazer", "pending": "A fazer", "in-progress": "Em andamento", "in-review": "Em validação",
         "rejected": "Em validação", "blocked": "Aguardando você", "completed": "Aguardando você",
         "accepted": "Concluído", "closed": "Concluído"}
PRECISA = {"blocked", "completed"}
TRANSICOES = {
    "open": {"pending", "blocked", "closed"},
    "pending": {"in-progress", "open", "blocked", "closed"},
    "in-progress": {"in-review", "blocked", "pending", "closed"},
    "in-review": {"completed", "rejected", "blocked", "in-progress"},
    "rejected": {"in-progress", "blocked", "closed"},
    "blocked": set(STATUS) - {"blocked", "completed", "accepted"},
    "completed": {"accepted", "in-progress", "rejected", "blocked"},
    "accepted": {"closed", "in-progress"},
    "closed": {"open"},
}
PRAZO_HORAS = {"in-progress": 24, "in-review": 24, "rejected": 24, "pending": 168, "blocked": 168, "open": 720}
RESUMO = ["O quê", "Por quê", "Agora", "Falta", "Precisa de você"]
GATES = ["review", "security", "qa"]
SIMBOLO = {"approved": "✔", "rejected": "✖", "pending": "…", "n/a": "–"}
VAZIO = re.compile(r"^(?:<[^>]*>|pending|n/?a|none|nenhum|tbd|-|—)?$", re.I)


def chave(s: str) -> str:
    s = unicodedata.normalize("NFKD", s or "").encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]", "", s.lower())


def secoes(corpo: str) -> dict[str, str]:
    """Divide o corpo por títulos '## ' e '### '. Chaves normalizadas (sem acento, minúsculas)."""
    out, atual, linhas = {}, None, []
    for linha in (corpo or "").replace("\r\n", "\n").split("\n"):
        m = re.match(r"^#{2,3}\s+(.*?)\s*$", linha)
        if m:
            if atual is not None:
                out[atual] = "\n".join(linhas).strip()
            atual, linhas = chave(m.group(1)), []
        elif atual is not None and not re.match(r"^\s*</?(details|summary)", linha):
            linhas.append(linha)
    if atual is not None:
        out[atual] = "\n".join(linhas).strip()
    return out


def preenchido(texto: str) -> bool:
    """Há conteúdo real, e não só marcadores de modelo (<...>), rótulos vazios ('Write: ') ou 'pending'?"""
    for linha in (texto or "").split("\n"):
        for parte in re.sub(r"<[^>]*>", "", linha).split("|"):
            t = re.sub(r"^[\s\-*]+", "", parte)
            t = re.sub(r"^\[[ xX]\]\s*", "", t)
            t = re.sub(r"\*\*[^*]*\*\*:?", "", t)
            t = re.sub(r"^[A-Za-zÀ-ÿ /]+:\s*", "", t.strip()).strip(" :-")
            if t and not VAZIO.match(t) and not set(t) <= set("-: "):
                return True
    return False


def caixas(texto: str):
    marcadas = len(re.findall(r"^\s*[-*]\s*\[[xX]\]", texto or "", re.M))
    total = len(re.findall(r"^\s*[-*]\s*\[[ xX]\]", texto or "", re.M))
    return marcadas, total


def tabela_gates(texto: str) -> dict[str, dict]:
    out = {}
    for linha in (texto or "").split("\n"):
        c = [x.strip() for x in linha.strip().strip("|").split("|")]
        if len(c) >= 4 and chave(c[0]) not in ("gate", "") and not set(c[0]) <= set("-: "):
            out[chave(c[0])] = {"instancia": c[1], "veredito": c[2].lower(), "sha": c[3],
                                "relatorio": c[4] if len(c) > 4 else ""}
    return out


def staffing_ok(texto: str) -> bool:
    """Ao menos uma linha da tabela com fonte e instância preenchidas."""
    for linha in (texto or "").split("\n"):
        c = [x.strip() for x in linha.strip().strip("|").split("|")]
        if len(c) >= 3 and chave(c[0]) != "function" and not set(c[0]) <= set("-: ") and preenchido(c[1]) and preenchido(c[2]):
            return True
    return False


def campo_gates(gates: dict) -> str:
    letras = [("R", "review"), ("S", "security"), ("P", "privacy"), ("Q", "qa")]
    return " ".join(f"{l}{SIMBOLO.get(gates.get(g, {}).get('veredito', 'pending'), '…')}" for l, g in letras)


def eventos_status(card: dict) -> list[dict]:
    """Linhas 'LOG STATUS | UTC | instância | id | de -> para | evidência' dos comentários."""
    evs = []
    for texto in card.get("log", []):
        for linha in str(texto).split("\n"):
            p = [x.strip() for x in linha.split("|")]
            if len(p) >= 5 and p[0].upper() == "LOG STATUS":
                m = re.match(r"^([a-z-]+)\s*(?:->|→)\s*([a-z-]+)$", p[4])
                if m:
                    evs.append({"utc": p[1], "instancia": p[2], "de": m.group(1), "para": m.group(2)})
    return evs


def hora(s: str | None):
    try:
        return dt.datetime.fromisoformat(str(s).replace("Z", "+00:00"))
    except Exception:
        return None


class Achado(dict):
    pass


def auditar(cards: list[dict], agora: dt.datetime, wip: int = 2) -> tuple[list[Achado], list[dict]]:
    """Devolve (achados, correções mecânicas)."""
    achados, correcoes = [], []

    def add(card, regra, sev, dono, msg):
        achados.append(Achado(regra=regra, severidade=sev, responsavel=dono, card=card.get("ref", "?"),
                              titulo=card.get("title", ""), mensagem=msg))

    em_andamento: dict[str, list[str]] = {}
    for c in cards:
        st = (c.get("status") or "").lower()
        ref = c.setdefault("ref", f"{c.get('repo', '?')}#{c.get('number', '?')}")
        agente = (c.get("agent") or "").strip()
        dono_entrega = agente.split("·")[0].strip() or "principal"
        s = secoes(c.get("body", ""))

        if st not in STATUS:
            add(c, "K-01", "erro", "scrum-master", f"Status '{c.get('status')}' não é um dos nove estados do contrato")
            continue
        if not re.match(r"^\[(?:[A-Z]{1,3}-\d+|task-\d+[a-z0-9-]*|bug-\d+|spike-\d+)\]\s+\S", c.get("title", "")):
            add(c, "K-02", "erro", "product-owner", "título fora do formato '[S-014] Título curto'")

        # campos derivados: correção mecânica
        for nome, atual, certo, regra in (
                ("Etapa", c.get("etapa"), ETAPA[st], "K-03"),
                ("Precisa de você", c.get("precisa"), "sim" if st in PRECISA else "não", "K-04")):
            if chave(atual or "") != chave(certo):
                add(c, regra, "aviso", "scrum-master", f"campo {nome} é '{atual or 'vazio'}', deveria ser '{certo}' (correção mecânica)")
                correcoes.append({"card": ref, "item_id": c.get("item_id"), "campo": nome, "valor": certo})
        gates = tabela_gates(s.get("gates", ""))
        certo = campo_gates(gates)
        if st not in ("open", "pending") and (c.get("gates") or "").strip() != certo:
            add(c, "K-05", "aviso", "scrum-master", f"campo Gates é '{c.get('gates') or 'vazio'}', a tabela diz '{certo}' (correção mecânica)")
            correcoes.append({"card": ref, "item_id": c.get("item_id"), "campo": "Gates", "valor": certo})

        # capa para humanos
        resumo = s.get("resumo", "")
        faltam = [r for r in RESUMO if not re.search(rf"\*\*{re.escape(r)}:?\*\*:?\s*\S", resumo)
                  or not preenchido(re.search(rf"\*\*{re.escape(r)}:?\*\*:?(.*)", resumo).group(1))]
        if faltam:
            add(c, "K-06", "erro", dono_entrega if st not in ("open", "pending") else "product-owner",
                "Resumo sem: " + ", ".join(faltam))
        elif len([l for l in resumo.split("\n") if l.strip()]) > 7:
            add(c, "K-06", "aviso", dono_entrega, "Resumo longo demais: mantenha cinco linhas curtas")
        m = re.search(r"\*\*Precisa de você:?\*\*:?\s*(sim|não|nao)", resumo, re.I)
        if m and (chave(m.group(1)) == "sim") != (st in PRECISA) and not faltam:
            add(c, "K-07", "erro", dono_entrega, f"o Resumo diz 'Precisa de você: {m.group(1)}', mas o Status é {st}")

        # entrada: Definition of Ready
        if st != "open":
            feitas, total = caixas(s.get("definitionofready", ""))
            if total == 0 or feitas < total:
                add(c, "K-08", "erro", "product-owner", f"saiu de open com Definition of Ready incompleta ({feitas}/{total})")
            if caixas(s.get("acceptancecriteria", ""))[1] == 0:
                add(c, "K-09", "erro", "product-owner", "sem critérios de aceite em lista de verificação")
            if not preenchido(s.get("scope", "")):
                add(c, "K-10", "erro", "product-owner", "seção Scope vazia (caminhos de escrita, exclusões, snapshot)")

        # execução
        if st in ("in-progress", "in-review", "rejected") and not agente:
            add(c, "K-11", "erro", "principal", f"{st} sem o campo Agent preenchido")
        if st in ("in-progress", "in-review") and not staffing_ok(s.get("staffing", "")):
            add(c, "K-12", "erro", "principal", "seção Staffing vazia (função, fonte, agente e tier)")
        if st in ("in-review", "completed", "accepted") and not preenchido(s.get("evidence", "")):
            add(c, "K-13", "erro", dono_entrega, f"{st} sem evidência registrada")
        if st == "rejected" and not re.search(r"\b[A-Z]{1,5}-\d+\b", s.get("findings", "")):
            add(c, "K-14", "erro", "validador", "rejected sem IDs de achados na seção Findings")
        if st == "blocked":
            b = s.get("blocked", "")
            faltam = [n for n, p in (("motivo", r"Reason:\s*(.+?)(?:\||$)"), ("quem destrava", r"Unblocks:\s*(.+?)(?:\||$)"),
                                     ("status anterior", r"Prior status:\s*(.+?)(?:\||$)"))
                      if not (re.search(p, b, re.M) and preenchido(re.search(p, b, re.M).group(1)))]
            if faltam:
                add(c, "K-15", "erro", dono_entrega, "blocked sem: " + ", ".join(faltam))

        # saída: gates e Definition of Done
        if st in ("completed", "accepted"):
            exigidos = GATES + (["privacy"] if re.search(r"Personal data:\s*yes", s.get("scope", ""), re.I) else [])
            ruins = [g for g in exigidos if gates.get(g, {}).get("veredito") != "approved"]
            if ruins:
                add(c, "K-16", "erro", "principal", f"{st} sem gate aprovado: " + ", ".join(ruins))
            shas = {gates[g]["sha"] for g in exigidos if g in gates and preenchido(gates[g]["sha"])}
            if not ruins and (len(shas) != 1 or any(not preenchido(gates[g]["sha"]) for g in exigidos)):
                add(c, "K-17", "erro", "principal", "gates aprovados em snapshots diferentes ou sem SHA: " + ", ".join(sorted(shas)) or "sem SHA")
            inst = [gates[g]["instancia"] for g in exigidos if g in gates and preenchido(gates[g]["instancia"])]
            if agente and any(chave(i) == chave(agente) for i in inst):
                add(c, "K-18", "erro", "principal", "o autor aparece como validador do próprio trabalho")
            feitas, total = caixas(s.get("definitionofdone", ""))
            if total == 0 or feitas < total:
                add(c, "K-19", "erro", "principal", f"{st} com Definition of Done incompleta ({feitas}/{total})")
        if st == "accepted" and not preenchido(s.get("humanacceptance", "")):
            add(c, "K-20", "erro", "principal", "accepted sem o registro do aceite humano (quem, data, escopo)")

        # diário e transições
        evs = eventos_status(c)
        if st != "open" and not evs:
            add(c, "K-21", "erro", dono_entrega, "nenhum 'LOG STATUS' nos comentários: as mudanças de status não foram registradas")
        elif evs:
            if evs[-1]["para"] != st:
                add(c, "K-21", "erro", dono_entrega, f"o último LOG STATUS diz '{evs[-1]['para']}', mas o Status é '{st}'")
            for e in evs:
                if e["de"] in TRANSICOES and e["para"] not in TRANSICOES[e["de"]]:
                    add(c, "K-22", "erro", e["instancia"] or "principal", f"transição inválida {e['de']} -> {e['para']} em {e['utc']}")
            ult = evs[-1]
            if ult["para"] == "completed" and chave(ult["instancia"]) not in ("principal",):
                add(c, "K-23", "erro", "principal", f"completed movido por '{ult['instancia']}': só o principal move para completed")
            if ult["para"] == "accepted" and not re.match(r"(?i)^(human|humano|user|usuario|usuário)", ult["instancia"]):
                add(c, "K-23", "erro", "principal", f"accepted movido por '{ult['instancia']}': o aceite é humano")

        # parado
        t = hora(c.get("updated_at"))
        if st in PRAZO_HORAS and t:
            horas = (agora - t).total_seconds() / 3600
            if horas > PRAZO_HORAS[st]:
                add(c, "K-24", "aviso", "product-owner" if st in ("open", "pending") else dono_entrega,
                    f"parado em {st} há {int(horas)} h (limite {PRAZO_HORAS[st]} h)")
        if st == "in-progress":
            em_andamento.setdefault(c.get("repo", "?"), []).append(ref)

    for repo, refs in em_andamento.items():
        if len(refs) > wip:
            achados.append(Achado(regra="K-25", severidade="aviso", responsavel="principal", card=", ".join(refs), titulo="",
                                  mensagem=f"{len(refs)} cards em andamento em {repo} (limite {wip}): confira se os escopos de escrita são disjuntos"))
    return achados, correcoes


# ---------- leitura ----------
def gh(*args) -> str:
    r = subprocess.run(["gh", *args], capture_output=True, text=True, timeout=120)
    if r.returncode != 0:
        raise RuntimeError((r.stderr or r.stdout).strip()[:300])
    return r.stdout


def ler_gh(owner: str, numero: str, limite: int):
    proj = json.loads(gh("project", "view", numero, "--owner", owner, "--format", "json"))
    campos = json.loads(gh("project", "field-list", numero, "--owner", owner, "--format", "json"))["fields"]
    itens = json.loads(gh("project", "item-list", numero, "--owner", owner, "--format", "json", "--limit", str(limite)))["items"]
    cards = []
    for it in itens:
        cont = it.get("content") or {}
        if cont.get("type") not in (None, "Issue") or not cont.get("number"):
            continue
        v = {chave(k): val for k, val in it.items() if isinstance(val, (str, int, float))}
        card = {"item_id": it.get("id"), "repo": cont.get("repository", ""), "number": cont.get("number"),
                "title": cont.get("title") or it.get("title", ""), "body": cont.get("body", ""),
                "status": v.get("status", ""), "etapa": v.get("etapa", ""), "precisa": v.get("precisadevoce", ""),
                "agent": v.get("agent", ""), "gates": v.get("gates", ""), "log": [], "updated_at": None}
        if card["status"] != "closed" and card["repo"]:
            extra = json.loads(gh("issue", "view", str(card["number"]), "--repo", card["repo"], "--json", "comments,updatedAt"))
            card["log"] = [c.get("body", "") for c in extra.get("comments", [])]
            card["updated_at"] = extra.get("updatedAt")
        cards.append(card)
    return cards, {"id": proj.get("id"), "campos": {chave(f["name"]): f for f in campos}}


def aplicar(correcoes: list[dict], meta: dict) -> list[str]:
    feitos = []
    for c in correcoes:
        campo = meta["campos"].get(chave(c["campo"]))
        if not campo or not c.get("item_id"):
            feitos.append(f"pulado {c['card']} {c['campo']}: campo ou item não encontrado")
            continue
        args = ["project", "item-edit", "--id", c["item_id"], "--project-id", meta["id"], "--field-id", campo["id"]]
        opcoes = {chave(o["name"]): o["id"] for o in campo.get("options", [])}
        if opcoes:
            if chave(c["valor"]) not in opcoes:
                feitos.append(f"pulado {c['card']} {c['campo']}: opção '{c['valor']}' não existe no campo")
                continue
            args += ["--single-select-option-id", opcoes[chave(c["valor"])]]
        else:
            args += ["--text", c["valor"]]
        gh(*args)
        feitos.append(f"corrigido {c['card']}: {c['campo']} = {c['valor']}")
    return feitos


def relatorio(cards, achados, correcoes) -> str:
    erros = [a for a in achados if a["severidade"] == "erro"]
    linhas = [f"Quadro auditado: {len(cards)} cards, {len(erros)} erro(s), {len(achados) - len(erros)} aviso(s), "
              f"{len(correcoes)} correção(ões) mecânica(s) possível(is)."]
    if not achados:
        return linhas[0] + "\nNenhuma pendência."
    por_dono: dict[str, list] = {}
    for a in achados:
        por_dono.setdefault(a["responsavel"], []).append(a)
    for dono in sorted(por_dono):
        linhas.append(f"\nCobrar de: {dono}")
        for a in sorted(por_dono[dono], key=lambda x: (x["severidade"] != "erro", x["card"], x["regra"])):
            linhas.append(f"  [{a['severidade']}] {a['regra']} {a['card']} {a['titulo'][:40]}".rstrip())
            linhas.append(f"          {a['mensagem']}")
    return "\n".join(linhas)


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("--arquivo", help="export JSON do quadro (lista de cards ou {'cards': [...]})")
    ap.add_argument("--owner")
    ap.add_argument("--projeto", help="número do Project")
    ap.add_argument("--limite", type=int, default=500)
    ap.add_argument("--wip", type=int, default=2, help="cards em andamento por repositório antes do aviso")
    ap.add_argument("--agora", help="data e hora de referência em ISO (padrão: agora, UTC)")
    ap.add_argument("--json", action="store_true")
    ap.add_argument("--aplicar", action="store_true", help="aplica as correções mecânicas (só com --owner e --projeto)")
    a = ap.parse_args(argv)
    agora = hora(a.agora) or dt.datetime.now(dt.timezone.utc)
    meta = None
    try:
        if a.arquivo:
            dados = json.load(open(a.arquivo, encoding="utf-8"))
            cards = dados["cards"] if isinstance(dados, dict) else dados
        elif a.owner and a.projeto:
            cards, meta = ler_gh(a.owner, a.projeto, a.limite)
        else:
            ap.error("informe --arquivo ou --owner e --projeto")
    except Exception as e:
        print(f"erro: não foi possível ler o quadro: {e}", file=sys.stderr)
        return 2
    achados, correcoes = auditar(cards, agora, a.wip)
    feitos = []
    if a.aplicar:
        if not meta:
            print("erro: --aplicar exige leitura ao vivo (--owner e --projeto)", file=sys.stderr)
            return 2
        feitos = aplicar(correcoes, meta)
    if a.json:
        print(json.dumps({"cards": len(cards), "achados": achados, "correcoes": correcoes, "aplicado": feitos},
                         ensure_ascii=False, indent=2))
    else:
        print(relatorio(cards, achados, correcoes))
        for f in feitos:
            print(f)
    return 1 if any(x["severidade"] == "erro" for x in achados) else 0


if __name__ == "__main__":
    sys.exit(main())
