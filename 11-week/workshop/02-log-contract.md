# Structured Log Contract

## Goal

This contract defines the structured log format for the selected critical journey: registering a sale and updating stock after the sale.

The fields below are aligned with the real project architecture and event contracts documented in the team repository:

- `sales-service` registers the sale and emits `SaleRegistered`.
- `product-service` consumes the event and decrements stock.
- `product-service` emits `StockUpdated` and `StockDepleted`.
- `inventory-service` owns product metadata and initial stock.
- RabbitMQ transports the business event between the bounded contexts.

This document is a design contract for observability; it does not claim that the production code already emits these values everywhere.

## Mandatory fields

| Field | Type | Required | Example | Purpose |
|---|---|---:|---|---|
| `timestamp` | string | Yes | `2026-10-20T18:12:15.123Z` | UTC timestamp for event ordering and incident investigation |
| `level` | string | Yes | `INFO` | Severity level |
| `service` | string | Yes | `sales-service` | Service that emitted the log |
| `version` | string | Yes | `1.0.0` | Application or contract version |
| `environment` | string | Yes | `dev` | Deployment environment |
| `trace_id` | string | Yes | `4bf92f3577b34da6a3ce929d0e0e4736` | Shared request trace across services |
| `span_id` | string | Yes | `00f067aa0ba902b7` | Unique span for the local operation |
| `correlation_id` | string | Yes | `7fe72a9d-ff6c-4312-9e0a-243022064e04` | Links the business operation across multiple steps |
| `event` | string | Yes | `SALE_REGISTERED` | Business or technical event name |
| `message` | string | Yes | `Sale request accepted for validation` | Human-readable summary |
| `duration_ms` | integer | Yes | `142` | Duration for the operation in milliseconds |

## Domain-specific fields

The following domain-specific fields are required for this project and its chosen journey:

| Field | Type | Required | Example | Purpose |
|---|---|---:|---|---|
| `sale_id` | string | Conditional | `4f7c1d11-8a3a-4e37-9f10-1c99fd05b5a4` | Identifies the sale being registered |
| `customer_id` | string | Conditional | `d3f81252-9f0b-4466-b4ea-9e7a2a3a0d21` | Links the sale to the customer |
| `product_id` | string | Conditional | `6a13e24c-1d48-4637-9d64-8b9d020db9d7` | Product involved in stock operations |
| `product_code` | string | Conditional | `BL-204` | Human-readable product code |
| `quantity` | integer | Conditional | `2` | Quantity in the sale or stock delta |
| `stock_quantity` | integer | Conditional | `8` | Current quantity after a stock change |
| `payment_method` | string | Conditional | `NEQUI` | The selected payment method |
| `event_type` | string | Conditional | `SaleRegistered` | Domain event name being emitted or consumed |
| `stock_reason` | string | Conditional | `SALE` | Why stock changed |
| `outcome` | string | Yes | `accepted` | Bounded outcome label for metrics and dashboards |

## Severity rules

### `ERROR`

Use `ERROR` for failed operations that require intervention or can affect the sale flow, including:

- database persistence failures
- RabbitMQ publish failures
- consumer processing failures
- downstream timeouts
- stock validation failures that block the sale
- stock deduction errors that leave the system inconsistent

### `WARN`

Use `WARN` for recoverable or business-rule issues that do not stop the request immediately, including:

- insufficient stock on pre-validation
- stock update blocked because the quantity would become negative
- product unavailable for the requested sale
- a retryable downstream condition
- a business rejection that is expected but still relevant to monitoring

### `INFO`

Use `INFO` for successful business milestones and application lifecycle events, including:

- start of request processing
- validation success
- sale persistence committed
- event publication successful
- stock update completed
- event consumption acknowledged

### `DEBUG`

Use `DEBUG` only for detailed local debugging, such as:

- local helper execution
- intermediate comparison values
- repeated retry attempts before failure
- detailed payload fragments after redaction

Never log DEBUG data that could reveal secrets or personal data in production.

## Never log

The following values must never be written to logs in plain text:

- passwords
- access tokens
- refresh tokens
- JWT secrets or signing keys
- database connection strings containing credentials
- customer personal identity numbers or sensitive profile data
- full payment details such as card numbers or account numbers
- raw authorization headers
- raw RabbitMQ credentials
- any PII beyond the minimal business identifiers needed for the flow

## Redaction and masking

The application should redact or mask any data that resembles sensitive information before writing it to logs.

Recommended rules:

- Mask tokens: `eyJ...` becomes `eyJ***` or a fixed placeholder.
- Mask account or card numbers: keep only the last 4 digits.
- Mask emails: `name@domain.com` becomes `n***@domain.com`.
- Mask phone numbers to only last 2–4 digits when necessary.
- For `product_code`, avoid logging full product descriptions if they may contain sensitive catalog data beyond the business identifier.
- For `customer_id`, prefer the stable UUID or a hashed surrogate when a user identifier is not needed for debugging.
- Persist correlation and trace metadata; do not store unrelated raw request bodies unless they are explicitly whitelisted and sanitized.

## Log example format

Each example below is a valid JSON object and uses the same `trace_id` value to show how a single distributed request can be traced across services.

### Example 1 — request received by sales-service

