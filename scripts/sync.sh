#!/usr/bin/env bash
# Copia pastas de outras branches para a main, sem alterar o conteúdo delas.
#
#   scripts/sync.sh                       # sincroniza todas as pastas do sync.conf
#   scripts/sync.sh prototype-v2          # só uma pasta (branch do sync.conf)
#   scripts/sync.sh prototype-v2 minha-branch   # só uma pasta, de outra branch
#
# PUSH=0 faz o commit local sem publicar. Nunca mexe em init/.
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

CONF=scripts/sync.conf
TARGET=${TARGET:-main}

[ -z "$(git status --porcelain)" ] || { echo "Há alterações locais não commitadas; abortando."; exit 1; }

git fetch origin --prune
git checkout "$TARGET"
git merge --ff-only "origin/$TARGET"

if [ $# -ge 1 ]; then
  folder=${1%/}
  branch=${2:-$(awk -v f="$folder" '$1==f{print $2}' "$CONF")}
  [ -n "$branch" ] || { echo "Pasta '$folder' não está no $CONF; informe a branch."; exit 1; }
  pairs=("$folder $branch")
else
  mapfile -t pairs < <(grep -vE '^\s*(#|$)' "$CONF")
fi

summary=()
for pair in "${pairs[@]}"; do
  read -r folder branch <<<"$pair"
  [ "$folder" != init ] || { echo "init/ é protegido."; exit 1; }
  git rev-parse --verify -q "origin/$branch" >/dev/null || { echo "Branch origin/$branch não existe."; exit 1; }
  git ls-tree -d --name-only "origin/$branch" "$folder" | grep -qx "$folder" || { echo "$folder não existe em origin/$branch."; exit 1; }
  # remove a pasta antes, para que arquivos apagados na branch também sumam da main
  git rm -rq --ignore-unmatch "$folder"; rm -rf "$folder"
  git checkout "origin/$branch" -- "$folder"
  summary+=("$folder <- $branch@$(git rev-parse --short "origin/$branch")")
  echo "✔ $folder <- origin/$branch"
done

if git diff --cached --quiet; then
  echo "Nada mudou; main já está atualizada."
  exit 0
fi

git commit -q -m "Sincroniza telas: $(IFS=,; echo "${summary[*]}")"
[ "${PUSH:-1}" = 0 ] || git push origin "$TARGET"
git log --oneline -1
