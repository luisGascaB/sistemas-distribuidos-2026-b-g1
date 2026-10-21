# CP5 - Product Portal operational runbook

## Scope

This runbook covers the Product Portal browser application for consulting and adjusting product stock. The repository is a React/Ionic frontend with MOCK and configured HTTP modes; it does not include the backend service or establish a deployed environment.

## Local validation

Run from the `bysellens-product-portal` repository:

```bash
npm ci
npm run test.unit
npm run lint
npm run build
npm run dev
```

Use the README's MOCK-mode login instructions. Confirm that the stock page loads, name/code search and stock filters work, and valid adjustments update the displayed quantity. Confirm invalid quantities and decrements exceeding stock are rejected.

## Troubleshooting

### Product list fails to load

1. Check the browser console for a `product_list_load` error record and note its `trace_id`.
2. Confirm whether the app is in MOCK or real mode.
3. In MOCK mode, check local storage and reproduce with a clean test session if needed.
4. In real mode, verify `VITE_API_BASE_URL`, the `GET /api/productos` response, CORS, and whether the server accepts `traceparent`.
5. Do not treat client-side trace logging as proof that the backend received or recorded the trace.

### Stock adjustment fails

1. Check the `stock_adjustment` result and `trace_id`.
2. Confirm the quantity is an integer greater than zero and a decrement does not exceed the displayed stock.
3. In MOCK mode, verify the local mock update.
4. In real mode, inspect the configured `PUT /api/inventario/{id}/{operacion}` response and request `cantidad`.
5. Check endpoint compatibility: the Product Service draft API describes different `/api/v1/products/...` routes, so the portal/backend integration must be reconciled before production claims.

### Trace cannot be followed beyond the browser

Confirm that the browser request includes W3C `traceparent`, CORS permits that header, and the backend extracts/propagates it. If any of these are missing, the browser trace ends at the HTTP boundary.

## Operational limitations

- The portal's counters and histograms are in-memory and browser-session scoped.
- No centralized exporter, dashboard, or alert receiver is configured by this change.
- Product Service documentation marks backend implementation and runtime verification pending.
- Do not use mock-mode success as evidence of a successful backend stock update.

## Completion evidence

The local implementation is verified by unit tests, lint, and production build. End-to-end validation against a deployed Product Service requires a compatible backend, environment configuration, and CORS/trace propagation checks.
