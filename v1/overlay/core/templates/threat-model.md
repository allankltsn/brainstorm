# Threat model: <system or capability>
Date: <UTC> | Version: <n> | Scope: <covered / not covered> | Snapshot of the design: <reference>

## Assets
| Asset | Why it matters | Classification (public / internal / personal / sensitive / secret) |
## Actors
<legitimate user; malicious authenticated user; external attacker; compromised service or dependency; insider; AI agent with repository or infrastructure access>
## Data flow and trust boundaries
<components, stores, flows; what is verified when each boundary is crossed>
## Threats
| ID | Boundary or component | STRIDE | Scenario (step by step) | Likelihood | Impact | Mitigation | How to verify | Owner |
| T-01 | | | | | | | | |
## Business abuse cases
<account enumeration, cross-tenant access, duplicate credit or coupon use, payment fraud, scraping>
## Derived security requirements
<verifiable; become acceptance criteria of the stories that touch them>
## Supply chain and operation
<dependencies, base images, CI actions pinned, CI secrets, who publishes, who reaches production>
## Accepted risks
| Risk | Why not mitigated now | Accepted by (human) | Review on |
