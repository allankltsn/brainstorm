# Installation registry
Location: docs/operations/registro-instalacoes.md. Rule: nothing is installed, enabled or granted without a proposal, explicit approval and a row here, recorded in the same turn.

## Installed or enabled
| Date (UTC) | What | Source | Version/commit | Scope (project/user/global) | Approved by | Files/settings changed | Remove with | Verification |
|---|---|---|---|---|---|---|---|---|
| 2026-11-20 | mod guardrails (Claude Code) | integrations/mod/guardrails | 0.1.0 | project | usuário, via install.py --mod guardrails | C:/dev/brainstorm-aura-eco/.claude/mods/guardrails, C:/dev/brainstorm-aura-eco/.claude/mods/.claude-plugin/marketplace.json, C:/dev/brainstorm-aura-eco/.claude/scripts/guardrails.py | claude plugin uninstall guardrails@guilda-mods --scope project; apagar C:\dev\brainstorm-aura-eco\.claude\mods\guardrails e C:\dev\brainstorm-aura-eco\.claude\scripts\guardrails.py | claude plugin marketplace add + install: ok |

## Attempted but not installed
| Date | What | Reason (cancelled/blocked/rejected by security review) | Alternative used |
|---|---|---|---|

## Temporary files outside the repository
| Path | Created for | Safe to delete after |
|---|---|---|
