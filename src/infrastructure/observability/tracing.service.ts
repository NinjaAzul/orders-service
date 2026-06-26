import { Injectable } from '@nestjs/common';
import { SpanStatusCode, trace } from '@opentelemetry/api';

type SpanAttributes = Record<string, string | number | boolean | undefined>;

@Injectable()
export class TracingService {
  private readonly tracer = trace.getTracer(process.env.OTEL_SERVICE_NAME ?? 'order-service');

  async withSpan<T>(
    name: string,
    attributes: SpanAttributes,
    operation: () => Promise<T>,
  ): Promise<T> {
    return this.tracer.startActiveSpan(name, async (span) => {
      try {
        for (const [key, value] of Object.entries(attributes)) {
          if (value !== undefined) {
            span.setAttribute(key, value);
          }
        }

        const result = await operation();
        span.setStatus({ code: SpanStatusCode.OK });

        return result;
      } catch (error) {
        if (error instanceof Error) {
          span.recordException(error);
          span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
        } else {
          span.setStatus({ code: SpanStatusCode.ERROR, message: String(error) });
        }

        throw error;
      } finally {
        span.end();
      }
    });
  }
}
