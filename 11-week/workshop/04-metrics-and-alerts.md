# CP4 - Product Portal metrics and alert proposal

## Metrics implemented in the portal

The current instrumentation keeps bounded, in-memory metrics for the browser session. They are diagnostic sample metrics, not a Prometheus exporter or centralized monitoring deployment.

| Metric | Type | Event | Meaning |
|---|---|---|---|
| `product_list_load:success` | Counter | `product_list_load` | Product list loads completed |
| `product_list_load:error` | Counter | `product_list_load` | Product list loads failed |
| `stock_adjustment:success` | Counter | `stock_adjustment` | Stock adjustments completed |
| `stock_adjustment:error` | Counter | `stock_adjustment` | Stock adjustments failed |
| `operation_duration_ms` | Cumulative histogram buckets | Both events | Client-side operation duration in fixed buckets |

Metrics use event and outcome only. They must not be labeled by trace ID, product name, search text, or operator identity because those values create privacy and cardinality risks.

### Prometheus export mapping for CP6

The in-memory values above are not themselves Prometheus time series. If a collector/exporter is added, map them to this bounded metric contract:

- `product_portal_operations_total{operation, outcome}` — map each operation/outcome counter to `operation="product_list_load"` or `"stock_adjustment"` and `outcome="success"` or `"error"`.
- `product_portal_operation_duration_seconds_bucket{operation, le}` — export cumulative duration buckets in seconds for each operation.
- `product_portal_operation_duration_seconds_count{operation}` — total duration observations for each operation.

Do not add `trace_id`, product identifiers, search strings, or user identities as metric labels. This is a proposed export mapping only; the current browser code does not expose these Prometheus metrics.

## Suggested service-level objectives

These are proposed targets for later measurement, not observed production results:

- Product list load success rate: at least 99% over a rolling 30-day window.
- Product list p95 duration: at most 1 second.
- Stock adjustment success rate: at least 99% over a rolling 30-day window.
- Stock adjustment p95 duration: at most 1 second, excluding user think time.

## Alert proposals

The in-memory sample cannot evaluate or deliver alerts. Once telemetry is exported and aggregated by an approved monitoring system, consider:

| Alert | Candidate trigger | Initial response |
|---|---|---|
| Product list failures elevated | Failure ratio above 5% for 10 minutes | Check API availability, browser network errors, and configured API base URL |
| Stock adjustment failures elevated | Failure ratio above 2% for 10 minutes | Check validation results, endpoint compatibility, and backend response status |
| Product Portal latency high | p95 over the SLO for 10 minutes | Compare list/adjustment latency and check the network/API dependency |

Thresholds must be tuned against baseline traffic and confirmed with the service owner before production use.

## Dashboard proposal

1. Product list load success/error count and ratio.
2. Stock adjustment success/error count and ratio.
3. p50/p95/p99 duration by bounded operation.
4. Error counts grouped by sanitized HTTP status, once real API telemetry is available.
5. Trace lookup by `trace_id` in a tracing backend; never use trace IDs as metric dimensions.

## Current limitations

Metrics are held in memory and reset when the page reloads. They are not sent to a collector, and no alerts are active. Backend metrics, dashboards, and end-to-end trace continuity remain future integration work.
