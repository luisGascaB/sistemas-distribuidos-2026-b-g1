# CP9 - Simulated incident drill and blameless postmortem

> **Simulation only.** No production incident occurred and no deployed backend telemetry was available. The slow trace and logs below are synthetic examples in the CP2 format, constructed from the CP1 Product Portal journey, CP4 latency proposal, CP6 planning assumptions, CP7 alert rules, and CP8 runbook.

## Scenario and assumptions

The affected CP1 hop is a real-mode Product Portal stock-list request to its configured product/inventory API (`GET /api/productos`). During the simulated 40-minute incident, the dependency responds in 3 seconds for 25% of requests. To make the low-volume CP6 scenario concrete, the drill assumes four list requests in the interval, one of which is slow. This is a simulated burst, not measured traffic.

For the sample trace, the three unaffected requests complete in 400–500 ms. The affected request takes 3,040 ms end to end, of which the downstream API call takes 3,000 ms. All four requests eventually succeed; this is a latency incident, not an availability outage.

## Trace of one slow request

Synthetic trace ID: `4bf92f3577b34da6a3ce929d0e0e4736`

Span tree for the single slow product-list request:

```text
product_list_load (Product Portal UI)                 3040 ms
└── productoService GET /api/productos                3020 ms
    ├── configured product/inventory API dependency  3000 ms
    └── client response handling                       20 ms
└── update page state and render                        20 ms
```

The child spans are nested estimates for this exercise; overlapping durations are not added together. The 3,040 ms root duration includes the 3,020 ms HTTP client span and 20 ms page update. The HTTP client span includes its 3,000 ms dependency wait and 20 ms response handling.

## Four synthetic CP2-format log lines

The required CP2 fields are retained. The optional `stage` field makes the simulated span boundary understandable. `service` remains `product-portal` to follow the CP2 contract; the modeled dependency span is not evidence of an actual backend log.

```json
{"timestamp":"2026-10-21T16:12:08.000Z","level":"INFO","service":"product-portal","event":"product_list_load","trace_id":"4bf92f3577b34da6a3ce929d0e0e4736","span_id":"a100000000000001","parent_span_id":"a100000000000002","duration_ms":3000,"outcome":"success","stage":"configured_api_wait"}
{"timestamp":"2026-10-21T16:12:08.020Z","level":"INFO","service":"product-portal","event":"product_list_load","trace_id":"4bf92f3577b34da6a3ce929d0e0e4736","span_id":"a100000000000003","parent_span_id":"a100000000000002","duration_ms":20,"outcome":"success","stage":"response_handling"}
{"timestamp":"2026-10-21T16:12:08.020Z","level":"INFO","service":"product-portal","event":"product_list_load","trace_id":"4bf92f3577b34da6a3ce929d0e0e4736","span_id":"a100000000000002","parent_span_id":"a100000000000004","duration_ms":3020,"outcome":"success","stage":"producto_service_http"}
{"timestamp":"2026-10-21T16:12:08.040Z","level":"INFO","service":"product-portal","event":"product_list_load","trace_id":"4bf92f3577b34da6a3ce929d0e0e4736","span_id":"a100000000000004","duration_ms":3040,"outcome":"success","stage":"portal_user_flow"}
```

These four records are drill data, not output captured from the current frontend. The present instrumentation emits a single operation-level record and does not yet produce backend child spans.

## SLI values during the drill

Using the four-request incident sample:

- **Availability SLI:** `4 successful / 4 valid = 100%`. No request failed, so the availability error ratio is 0%.
- **Latency SLI:** `3 of 4 requests <= 1 s = 75% within threshold`; the sample p95 is 3.04 s. The CP6 p95 target of at most 1 s is breached.
- **Stock-adjustment success SLI:** not affected by this product-list incident; no adjustment requests are included in the sample.

### Alert outcome

- **First alert, if CP4's proposed latency alert is implemented:** `Product Portal latency high` when p95 stays over 1 second for 10 minutes; it first fires at incident minute **10**.
- **CP7 fast availability burn alert:** does not fire. The requests are slow but successful, so the availability error ratio is 0%, not a 14.4 burn rate.
- **CP7 slow availability burn alert:** does not fire for the same reason.

The CP4 latency alert is a proposal, not a deployed Prometheus rule. With the current in-memory frontend metrics and no exporter, no automated alert actually fires. The minute-10 result is the expected outcome in the simulated monitoring setup.

## Timeline

