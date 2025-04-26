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

}