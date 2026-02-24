import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// CRUDs modules (We dont need to import the entities here because we are using
// autoLoadEntities in the TypeOrmModule configuration)
import { UsersModule } from './users/users.module';

// Debug service to log loaded TypeORM entities on application startup
import { TypeormDebugService } from './database/typeorm-debug.service';

@Module({
  imports: [
    // Load environment variables from .env file
    ConfigModule.forRoot({ isGlobal: true }),
    // Configure TypeORM with PostgreSQL using environment variables
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        // Database connection settings
        type: 'postgres',
        host: configService.get<string>('DB_HOST', '127.0.0.1'),
        port: Number(configService.get<string>('DB_PORT', '5432')),
        username: configService.get<string>('DB_USER', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', 'postgres'),
        database: configService.get<string>('DB_NAME', 'le-general'),
        // Automatically load entities from the specified directory
        autoLoadEntities: true, // Automatically load entities from the specified directory
        synchronize: true, // Note: Set to false in production to avoid data loss
      }),
    }),
    UsersModule,
    // Configure rate limiting with ThrottlerModule
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60_000, // Time to live for rate limiting (in milliseconds)
          limit: 35, // Maximum number of requests within the ttl
        },
      ],
    }),
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
