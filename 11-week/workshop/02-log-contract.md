# CP2 - Structured log contract for Product Portal

## Purpose

Define privacy-conscious client logs for the Product Portal's real user journey: loading the product list and adjusting stock. This is a browser-side contract; it does not claim that a centralized log platform or backend logging is deployed.

## Required fields

| Field | Type | Required | Purpose |
|---|---|---:|---|
| `timestamp` | ISO-8601 string | Yes | Order events during troubleshooting |
| `level` | `INFO` / `ERROR` | Yes | Result severity |
| `service` | string | Yes | Fixed value `product-portal` |
| `event` | string | Yes | Bounded operation name |
| `trace_id` | 32 hex characters | Yes | Correlate the operation with its HTTP request |
| `span_id` | 16 hex characters | Yes | Identify this client operation |
| `duration_ms` | non-negative number | Yes | Measure the operation duration |
| `outcome` | `success` / `error` | Yes | Operation result |

## Event names

Use bounded names only:

- `product_list_load`
- `stock_adjustment`

Do not use product names, free-text search terms, or IDs as event names or metric labels.

## Privacy and severity

- `INFO`: product list load or stock adjustment completed.
- `ERROR`: an operation failed; rethrow the original error after recording the outcome.
- Never log credentials, authorization headers, access tokens, customer details, request bodies, product names, or raw error messages that may contain user data.
- Keep `trace_id` and `span_id` as diagnostic context, not metric labels.
- The current implementation logs JSON in the browser console. Production forwarding and retention policy require an approved telemetry backend.

## Example

```json
{
  "timestamp": "2026-10-20T19:00:00.000Z",
  "level": "INFO",
  "service": "product-portal",
  "event": "stock_adjustment",
  "trace_id": "4bf92f3577b34da6a3ce929d0e0e4736",
  "span_id": "00f067aa0ba902b7",
  "duration_ms": 42,
  "outcome": "success"
}
```

The implementation intentionally avoids including the selected product's name or the operator's identity in these records.
