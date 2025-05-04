import { KafkaMessage } from "kafkajs";

export class SendMessageDto {
    topic: string;
    message: { key?: string; value: Buffer };
}

