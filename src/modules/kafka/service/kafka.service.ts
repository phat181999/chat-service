import { HttpException, HttpStatus, Inject, Injectable, Logger } from "@nestjs/common";
import { ClientKafka, KafkaRetriableException } from "@nestjs/microservices";
import { KafkaSendMessage } from "src/shared/interface/kafka";

@Injectable()
export class KafkaService {
  private readonly logger = new Logger(KafkaService.name);

  constructor(
    @Inject("NOTIFICATION_SERVICE") private readonly kafkaClient: ClientKafka,
  ) {}

  async sendMessage(data: KafkaSendMessage): Promise<void> {
    try {
      await this.kafkaClient.emit(data.topic, {
        key: data.message.key,
        value: data.message.value,
        timestamp: data.message.timestamp,
      }).toPromise(); 
      this.kafkaClient
      this.logger.log(`Message successfully sent to topic [${data.topic}]: ${JSON.stringify(data)}`);
    } catch (error) {
      this.logger.error(`Failed to send message to topic [${data.topic}]: ${error.message}`, error.stack);
      if (error?.isRetriable) {
        throw new KafkaRetriableException(error.message);
      }
      throw new HttpException('Failed to send Kafka message', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
