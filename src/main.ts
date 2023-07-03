import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  // App setup
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api');
  app.useGlobalPipes(new ValidationPipe());

  // Cookies setup
  app.use(cookieParser());

  // Config setup
  const config = app.get(ConfigService);
  const PORT = config.get<number>('API_PORT') || 3000;

  // CORS setup
  const CLIENT_URL = config.get<string>('CLIENT_URL');
  app.enableCors({ origin: CLIENT_URL, credentials: true });

  // Swagger setup
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  await app.listen(PORT, () => {
    console.log(`Server is running on PORT=${PORT}`);
  });
}
bootstrap();
