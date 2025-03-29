import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";


@Injectable()
export class KafkaProducerService { 
    
    constructor(
        @Inject('CHAT_SERVICE') private readonly kafkaClient: ClientKafka
    ) {}

    async sendMessage(topic: string, message: any) {
        console.log(`📥 Received message:`, message.value);

        return await this.kafkaClient.emit(topic, message); 
      }

}