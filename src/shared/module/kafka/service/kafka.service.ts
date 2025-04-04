import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";
import { SendMessageDto } from "../dto/send-message.dto";

@Injectable()
export class KafkaService {

    constructor(
        @Inject("CHAT_SERVICE") private readonly kafkaClient: ClientKafka,

    ) {}

    async sendMessage(message: any) {
        try {
            return await this.kafkaClient.emit(message.topic, message.message);
        }catch(error) {
            console.error("Error sending message to Kafka:", error);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}