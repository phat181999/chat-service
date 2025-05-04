import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

export const redisClientFactory = (configService: ConfigService): Redis => {
  const redisUrl = configService.get<string>('REDIS_URL');

  if (!redisUrl) {
    throw new Error('[Redis] REDIS_URL environment variable is not defined');
  }

  const redis = new Redis(redisUrl);

  return redis;
};
