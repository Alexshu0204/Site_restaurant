import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StringValue } from 'ms';
import { User } from '../users/entities/user.entity';
import { SecurityEvent } from './entities/security-event.entity';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';

// This file defines the AuthModule, which is responsible for handling authentication in the application.

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    TypeOrmModule.forFeature([User, SecurityEvent]),
    // The JwtModule is configured asynchronously to allow the use of ConfigService for retrieving
    // the JWT secret and expiration time from environment variables. This ensures that sensitive
    // information is not hardcoded and can be easily managed through configuration.

    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        // The secret key used to sign the JWT tokens, retrieved from environment variables
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.getOrThrow<string>(
            'JWT_EXPIRES_IN',
          ) as StringValue,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService], // Export AuthService to be used in other modules (like UsersModule)
})
export class AuthModule {}
