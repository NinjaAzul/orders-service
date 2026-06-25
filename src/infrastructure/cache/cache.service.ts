import { Inject, Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS } from './redis.provider';

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);
  private readonly ttlSeconds = 60;

  constructor(@Inject(REDIS) private readonly redis: Redis) {}

  async getJson<T>(key: string): Promise<T | null> {
    try {
      const value = await this.redis.get(key);
      return value ? (JSON.parse(value) as T) : null;
    } catch (error) {
      this.logger.warn(`Cache read failed for key ${key}: ${String(error)}`);
      return null;
    }
  }

  async setJson(key: string, value: unknown): Promise<void> {
    try {
      await this.redis.set(key, JSON.stringify(value), 'EX', this.ttlSeconds);
    } catch (error) {
      this.logger.warn(`Cache write failed for key ${key}: ${String(error)}`);
    }
  }

  async invalidateProducts(): Promise<void> {
    try {
      const keys = await this.redis.keys('products:*');

      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
    } catch (error) {
      this.logger.warn(`Cache invalidation failed: ${String(error)}`);
    }
  }
}
