import { trace } from '@opentelemetry/api';
import { Injectable } from '@nestjs/common';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  feature: string;
  operation: string;
  message: string;
  level?: LogLevel;
  errorCode?: string;
  [key: string]: string | number | boolean | null | undefined;
}

@Injectable()
export class AppLoggerService {
  private readonly severity: Record<LogLevel, number> = {
    debug: 10,
    info: 20,
    warn: 30,
    error: 40,
  };

  log(context: LogContext): void {
    const { level = 'info', ...fields } = context;

    if (!this.shouldLog(level)) {
      return;
    }

    const activeSpanContext = trace.getActiveSpan()?.spanContext();

    process.stdout.write(
      `${JSON.stringify({
        timestamp: new Date().toISOString(),
        level,
        service: process.env.OTEL_SERVICE_NAME ?? 'order-service',
        traceId: activeSpanContext?.traceId,
        spanId: activeSpanContext?.spanId,
        ...fields,
      })}\n`,
    );
  }

  info(context: LogContext): void {
    this.log({ ...context, level: 'info' });
  }

  warn(context: LogContext): void {
    this.log({ ...context, level: 'warn' });
  }

  error(context: LogContext): void {
    this.log({ ...context, level: 'error' });
  }

  private shouldLog(level: LogLevel): boolean {
    const configuredLevel = (process.env.LOG_LEVEL ?? 'info') as LogLevel;
    return this.severity[level] >= (this.severity[configuredLevel] ?? this.severity.info);
  }
}
