"""Funções compartilhadas pelos hooks do núcleo. Só biblioteca padrão."""
from __future__ import annotations

import fnmatch
import json
import os
import re
import sys
import tempfile
from pathlib import Path

PADRAO = {
    "autonomia": "portoes",
    "dados_pessoais": False,
    "ramos_protegidos": ["main", "master"],
    "orcamento": {"max_chamadas": 400, "max_subagentes": 30, "max_repeticoes": 5, "max_tokens": 0},
    "producao_apos_conteudo_externo": "perguntar",
    "bash_negar": [],
    "bash_perguntar": [],
}

# Arquivos cujo conteúdo não deve chegar ao modelo nem ao histórico.
SENSIVEIS = [
    ".env", ".env.*", "*.pem", "*.key", "*.p12", "*.pfx", "id_rsa*", "id_ed25519*", "id_ecdsa*",
    "credentials", "credentials.json", ".netrc", "secrets.*", "*.tfstate", "*.tfstate.*", "kubeconfig",
]
SENSIVEIS_CAMINHO = [".ssh/", ".aws/credentials", ".kube/config", "/proc/self/environ", ".gnupg/"]
EXEMPLOS = (".example", ".sample", ".template", ".dist", ".pub")


def entrada() -> dict:
    try:
        dados = json.load(sys.stdin)
        return dados if isinstance(dados, dict) else {}
    except Exception:
        return {}


def raiz_projeto(dados: dict) -> Path | None:
    """Sobe a partir do diretório do projeto até achar a pasta .agentes."""
    inicio = Path(os.environ.get("CLAUDE_PROJECT_DIR") or dados.get("cwd") or os.getcwd())
    for d in [inicio, *inicio.parents]:
        if (d / ".agentes").is_dir():
            return d
    return None


def config(raiz: Path | None) -> dict:
    cfg = json.loads(json.dumps(PADRAO))
    if raiz:
        try:
            lido = json.loads((raiz / ".agentes" / "config.json").read_text(encoding="utf-8"))
            for k, v in lido.items():
                if isinstance(v, dict) and isinstance(cfg.get(k), dict):
                    cfg[k].update(v)
                else:
                    cfg[k] = v
        except Exception:
            pass
    return cfg


def caminho_sessao(raiz: Path, dados: dict) -> Path:
    sid = re.sub(r"[^A-Za-z0-9_-]", "_", str(dados.get("session_id") or "sem-id"))[:80]
    return raiz / ".agentes" / "sessoes" / f"{sid}.json"


def ler_json(caminho: Path, padrao: dict) -> dict:
    try:
        d = json.loads(caminho.read_text(encoding="utf-8"))
        return d if isinstance(d, dict) else dict(padrao)
    except Exception:
        return dict(padrao)


def salvar_json(caminho: Path, dados: dict) -> None:
    caminho.parent.mkdir(parents=True, exist_ok=True)
    fd, tmp = tempfile.mkstemp(dir=str(caminho.parent), suffix=".tmp")
    with os.fdopen(fd, "w", encoding="utf-8") as f:
        json.dump(dados, f, ensure_ascii=False, indent=2)
        f.write("\n")
    os.replace(tmp, caminho)


def sensivel(caminho: str) -> bool:
    if not caminho:
        return False
    c = caminho.replace("\\", "/")
    base = c.rstrip("/").rsplit("/", 1)[-1].lower()
    if base.endswith(EXEMPLOS):
        return False
    if any(p in c for p in SENSIVEIS_CAMINHO):
        return True
    return any(fnmatch.fnmatch(base, p) for p in SENSIVEIS)


def arquivo_de_estado(caminho: str) -> bool:
    c = (caminho or "").replace("\\", "/")
    return bool(re.search(r"(^|/)\.agentes/(estado\.json|config\.json|sessoes(/|$))", c))


def negar(motivo: str) -> None:
    """Bloqueia a ação. O motivo vai para o modelo pelo stderr (código de saída 2)."""
    print(f"[nucleo] BLOQUEADO: {motivo}", file=sys.stderr)
    sys.exit(2)


def perguntar(motivo: str) -> None:
    """Pede confirmação humana antes de executar."""
    print(json.dumps({"hookSpecificOutput": {
        "hookEventName": "PreToolUse",
        "permissionDecision": "ask",
        "permissionDecisionReason": f"[nucleo] {motivo}",
    }}, ensure_ascii=False))
    sys.exit(0)


def contexto(evento: str, texto: str) -> None:
    print(json.dumps({"hookSpecificOutput": {"hookEventName": evento, "additionalContext": texto}}, ensure_ascii=False))
    sys.exit(0)
