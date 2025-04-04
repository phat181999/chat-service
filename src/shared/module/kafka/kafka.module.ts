import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { KafkaService } from "./service/kafka.service";
import { KafkaController } from "./controller/kafka.controller";
import { CacheModule } from "@nestjs/cache-manager";

@Module({
    imports: [
        ConfigModule, 
        CacheModule.register(),
        ClientsModule.registerAsync([
            {
            name: 'CHAT_SERVICE',
            useFactory: (configService: ConfigService) => ({
                transport: Transport.KAFKA,
                options: {
                client: {
                    clientId: 'chat-app-client',
                    brokers: [configService.get<string>('KAFKA_BROKER') || 'localhost:9092'],
                },
                consumer: {
                    groupId: 'chat-app-group',
                },
                },
            }),
            inject: [ConfigService],
            },
        ]),
    ],
    controllers: [KafkaController],
    providers: [
        KafkaService
    ],
    exports: [
        KafkaService 
    ]
})

export class KafkaModule {}