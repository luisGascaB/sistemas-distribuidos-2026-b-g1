# CP8 - Runbook: Product Portal availability fast burn

## Purpose and scope

Use this runbook when `ProductPortalAvailabilityFastBurn` fires. It covers the Product Portal client operations for loading products and adjusting stock.

The current portal writes structured logs to the browser console and keeps counters in memory. It does not export the Prometheus metrics used by CP7 or forward logs to Loki. Therefore, the queries below are the target operational procedure once telemetry is connected; until then, use the browser-console checks and treat the alert rules as design artifacts, not active production alerts.

## Alert symptoms

The fast-burn alert fires when the availability error budget burn rate is above 14.4 in both the 1-hour and 5-minute windows, confirmed for 5 minutes. For the illustrative CP6 assumptions, a sustained burn at that rate corresponds to about 2.88 minutes of the 144-minute monthly time budget per hour.

Possible user-visible symptoms:

- The product list fails to load or repeatedly displays its error state.
- Stock adjustments fail and the portal displays an error message.
- Real-mode network requests return errors or time out.
- The browser records repeated `product_list_load` or `stock_adjustment` error events.

## Confirm the alert with PromQL

Check the burn rate and the underlying error ratio in both windows:

```promql
(
  sum(rate(product_portal_operations_total{outcome="error"}[1h]))
  /
  sum(rate(product_portal_operations_total[1h]))
) / 0.01
```

```promql
(
  sum(rate(product_portal_operations_total{outcome="error"}[5m]))
  /
  sum(rate(product_portal_operations_total[5m]))
) / 0.01
```

Both results must remain above `14.4` for the configured `for: 5m` period. Break down by operation to find whether product loading or stock adjustment is contributing:

```promql
sum by (operation) (
  rate(product_portal_operations_total{outcome="error"}[5m])
)
/
sum by (operation) (
  rate(product_portal_operations_total[5m])
)
```

If the denominator is zero or too small to be meaningful, do not interpret the ratio as proof of widespread impact. Check whether real-mode traffic and telemetry export are working.

## Find related logs by trace ID

1. Obtain a failing `trace_id` from the alert sample or a failed browser request.
2. If logs are forwarded to Loki in the future, query:

```logql
{service="product-portal"} | json | trace_id="<TRACE_ID>"
```

3. With the current implementation, open browser developer tools, select the Console, and search/filter for the exact `trace_id`. Inspect the matching structured JSON record's `event`, `duration_ms`, and `outcome`.
4. In real mode, correlate the same trace ID with backend logs only if the server received `traceparent` and records the propagated trace. The portal alone cannot confirm backend propagation.

Never copy access tokens, authorization headers, customer data, or raw request bodies into incident notes.

## First mitigations, ordered by risk

Apply one mitigation at a time and record the time and result.

1. **Lowest risk — reduce exposure with an existing feature flag or pause further rollout.** If the deployed release has a supported flag for stock adjustment, temporarily disable only that action while retaining product consultation. If no such flag exists, do not invent one at incident time; pause the rollout and communicate the temporary limitation to administrators.
2. **Moderate risk — roll back the most recent portal release.** Use the team's approved deployment pipeline to restore the last known-good frontend artifact. Do not run an unverified manual command or roll back the backend based only on a frontend alert. Verify the portal version and smoke-test product loading afterward.
3. **Higher risk — scale the hosting/API dependency only when evidence points to capacity saturation.** Ask the owning service/operations role to scale the affected stateless hosting or API tier using its approved platform procedure. The current project materials do not establish deployed hosting details or a scale command, so do not apply this without confirming the target and capacity signal.

Do not use mock mode as a production workaround: mock stock changes are local and do not update the backend.

## Escalation

Escalate with the alert name, first-seen time, affected operation, burn rate in each window, sample trace IDs, current application version, mode (MOCK or real), and mitigations already attempted.

1. **Product Portal/frontend owner:** leads browser/client diagnosis, release pause, and frontend rollback.
2. **Product Service/backend owner:** joins when real API requests fail, endpoint compatibility is implicated, or backend trace propagation/stock behavior needs investigation.
3. **Team lead or incident coordinator:** coordinates impact communication, priorities, and any sustained error-budget exhaustion.

The named people, paging channel, and deployment-specific contacts must be filled in by the team; they are not specified in the available repository evidence.

## Verify recovery

1. Confirm product-list loads and valid stock adjustments succeed in real mode against the intended backend; do not use MOCK success as backend recovery evidence.
2. Confirm error logs stop increasing and inspect the related `trace_id` through the browser and backend, if propagated.
3. Once the collector is implemented, verify the 5-minute and 1-hour burn rates are below `14.4` and the alert resolves.
4. Observe normal business traffic for at least 30 minutes after mitigation and confirm no renewed fast-burn alert.
5. Record the mitigation, observed impact, recovery time, and remaining risks for CP9's incident review.

## Readiness limitations

- Prometheus metrics and Loki log forwarding are not configured by the current frontend change.
- No feature flag or deployment rollback command is documented in this repository.
- The Product Service runtime and real deployment have not been verified.
- Until these gaps are addressed, this is a project-specific response checklist, not evidence of a live alerting system.
