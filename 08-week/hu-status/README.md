<!--
Your weekly grade is read AUTOMATICALLY from this file:
08-week/hu-status/README.md (inside YOUR fork). English.
-->

# Weekly Status - Week 08

- FULL_NAME: Luis Eduardo Gasca Bonilla
- GITHUB_USER: luisGascaB
- TEAM: bysellens
- SPRINT_GOAL: Update and consolidate the UML diagrams to support the planned microservice architecture and MVP implementation.

## 1. User stories worked this week

| HU ID | Title | Status (todo/doing/done) | Evidence (PR or commit URL) |
|---|---|---|---|
| HU-XXX-001 | UML diagrams update | done | https://github.com/code-corhuila/bysellens-docs/commit/ea608f9fcaf407213b00c130469dacd9eb536487 |

## 2. My individual contribution

- Updated the **08 — UML Diagrams** documentation.
- Updated the UML diagrams according to the second-cut architecture.
- Added and updated the **local deployment diagram** to represent the planned isolated services and their owned persistence.
- Reviewed the relationships between the services, databases, and the local deployment environment.
- Created the corresponding documentation commit following the Conventional Commits format.

## 3. Blockers and risks

- No major technical blockers were encountered during the UML documentation update.
- The microservices and their boundaries still need to be analyzed in greater detail before implementation begins.
- The deployment configuration is still planned and may require adjustments during the MVP implementation stage.

## 4. Plan for next week

For Week 09, the main activities will be:

- Analyze the **microservices** defined in the architecture.
- Review the responsibilities and boundaries of each service.
- Identify the services that will be implemented as part of the **MVP**.
- Begin preparing the implementation of the selected microservices.
- Review the required communication, persistence, and configuration for each service.

## 5. Compliance self-check

- Conventional Commits - `type(scope): summary` ✓
- Per-environment HU branch + PR to that environment (hu-xxx-dev -> develop, ...)
- Testable acceptance criteria
- Tests added/updated (unit / integration)
- DDD / hexagonal boundaries respected (domain has no I/O) ✓
- No secrets; config via environment variables ✓

## 6. Evidence links

- **08 — UML Diagrams update:**  
  https://github.com/code-corhuila/bysellens-docs/commit/ea608f9fcaf407213b00c130469dacd9eb536487

- **Local deployment diagram:**  
  Updated as part of the UML documentation commit above.
