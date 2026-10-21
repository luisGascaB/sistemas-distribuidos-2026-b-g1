# CP3 - Run and verify Product Portal instrumentation

The instrumentation is implemented in the Product Portal repository, not in a standalone mock sales-service sample.

## Run from the Product Portal repository

```bash
npm ci
npm run test.unit
npm run lint
npm run build
npm run dev
```

Open the Vite URL printed in the terminal, sign in using the repository's MOCK-mode instructions, load the stock view, and try a stock adjustment. The browser console should show structured `product-portal` records with trace and span IDs.

## Instrumentation files

- `src/services/observabilidad.ts`: W3C trace context, structured JSON logs, in-memory counters and duration histogram buckets.
- `src/services/productoService.ts`: wraps list/adjustment operations and sends `traceparent` in configured real-mode HTTP requests.
- `src/services/observabilidad.test.ts`: checks trace format, trace-parent preservation, success/error logging, and counters.
- `src/services/dominio.test.ts`: checks the real-mode stock request carries a valid `traceparent`.

MOCK mode exercises local storage and client telemetry only. It does not make a backend request. Real-mode propagation still requires compatible backend handling and CORS configuration.
