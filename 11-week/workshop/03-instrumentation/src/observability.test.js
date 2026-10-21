import test from 'node:test';
import assert from 'node:assert/strict';
import { createTraceHeaders, parseTraceparent, createRequestCounter, createLatencyHistogram } from './observability.js';

test('createTraceHeaders produces W3C traceparent headers', () => {
  const headers = createTraceHeaders('4bf92f3577b34da6a3ce929d0e0e4736', '00f067aa0ba902b7');
  assert.equal(headers.traceparent, '00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01');
  assert.equal(headers.tracestate, 'by-sellens=dev');
});

test('parseTraceparent extracts trace and span ids correctly', () => {
  const result = parseTraceparent('00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01');
  assert.equal(result.traceId, '4bf92f3577b34da6a3ce929d0e0e4736');
  assert.equal(result.spanId, '00f067aa0ba902b7');
});

test('request counter tracks counted outcomes', () => {
  const counter = createRequestCounter();
  counter.increment('sale_requests_total');
  counter.increment('sale_requests_total');
  assert.deepEqual(counter.snapshot(), { sale_requests_total: 2 });
});

test('latency histogram tracks observed request timings', () => {
  const histogram = createLatencyHistogram([50, 100, 200, 500]);
  histogram.observe(75);
  histogram.observe(320);
  const snapshot = histogram.snapshot();
  assert.equal(snapshot[100], 1);
  assert.equal(snapshot[500], 1);
});
