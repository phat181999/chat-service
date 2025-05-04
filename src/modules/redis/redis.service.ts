import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit {
  private readonly logger = new Logger(RedisService.name);

  constructor(@Inject('REDIS') private readonly redisClient: Redis) {}

  async onModuleInit() {
    try {
      await this.redisClient.ping();
      this.logger.log('✅ Redis ping successful, connection verified.');
    } catch (error) {
      this.logger.error('❌ Redis connection failed on startup:', error.message);
      process.exit(1); 
    }
  }

  getClient(): Redis {
    return this.redisClient;
  }

  async get(key: string): Promise<string | null> {
    this.logger.log(`Getting value for key ${key}`);
    return await this.redisClient.get(key);
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    if (ttl) {
      await this.redisClient.set(key, value, 'EX', ttl);
      this.logger.log(`Set key ${key} with status ${value} and TTL ${ttl}`);
      return;
    }
    this.logger.log(`Set key ${key} with status ${value}`);
    await this.redisClient.set(key, value);
    return
  }

  async del(key: string): Promise<number | undefined> {
    this.logger.log(`Deleting key ${key}`);
    return await this.redisClient.del(key);
  }

  async exists(key: string): Promise<number | undefined> {
    this.logger.log(`Checking existence of key ${key}`);
    return await this.redisClient.exists(key);
  }
}
