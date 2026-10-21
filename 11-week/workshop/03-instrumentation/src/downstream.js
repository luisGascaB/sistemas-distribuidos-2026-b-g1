import { createTraceHeaders, parseTraceparent, createStructuredLogger, createRequestCounter, createLatencyHistogram } from './observability.js';

const logger = createStructuredLogger('product-service');
const metrics = createRequestCounter();
const latency = createLatencyHistogram();

function processStockUpdate({ traceparent, quantity, productId }) {
  const parsed = parseTraceparent(traceparent);
  const start = Date.now();

  metrics.increment('stock_update_total');
  logger.info('STOCK_UPDATE_RECEIVED', 'Stock update request received', {
    trace_id: parsed.traceId,
    span_id: parsed.spanId,
    correlation_id: '7fe72a9d-ff6c-4312-9e0a-243022064e04',
    product_id: productId,
    quantity,
    outcome: 'accepted'
  });

  const updated = Math.max(0, quantity);
  const duration = Date.now() - start;
  latency.observe(duration);

  const downstreamHeaders = createTraceHeaders(parsed.traceId, parsed.spanId);

  logger.info('STOCK_UPDATED', 'Stock updated after sale processing', {
    trace_id: parsed.traceId,
    span_id: parsed.spanId,
    correlation_id: '7fe72a9d-ff6c-4312-9e0a-243022064e04',
    product_id: productId,
    quantity: updated,
    duration_ms: duration,
    outcome: 'accepted',
    downstream_headers: downstreamHeaders
  });

  return {
    productId,
    quantity: updated,
    traceId: parsed.traceId,
    spanId: parsed.spanId,
    downstreamHeaders,
    metrics: metrics.snapshot(),
    latency: latency.snapshot()
  };
}

export { processStockUpdate };
