import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { KafkaService } from "./service/kafka.service";
import { KafkaController } from "./controller/kafka.controller";
import { CacheModule } from "@nestjs/cache-manager";

@Module({
  imports: [
    ConfigModule,
    CacheModule.register({
      ttl: 60000,
    }),
    ClientsModule.registerAsync([
      {
        name: 'NOTIFICATION_SERVICE',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: configService.get<string>('KAFKA_CLIENT_ID') || 'notification',
              brokers: configService.get<string>('KAFKA_BROKERS')?.split(',') || ['localhost:9092'],
              retry: {
                initialRetryTime: 300,
                retries: 10
              },
            },
            consumer: {
              groupId: configService.get<string>('KAFKA_CONSUMER_GROUP') || 'notification-consumer',
              allowAutoTopicCreation: configService.get<boolean>('KAFKA_AUTO_TOPIC_CREATION') || false,
              sessionTimeout: 30000,
            }
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [KafkaController],
  providers: [KafkaService],
  exports: [KafkaService]
})
export class KafkaModule {}