# Kanban board: cards a human reads in seconds and an agent can work from (opt-in profile)

This workflow applies only when the `kanban-board` profile is selected, on top of
workflow/github-projects.md, which stays the contract for states, authority, issue identity,
freshness and records. This file adds the two-layer card, the simplified human view, the
ownership of card correctness and the audit that makes it checkable.

## The two-layer card (templates/kanban-card.md)
One issue, two readers.

- **Cover, for the human.** What the board shows: the title and the project fields. Plus the
  first block of the body, `## Resumo`, five short lines in Portuguese: O quê, Por quê, Agora,
  Falta, Precisa de você. No jargon, no IDs the human must look up. The delivery owner rewrites
  it on every Status change; a summary that describes a previous state is a defect.
- **Sheet, for agents.** Inside a `<details>` block, in English: Context, Business rules,
  Acceptance criteria, Scope, Definition of Ready, Staffing, Evidence, Gates, Findings, Blocked,
  Definition of Done, Human acceptance. The sheet only grows; nothing proven is deleted.
- **Diary.** Each Status change is one comment:
  `LOG STATUS | <UTC> | <instance> | <id> | <from> -> <to> | <evidence link>`
  written by whoever makes the move, in addition to the event types of templates/log.md.

One card per story; tasks are sub-issues of the story and stories of the epic. Evidence,
diffs and logs stay in the repository and are linked, never pasted.

## Fields
| Field | Type | Who sets it |
|---|---|---|
| Status | single select, the nine states | per the authority table in workflow/github-projects.md |
| Etapa | single select: A fazer, Em andamento, Em validação, Aguardando você, Concluído | derived from Status |
| Precisa de você | single select: sim, não | derived: sim when Status is blocked or completed |
| Gates | text, for example `R✔ S✔ P– Q…` | derived from the Gates table (review, security, privacy, qa) |
| Type, Priority, Estimate, Sprint | as in workflow/github-projects.md | product-owner |
| Agent | text: function · instance | principal at dispatch |

Derived fields are never edited by hand. integrations/kanban/audit_board.py computes them and
corrects them with `--aplicar`.

| Etapa (human view) | Status (contract) |
|---|---|
| A fazer | open, pending |
| Em andamento | in-progress |
| Em validação | in-review, rejected |
| Aguardando você | blocked, completed |
| Concluído | accepted, closed |

Views, created by the human in the interface (the CLI cannot create them): **Quadro** (board
grouped by Etapa, showing Priority, Agent and Gates), **Precisa de mim** (filter
`Precisa de você: sim`) and **Operação** (table with every field, for audits).

## Who guarantees what
| Party | Guarantees | Blocks |
|---|---|---|
| product-owner | Entry quality: title, summary, criteria as a checklist, Scope, Definition of Ready, priority | A card does not leave `open` without it |
| scrum-master | The flow: valid transitions, required fields per state, owners present, derived fields in sync, stale cards and work in progress listed | Any transition whose entry conditions fail the audit |
| Delivery owner (Agent field) | Its own card: `LOG STATUS` before acting, evidence and handoff on delivery, summary rewritten | — |
| Validators | Verdict, instance and SHA in the Gates table; finding IDs when rejecting | `completed` without their approval |
| Principal | Dispatch with a card reference; the only one who moves to `completed`, after re-running one evidence command; applies or authorizes mechanical corrections | — |
| Human | The only one who moves to `accepted` | — |

## The charging loop
Specialists do not talk to each other; everything passes through the principal.

1. The scrum-master runs the audit (action `board`).
2. It returns findings grouped by responsible party, with rule IDs, and the list of mechanical
   corrections.
3. Mechanical corrections (Etapa, Precisa de você, Gates) are applied by the script.
4. The principal returns each content finding to its owner with the card and the rule. Work on
   that card does not advance while an error is open.
5. The next audit confirms. A finding closes only when the script stops reporting it.

The scrum-master never fills evidence, verdicts, criteria, summaries or checklists, even when
the value looks obvious: that would turn a missing proof into an invented one.

When to audit: before every Status transition (the card must already meet the entry conditions
of the destination state), at session start or resume, at the end of each wave, whenever a
handoff is written, and before every human gate. Record one line each time: cards checked,
errors, warnings, stale, waiting on the human.

## Audit rules (integrations/kanban/audit_board.py)
| Rule | Checks | Responsible |
|---|---|---|
| K-01 | Status is one of the nine states | scrum-master |
| K-02 | Title format `[S-014] Short title` | product-owner |
| K-03, K-04, K-05 | Etapa, Precisa de você and Gates match their sources (mechanical) | scrum-master |
| K-06, K-07 | Summary has the five lines, is short and agrees with the Status | delivery owner (product-owner before work starts) |
| K-08, K-09, K-10 | Left `open` with Definition of Ready complete, criteria as a checklist and Scope filled | product-owner |
| K-11, K-12 | Agent field and Staffing row while work is active | principal |
| K-13 | Evidence present from `in-review` on | delivery owner |
| K-14 | `rejected` carries finding IDs | validator |
| K-15 | `blocked` states reason, who unblocks and prior status | delivery owner |
| K-16, K-17, K-18 | Required gates approved, on one SHA, by instances other than the author | principal |
| K-19, K-20 | Definition of Done complete; human acceptance recorded for `accepted` | principal |
| K-21, K-22, K-23 | `LOG STATUS` matches the Status, every transition is valid, `completed` by the principal and `accepted` by the human | whoever moved |
| K-24 | Stale beyond the windows of workflow/github-projects.md | delivery owner or product-owner |
| K-25 | Too many cards in progress in one repository | principal |

Errors block; warnings are listed. Privacy becomes a required gate when Scope says
`Personal data: yes`.

## Dispatch needs a card
No specialist is dispatched without a card reference in the brief, on its own line:
`Card: <owner>/<repo>#<number>`. Where the guardrails mod is installed, a hook denies a
dispatch without it. Read-only exploration and the scrum-master itself are exempt. The hook
checks the reference is present; it does not query GitHub, so the audit remains what verifies
the card's state.

## Limits to state honestly
- GitHub Projects does not enforce who moves a card. The audit detects a wrong move after the
  fact; it does not prevent it.
- The audit checks structure and consistency, not truth: a summary can be filled and wrong, an
  evidence link can point to nothing. Gates and the principal's re-run of evidence cover that.
- Without the `gh` CLI the script audits a board export; freshness then depends on the export.
