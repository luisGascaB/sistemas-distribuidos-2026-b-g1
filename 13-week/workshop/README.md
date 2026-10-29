# Week 13 — Threat Modeling and Security Backlog

This workshop applies threat modeling and security controls to the Bysellens
project. Findings must distinguish verified implementation from documented
design. Do not mark a checkpoint complete without its required evidence.

<!-- CONFIG-START -->
- GITHUB_USER: luisGascaB
- TRUST_BOUNDARY: React administrative frontend → product-service
- TRUST_BOUNDARY_ISSUE: https://github.com/code-corhuila/bysellens-docs/issues/56
- WORK_BRANCH: hu-luisGascaB-main
- PULL_REQUEST_URL: [PENDING]
- SECURITY_STORY_1_URL: [PENDING]
- SECURITY_STORY_2_URL: [PENDING]
- SECURITY_STORY_3_URL: [PENDING]
- REFLECTION_DOCUMENT_URL: [PENDING: provide the Week 13 document link]
- DOCS_REPOSITORY: https://github.com/code-corhuila/bysellens-docs
- STRIDE_DOCUMENT_URL: https://github.com/code-corhuila/bysellens-docs/blob/security/stride-luisGascaB/05-architecture/security/stride-luisGascaB.md
- PEER_REVIEW_URL: [PENDING: only after reviewing a real teammate PR]
- BOOK_REFERENCE: [PENDING: verify page(s) in the physical copy before citing]
<!-- CONFIG-END -->

## Checkpoint status

| Checkpoint | Status | Evidence / blocker |
|---|---|---|
| CP0 — Preparation | In progress | Issue #56 records the selected boundary; repository branches, PRs, and documentation-repo access remain unverified. |
| CP1 — Attack surface | Draft prepared | `01-attack-surface.md`; confirm the authoritative implementation repository before treating the snapshot as canonical. |
| CP2 — STRIDE | Analysis complete | All six categories, prioritization and conditional residual-risk targets are in the linked docs branch; physical-book page citation remains pending verification. |
| CP3 — Security stories | Pending | Rank evidence-based STRIDE risks and check existing issues before creating any. |
| CP4 — Security CI | Pending | Select tools and an authorization test from the confirmed implementation and its real protected operations. |
| CP5 — Peer review | Pending | Requires a teammate's actual pull request and approval before posting a review. |
| CP6–CP8 — Completion | Pending | Requires real review feedback, executed checks, and recorded output. |
| CP9 — Personal reflection | Student-authored | Write the reflection personally; AI must not draft or rewrite it. |

## Selected trust boundary

The selected boundary is the request path from the React administrative
frontend to the product-service API. Issue
[#56](https://github.com/code-corhuila/bysellens-docs/issues/56) records the
claim and scope: analyze how browser requests reach the service and how product
and inventory data are protected.

The local microservices snapshot uses a `catalogo-service` implementation with
product and inventory routes; the documentation distinguishes a planned
`product-service`. Confirm which implementation and API contract are
authoritative before attributing controls or findings to `product-service`.

The issue is visible in the user's supplied screenshot. A complete check of
all issues and pull requests in the documentation repository has not been
possible from this environment.

## Evidence and scope notes

- The original course workspace was a snapshot without `.git`. This file is
  being prepared in the separately cloned course fork, not in that snapshot.
- Local Bysellens documentation and microservices folders are snapshots without
  `.git`; use them as provisional code/documentation evidence only.
- The separate Product Portal clone has an existing untracked `.tsupgrader/`
  directory. Preserve it; do not overwrite or remove it.
- The public course fork is divergent from its upstream. Do not synchronize it
  automatically; review the comparison and agree on a safe update path first.
- No push is performed automatically. Review each checkpoint and keep its
  commit and push separate from the others.

## Before starting CP1

- [x] Record the selected boundary in the manually created documentation issue.
- [ ] Confirm that no conflicting issue or pull request exists in the full repository.
- [ ] Confirm which implementation repository/snapshot is authoritative.
- [ ] Keep all workshop deliverables in English and record only verified evidence.
