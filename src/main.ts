// main.ts is the entry point of the NestJS application. It sets up the application with
// various security measures, including Helmet for HTTP headers security, CORS
// configuration, and global validation pipes. It also conditionally sets up Swagger
// API documentation in development mode. Finally, it starts the application on the
// specified port.

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
// The NestExpressApplication type is used to create an application that can serve static assets
// and use Express-specific features.
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
// Importing the AppModule, which is the root module of the application that imports all other modules.
import { join } from 'path';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

const allowedCorsOrigins = new Set([
  'http://localhost:5173',
  'http://localhost:5174',
]);

async function bootstrap() {
  const nodeEnv = process.env.NODE_ENV ?? 'development';
  const isProduction = nodeEnv === 'production';
  const isSwaggerEnabled = process.env.SWAGGER_ENABLED !== 'false';

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
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

  // Serve simple static pages (ex: temporary admin dashboard prototype)
  app.useStaticAssets(join(__dirname, '..', 'public'));

  // Only allow the expected local frontend dev origins.
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedCorsOrigins.has(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`Origin non autorisee par CORS: ${origin}`), false);
    },
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Authorization', 'Content-Type'],
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

  if (isSwaggerEnabled) {
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
      .addTag('event-requests')
      .addTag('dashboard')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });
  }

  const port = Number(process.env.PORT ?? 3010);
  await app.listen(port);

  console.log(`Server running on http://localhost:${port}`);
  if (isSwaggerEnabled) {
    console.log(`Swagger documentation available at http://localhost:${port}/docs`);
  }
}
void bootstrap();
