import { forwardRef, MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatSchema } from './entity/chat.entity';
import { ChatService } from './service/chat.service';
import { ChatController } from './controller/chat.controller';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { KafkaModule } from '../kafka/kafka.module';
import { CacheModule } from '@nestjs/cache-manager';
import { TcpModule } from 'src/shared/module/tcp/tcp.module';
import { CloudinaryModule } from 'src/config/cloudinary/cloudinary.module';

@Module({
  imports: [
    forwardRef(() => KafkaModule),
    forwardRef(() => TcpModule),
    forwardRef(() => CloudinaryModule),
    CacheModule.register(),
    MongooseModule.forFeature([{ name: 'Chat', schema: ChatSchema }]),
    ConfigModule, 
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  controllers: [ChatController],
  providers: [
    ChatService, 
    AuthGuard,
  ],
})

export class ChatModule {
  
}
// configure(consumer: MiddlewareConsumer) {
//   consumer
//     .apply(CloudinaryUploadMiddleware)
//     .forRoutes({path: 'chat/create-chat', method: RequestMethod.POST});
// }