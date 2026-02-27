import { Module } from '@nestjs/common';
import { ConfigModule as ConfM, ConfigService as ConfS } from '@nestjs/config';
import { JwtModule as JMod } from '@nestjs/jwt';
import { PassportModule as PWM } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StringValue } from 'ms';
import { User } from '../users/entities/user.entity';
import { AuthService as AS } from './auth.service';
import { AuthController as ACtr } from './auth.controller';
import { JwtStrategy as JStrat } from './strategies/jwt.strategy';

// This file defines the AuthModule, which is responsible for handling authentication in the application.

@Module({
  imports: [
    ConfM,
    PWM,
    TypeOrmModule.forFeature([User]),
    // The JwtModule is configured asynchronously to allow the use of ConfigService for retrieving
    // the JWT secret and expiration time from environment variables. This ensures that sensitive
    // information is not hardcoded and can be easily managed through configuration.

    JMod.registerAsync({ // Inject the ConfigService to access environment variables
      inject: [ConfS],
      useFactory: (configService: ConfS) => ({ // JWT configuration settings
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
  controllers: [ACtr],
  providers: [AS, JStrat],
  exports: [AS], // Export AuthService to be used in other modules (like UsersModule)
})
export class AuthModule {}
