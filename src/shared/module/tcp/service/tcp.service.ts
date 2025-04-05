import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { HttpException, Inject, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ClientProxy, ClientTCP } from "@nestjs/microservices";
import { Cache } from 'cache-manager';


@Injectable()
export class TcpService {
    private client: ClientTCP;
    private logger: Logger;
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        @Inject('USER_SERVICE') private readonly clientProxy: ClientProxy,
        private configService: ConfigService,
    ) {
        this.client = this.clientProxy as ClientTCP;
         this.logger = new Logger(TcpService.name);
    }

    async checkUser(receiver: string): Promise<boolean> {
        try {
            const response = await this.client.send<boolean>('check-user', receiver).toPromise(); 
            if (response) {
                // Cache the result for 60 seconds
                this.logger.log(`Caching user check result for ${receiver}`);
                await this.cacheManager.set(`check-user:${receiver}`, response, 60);
            }
            return response ?? false; 
        } catch (error) {
            console.error('Error checking user via TCP:', error);
            return false; 
        }
    }

}