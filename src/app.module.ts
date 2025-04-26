import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './modules/chat/chat.module';
import { ConfigService } from '@nestjs/config';
import { KafkaModule } from './modules/kafka/kafka.module';
import { TcpModule } from './shared/module/tcp/tcp.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DATABASE_URI'),
      }),
      inject: [ConfigService],
    }),
    ChatModule,
    TcpModule
  ],
  controllers: [AppController],
  providers: [AppService, ],
})
export class AppModule {}
