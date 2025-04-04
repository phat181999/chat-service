import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  const microservice = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.TCP,
    options: { host: 'localhost', port: 6000 }, // ✅ Đảm bảo cổng đúng
  });

  microservice.listen(); 
  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 4000);
  console.log('🚀 Chat Service is running');
}
bootstrap();
