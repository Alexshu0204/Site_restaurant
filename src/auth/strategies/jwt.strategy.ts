// This file defines the JWT authentication strategy for the application using Passport.js.
// It extracts the JWT token from the Authorization header, verifies it using the secret key,
// and validates the payload to ensure it contains the necessary information (like user ID and email).
// If the token is valid, it returns the user information that can be used in request handling.

import { Injectable, UnauthorizedException as UNAE} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

// The JwtStrategy class extends PassportStrategy and implements the JWT authentication logic.
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET', 'dev-secret'),
    });
  }

  // The validate method is called after the token is verified. It checks the payload and returns
  // user information.
  async validate(payload: { sub: number; email: string }) {
    if (!payload?.sub) {
      throw new UNAE('Invalid token payload');
    }

    return {
      userId: payload.sub, // It's the unique identifier for the user, often the user ID
      email: payload.email,
    };
  }
}