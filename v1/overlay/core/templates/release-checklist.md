# Release <version>
Date: <UTC> | Released snapshot: <SHA per repository> | Human owner: <name> | Window: <date, time, zone>

Every checked item carries evidence (link, command and result, or file path). No evidence, no check.

## Scope
- [ ] Stories and pull requests included: <link> | Left out and why: <...>
## Quality on the released SHA
- [ ] Technical review: <path> | Security: <path> | QA: <path> | Privacy (if personal data): <path>
- [ ] Pipeline green: <run link> | No critical or high finding open (or risk accepted by <human>)
## Version and notes
- [ ] SemVer version set (policies/versioning.md), changelog updated, user notes reviewed
## Database and data
- [ ] Migrations backward compatible (expand before contract) and tested on a copy: <evidence>
- [ ] Recent backup confirmed; restore last tested on <date>
## Configuration
- [ ] New variables and secrets exist in the environment (names only, never values)
- [ ] Feature flags in the planned initial state; DNS, certificates and edge rules checked if they change
## Deploy order
1. <component> <version>
## Post-deploy verification
- [ ] Health checks | Smoke test of critical journeys: <list> | Errors, latency and saturation within thresholds for <30-60 min>: <dashboard>
## Rollback
| Component | Previous version | Proposed action | Migration reversible? | Tested? |
Criterion to roll back: <objective threshold> | Who decides: <human>
## Communication
- [ ] Who is told before and after (team, support, users)
## Decision
Go / no-go by <human> at <UTC>
