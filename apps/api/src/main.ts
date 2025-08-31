import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { LoggerService } from './logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = app.get(LoggerService);
  
  // Enable shutdown hooks for Prisma
  const prismaService = app.get(PrismaService);
  
  // Set global prefix
  app.setGlobalPrefix('api');
  
  // Add security middleware
  app.use(helmet());
  
  // Setup CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  });
  
  // Add validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  
  // Add exception filter
  app.useGlobalFilters(new HttpExceptionFilter(logger));
  
  // Setup Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Booking Engine API')
    .setDescription('API for multi-property service apartment booking engine')
    .setVersion('1.0')
    .addTag('bookings')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  app.enableShutdownHooks();
  // Start server
  const port = process.env.PORT || 4000;
  await app.listen(port);
  logger.log(`Application is running on port ${port}`);
}

bootstrap();