import { Global, Module } from '@nestjs/common';
import { AppLoggerService } from './app-logger.service';
import { TracingService } from './tracing.service';

@Global()
@Module({
  providers: [AppLoggerService, TracingService],
  exports: [AppLoggerService, TracingService],
})
export class ObservabilityModule {}
