import { CacheModule } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { TcpService } from "./service/tcp.service";


@Module({
  imports: [
    ConfigModule,
    CacheModule.register(),
    ClientsModule.registerAsync([
      {
        name: 'USER_SERVICE',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('TCP_HOST') || 'localhost',
            port: configService.get<number>('TCP_PORT') || 5000,
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [],
  providers: [TcpService],
  exports: [TcpService],
})

export class TcpModule {}