| Incident time | Event |
|---:|---|
| T+00 min | The configured product/inventory API begins responding in 3 seconds for 25% of product-list requests. The requests still succeed. |
| T+10 min | In the simulated monitoring setup, the CP4 p95 latency alert fires after the threshold has remained breached for 10 minutes. |
| T+12 min | The responder checks operation-level p95 and follows the trace for the slow request, locating most of the delay in the configured API dependency. |
| T+18 min | The team confirms a simulated capacity-saturation signal in the downstream API tier; this is an assumption for the drill, not an observed production root cause. |
| T+20 min | Following CP8 mitigation step 3, the owning operations role requests a controlled scale-out of the affected stateless API tier using its approved platform procedure. |
| T+35 min | The controlled scale-out is ready; sample response times return below the 1-second target. |
| T+40 min | The degraded-latency period ends after 40 minutes. Begin the 30-minute recovery observation window. |
| T+70 min | The team confirms no renewed latency breach and closes the simulated incident. |

## Impact and error-budget accounting

For this drill, four product-list requests occur during the 40-minute interval and one is slow:

- Requests affected: `1 of 4` (25%); requests failed: `0 of 4`.
- Degraded-latency period: 40 minutes.
- **Availability request budget:** 0 failed requests consumed out of the CP6 budget of 7.5 failures (at most 7 whole failures).
- **Availability time budget:** 0 outage minutes consumed out of 144 minutes. The portal was degraded, not fully unavailable; do not count all 40 minutes as full outage under the CP6 availability definition.
- **Latency budget:** at most 5% of 750 monthly operations may exceed 1 second, or 37.5 slow operations. The one slow request in this sample consumes `1 / 37.5 = 2.67%` of the illustrative latency request budget.

The CP6 traffic estimate averages 25 operations across an 8-hour day. Four requests in 40 minutes is an illustrative burst to obtain an exact 25% sample; it is not a traffic measurement. If the team later decides that degraded minutes should also count against a separate user-experience time budget, that policy must be defined explicitly rather than silently subtracting them from the availability outage budget.

## Runbook action that stops the bleeding

After confirming the simulated capacity signal, apply **CP8 mitigation step 3: controlled scale-out of the affected stateless API tier**. This targets the assumed capacity constraint and restores response time. Use only the owning team's approved platform procedure; no deployment platform or scale command is established in the project materials.

If capacity evidence is absent, do not scale blindly. Follow CP8's lower-risk response first: pause any active rollout, gather trace evidence, and escalate to the Product Service/API owner.

## Blameless postmortem

### Summary

A simulated downstream API capacity constraint increased product-list latency to 3 seconds for one in four requests over 40 minutes. Requests remained successful. The CP4 latency alert would fire at minute 10 if implemented; CP7 availability burn alerts correctly remain inactive because there are no failed requests.

### Root cause

For the exercise only, the configured product/inventory API tier had insufficient available capacity under the simulated burst, causing elevated response time for 25% of requests. This cause is an explicit drill assumption. The actual backend implementation and capacity behavior have not been verified.

### Contributing factors

- The portal's current instrumentation records a client operation but does not emit dependency spans.
- Metrics remain in browser memory and are not exported to a monitoring system.
- The CP4 latency alert is proposed but not deployed.
- CP6 traffic figures are illustrative and do not establish a measured peak-load baseline.
- The portal's configured API path still needs compatibility validation against the separate Product Service draft contract.

### Action items

1. **As the Product Portal owner, I want operation metrics exported to the team's monitoring system so that latency objectives can trigger actionable alerts.**
   - Acceptance criteria:
     - Real-mode list and stock-adjustment operations export bounded counters by `operation` and `outcome`.
     - Duration histograms are exported in seconds and can be queried by PromQL.
     - MOCK-mode telemetry is excluded from production SLOs.
     - Automated tests verify metric names, labels, and success/error increments.

2. **As an administrator, I want the request trace to include the downstream API span so that slow product loads can be localized without guessing.**
   - Acceptance criteria:
     - A real-mode request sends W3C `traceparent`.
     - The backend creates a child span preserving the trace ID and records the dependency duration.
     - An integration test verifies parent/child trace continuity and the 3-second dependency span in a controlled delay scenario.
     - Logs contain no credentials, tokens, or raw user data.

3. **As the Product Portal/API operations owner, I want capacity behavior tested against the expected peak load so that a dependency slowdown is detected and mitigated before affecting administrators.**
   - Acceptance criteria:
     - A repeatable test simulates the CP6 baseline and an agreed peak above it.
     - The product-list p95 remains at or below 1 second at the agreed supported load, or the capacity limit is documented and an alert fires within 10 minutes when p95 exceeds the SLO.
     - The approved scale-out procedure is tested in a non-production environment and its recovery result is recorded.

## Learning and limitations

This drill demonstrates that a latency SLO can be breached while availability remains 100%; the alert must match the user-visible symptom. It also exposes a practical gap: the current implementation cannot produce the exported Prometheus metrics or distributed backend spans assumed by the simulated alert. Validate the traffic estimate, backend/API contract, and alert behavior before presenting this exercise as production evidence.
