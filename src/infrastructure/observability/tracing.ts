import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { NodeSDK } from '@opentelemetry/sdk-node';

const tracesEnabled = process.env.OTEL_TRACES_ENABLED === 'true';

if (tracesEnabled) {
  const sdk = new NodeSDK({
    serviceName: process.env.OTEL_SERVICE_NAME ?? 'order-service',
    traceExporter: new OTLPTraceExporter({
      url: `${process.env.OTEL_EXPORTER_OTLP_ENDPOINT ?? 'http://localhost:4318'}/v1/traces`,
    }),
    instrumentations: [getNodeAutoInstrumentations()],
  });

  void sdk.start();

  process.on('SIGTERM', () => {
    void sdk.shutdown();
  });
}
