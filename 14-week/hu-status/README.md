
<!-- HU-STATUS TEMPLATE - do NOT remove the <!-- ... --> markers or the table headers.
     Your weekly grade is read AUTOMATICALLY from this file:
       14-week/hu-status/README.md  (inside YOUR fork). English. -->

# Weekly Status - Week 14

<!-- CONFIG-START - must match your profile repo (username/username) CONFIG -->
- FULL_NAME: Luis Eduardo Gasca Bonilla
- GITHUB_USER: luisGascaB
- TEAM: G1 - BySellens
- SPRINT_GOAL: Develop and publish the standalone Product API as part of the Bysellens backend.
<!-- CONFIG-END -->

## 1. User stories worked this week
| HU ID | Title | Status (todo/doing/done) | Evidence (PR or commit URL) |
|---|---|---|---|
| HU-PRODUCT-001 | Develop and publish the standalone Product API backend service | done | https://github.com/code-corhuila/bysellens-product-api/pull/2 |

## 2. My individual contribution
- Created and published the standalone Product API service using Spring Boot and Java 21.
- Added the product API functionality, persistence layer, database migrations with Flyway, and product image handling.
- Configured database and service settings through environment variables.
- Incorporated JWT-based security dependencies and inventory service integration configuration.
- Added automated tests and validated the service with `mvn clean test` (2 tests passed).
- Created and merged PR #2 into the `develop` branch.

## 3. Blockers and risks
- Integration with the other backend microservices remains a pending activity.
- Inventory service communication requires validation in the integrated environment.
- End-to-end testing of the complete backend is still necessary.

## 4. Plan for next week
- Continue integrating Product API with the other backend services.
- Validate communication with the inventory service.
- Execute integration tests and verify API behavior.
- Review security, database configuration, and environment variables.
- Update technical documentation and integration evidence.

## 5. Compliance self-check
- [x] Conventional Commits - `type(scope): summary`
- [x] Per-environment HU branch + PR to that environment (hu-xxx-dev -> develop, ...)
- [x] Testable acceptance criteria
- [x] Tests added/updated (unit / integration)
- [ ] DDD / hexagonal boundaries respected (domain has no I/O)
- [x] No secrets; config via environment variables

## 6. Evidence links
- Product API repository: https://github.com/code-corhuila/bysellens-product-api
- Pull Request #2: https://github.com/code-corhuila/bysellens-product-api/pull/2
- Commit: https://github.com/code-corhuila/bysellens-product-api/commit/33bd2251e69635ef816057043d2c2052cd0d697d
- Merge commit: https://github.com/code-corhuila/bysellens-product-api/commit/319c99923a0aa1ec2e042a6d2520d4fa2a98e00d
