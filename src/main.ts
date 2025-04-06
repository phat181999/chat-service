import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  const microservice = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.TCP,
    options: { host: 'localhost', port: 6000 }, // ✅ Đảm bảo cổng đúng
  });
  app.use(bodyParser.json()); // to parse application/json
  app.use(bodyParser.urlencoded({ extended: true })); 
  microservice.listen(); 
  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 4000);
  console.log('🚀 Chat Service is running');
}
bootstrap();
