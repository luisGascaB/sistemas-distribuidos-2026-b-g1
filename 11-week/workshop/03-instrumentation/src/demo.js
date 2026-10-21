import { createStructuredLogger, createTraceHeaders, createRequestCounter, createLatencyHistogram } from './observability.js';
import { processStockUpdate } from './downstream.js';

const logger = createStructuredLogger('sales-service');
const metrics = createRequestCounter();
const latency = createLatencyHistogram();

function registerSale({ customerId, productId, quantity }) {
  const rootTrace = createTraceHeaders();
  const start = Date.now();

  metrics.increment('sale_requests_total');
  logger.info('SALE_REQUEST_RECEIVED', 'Sale request received by sales-service', {
    trace_id: rootTrace.traceparent.split('-')[1],
    span_id: rootTrace.traceparent.split('-')[2],
    correlation_id: '7fe72a9d-ff6c-4312-9e0a-243022064e04',
    customer_id: customerId,
    product_id: productId,
    quantity,
    outcome: 'accepted'
  });

  const downstream = processStockUpdate({
    traceparent: rootTrace.traceparent,
    quantity,
    productId
  });

  const duration = Date.now() - start;
  latency.observe(duration);

  logger.info('SALE_COMPLETED', 'Sale was registered and stock was updated', {
    trace_id: rootTrace.traceparent.split('-')[1],
    span_id: rootTrace.traceparent.split('-')[2],
    correlation_id: '7fe72a9d-ff6c-4312-9e0a-243022064e04',
    product_id: productId,
    quantity,
    duration_ms: duration,
    outcome: 'accepted',
    downstream_trace_id: downstream.traceId,
    downstream_span_id: downstream.spanId
  });

  return {
    traceId: rootTrace.traceparent.split('-')[1],
    spanId: rootTrace.traceparent.split('-')[2],
    metrics: metrics.snapshot(),
    latency: latency.snapshot(),
    downstream
  };
}

const result = registerSale({ customerId: 'd3f81252-9f0b-4466-b4ea-9e7a2a3a0d21', productId: '6a13e24c-1d48-4637-9d64-8b9d020db9d7', quantity: 2 });
console.log(JSON.stringify({ result }, null, 2));
