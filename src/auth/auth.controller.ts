// This file defines the AuthController, which handles authentication-related HTTP
// requests such as user registration and login. It uses the AuthService to perform
// the actual authentication logic.

import { Body, Controller, Post } from '@nestjs/common';
import { AuthService as AS } from './auth.service';
import { RegisterDto as RDto } from './dto/register.dto';
import { LoginDto as LDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AS) {}

  @Post('register')
  register(@Body() dto: RDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LDto) {
    return this.authService.login(dto);
  }
}