# Week 11 - CP5: Runbook and operational validation for the sale/stock flow

## Objective

This checkpoint closes the observability workshop by turning the documented architecture, the trace model, the structured logs, and the metrics into an operational runbook for the real business journey selected in the project:

- Product portal / admin flow
- sales-service registers the sale
- `SaleRegistered` is produced to RabbitMQ
- product-service processes the event and updates stock
- `StockUpdated` / `StockDepleted` are emitted and correlated to the same trace

This runbook is intentionally aligned with the actual workshop journey and with the project evidence used throughout CP0–CP4.

## Operational summary

### Service responsibilities

| Service | Responsibility | Primary observability signals |
|---|---|---|
| sales-service | Accept the sale and register it | request counters, latency histograms, business success logs |
| product-service | Consume the sale event and update stock | stock-update counter, event lag, stock depletion signals |
| RabbitMQ | Transport the domain event | queue lag, consumer lag, message throughput |
| PostgreSQL | Persist business state | database writes, commit latency, failed inserts |

## End-to-end validation checklist

Use the following checklist when validating the flow manually or in a test environment:

- [ ] A sale request reaches `sales-service`
- [ ] A `trace_id` is generated or propagated from the incoming request
- [ ] The sale request is logged with `event=sale_request_received`
- [ ] The event is published to RabbitMQ with consistent metadata
- [ ] `product-service` consumes the event and logs `stock_update_received`
- [ ] The business result logs `stock_updated` or `stock_depleted`
- [ ] Counters increment for successful sale registration and stock update
- [ ] The request latency histogram is updated
- [ ] RabbitMQ lag remains within alert thresholds
- [ ] The same `trace_id` can be used to correlate all events across the flow

## Recommended log signal mapping

| Signal | Example event | Required fields |
|---|---|---|
| Sale accepted | `SALE_REQUEST_RECEIVED` | `trace_id`, `span_id`, `correlation_id`, `customer_id`, `product_id`, `quantity`, `outcome` |
| Event published | `SALE_REGISTERED` | `trace_id`, `event_name`, `routing_key`, `message_id`, `outcome` |
| Stock update received | `STOCK_UPDATE_RECEIVED` | `trace_id`, `span_id`, `product_id`, `quantity`, `outcome` |
| Stock updated | `STOCK_UPDATED` | `trace_id`, `product_id`, `quantity`, `duration_ms`, `outcome` |
| Stock depleted | `STOCK_DEPLETED` | `trace_id`, `product_id`, `quantity_remaining`, `outcome` |
| Sale completion | `SALE_COMPLETED` | `trace_id`, `duration_ms`, `outcome`, `downstream_trace_id` |

## Alert and dashboard decision tree

### If sale registration rate drops

1. Check the `sales_requests_total` and `sales_requests_failed_total` counters.
2. Review the last 10–30 minutes of logs for failed validations or downstream errors.
3. Confirm whether the request reached RabbitMQ.
4. Verify the `trace_id` and `correlation_id` for the failing samples.

### If stock updates slow down

1. Inspect `stock_update_duration_ms` and the histogram buckets.
2. Check RabbitMQ lag for the `SaleRegistered` queue.
3. Confirm whether product-service is stuck in a retry loop or DB write delay.
4. Look for `StockDepleted` events that are abnormal or unexpected.

### If the business flow is blocked

1. Start with the failing `trace_id`.
2. Review the log sequence across sales-service and product-service.
3. Validate the event publication in RabbitMQ.
4. Check PostgreSQL or inventory persistence writes.
5. Confirm whether the same correlation identifier appears in the logs and metrics.

## Validation commands

These commands are the minimum practical validation set for the workshop sample implemented in CP3.

```bash
cd 11-week/workshop/03-instrumentation
npm test
npm run start
```

Expected result:

- Tests pass with zero failures
- The demo emits structured logs for the sale and stock path
- The same `trace_id` is preserved across the sample flow

## Production readiness checklist

Before treating this as a live system strategy, confirm the following:

- [ ] W3C `traceparent` propagation is implemented for HTTP requests
- [ ] Message metadata preserves `trace_id`, `correlation_id`, and `causation_id`
- [ ] Structured log keys are consistent across services
- [ ] PII or sensitive customer data is never logged
- [ ] Business metrics and infrastructure metrics share the same trace lineage
- [ ] Alerts are tied to specific service owners and documented runbook steps
- [ ] Dashboard panels include both failure rate and latency
- [ ] Stock depletion events are reviewed for business exceptions and recovery paths

## Final workshop evidence summary

This workshop has established the following real evidence chain:

1. The real business path is documented in the architecture repo and selected for observability work.
2. The journey was mapped into a traceable event flow from `sales-service` to `product-service`.
3. A structured log contract was defined and used consistently.
4. A minimal instrumentation sample was implemented and validated with working output.
5. Metrics and alert rules were defined for the same business flow.
6. The final runbook connects all of them into a closeable operational workflow.

## Conclusion

This final checkpoint closes the workshop loop: the system is no longer just described as a flow, but also instrumented, observed, and prepared for operational diagnosis. The tracing logic, logs, metrics, and alerting strategy all align with the same product journey and are ready to be extended into a real runtime implementation when the project services are available.
