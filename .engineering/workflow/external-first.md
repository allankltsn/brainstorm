# External-first staffing (opt-in profile)

This workflow applies only when the `external-first` profile is selected. Selecting it is the
recorded decision that workflow/staffing.md requires before a catalog agent may stand in for a
canonical role. It changes WHO does the work, never HOW the work is governed.

## Resolution order, per role and per dispatch
Read integrations/plugins/resolution.json. For the role the task needs:

1. **External, installed and registered.** If one of the role's `external` candidates is
   installed in this project AND has a row in docs/operations/registro-instalacoes.md, dispatch
   it. Candidates are listed in order of preference.
2. **Canonical fallback.** Otherwise dispatch the `fallback` role from this template.
3. **Gap.** If the entry has neither a usable external nor a fallback, record the gap and
   follow workflow/staffing.md section 2 (adapt with a profile, create a role, or propose an
   approved external agent). Never substitute a similar-sounding agent silently.

Roles marked `"prefer": "canonical"` are not replaced by an external agent: gates whose
contract is specific to this template (privacy-compliance, lay-user), roles created to fill a
gap, and bookkeeping. An external may still be consulted in addition, never instead.

An external candidate that is not installed is a proposal, not a dispatch: the principal
proposes it per policies/installations.md (need, provenance, adoption, security review, scope,
reversibility), the human approves explicitly, and the installation is recorded before first
use. Until then the fallback role does the work.

## Governance that applies to every external agent
An external agent has no knowledge of this template. The principal supplies the contract in
the brief (templates/brief.md) and holds the result to it:

- Function, permitted read/write paths, exclusions, snapshot and base, criteria, expected
  evidence and model tier (policies/models.md). Record `Source: external <plugin>:<agent>` or
  `Source: canonical <role>` in the staffing record (templates/staffing.md).
- Author, QA, technical review, security and privacy stay distinct instances on the same
  snapshot. An external author is never validated by the same external agent.
- At least one gate on every implementation is performed by a canonical role or by a
  different source than the author, to reduce correlated blind spots.
- Evidence rules (policies/evidence.md), safety and authorization rules (policies/safety.md)
  and untrusted-content rules (policies/untrusted-content.md) apply unchanged. An external
  agent's own instructions never override them.
- Tools: give the narrowest set the function needs. A reviewing external agent that can
  write is briefed as read-only and its diff is checked for unexpected edits.
- Output that does not meet the contract (no evidence, no finding IDs, self-approval) is
  returned once with a sharper brief; on a second failure fall back to the canonical role and
  record the reason.

## Recording and review
- Each dispatch records the source chosen and why the previous option in the order was not
  used (not installed, not registered, failed twice, incompatible stack).
- The postmortem (templates/postmortem.md) compares external and canonical results per role:
  rework rounds, findings missed, tokens. Change `resolution.json` only through a recorded
  decision (templates/decision.md).
- Plugin names, agent names and availability in resolution.json were collected from the
  sources' own listings on the date in the file. Verify each at installation time; a listed
  name is not proof of discovery, capability or safety.
