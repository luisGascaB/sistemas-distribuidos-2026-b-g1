<!--
Your weekly grade is read AUTOMATICALLY from this file:
09-week/hu-status/README.md (inside YOUR fork). English.
-->

# Weekly Status - Week 09

- FULL_NAME: Luis Eduardo Gasca Bonilla
- GITHUB_USER: luisGascaB
- TEAM: By-sellens
- SPRINT_GOAL: Update and consolidate the architecture documentation and architectural decisions for the project.

## 1. User stories worked this week

| HU ID | Title | Status (todo/doing/done) | Evidence (PR or commit URL) |
|---|---|---|---|
| HU-XXX-001 | Architecture documentation update | done | https://github.com/code-corhuila/bysellens-docs/commit/4c08558207227b0e70ba8855c225dcb5249f6b29 |

## 2. My individual contribution

- Updated the **05 — Architecture** documentation.
- Added the new **ADR-003 — Stock Concurrency** architectural decision record.
- Updated the **Hexagonal Architecture** documentation.
- Updated the **architecture overview** documentation.
- Updated the **architecture overview PDF**.
- Consolidated the architecture documentation and architectural decisions in the corresponding files.
- Created the corresponding documentation commit following the Conventional Commits format.

## 3. Blockers and risks

- No major technical blockers were encountered during the architecture documentation update.
- The architectural decisions may require further refinement during the implementation of the microservices.
- The stock concurrency strategy should be validated during the implementation and integration stages.

## 4. Plan for next week

For Week 10, the main activities will be:

- Continue with the definition and implementation of the microservices.
- Validate the architectural decisions defined in the documentation.
- Review the stock concurrency strategy during implementation.
- Continue integrating the architecture decisions with the MVP development.

## 5. Compliance self-check

- Conventional Commits - `type(scope): summary` ✓
- Per-environment HU branch + PR to that environment (hu-xxx-dev -> develop, ...)
- Testable acceptance criteria
- Tests added/updated (unit / integration)
- DDD / hexagonal boundaries respected (domain has no I/O) ✓
- No secrets; config via environment variables ✓

## 6. Evidence links

- **05 — Architecture update:**  
  https://github.com/code-corhuila/bysellens-docs/commit/4c08558207227b0e70ba8855c225dcb5249f6b29

### Files updated

- `05-architecture/decisions/records/ADR-003-stock-concurrency.md` — new
- `05-architecture/hexagonal-architecture.md` — updated
- `05-architecture/overview.md` — updated
- `05-architecture/overview.pdf` — updated
