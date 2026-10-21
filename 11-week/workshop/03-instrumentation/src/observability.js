const SERVICE_NAME = 'sales-service';

function createTraceHeaders(traceId = randomTraceId(), spanId = randomSpanId()) {
  return {
    traceparent: `00-${traceId}-${spanId}-01`,
    tracestate: 'by-sellens=dev'
  };
}

function parseTraceparent(traceparentHeader) {
  if (!traceparentHeader || typeof traceparentHeader !== 'string') {
    return {
      traceId: randomTraceId(),
      spanId: randomSpanId()
    };
  }

  const match = traceparentHeader.match(/^00-([0-9a-fA-F]{32})-([0-9a-fA-F]{16})-([0-9a-fA-F]{2})$/);
  if (!match) {
    return {
      traceId: randomTraceId(),
      spanId: randomSpanId()
    };
  }

  return {
    traceId: match[1],
    spanId: match[2]
  };
}

function randomTraceId() {
  return Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
}

function randomSpanId() {
  return Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
}

function createStructuredLogger(serviceName = SERVICE_NAME) {
  return {
    info(event, message, context = {}) {
      emitLog('INFO', serviceName, event, message, context);
    },
    warn(event, message, context = {}) {
      emitLog('WARN', serviceName, event, message, context);
    },
    error(event, message, context = {}) {
      emitLog('ERROR', serviceName, event, message, context);
    },
    debug(event, message, context = {}) {
      emitLog('DEBUG', serviceName, event, message, context);
    }
  };
}

function emitLog(level, service, event, message, context = {}) {
  const timestamp = new Date().toISOString();
  const payload = {
    timestamp,
    level,
    service,
    version: '1.0.0',
    environment: 'dev',
    trace_id: context.trace_id || randomTraceId(),
    span_id: context.span_id || randomSpanId(),
    correlation_id: context.correlation_id || '00000000-0000-0000-0000-000000000000',
    event,
    message,
    duration_ms: context.duration_ms ?? 0,
    outcome: context.outcome || 'accepted',
    ...context
  };

  console.log(JSON.stringify(payload));
}

function createRequestCounter() {
  const values = new Map();

  return {
    increment(label, amount = 1) {
      values.set(label, (values.get(label) ?? 0) + amount);
      return values.get(label);
    },
    snapshot() {
      return Object.fromEntries(values.entries());
    }
  };
}

function createLatencyHistogram(buckets = [50, 100, 200, 500, 1000, 2000, 5000]) {
  const histogram = new Map(buckets.map((bucket) => [bucket, 0]));

  return {
    observe(value) {
      for (const bucket of buckets) {
        if (value <= bucket) {
          histogram.set(bucket, (histogram.get(bucket) ?? 0) + 1);
          break;
        }
      }
      if (!Array.from(histogram.keys()).some((bucket) => value <= bucket)) {
        const maxBucket = Math.max(...buckets);
        histogram.set(maxBucket, (histogram.get(maxBucket) ?? 0) + 1);
      }
    },
    snapshot() {
      return Object.fromEntries(histogram.entries());
    }
  };
}

export {
  SERVICE_NAME,
  createTraceHeaders,
  parseTraceparent,
  createStructuredLogger,
  createRequestCounter,
  createLatencyHistogram
};
