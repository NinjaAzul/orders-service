import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { AppLoggerService } from '../observability/app-logger.service';
import { TracingService } from '../observability/tracing.service';
import { REDIS } from './redis.provider';

@Injectable()
export class CacheService {
  private readonly ttlSeconds = 60;

  constructor(
    @Inject(REDIS) private readonly redis: Redis,
    private readonly logger: AppLoggerService,
    private readonly tracing: TracingService,
  ) {}

  async getJson<T>(key: string): Promise<T | null> {
    return this.tracing.withSpan('redis.get', { 'cache.key': key }, async () => {
      try {
        const value = await this.redis.get(key);

        this.logger.info({
          feature: 'cache',
          operation: 'redis.get',
          message: value ? 'cache hit' : 'cache miss',
          cacheKey: key,
          cacheHit: Boolean(value),
        });

        return value ? (JSON.parse(value) as T) : null;
      } catch (error) {
        this.logger.warn({
          feature: 'cache',
          operation: 'redis.get',
          message: 'cache read failed',
          cacheKey: key,
          error: String(error),
        });
        return null;
      }
    });
  }

  async setJson(key: string, value: unknown): Promise<void> {
    await this.tracing.withSpan(
      'redis.set',
      { 'cache.key': key, 'cache.ttl': this.ttlSeconds },
      async () => {
        try {
          await this.redis.set(key, JSON.stringify(value), 'EX', this.ttlSeconds);
          this.logger.info({
            feature: 'cache',
            operation: 'redis.set',
            message: 'cache write succeeded',
            cacheKey: key,
            ttlSeconds: this.ttlSeconds,
          });
        } catch (error) {
          this.logger.warn({
            feature: 'cache',
            operation: 'redis.set',
            message: 'cache write failed',
            cacheKey: key,
            error: String(error),
          });
        }
      },
    );
  }

  async invalidateProducts(): Promise<void> {
    await this.tracing.withSpan('redis.invalidate', { 'cache.key': 'products:*' }, async () => {
      try {
        const keys = await this.redis.keys('products:*');

        if (keys.length > 0) {
          await this.redis.del(...keys);
        }

        this.logger.info({
          feature: 'cache',
          operation: 'redis.invalidate',
          message: 'product cache invalidated',
          keysCount: keys.length,
        });
      } catch (error) {
        this.logger.warn({
          feature: 'cache',
          operation: 'redis.invalidate',
          message: 'cache invalidation failed',
          error: String(error),
        });
      }
    });
  }
}
