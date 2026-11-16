<!--
Kanban card (workflow/kanban-board.md). Two layers in one issue body:
  1. "Resumo": the human cover, in Portuguese, five short lines, rewritten on every Status change.
  2. "Agent sheet": the working contract, in English, inside <details>; it only grows.
Issue title: [S-014] Short imperative title   (also [E-NN], [task-N-role], [bug-N], [spike-N], [D-N])
Project fields (not in the body): Status, Etapa, Precisa de você, Type, Priority, Agent, Gates, Estimate, Sprint.
Etapa, Precisa de você and Gates are derived; the audit script keeps them in sync. Never edit them by hand.
Each Status change is one comment: LOG STATUS | <UTC> | <instance> | <id> | <from> -> <to> | <evidence link>
-->
## Resumo
- **O quê:** <uma frase, sem jargão>
- **Por quê:** <o valor para o usuário ou o negócio>
- **Agora:** <onde está e quem está com o card>
- **Falta:** <o próximo passo concreto>
- **Precisa de você:** <não | sim: a decisão ou ação esperada>

<details>
<summary>Agent sheet</summary>

### Context
<parent epic or story, requirement IDs (FR/NFR/BR), design and API contract links, related decisions>

### Business rules
- <BR-nn: rule quoted from the requirements>

### Acceptance criteria
- [ ] Given <state>, when <action>, then <observable result>
- [ ] Given <error or limit>, when <action>, then <message or behaviour>
- [ ] Given <another user or tenant>, when <action>, then <access denied>

### Scope
Write: <allowed paths> | Do not touch: <paths> | Snapshot/base: <SHA or branch> | Personal data: <yes/no>
Dependencies: <cards or "none"> | Existing authorizations: <scope or "none">

### Definition of Ready
- [ ] Narrative and criteria are clear and testable
- [ ] Business rules cited by ID
- [ ] Design and contract referenced
- [ ] Dependencies resolved or declared
- [ ] Personal data and risks marked

### Staffing
| Function | Source (external plugin:agent or canonical role) | Instance | Model tier and reason |
|---|---|---|---|
| author | <...> | <...> | <...> |

### Evidence
<links or repository paths to sanitized evidence: commands, exit codes, commit or pull request, handoff file>

### Gates
| Gate | Instance | Verdict | SHA | Report |
|---|---|---|---|---|
| review | <instance> | pending | <sha> | <path> |
| security | <instance> | pending | <sha> | <path> |
| privacy | <instance> | n/a | <sha> | <path> |
| qa | <instance> | pending | <sha> | <path> |

### Findings
<stable IDs, severity, state, who confirms; pending decisions for the human>

### Blocked
Reason: <...> | Unblocks: <who or what> | Prior status: <status>

### Definition of Done
- [ ] Every criterion proven with evidence
- [ ] Automated tests pass on the final snapshot
- [ ] Review, security and QA approved on the same snapshot
- [ ] Privacy approved when personal data is involved
- [ ] Documentation and changelog updated

### Human acceptance
pending

</details>
