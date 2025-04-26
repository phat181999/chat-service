import { HttpException, HttpStatus, Inject, Injectable, Logger } from "@nestjs/common";
import { ClientKafka, KafkaRetriableException } from "@nestjs/microservices";
import { KafkaSendMessage } from "src/shared/interface/kafka";

@Injectable()
export class KafkaService {
  private logger: Logger;
    constructor(
        @Inject("NOTIFICATION_SERVICE") private readonly kafkaClient: ClientKafka,
    ) {
      this.logger = new Logger(KafkaService.name);
    }

    async sendMessage(data: KafkaSendMessage): Promise<void> {
        try {
          const rs = await this.kafkaClient.emit(data.topic, {
            key: data.message.key,
            value: data.message.value,
            timestamp: data.message.timestamp,
          });
          this.logger.log(`Message sent to topic ${rs}:`, data);
        } catch (error) {
          throw new KafkaRetriableException(error.message);
        }
      }
      
}