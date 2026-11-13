
<!-- HU-STATUS TEMPLATE - do NOT remove the <!-- ... --> markers or the table headers.
     Your weekly grade is read AUTOMATICALLY from this file:
       15-week/hu-status/README.md  (inside YOUR fork). English. -->

# Weekly Status - Week 15

<!-- CONFIG-START - must match your profile repo (username/username) CONFIG -->
- FULL_NAME: Luis Eduardo Gasca Bonilla
- GITHUB_USER: luisGascaB
- TEAM:G1 - BySellens
- SPRINT_GOAL: Consolidate the Product bounded context by updating the database structure and documenting the integration of the PostgreSQL database.
<!-- CONFIG-END -->

## 1. User stories worked this week
| HU ID | Title | Status (todo/doing/done) | Evidence (PR or commit URL) |
|---|---|---|---|
| HU-XXX-001 | Product database configuration and schema update | done | https://github.com/code-corhuila/bysellens-product-db/tree/develop |

## 2. My individual contribution
- Participated in updating and reviewing the Product database repository.
- Worked with the database structure and its organization within the Product bounded context.
- Reviewed the PostgreSQL database configuration and the use of Flyway for database migrations.
- Reviewed the initial migration responsible for creating the productos table, including its constraints and indexes.
- Helped maintain the database documentation and its integration with the Product service.
- Reviewed the separation between database infrastructure and the domain logic.

## 3. Blockers and risks
- Database integration requires consistency between the database schema and the Product service entities.
- Database configuration must remain environment-based to avoid exposing credentials.
- Changes to database migrations must be validated to prevent inconsistencies between environments.

## 4. Plan for next week
- Continue reviewing the Product database integration.
- Validate database migrations and their compatibility with the Product service.
- Verify that the application connects correctly to PostgreSQL.
- Review the consistency between database entities and application models.
- Continue supporting the integration and validation of the Bysellens system.

## 5. Compliance self-check
- [ ] Conventional Commits - `type(scope): summary`
- [ ] Per-environment HU branch + PR to that environment (hu-xxx-dev -> develop, ...)
- [ ] Testable acceptance criteria
- [ ] Tests added/updated (unit / integration)
- [x] DDD / hexagonal boundaries respected (domain has no I/O)
- [x] No secrets; config via environment variables

## 6. Evidence links
- Product Database Repository: https://github.com/code-corhuila/bysellens-product-db
- Database Development Branch: https://github.com/code-corhuila/bysellens-product-db/tree/develop
- Database Migration Documentation: https://github.com/code-corhuila/bysellens-product-db/tree/develop/db
- Personal Repository: https://github.com/luisGascaB/sistemas-distribuidos-2026-b-g1
```
