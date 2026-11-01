<!-- HU-STATUS TEMPLATE - do NOT remove the <!-- ... --> markers or the table headers.
     Your weekly grade is read AUTOMATICALLY from this file:
       12-week/hu-status/README.md  (inside YOUR fork). English. -->

# Weekly Status - Week 12

<!-- CONFIG-START - must match your profile repo (username/username) CONFIG -->
- FULL_NAME: Luis Gasca
- GITHUB_USER: luisGascaB
- TEAM: - BySellens
- SPRINT_GOAL: Align UML, security architecture, and quality documentation with the current By_Sellens design.
<!-- CONFIG-END -->

## 1. User stories worked this week
| HU ID | Title | Status (todo/doing/done) | Evidence (PR or commit URL) |
|---|---|---|---|
| N/A | Reconcile UML diagrams and documentation | done | [PR #73](https://github.com/code-corhuila/bysellens-docs/pull/73) |
| N/A | Add the sales-service STRIDE threat model | done | [PR #74](https://github.com/code-corhuila/bysellens-docs/pull/74) |
| N/A | Add quality verification guides | doing | [Commit 414d76b](https://github.com/code-corhuila/bysellens-docs/commit/414d76be331eab46990fa580ac807765030302c7) — branch `docs/11-quality-verification-guides`; PR still pending |

## 2. My individual contribution
- Updated the UML documentation, diagram sources, rendered SVGs, and rendering script; corrected a broken registry link.
- Added a sales-service STRIDE analysis covering six threats, provisional risk scores, evidence, and proposed mitigations.
- Added an acceptance matrix, a quality review checklist, and performance and security verification guides.
- Kept unrelated working-tree changes out of the documentation branches.

## 3. Blockers and risks
- The quality verification branch is published, but its PR has not been opened yet.
- PlantUML rendering could not be rerun because the PlantUML JAR was unavailable. Existing SVGs were validated as XML.
- STRIDE risk acceptance and owner reflection remain pending; documented test scenarios are not claimed as executed.

## 4. Plan for next week
- Open the PR for `docs/11-quality-verification-guides`.
- Run PlantUML validation and rendering when the JAR is available.
- Continue tracking pending review and risk-acceptance decisions.

## 5. Compliance self-check
- [x] Conventional Commits - `type(scope): summary`
- [ ] Per-environment HU branch + PR (documentation branches were used; no HU-specific branch was created)
- [x] Testable acceptance criteria documented
- [ ] Tests added/updated (no executable tests were added or updated)
- [ ] DDD / hexagonal boundaries respected (documentation-only work; not applicable)
- [x] No secrets introduced; no application configuration was changed

## 6. Evidence links
- [UML PR #73](https://github.com/code-corhuila/bysellens-docs/pull/73)
- [Architecture PR #74](https://github.com/code-corhuila/bysellens-docs/pull/74)
- [Quality guides commit](https://github.com/code-corhuila/bysellens-docs/commit/414d76be331eab46990fa580ac807765030302c7)
