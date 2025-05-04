import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisService } from './redis.service';
import { redisClientFactory } from 'src/config/redis/redis.config';
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'REDIS',
      useFactory: redisClientFactory,
      inject: [ConfigService],
    },
    RedisService,
  ],
  exports: ['REDIS', RedisService],
})
export class RedisModule {}
