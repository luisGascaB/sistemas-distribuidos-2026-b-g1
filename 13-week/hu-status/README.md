
<!-- HU-STATUS TEMPLATE - do NOT remove the <!-- ... --> markers or the table headers.
     Your weekly grade is read AUTOMATICALLY from this file:
       13-week/hu-status/README.md  (inside YOUR fork). English. -->

# Weekly Status - Week 13

<!-- CONFIG-START - must match your profile repo (username/username) CONFIG -->
- FULL_NAME: Luis Eduardo Gasca Bonilla
- GITHUB_USER: luisGascaB
- TEAM:  G1 - BySellens
- SPRINT_GOAL: Improve Bysellens security through threat modeling, access control, inventory validation, and security testing.
<!-- CONFIG-END -->

## 1. User stories worked this week
| HU ID | Title | Status (todo/doing/done) | Evidence (PR or commit URL) |
|---|---|---|---|
| #57 | Enforce authentication and ADMIN authorization in product-service | doing | https://github.com/code-corhuila/bysellens-docs/issues/57 |
| #58 | Validate stock updates to prevent data tampering | doing | https://github.com/code-corhuila/bysellens-docs/issues/58 |
| Pending | Add auditability to inventory changes | todo | Pending issue creation |

## 2. My individual contribution
- Identified the attack surface and trust boundaries between the React administrative frontend and the Product API.
- Documented the system assets, entry points, and existing security controls.
- Performed a STRIDE threat analysis and evaluated risks according to likelihood and impact.
- Created security backlog stories related to authentication, authorization, and inventory validation.
- Prepared a security CI plan covering secret detection, dependency auditing, and negative authorization tests.
- Prepared a technical peer review of a teammate's STRIDE pull request.

## 3. Blockers and risks
- The Product service implementation and its runtime security controls still need to be verified.
- The third security story for inventory auditability is pending.
- The security CI workflow and negative authorization test still need implementation and execution.
- The physical book reference and exact page numbers need verification.
- The peer review must be formally submitted on GitHub.

## 4. Plan for next week
- Complete the remaining security backlog work.
- Implement and validate authentication and authorization controls.
- Execute the negative authorization test and record the actual output.
- Complete the security CI workflow and validate its configuration.
- Finalize the STRIDE documentation and implementation plan.
- Complete the pending peer review and update the evidence links.

## 5. Compliance self-check
- [ ] Conventional Commits - `type(scope): summary`
- [ ] Per-environment HU branch + PR to that environment (hu-xxx-dev -> develop, ...)
- [ ] Testable acceptance criteria
- [ ] Tests added/updated (unit / integration)
- [ ] DDD / hexagonal boundaries respected (domain has no I/O)
- [ ] No secrets; config via environment variables

## 6. Evidence links
- Attack surface map: https://github.com/luisGascaB/sistemas-distribuidos-2026-b-g1/blob/main/13-week/workshop/01-attack-surface.md
- STRIDE analysis: https://github.com/luisGascaB/sistemas-distribuidos-2026-b-g1/blob/main/13-week/workshop/02-stride.md
- Security backlog: https://github.com/luisGascaB/sistemas-distribuidos-2026-b-g1/blob/main/13-week/workshop/03-security-backlog.md
- Security CI plan: https://github.com/luisGascaB/sistemas-distribuidos-2026-b-g1/blob/main/13-week/workshop/04-security-ci.md
- Peer review preparation: https://github.com/luisGascaB/sistemas-distribuidos-2026-b-g1/blob/main/13-week/workshop/05-peer-review.md
- Security story 1: https://github.com/code-corhuila/bysellens-docs/issues/57
- Security story 2: https://github.com/code-corhuila/bysellens-docs/issues/58
- STRIDE boundary claim: https://github.com/code-corhuila/bysellens-docs/issues/56
- Final implementation plan: Pending
- Last commit URL: Pending
