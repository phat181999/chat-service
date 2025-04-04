import { Controller, HttpException, HttpStatus, Inject, Logger } from "@nestjs/common";
import { KafkaService } from "../service/kafka.service";
import { EventPattern, Payload } from "@nestjs/microservices";
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Controller()

export class KafkaController {
    private logger: Logger;
    constructor(
        private readonly kafkaService: KafkaService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {
        this.logger = new Logger(KafkaController.name);
    }
    
    @EventPattern('user-verified')
    async handleUserVerified(@Payload() message: { value: string | any }) {
      try {
        console.log(`📥 Received Kafka message:`, message);
        const data = typeof message === 'string' ? 
          JSON.parse(message) : 
          message;
  
        if (!data?.receiver) {
          throw new Error('Invalid verification response');
        }
  
        // Cache the verification result
        if (data.exists) {
          await this.cacheManager.set(
            `user:${data.receiver}`, 
            'exists',
            3600 // Cache for 1 hour
          );
        }
      } catch (error) {
        this.logger.error(`Error processing user verification response: ${error.message}`);
      }
    }
}