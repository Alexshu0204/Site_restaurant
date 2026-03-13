// main.ts is the entry point of the NestJS application. It sets up the application with
// various security measures, including Helmet for HTTP headers security, CORS
// configuration, and global validation pipes. It also conditionally sets up Swagger
// API documentation in development mode. Finally, it starts the application on the
// specified port.

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isProduction = process.env.NODE_ENV === 'production';

  const app = await NestFactory.create(AppModule, {
    logger: isProduction
      ? ['error', 'warn']
      : ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  // Headers security with Helmet
  app.use(
    helmet({
      // Allow cross-origin resource sharing for images and other media
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      // Set a strict Content Security Policy to mitigate XSS and data injection attacks
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'"],
          imgSrc: ["'self'", 'data:', 'https:'],
          connectSrc: ["'self'"],
          objectSrc: ["'none'"],
          baseUri: ["'self'"],
          frameAncestors: ["'none'"],
          formAction: ["'self'"],
        },
      },
      referrerPolicy: { policy: 'no-referrer' },
    }),
  );

  // Enable CORS for specific origins and allow credentials
  app.enableCors({
    origin: ['http://localhost:3010', 'http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  });

  // Reject requests with non-whitelisted properties
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: isProduction,
    }),
  );

  if (isDevelopment) {
    // Apply a more relaxed Content Security Policy for the Swagger UI in development
    // to allow inline scripts and styles.

    // how it works ? The Helmet middleware is applied specifically to the '/docs'
    // route, which serves the Swagger UI. This allows us to have a stricter Content
    // Security Policy for the rest of the application while relaxing it for the API
    // documentation interface, which may require inline scripts and styles to
    // function properly.

    app.use(
      '/docs',
      helmet.contentSecurityPolicy({
        useDefaults: true,
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:', 'https:'],
          connectSrc: ["'self'"],
          objectSrc: ["'none'"],
          baseUri: ["'self'"],
          frameAncestors: ["'none'"],
          formAction: ["'self'"],
        },
      }),
    );

    // Swagger API documentation setup
    const config = new DocumentBuilder()
      .setTitle('Le Général API')
      .setDescription(
        "API pour la gestion des utilisateurs et de l'authentification",
      )
      .setVersion('1.0')
      .addTag('users')
      .addTag('auth')
      .addTag('categories')
      .addTag('menu-items')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
  }

  await app.listen(process.env.PORT ?? 3010);
}
void bootstrap();
