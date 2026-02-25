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
    JMod.registerAsync({
      inject: [ConfS],
      useFactory: (configService: ConfS) => ({
        secret: configService.get<string>('JWT_SECRET', 'dev-secret'),
        signOptions: {
          expiresIn: configService.get<string>(
            'JWT_EXPIRES_IN',
            '1h',
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
