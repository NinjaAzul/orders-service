import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

export const REDIS = Symbol('REDIS');

export const redisProvider = {
  provide: REDIS,
  inject: [ConfigService],
  useFactory: (configService: ConfigService): Redis => {
    return new Redis({
      host: configService.getOrThrow<string>('REDIS_HOST'),
      port: configService.getOrThrow<number>('REDIS_PORT'),
      lazyConnect: true,
      maxRetriesPerRequest: 1,
    });
  },
};
