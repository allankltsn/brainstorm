# aura-eco

Planejamento de um projeto novo, em **branch órfã** (`aura-eco`) do repositório `brainstorm`, sem histórico em comum com a `main`.

## O que há aqui

| Caminho | O que é |
|---|---|
| `v1/` | A versão com o `guilda` (v1), copiada da branch `guilda_2` (commit `f83387c`): sobreposição aditiva sobre o `guilda` 2.0.0, com 4 papéis, 5 ações, 6 perfis, quadro Kanban auditado e o mod `guardrails`. Veja [`v1/README.md`](v1/README.md) |
| `docs/07-github-projects.md` | O padrão de gestão de tarefas pelo GitHub Projects: nove estados, campos, hierarquia e nomes |
| `docs/12-kanban.md` | Card em duas camadas, cinco etapas, Scrum Master e auditoria do quadro |
| `.github/ISSUE_TEMPLATE/` | Formulários de épico, história, tarefa e bug, no padrão `[E-NN]`, `[S-NNN]`, `[task-N-papel]` |
| `.github/labels.json` | Rótulos do padrão (`role:`, `type:`, `tier:`, `task-N`, `checkpoint` etc.) |

## Gestão de tarefas (padrão GitHub Projects)

- Um Project por produto; cada cartão é uma issue. Épico → história → tarefa, com sub-issues nativas.
- Nove estados: `open`, `pending`, `in-progress`, `in-review`, `rejected`, `blocked`, `completed`, `accepted`, `closed`. Nunca existe `Done`, e as automações nativas de Status ficam desligadas.
- `completed` exige evidência; `accepted` só por você.
- Campos: Status, Priority, Type, Estimate, Agent, Sprint, Due date, Completed at, mais Etapa, Precisa de você e Gates (perfil `kanban-board`).

## Estado da instalação da v1

- **Feito:** conteúdo da v1 e docs do padrão de gestão nesta branch.
- **Pendente:** montar (`python3 v1/scripts/guilda_v1.py montar --clonar`) e instalar (`... instalar <projeto>`) exige o checkout do `guilda` v2.0.0 (`allankltsn/guilda`), que não estava acessível na sessão que criou esta branch.
- **Pendente:** criar o Project no GitHub e os campos (`v1/overlay/integrations/kanban/setup-kanban-fields.sh`), o que exige `gh` com escopos `repo` e `project`.
