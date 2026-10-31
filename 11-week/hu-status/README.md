<!-- HU-STATUS TEMPLATE - do NOT remove the <!-- ... --> markers or the table headers.
     Your weekly grade is read AUTOMATICALLY from this file:
       11-week/hu-status/README.md  (inside YOUR fork). English. -->

# Weekly Status - Week 11

<!-- CONFIG-START - must match your profile repo (username/username) CONFIG -->
- FULL_NAME: Luis Eduardo Gasca Bonilla
- GITHUB_USER: luisGascaB
- TEAM: G1 - BySellens
- SPRINT_GOAL: Improve observability in the Product Portal through critical journey mapping, structured logging, distributed tracing, metrics, service level objectives, alerting policies, and incident response documentation.
<!-- CONFIG-END -->

## 1. User stories worked this week
| HU ID | Title | Status (todo/doing/done) | Evidence (PR or commit URL) |
|---|---|---|---|
| CP0 | Initialize Week 11 observability workshop | done | [Commit](https://github.com/luisGascaB/sistemas-distribuidos-2026-b-g1/commit/7e2e798c1ba7ad7b4c6a2a4624544e585f8ad35e) |
| CP1 | Map the Product Portal critical journey and trace propagation | done | [Commit](https://github.com/luisGascaB/sistemas-distribuidos-2026-b-g1/commit/d942b3e4ec7e37c007e38ade4ae98a08d66fe463) |
| CP2 | Define the structured logging contract | done | [Log contract](https://github.com/luisGascaB/sistemas-distribuidos-2026-b-g1/blob/main/11-week/workshop/02-log-contract.md) |
| CP3 | Document the observability instrumentation approach | doing | [Instrumentation folder](https://github.com/luisGascaB/sistemas-distribuidos-2026-b-g1/tree/main/11-week/workshop/03-instrumentation) |
| CP4 | Define Product Portal metrics and golden signals | done | [Metrics catalog](https://github.com/luisGascaB/sistemas-distribuidos-2026-b-g1/blob/main/11-week/workshop/04-metrics-and-alerts.md) |
| CP5 | Complete the Week 11 weekly status report | doing | [Weekly status](https://github.com/luisGascaB/sistemas-distribuidos-2026-b-g1/blob/main/11-week/hu-status/README.md) |
| CP6 | Define service level indicators, objectives, and error budget | done | [SLO and error budget](https://github.com/luisGascaB/sistemas-distribuidos-2026-b-g1/blob/main/11-week/workshop/06-slo.md) |
| CP7 | Define burn-rate alerting rules and policies | done | [Alert rules and runbook commit](https://github.com/luisGascaB/sistemas-distribuidos-2026-b-g1/commit/36f140efb41b2c9498079365b82522ea4cdb540f) |
| CP8 | Write the incident response runbook | done | [Runbook](https://github.com/luisGascaB/sistemas-distribuidos-2026-b-g1/blob/main/11-week/workshop/08-runbook.md) |
| CP9 | Document the incident drill and postmortem | done | [Commit](https://github.com/luisGascaB/sistemas-distribuidos-2026-b-g1/commit/ecd06c1cab093bff8a8fe280d37e3d14781f33fe) |
| CP10 | Prepare the individual reflection and implementation plan | doing | [Week 11 workshop](https://github.com/luisGascaB/sistemas-distribuidos-2026-b-g1/tree/main/11-week/workshop) |

## 2. My individual contribution
- Documented the Product Portal critical journey, focusing on product consultation and stock adjustment.
- Identified the main components involved in the flow, including the product service and Products page.
- Documented the purpose of trace_id, span_id, and correlation_id for tracking operations and connecting events.
- Defined a structured logging contract with the expected fields, severity levels, and privacy considerations.
- Prepared a metrics catalog for product list loading, stock adjustments, and operation duration.
- Analyzed metric cardinality and privacy risks, identifying why trace IDs, product names, search terms, and operator identities should not be used as metric labels.
- Defined proposed service level indicators, service level objectives, and error-budget calculations for availability and latency.
- Documented alerting policies based on error-budget consumption and burn-rate thresholds.
- Prepared an incident response runbook with steps to investigate alerts, review logs and traces, and apply mitigation actions.
- Documented a simulated latency incident, including its timeline, impact analysis, postmortem, and recommended improvements.
- Reviewed existing Product Portal services and domain tests related to product consultation and stock adjustment.

## 3. Blockers and risks
- The reviewed Product Portal version does not contain the complete observability instrumentation module referenced by the workshop instructions.
- The structured logging contract, metrics catalog, and alert policies are documented, but their complete integration into the application and a monitoring platform remains pending.
- Trace context propagation across the complete request flow requires implementation and verification.
- The proposed SLI/SLO targets and alert thresholds need validation using real application measurements.
- Additional observability-specific tests and load tests are required to validate the proposed solution.

## 4. Plan for next week
- Continue implementing and validating observability instrumentation in the Product Portal.
- Implement and verify trace context propagation across the relevant operations.
- Integrate structured logging and metrics into the application.
- Add automated tests for observability behavior.
- Connect metrics to a monitoring solution and validate the proposed alert rules.
- Perform load and latency tests to evaluate the proposed SLOs.
- Update the runbook and documentation with implementation and test evidence.

## 5. Compliance self-check
- [ ] Conventional Commits - `type(scope): summary`
- [ ] Per-environment HU branch + PR to that environment (hu-xxx-dev -> develop, ...)
- [ ] Testable acceptance criteria
- [ ] Tests added/updated (unit / integration)
- [ ] DDD / hexagonal boundaries respected (domain has no I/O)
- [ ] No secrets; config via environment variables

## 6. Evidence links

- CP0 - Initialize Week 11 observability workshop:
  https://github.com/luisGascaB/sistemas-distribuidos-2026-b-g1/commit/7e2e798c1ba7ad7b4c6a2a4624544e585f8ad35e

- CP1 - Product Portal critical journey and trace propagation:
  https://github.com/luisGascaB/sistemas-distribuidos-2026-b-g1/commit/d942b3e4ec7e37c007e38ade4ae98a08d66fe463

- CP2 - Structured logging contract:
  https://github.com/luisGascaB/sistemas-distribuidos-2026-b-g1/blob/main/11-week/workshop/02-log-contract.md

- CP3 - Observability instrumentation instructions:
  https://github.com/luisGascaB/sistemas-distribuidos-2026-b-g1/tree/main/11-week/workshop/03-instrumentation

- CP4 - Metrics catalog and golden signals:
  https://github.com/luisGascaB/sistemas-distribuidos-2026-b-g1/blob/main/11-week/workshop/04-metrics-and-alerts.md

- CP5 - Week 11 weekly status report:
  https://github.com/luisGascaB/sistemas-distribuidos-2026-b-g1/blob/main/11-week/hu-status/README.md

- CP6 - Service level objectives and error budget:
  https://github.com/luisGascaB/sistemas-distribuidos-2026-b-g1/blob/main/11-week/workshop/06-slo.md

- CP7 - Burn-rate alerting rules and runbook:
  https://github.com/luisGascaB/sistemas-distribuidos-2026-b-g1/commit/36f140efb41b2c9498079365b82522ea4cdb540f

- CP7 - Additional burn-rate alerting rules:
  https://github.com/luisGascaB/sistemas-distribuidos-2026-b-g1/commit/8f10453dafa0adafaf143e77b24950d43d3a2dc7

- CP8 - Incident response runbook:
  https://github.com/luisGascaB/sistemas-distribuidos-2026-b-g1/blob/main/11-week/workshop/08-runbook.md

- CP9 - Incident drill and postmortem:
  https://github.com/luisGascaB/sistemas-distribuidos-2026-b-g1/commit/ecd06c1cab093bff8a8fe280d37e3d14781f33fe

- CP10 - Individual reflection and implementation plan:
  https://github.com/luisGascaB/sistemas-distribuidos-2026-b-g1/tree/main/11-week/workshop

- Individual GitHub repository:
  https://github.com/luisGascaB/sistemas-distribuidos-2026-b-g1

- Week 11 workshop folder:
  https://github.com/luisGascaB/sistemas-distribuidos-2026-b-g1/tree/main/11-week/workshop
