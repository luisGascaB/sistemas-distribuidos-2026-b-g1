# Week 11 - CP4: Metrics and alerts for the sale/stock flow

## Business context

This checkpoint defines the recommended observability metrics for the same journey already accepted in the workshop:

- Product portal / admin flow
- sales-service registers the sale
- product-service consumes the `SaleRegistered` event
- stock is reduced and a `StockUpdated` / `StockDepleted` event is emitted
- the update is correlated with the original sale trace

The objective is to make the business outcome visible in a way that can be monitored and alerted without losing the trace continuity already defined in CP1 and CP2.

## Core measurement model

The flow should be observed from three layers:

1. User/business flow: sale registration and stock impact
2. Service layer: latency, error rate, queue consumption, database writes
3. Dependency layer: RabbitMQ lag, PostgreSQL commit volumes, service availability

## Required business metrics

| Metric name | Type | Service | Meaning |
|---|---|---|---|
| `sales_requests_total` | Counter | sales-service | Number of sale requests accepted by the service |
| `sales_requests_failed_total` | Counter | sales-service | Number of failed sale validations or processing failures |
| `sale_registration_duration_ms` | Histogram | sales-service | Latency to register a sale |
| `stock_update_total` | Counter | product-service | Number of successful stock updates |
| `stock_depleted_total` | Counter | product-service | Number of times stock reaches depletion after a sale |
| `stock_update_duration_ms` | Histogram | product-service | Time to process the stock adjustment after the sale event |
| `rabbitmq_sale_event_lag` | Gauge | product-service | Queue lag between the sale event produced and processed |
| `sales_db_write_total` | Counter | sales-service | Sale insert / write throughput |
| `inventory_db_write_total` | Counter | inventory-service or product-service | Inventory update write throughput |
| `trace_business_decision_total` | Counter | sales-service/product-service | Count of business decisions tied to a trace |

## Recommended labels

All metrics should include at least these labels when possible:

- `service`
- `environment`
- `operation`
- `status`
- `product_id` (optional but useful for stock impact analysis)
- `trace_id`
- `tenant` or `market` if the system is multi-tenant

The label set should remain stable and must not include raw personal data.

## Service-level objectives (SLOs)

The recommended threshold values for this flow are:

- Sale registration success rate: >= 99.5%
- Sale registration p95 latency: <= 800 ms under normal load
- Stock update rate success: >= 99.9%
- Queue lag for `SaleRegistered`: < 100 messages under steady state
- Stock update processing p95: <= 1.5 s

These thresholds are not a claim about the live platform; they are the workshop’s target observability contract for the documented business flow.

## Prometheus-style metric examples

```yaml
# Example only - for workshop design
- record: sales:request_rate_5m
  expr: rate(sales_requests_total{job="sales-service"}[5m])

- record: sales:failure_rate_5m
  expr: rate(sales_requests_failed_total{job="sales-service"}[5m]) / rate(sales_requests_total{job="sales-service"}[5m])

- record: inventory:stock_update_latency_p95
  expr: histogram_quantile(0.95, sum by (le) (rate(stock_update_duration_ms_bucket{job="product-service"}[5m])))
```

## Alert rules

```yaml
groups:
  - name: bysellens-sale-flow
    rules:
      - alert: SaleRegistrationFailureRateHigh
        expr: rate(sales_requests_failed_total{job="sales-service"}[10m]) / rate(sales_requests_total{job="sales-service"}[10m]) > 0.05
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: High failure rate in sale registration
          description: Sale registration failures exceed 5% for 10 minutes.

      - alert: StockUpdateLatencyHigh
        expr: histogram_quantile(0.95, sum by (le) (rate(stock_update_duration_ms_bucket{job="product-service"}[10m]))) > 1500
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: Stock update latency above target
          description: Product-service is taking too long to process sale-triggered stock updates.

      - alert: RabbitMQSaleEventLagHigh
        expr: rabbitmq_sale_event_lag{job="product-service"} > 100
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: Queue lag is breaking the sale-stock flow
          description: Sale events are backing up before stock updates are processed.

      - alert: StockDepletedUnexpectedly
        expr: rate(stock_depleted_total{job="product-service"}[15m]) > 0
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: Inventory depletion detected for sale flow
          description: A stock depletion event was observed with no expected business recovery window.
```

## Dashboard views

A useful dashboard should include at least these panels:

1. Sale requests per minute
2. Sale success vs failure rate
3. p95 sale registration latency
4. p95 stock update latency
5. RabbitMQ lag for `SaleRegistered`
6. Stock depletion events by product
7. Correlated traces by `trace_id`

## Trace correlation design

For the real flow, metrics and logs must connect through the same `trace_id`:

- sales-service creates or receives the trace context
- product-service reads the same `trace_id` from the event metadata or HTTP headers
- every log line includes `trace_id`, `span_id`, and the relevant business event
- every alert references the transaction path and service that generated the issue

This ensures that an incident in stock processing can be traced back to the original sale registration without guessing.

## Operational guidance

When an alert triggers:

1. Check the trace associated with the failing `trace_id`
2. Confirm whether the sale event reached RabbitMQ
3. Confirm whether product-service consumed the event
4. Review inventory update success and PostgreSQL write completion
5. Correlate the degradation to a specific product or batch of sales

## Summary

This checkpoint turns the business journey into a measurable operational contract. The combination of counters, histograms, queue lag, and alert rules gives the team a concrete way to detect degradation in the documented sale-to-stock flow before it becomes a customer-facing issue.
