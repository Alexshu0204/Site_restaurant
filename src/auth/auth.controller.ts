// This file defines the AuthController, which handles authentication-related HTTP
// requests such as user registration and login. It uses the AuthService to perform
// the actual authentication logic.

import { Body, Controller, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

// The getEnvPositiveInt function is a utility function that retrieves an environment variable by name,
function getEnvPositiveInt(name: string, fallback: number): number {
  const rawValue = process.env[name];
  const parsedValue = Number(rawValue);

  if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
    return fallback;
  }

  return Math.floor(parsedValue);
}

const loginThrottleLimit = getEnvPositiveInt('AUTH_LOGIN_THROTTLE_LIMIT', 20);
const loginThrottleTtlMs = getEnvPositiveInt(
  'AUTH_LOGIN_THROTTLE_TTL_MS',
  60_000,
);
const forgotThrottleLimit = getEnvPositiveInt('AUTH_FORGOT_THROTTLE_LIMIT', 5);
const forgotThrottleTtlMs = getEnvPositiveInt(
  'AUTH_FORGOT_THROTTLE_TTL_MS',
  60_000,
);
const refreshThrottleLimit = getEnvPositiveInt(
  'AUTH_REFRESH_THROTTLE_LIMIT',
  10,
);
const refreshThrottleTtlMs = getEnvPositiveInt(
  'AUTH_REFRESH_THROTTLE_TTL_MS',
  60_000,
);

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  // Keep enough room for account-level lockout logic (starts at 10 fails), while still rate-limiting bots.
  // The Throttle decorator from @nestjs/throttler is used to enforce this rate limit on the login endpoint.
  @Throttle({ default: { limit: loginThrottleLimit, ttl: loginThrottleTtlMs } })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('forgot-password')
  @Throttle({
    default: { limit: forgotThrottleLimit, ttl: forgotThrottleTtlMs },
  })
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Post('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  // The refresh endpoint allows clients to obtain a new access token using a valid refresh token. We also
  // apply a rate limit of 10 requests per minute to this endpoint to prevent abuse.

  @Post('refresh')
  @Throttle({
    default: { limit: refreshThrottleLimit, ttl: refreshThrottleTtlMs },
  })
  refresh(
    @Body() dto: RefreshTokenDto,
  ): Promise<{ message: string; access_token: string; refresh_token: string }> {
    return this.authService.refreshTokens(dto);
  }

  @Post('logout')
  logout(@Body() dto: RefreshTokenDto): Promise<{ message: string }> {
    return this.authService.logout(dto);
  }
}
