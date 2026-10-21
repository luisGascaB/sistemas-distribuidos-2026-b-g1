# CP6 - SLIs, SLOs, and error budget for Product Portal

> **Draft — illustrative traffic assumption, not measured production usage.** The user approved using this example for the draft: one administrator, about 20 product-list loads and 5 stock adjustments per business day, over 8 operating hours. Validate that it represents the expected real usage before submission. No production traffic data is available in the Product Portal repository.

## Scope and measurement assumptions

This SLO set covers the two instrumented Product Portal operations:

- `product_list_load`
- `stock_adjustment`

For the PromQL below, the CP4 client metrics must be exported to the monitoring system with this bounded metric contract:

- `product_portal_operations_total{operation, outcome}` — counter, where `outcome` is `success` or `error`.
- `product_portal_operation_duration_seconds_bucket{operation, le}` — cumulative duration histogram.
- `product_portal_operation_duration_seconds_count{operation}` — histogram observation count.

The current browser implementation keeps counters and histogram buckets in memory. It does **not** expose these Prometheus metrics or send them to a collector. The queries below become executable only after an approved exporter/collector is configured. MOCK-mode operations must not be counted as production service availability.

## SLO 1 — Product Portal operation availability

- **Target:** at least 99% successful valid operations over a rolling 30-day window.
- **Valid events:** completed product-list loads and stock-adjustment attempts that passed client-side validation and reached the selected execution mode.
- **Good events:** valid events completed successfully.
- **SLI formula:** good valid operations / all valid operations.
- **PromQL:**

```promql
sum(increase(product_portal_operations_total{outcome="success"}[30d]))
/
sum(increase(product_portal_operations_total[30d]))
```

The result must be at least `0.99`. Requests rejected by client-side input validation should be excluded from the denominator; they are user-correctable validation outcomes, not service failures.

## SLO 2 — Product operation latency

- **Target:** p95 duration no greater than 1 second over a rolling 30-day window.
- **Valid events:** successful product-list loads and stock adjustments, measured from the start to the end of the client service operation.
- **SLI:** the 95th percentile of valid operation durations.
- **PromQL, product list:**

```promql
histogram_quantile(
  0.95,
  sum by (le) (
    rate(product_portal_operation_duration_seconds_bucket{
      operation="product_list_load"
    }[30d])
  )
)
```

- **PromQL, stock adjustment:**

```promql
histogram_quantile(
  0.95,
  sum by (le) (
    rate(product_portal_operation_duration_seconds_bucket{
      operation="stock_adjustment"
    }[30d])
  )
)
```

Each result must be at most `1`. These durations do not include time a user spends reading or interacting with the page.

## SLO 3 — Stock adjustment success

- **Target:** at least 99% of valid stock-adjustment operations succeed over a rolling 30-day window.
- **Good events:** valid stock-adjustment operations completed successfully.
- **Valid events:** stock-adjustment operations that passed client-side validation and were attempted in the selected execution mode.
- **SLI formula:** successful stock adjustments / all valid stock adjustments.
- **PromQL:**

```promql
sum(increase(product_portal_operations_total{
  operation="stock_adjustment",
  outcome="success"
}[30d]))
/
sum(increase(product_portal_operations_total{
  operation="stock_adjustment"
}[30d]))
```

The result must be at least `0.99`. Client-side validation rejections are excluded. In MOCK mode, this measures only the mock workflow and must not be presented as backend adjustment reliability.

## Traffic estimate — illustrative scenario to validate

No real usage measurements or administrator count were found in the available Product Portal source. For a draft calculation, use the approved illustrative scenario:

- Product-list loads per day (`L`): **20**
- Stock adjustments per day (`A`): **5**
- Expected operating hours per day (`H`): **8**
- Scenario basis: **one administrator using the portal during an 8-hour business day, averaging about 20 product-list loads and 5 stock adjustments. These are planning assumptions, not measured usage.**

For a 30-day window and a 99% availability SLO:

- Estimated valid operations: `30 × (20 + 5) = 750`
- Error budget in failed operations: `0.01 × 750 = 7.5`; because failures are whole requests, at most **7 failed operations** remain within the budget. The 8th failure exceeds it.
- Total scheduled service time: `30 × 8 × 60 = 14,400 minutes`
- Error budget in full-outage minutes: `0.01 × 14,400 = 144 minutes` (2 hours 24 minutes).

The estimate assumes each product-list load and each stock adjustment counts as one valid operation. It should be replaced with real measurements or revised if the number of administrators, their usage, or the required service hours differ.

## Error-budget policy

| Budget consumed | Policy |
|---:|---|
| 50% | 3.75 failures / 72 minutes. At whole-request granularity, investigate at 4 failures. Notify the Product Portal owner, review the failing operation and traces, and avoid risky releases until the cause is understood. |
| 75% | 5.625 failures / 108 minutes. At whole-request granularity, investigate at 6 failures. Prioritize reliability work, review the error budget daily, and pause non-essential changes that could increase risk. |
| 100% | 7.5 failures / 144 minutes. The 8th failed operation exceeds the fractional request budget. Declare the SLO exhausted, stop feature releases, follow the incident process, and resume only after mitigation and owner review. |

## Target realism check

A 99% availability target allows 1% failed valid operations. Under the illustrative 8-hour/day schedule, that corresponds to 2 hours 24 minutes of full outage in a 30-day window. Decide whether that tolerance is acceptable for administrators who rely on stock visibility and adjustments. Revisit the target if the portal must be available more reliably during business operations.

The 1-second p95 target is an initial user-facing target for the portal operations, not a measured baseline. Compare it with observed real-mode latency before treating it as a production commitment.

## Completion checklist

- [ ] Validate or revise the illustrative daily product-list load estimate and justification
- [ ] Validate or revise the illustrative daily stock-adjustment estimate and justification
- [ ] Confirm or revise the assumed 8 operating hours
- [x] Request and minute error budgets computed from the approved illustrative scenario
- [ ] Prometheus exporter/collector mapping implemented or explicitly recorded as pending
- [ ] CP6 reflection entry written by the student
