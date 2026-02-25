import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Headers security with Helmet
  app.use(helmet({
    // Allow cross-origin resource sharing for images and other media
    crossOriginResourcePolicy: { policy: "cross-origin" }
  }));

  // Enable CORS for specific origins and allow credentials
  app.enableCors({
    origin: ['http://localhost:3001', 'http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  });

  // Reject requests with non-whitelisted properties
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger API documentation setup
  const config = new DocumentBuilder() // Create a new DocumentBuilder instance to configure Swagger
    .setTitle('Le Général API') // Set the title of the API documentation
    .setDescription('API pour la gestion des utilisateurs et de l\'authentification') // Set a description for the API
    .setVersion('1.0') // Set the version of the API
    .addTag('users') // Add a tag for user-related endpoints
    .addTag('auth') // Add a tag for authentication-related endpoints
    .addBearerAuth() // Add support for Bearer token authentication
    .build(); // Build the configuration

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
