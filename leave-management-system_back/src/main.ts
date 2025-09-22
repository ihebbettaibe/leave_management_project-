import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // Serve static files for uploads
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });
  
  // Enable CORS for frontend communication
  app.enableCors({
    origin: [
      'http://localhost:4200', 
      'http://localhost:4201',
      'http://localhost:3000',
      'http://localhost:3002', // Legacy frontend server port
      'http://localhost:4300', // Current frontend server port
      'http://127.0.0.1:4200',
      'http://127.0.0.1:4201',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3002', // Legacy frontend server port
      'http://127.0.0.1:4300', // Current frontend server port
      'file://',
      'null' // For local file access
    ], // Angular frontend URLs and local file access
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    optionsSuccessStatus: 200
  });
  
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('leave management system')
    .setDescription('The leave management system API description')
    .setVersion('1.0')
    .addTag('LMS')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(3001, '0.0.0.0');
  console.log('🚀 Backend server is running on http://localhost:3001');
  console.log('🚀 Swagger documentation available at http://localhost:3001/api');
}
bootstrap();
