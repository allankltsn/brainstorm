#!/usr/bin/env bash
# Acrescenta a um GitHub Project existente os campos do contrato core/workflow/kanban-board.md.
# Uso: bash setup-kanban-fields.sh <owner> <número do project>
# Requer: gh autenticado com escopo project. Não lê nem grava tokens.
# Rode depois de integrations/github-projects/setup-project.sh, que cria o Project e os campos base.
set -euo pipefail

OWNER="${1:?uso: setup-kanban-fields.sh <owner> <número>}"
NUMBER="${2:?uso: setup-kanban-fields.sh <owner> <número>}"

command -v gh >/dev/null || { echo "gh não encontrado" >&2; exit 1; }
command -v jq >/dev/null || { echo "jq não encontrado" >&2; exit 1; }

existentes=$(gh project field-list "$NUMBER" --owner "$OWNER" --format json | jq -r '.fields[].name')
criar() { # nome, tipo, opções (opcional)
  if grep -qxF "$1" <<<"$existentes"; then echo "já existe: $1"; return; fi
  if [ -n "${3:-}" ]; then
    gh project field-create "$NUMBER" --owner "$OWNER" --name "$1" --data-type "$2" --single-select-options "$3" >/dev/null
  else
    gh project field-create "$NUMBER" --owner "$OWNER" --name "$1" --data-type "$2" >/dev/null
  fi
  echo "criado: $1"
}

criar "Etapa" SINGLE_SELECT "A fazer,Em andamento,Em validação,Aguardando você,Concluído"
criar "Precisa de você" SINGLE_SELECT "sim,não"
criar "Gates" TEXT

echo
echo "Falta na interface: criar as views Quadro (agrupada por Etapa), Precisa de mim (filtro) e Operação (tabela)."
