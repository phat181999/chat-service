import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { HttpException, Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ClientProxy, ClientTCP } from "@nestjs/microservices";
import { Cache } from 'cache-manager';


@Injectable()
export class TcpService {
    private client: ClientTCP;

    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        @Inject('USER_SERVICE') private readonly clientProxy: ClientProxy,
        private configService: ConfigService,
    ) {
        this.client = this.clientProxy as ClientTCP;
    }

    async checkUser(receiver: string): Promise<boolean> {
        try {
            console.log(`Sending TCP request to check user: ${receiver}`);
            const response = await this.client.send<boolean>('check-user', receiver).toPromise(); 
            
            console.log(`TCP response: ${response}`);
            if (response) {
                await this.cacheManager.set(`check-user:${receiver}`, response, 60);
            }
            return response ?? false; // ✅ Tránh lỗi khi undefined/null
        } catch (error) {
            console.error('Error checking user via TCP:', error);
            return false; // ✅ Không throw lỗi để tránh crash service
        }
    }

}