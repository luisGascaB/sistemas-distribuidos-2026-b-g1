# How to run the instrumentation demo

## Prerequisites

- Node.js 18 or newer

## Install

```bash
npm install
```

## Run the demo

```bash
npm run start
```

## Run the tests

```bash
npm test
```

## What this demo shows

This demo models the real `sales-service` -> `product-service` flow described in the project architecture:

- a sale request is received
- a trace is created with W3C `traceparent`
- the downstream product-service logic consumes the same trace context
- a structured log is emitted
- a request counter and latency histogram are updated

The sample is intentionally small and educational, but it follows the actual project pattern of a distributed business flow across multiple bounded contexts.
