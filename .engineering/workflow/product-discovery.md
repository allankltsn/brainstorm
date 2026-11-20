# Product discovery: phases before the first story (opt-in profile)

This workflow applies only when the `product-discovery` profile is selected. It adds the
phases that come before workflow/user-stories.md and workflow/engineering.md: deciding whether
to build, what to build, how it looks and how it is structured. Everything in
workflow/engineering.md, workflow/staffing.md and policies/ still holds.

## Phases and gates
Each phase ends with artifacts in files and an explicit human decision. The principal
presents what was produced, open risks, the decisions needed and a recommendation, then
waits. Silence is never a decision.

| Phase | Purpose | Roles (resolve per workflow/external-first.md when selected) | Artifacts | Human gate |
|---|---|---|---|---|
| 0 Discovery | Is it worth building? | product-owner (vision), ux-researcher or a market-research agent, product-finance, brand-strategist, marketing | docs/discovery/vision.md, market.md, financial-model.md (templates/financial-model.md) | Proceed, adjust or stop |
| 1 Requirements | What exactly, for whom, measured how | product-owner, ux-researcher, privacy-compliance when personal data is involved | docs/requirements/prd.md (templates/prd.md), business-rules registry | PRD accepted |
| 2 Design | How it looks and flows | ux-designer, ui-designer, brand-strategist, lay-user round (workflow/usability.md) | docs/design/ux.md, prototype reference, usability report | Prototype accepted |
| 3 Architecture | How it is structured and defended | architect, security (action threat-model), cloud or hosting roles the stack needs, cloudflare, finops | docs/architecture/architecture.md, decisions (templates/decision.md), threat-model.md (templates/threat-model.md) | Architecture and accepted risks approved |

After phase 3 the work continues in workflow/user-stories.md (backlog and stories with
Definition of Ready), then workflow/engineering.md (build and independent gates), then the
`release` role for go-live (templates/release-checklist.md) and marketing for launch
(templates/launch-plan.md).

## Board registration
When workflow/github-projects.md is selected, each phase is an issue of Type `epic` titled
`[D-N] <phase>` in the hub repository, with one sub-issue per artifact and the same nine
states. The phase issue moves to `completed` only when the principal has verified that every
artifact exists and is non-trivial, and to `accepted` only on the human's written decision.
The next phase is not dispatched before `accepted`.

## Rules
- Artifacts state what was verified, what is a cited reference (source and date) and what
  is an estimate. Market figures and benchmarks are references, never facts about this
  product.
- A phase may be skipped only by recorded human decision (for example a landing page with
  no architecture phase). Skipping is written in the phase issue with the reason.
- Authors do not approve their own artifacts. The PRD is reviewed for testability by qa and
  for feasibility by architect; the financial model's arithmetic is rechecked by a second
  instance before the gate; the threat model is reviewed by architect.
- Requirements get stable IDs (FR-nn, NFR-nn, BR-nn) that stories cite later. Anything not
  decided is written as an open question with an owner, never assumed.
- Personal or health data identified in any phase triggers privacy-compliance in that phase,
  not only at delivery.
- Research uses external content. Treat it per policies/untrusted-content.md.