```json
{"timestamp":"2026-10-20T18:12:15.000Z","level":"INFO","service":"sales-service","version":"1.0.0","environment":"dev","trace_id":"4bf92f3577b34da6a3ce929d0e0e4736","span_id":"00f067aa0ba902b7","correlation_id":"7fe72a9d-ff6c-4312-9e0a-243022064e04","event":"SALE_REQUEST_RECEIVED","message":"Sale registration request received from admin portal","duration_ms":12,"sale_id":"4f7c1d11-8a3a-4e37-9f10-1c99fd05b5a4","customer_id":"d3f81252-9f0b-4466-b4ea-9e7a2a3a0d21","payment_method":"NEQUI","outcome":"accepted"}
```

### Example 2 — product lookup validation through inventory-service

```json
{"timestamp":"2026-10-20T18:12:15.150Z","level":"INFO","service":"inventory-service","version":"1.0.0","environment":"dev","trace_id":"4bf92f3577b34da6a3ce929d0e0e4736","span_id":"4a701efb2543d0bd","correlation_id":"7fe72a9d-ff6c-4312-9e0a-243022064e04","event":"PRODUCT_VALIDATED","message":"Product metadata validated for sale request","duration_ms":46,"product_id":"6a13e24c-1d48-4637-9d64-8b9d020db9d7","product_code":"BL-204","outcome":"accepted"}
```

### Example 3 — business-rule rejection: insufficient stock

```json
{"timestamp":"2026-10-20T18:12:15.240Z","level":"WARN","service":"product-service","version":"1.0.0","environment":"dev","trace_id":"4bf92f3577b34da6a3ce929d0e0e4736","span_id":"b11236af0d11d0b3","correlation_id":"7fe72a9d-ff6c-4312-9e0a-243022064e04","event":"STOCK_INSUFFICIENT","message":"Requested quantity exceeds available stock","duration_ms":31,"product_id":"6a13e24c-1d48-4637-9d64-8b9d020db9d7","product_code":"BL-204","quantity":3,"stock_quantity":2,"outcome":"rejected"}
```

### Example 4 — sale persisted in sales database

```json
{"timestamp":"2026-10-20T18:12:15.500Z","level":"INFO","service":"sales-service","version":"1.0.0","environment":"dev","trace_id":"4bf92f3577b34da6a3ce929d0e0e4736","span_id":"9f671be39b60064d","correlation_id":"7fe72a9d-ff6c-4312-9e0a-243022064e04","event":"SALE_PERSISTED","message":"Sale and sale items committed to sales database","duration_ms":88,"sale_id":"4f7c1d11-8a3a-4e37-9f10-1c99fd05b5a4","customer_id":"d3f81252-9f0b-4466-b4ea-9e7a2a3a0d21","payment_method":"NEQUI","outcome":"accepted"}
```

### Example 5 — `SaleRegistered` dispatched to RabbitMQ

```json
{"timestamp":"2026-10-20T18:12:15.620Z","level":"INFO","service":"sales-service","version":"1.0.0","environment":"dev","trace_id":"4bf92f3577b34da6a3ce929d0e0e4736","span_id":"1adb2f3d423e50cb","correlation_id":"7fe72a9d-ff6c-4312-9e0a-243022064e04","event":"SALE_REGISTERED_PUBLISHED","message":"SaleRegistered event published to RabbitMQ","duration_ms":19,"sale_id":"4f7c1d11-8a3a-4e37-9f10-1c99fd05b5a4","event_type":"SaleRegistered","outcome":"accepted"}
```

### Example 6 — product-service timeout while processing downstream stock update

```json
{"timestamp":"2026-10-20T18:12:16.030Z","level":"ERROR","service":"product-service","version":"1.0.0","environment":"dev","trace_id":"4bf92f3577b34da6a3ce929d0e0e4736","span_id":"d3e41d9f567d5a88","correlation_id":"7fe72a9d-ff6c-4312-9e0a-243022064e04","event":"STOCK_UPDATE_TIMEOUT","message":"Timeout while updating stock after sale processing","duration_ms":5000,"product_id":"6a13e24c-1d48-4637-9d64-8b9d020db9d7","sale_id":"4f7c1d11-8a3a-4e37-9f10-1c99fd05b5a4","outcome":"timeout"}
```

### Example 7 — stock update successfully processed and zero-stock detection emitted

```json
{"timestamp":"2026-10-20T18:12:16.210Z","level":"INFO","service":"product-service","version":"1.0.0","environment":"dev","trace_id":"4bf92f3577b34da6a3ce929d0e0e4736","span_id":"3dfa8b4dba64a2ea","correlation_id":"7fe72a9d-ff6c-4312-9e0a-243022064e04","event":"STOCK_UPDATED","message":"Stock decreased after sale and stock availability reevaluated","duration_ms":74,"product_id":"6a13e24c-1d48-4637-9d64-8b9d020db9d7","product_code":"BL-204","stock_quantity":0,"stock_reason":"SALE","outcome":"accepted"}
```

## Logging contract summary

The contract should be applied consistently across the selected journey:

- Every log line must remain JSON-structured.
- `trace_id` must be the same across all logs in the same business operation.
- `span_id` must identify the exact local work unit.
- `correlation_id` may be shared by the same sale operation across multiple services.
- `duration_ms` must be numeric and based on the real execution time when available.
- `outcome` must use bounded values such as `accepted`, `rejected`, `timeout`, `error`, `retry`, `completed`.

This gives the team a consistent observability schema compatible with distributed tracing, troubleshooting, and metric correlation without leaking sensitive data.
