// The AppModule is the root module of the NestJS application. It imports and configures
// all the necessary modules, including the AuthModule for authentication, the UsersModule
// for user management, and the ThrottlerModule for rate limiting. It also sets up global
// guards and services that are used throughout the application.

import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Importing the AuthModule
import { AuthModule } from './auth/auth.module';

// CRUDs modules (We dont need to import the entities here because we are using
// autoLoadEntities in the TypeOrmModule configuration)
import { UsersModule } from './users/users.module';

// Debug service to log loaded TypeORM entities on application startup
import { TypeormDebugService } from './database/typeorm-debug.service';
import { CategoriesModule } from './categories/categories.module';
import { MenuItemsModule } from './menu-items/menu-items.module';
import { SeedModule } from './seed/seed.module';

// We conditionally include the SeedModule based on the SEED_ENABLED environment variable.
const shouldEnableSeedModule =
  process.env.NODE_ENV !== 'production' && process.env.SEED_ENABLED === 'true';

@Module({
  imports: [
    // Load environment variables from .env file
    ConfigModule.forRoot({
      isGlobal: true,

      // Let's define a validation schema for our environment variables using Joi.
      // This will help us catch configuration errors early on.
      // Note : joi is a powerful schema description language and data validator
      // for JavaScript. It allows us to define a schema for our environment variables,
      // specifying the expected types, default values, and validation rules. This way,
      // if we forget to set an environment variable or set it to an invalid value,
      // we'll get a clear error message when the application starts. So it's a win-win
      // for both development and production environments, as it helps ensure that our
      // application is configured correctly before it runs.
      
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        PORT: Joi.number().port().default(3010),
        DB_HOST: Joi.string().hostname().default('127.0.0.1'),
        DB_PORT: Joi.number().port().default(5432),
        DB_USER: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        JWT_SECRET: Joi.string().min(16).required(),
        JWT_EXPIRES_IN: Joi.string().required(),
        JWT_REFRESH_SECRET: Joi.string().min(16).required(),
        JWT_REFRESH_PREVIOUS_SECRETS: Joi.string().allow('').optional(),
        JWT_REFRESH_EXPIRES_IN: Joi.string().optional().default('7d'),
        AUTH_LOGIN_THROTTLE_LIMIT: Joi.number().integer().min(1).default(20),
        AUTH_LOGIN_THROTTLE_TTL_MS: Joi.number()
          .integer()
          .min(1)
          .default(60_000),
        AUTH_FORGOT_THROTTLE_LIMIT: Joi.number().integer().min(1).default(5),
        AUTH_FORGOT_THROTTLE_TTL_MS: Joi.number()
          .integer()
          .min(1)
          .default(60_000),
        AUTH_REFRESH_THROTTLE_LIMIT: Joi.number().integer().min(1).default(10),
        AUTH_REFRESH_THROTTLE_TTL_MS: Joi.number()
          .integer()
          .min(1)
          .default(60_000),
        AUTH_FAILED_ATTEMPT_RESET_WINDOW_MS: Joi.number()
          .integer()
          .min(1)
          .default(1_800_000),
        AUTH_LOCKOUT_TIER1_ATTEMPTS: Joi.number().integer().min(1).default(10),
        AUTH_LOCKOUT_TIER1_MINUTES: Joi.number().integer().min(1).default(5),
        AUTH_LOCKOUT_TIER2_ATTEMPTS: Joi.number().integer().min(1).default(15),
        AUTH_LOCKOUT_TIER2_MINUTES: Joi.number().integer().min(1).default(10),
        AUTH_LOCKOUT_TIER3_ATTEMPTS: Joi.number().integer().min(1).default(20),
        AUTH_LOCKOUT_TIER3_MINUTES: Joi.number().integer().min(1).default(60),
        AUTH_LOCKOUT_TIER4_ATTEMPTS: Joi.number().integer().min(1).default(30),
        AUTH_LOCKOUT_TIER4_MINUTES: Joi.number().integer().min(1).default(300),
        FRONTEND_URL: Joi.string().uri().optional(),
        RESET_PASSWORD_URL: Joi.string().uri().optional(),
        MAIL_FROM: Joi.string().email().allow('').optional(),
        RESEND_API_KEY: Joi.string().allow('').optional(),
        TYPEORM_DEBUG: Joi.string()
          .valid('true', 'false', '1', '0', 'on', 'off')
          .default('false'),

        // This variable allows us to enable or disable the SeedModule, which is responsible for
        // seeding the database with initial data.
        SEED_ENABLED: Joi.string()
          .valid('true', 'false', '1', '0', 'on', 'off')
          .default('false'),
      }),
      validationOptions: {
        abortEarly: false,
      },
    }),
    // Configure TypeORM with PostgreSQL using environment variables
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        // Environment-aware behavior
        logging:
          configService.get<string>('NODE_ENV', 'development') === 'development'
            ? ['error', 'warn']
            : false,
        // Database connection settings
        type: 'postgres',
        host: configService.get<string>('DB_HOST', '127.0.0.1'),
        port: Number(configService.get<string>('DB_PORT', '5432')),
        username: configService.get<string>('DB_USER', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', 'postgres'),
        database: configService.get<string>('DB_NAME', 'le-general'),
        // Automatically load entities from the specified directory
        autoLoadEntities: true, // Automatically load entities from the specified directory
        synchronize: false, // Note: Set to false in production to avoid data loss
      }),
    }),
    // -> We have to here the modules that we want to use in our application
    UsersModule,
    AuthModule,
    // Configure rate limiting with ThrottlerModule
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60_000, // Time to live for rate limiting (in milliseconds)
          limit: 35, // Maximum number of requests within the ttl
        },
      ],
    }),
    CategoriesModule,
    MenuItemsModule,
    ...(shouldEnableSeedModule ? [SeedModule] : []),
  ],
  controllers: [AppController],
  // Services available for dependency injection throughout application
  providers: [
    AppService,
    TypeormDebugService,
    {
      // Apply rate limiting globally using ThrottlerGuard
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
