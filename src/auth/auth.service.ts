import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException as UNAE,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
// We use argon2 for secure password hashing, which is a modern and secure hashing algorithm
import * as argon2 from 'argon2';
import { createHash, randomBytes } from 'crypto';
import ms, { StringValue } from 'ms';
import { MoreThan, Repository } from 'typeorm';
import { SecurityEvent } from './entities/security-event.entity';
import { User } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

// The AuthService is responsible for handling user registration and login logic.
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly failedAttemptResetWindowMs = 30 * 60 * 1000;

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(SecurityEvent)
    private readonly securityEventRepository: Repository<SecurityEvent>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService, // Injecting JwtService for token generation
  ) {}

  // Helper method to log security events such as login attempts, password reset requests, and token refreshes.
  // This method creates a new SecurityEvent entity and saves it to the database, allowing for auditing and monitoring of security-related activities.
  private async logSecurityEvent(
    type: string,
    email: string | null,
    outcome: string,
    metadata?: string,
  ): Promise<void> {
    const event = this.securityEventRepository.create({
      type,
      email,
      outcome,
      metadata: metadata ?? null,
    });
    await this.securityEventRepository.save(event);
  }

  // Lockout logic to determine how long an account should be locked after a certain number of failed login
  // attempts.This method calculates the lockout duration based on the number of failed attempts, providing
  // increasing lockout times for repeated failures to enhance security.

  private getLockoutUntil(attempts: number): Date | null {
    if (attempts < 10) {
      return null;
    }

    let lockMinutes = 0;

    if (attempts >= 30) {
      lockMinutes = 300;
    } else if (attempts >= 20) {
      lockMinutes = 60;
    } else if (attempts >= 15) {
      lockMinutes = 10;
    } else if (attempts >= 10) {
      lockMinutes = 5;
    }

    const msInAMinute = 60 * 1000;
    return new Date(Date.now() + lockMinutes * msInAMinute);
  }

  // This method checks if the failed login attempts should be reset based on the time elapsed since the
  // last failed attempt.
  private shouldResetFailedAttempts(user: User): boolean {
    if (!user.lastFailedLoginAt) {
      return false;
    }

    const elapsedMs = Date.now() - user.lastFailedLoginAt.getTime();
    return elapsedMs >= this.failedAttemptResetWindowMs;
  }

  // Helper methods to manage refresh token configuration and expiration logic.
  private getRefreshSecret(): string {
    return this.configService.getOrThrow<string>('JWT_REFRESH_SECRET');
  }

  private getPreviousRefreshSecrets(): string[] {
    const raw = this.configService.get<string>(
      'JWT_REFRESH_PREVIOUS_SECRETS',
      '',
    );
    return raw
      .split(',')
      .map((secret) => secret.trim())
      .filter((secret) => secret.length > 0);
  }

  // The refresh token expiration is calculated based on the current time plus the configured
  // TTL, which allows for flexible session management.
  private getRefreshExpiresIn(): StringValue {
    return this.configService.get<StringValue>(
      'JWT_REFRESH_EXPIRES_IN',
      '7d' as StringValue,
    );
  }

  private getResetBaseUrl(): string {
    return (
      this.configService.get<string>('RESET_PASSWORD_URL') ??
      this.configService.get<string>('FRONTEND_URL') ??
      'http://localhost:3003'
    );
  }

  // This method calculates the exact expiration date for a refresh token based on the configured TTL.
  private getRefreshExpiresAt(): Date {
    const expiresIn = this.getRefreshExpiresIn();
    const ttlMs = ms(expiresIn);
    return new Date(Date.now() + ttlMs);
  }

  // This method issues both access and refresh tokens for a user, and updates the user's
  // refresh token hash and expiration time in the database. This allows for secure session
  // management and token revocation if needed.
  private async issueTokens(user: User, role: string) {
    const payload = {
      sub: user.id,
      email: user.email,
      role,
    };

    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.getRefreshSecret(),
      expiresIn: this.getRefreshExpiresIn(),
    });

    user.refreshTokenHash = await argon2.hash(refreshToken);
    user.refreshTokenExpiresAt = this.getRefreshExpiresAt();
    await this.usersRepository.save(user);

    return { accessToken, refreshToken };
  }

  // Method to handle user registration
  async register(dto: RegisterDto) {
    // Check if a user with the provided email already exists
    const existingUser = await this.usersRepository.findOne({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException("L'adresse e-mail est déjà utilisée.");
    }

    const passwordHash = await argon2.hash(dto.password);

    const user = this.usersRepository.create({
      email: dto.email,
      passwordHash,
      role: 'user',
    });

    // Save the new user to the database
    const savedUser = await this.usersRepository.save(user);
    return {
      message: 'Vous êtes inscrit.',
      id: savedUser.id,
      email: savedUser.email,
    };
  } // Close register method

  // Method to handle user login
  async login(dto: LoginDto) {
    const user = await this.usersRepository.findOne({
      where: { email: dto.email },
    });

    if (!user) {
      await this.logSecurityEvent('LOGIN', dto.email, 'FAILED_NO_USER');
      throw new UNAE(
        'La connexion a échoué. Veuillez vérifier vos identifiants.',
      );
    }

    // Check if we should reset failed attempts based on the time elapsed since the last failed login.
    if (this.shouldResetFailedAttempts(user)) {
      user.failedLoginAttempts = 0;
      user.loginLockedUntil = null;
      user.lastFailedLoginAt = null;
      await this.usersRepository.save(user);

      await this.logSecurityEvent('LOGIN_COUNTER', user.email, 'RESET_WINDOW');
    }

    // Check if the account is currently locked due to too many failed login attempts

    if (user.loginLockedUntil && user.loginLockedUntil > new Date()) {
      await this.logSecurityEvent(
        'LOGIN',
        user.email,
        'FAILED_LOCKED',
        `locked_until=${user.loginLockedUntil.toISOString()}`,
      );
      throw new UNAE(
        'Compte temporairement verrouillé après plusieurs tentatives. Réessayez plus tard.',
      );
    }

    const IsPasswordValid = await argon2.verify(
      user.passwordHash,
      dto.password,
    );
    if (!IsPasswordValid) {
      // Increment failed login attempts and set lockout time if necessary, then log the failed attempt
      // with details for monitoring.

      user.failedLoginAttempts += 1;
      user.lastFailedLoginAt = new Date();
      user.loginLockedUntil = this.getLockoutUntil(user.failedLoginAttempts);
      await this.usersRepository.save(user);

      await this.logSecurityEvent(
        'LOGIN',
        user.email,
        'FAILED_BAD_PASSWORD',
        `attempts=${user.failedLoginAttempts}`,
      );
      throw new UNAE(
        'La connexion a échoué. Veuillez vérifier vos identifiants.',
      );
    }

    // On successful login, reset failed attempts and log the successful login event with user role information.
    const role = user.role ?? 'user'; // Default to 'user' role if not set

    user.failedLoginAttempts = 0;
    user.loginLockedUntil = null;
    user.lastFailedLoginAt = null;
    await this.usersRepository.save(user);
    await this.logSecurityEvent('LOGIN', user.email, 'SUCCESS', `role=${role}`);

    const tokens = await this.issueTokens(user, role);

    return {
      message: 'Connexion réussie.',
      role,
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
    };
  } // Close login method

  // Handle forgot-password without leaking whether the email exists (anti-enumeration).
  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.usersRepository.findOne({
      where: { email: dto.email },
    });

    // If the user exists, generate a reset token, save its hash and expiration, and send the reset email.
    // If the user does not exist, we still log the event for monitoring but do not indicate this to the requester.
    if (user) {
      const rawToken = randomBytes(32).toString('hex');
      const tokenHash = this.hashResetToken(rawToken);
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

      user.passwordResetTokenHash = tokenHash;
      user.passwordResetExpiresAt = expiresAt;
      await this.usersRepository.save(user);
      await this.sendPasswordResetEmail(user.email, rawToken);

      // Log the password reset request event, indicating that a token was issued for the user.
      await this.logSecurityEvent(
        'PASSWORD_RESET_REQUEST',
        user.email,
        'ISSUED',
      );
    } else {
      await this.logSecurityEvent(
        'PASSWORD_RESET_REQUEST',
        dto.email,
        'NO_USER',
      );
    }

    return {
      message:
        'Un lien de réinitialisation a été envoyé dans votre boîte de réception. Veuillez vérifier votre e-mail.',
    };
  }

  // Reset password using a valid, non-expired, single-use reset token.
  async resetPassword(dto: ResetPasswordDto) {
    const tokenHash = this.hashResetToken(dto.token);
    const now = new Date();

    const user = await this.usersRepository.findOne({
      where: {
        passwordResetTokenHash: tokenHash,
        passwordResetExpiresAt: MoreThan(now),
      },
    });

    if (!user) {
      throw new BadRequestException(
        'Token de réinitialisation invalide ou expiré.',
      );
    }

    // Update the user's password and clear reset token fields to prevent reuse. Also invalidate refresh tokens.
    user.passwordHash = await argon2.hash(dto.newPassword);
    user.passwordResetTokenHash = null;
    user.passwordResetExpiresAt = null;
    user.refreshTokenHash = null;
    user.refreshTokenExpiresAt = null;
    await this.usersRepository.save(user);

    await this.logSecurityEvent('PASSWORD_RESET', user.email, 'SUCCESS');

    return { message: 'Mot de passe réinitialisé avec succès.' };
  }

  // Hash the reset token before persistence to avoid storing sensitive token material.
  private hashResetToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  // Send reset email via Resend when configured, or log link in development fallback.
  private async sendPasswordResetEmail(
    to: string,
    token: string,
  ): Promise<void> {
    const resetBaseUrl = this.getResetBaseUrl();
    const resetLink = `${resetBaseUrl}/reset-password?token=${token}`;
    const emailTemplate = this.buildPasswordResetEmail(resetLink);

    const resendApiKey = this.configService.get<string>('RESEND_API_KEY');
    const mailFrom = this.configService.get<string>('MAIL_FROM');

    if (!resendApiKey || !mailFrom) {
      if (
        this.configService.get<string>('NODE_ENV', 'development') ===
        'development'
      ) {
        this.logger.log(`Password reset link for ${to}: ${resetLink}`);
      } else {
        this.logger.warn(
          'Mail provider is not configured. Set RESEND_API_KEY and MAIL_FROM.',
        );
      }
      return;
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: mailFrom,
        to: [to],
        subject: emailTemplate.subject,
        html: emailTemplate.html,
        text: emailTemplate.text,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      this.logger.error(`Resend API error: ${response.status} ${errorBody}`);
    }
  }

  // Build a clear reset-password email with both HTML and plaintext versions.
  private buildPasswordResetEmail(resetLink: string): {
    subject: string;
    html: string;
    text: string;
  } {
    return {
      subject: 'Réinitialisation de votre mot de passe',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111; max-width: 620px; margin: 0 auto;">
          <h2 style="margin-bottom: 12px;">Réinitialisation du mot de passe</h2>
          <p>Vous avez demandé une réinitialisation de votre mot de passe.</p>
          <p>Ce lien est valide pendant <strong>15 minutes</strong>.</p>
          <p style="margin: 24px 0;">
            <a
              href="${resetLink}"
              style="background: #111; color: #fff; text-decoration: none; padding: 10px 16px; border-radius: 8px; display: inline-block;"
            >
              Réinitialiser mon mot de passe
            </a>
          </p>
          <p>Si le bouton ne fonctionne pas, copiez-collez ce lien dans votre navigateur :</p>
          <p><a href="${resetLink}">${resetLink}</a></p>
          <hr style="margin: 24px 0; border: none; border-top: 1px solid #ddd;" />
          <p style="color: #666; font-size: 12px;">
            Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet e-mail.
          </p>
        </div>
      `,
      text: `Réinitialisation du mot de passe\n\nVous avez demandé une réinitialisation de votre mot de passe.\nCe lien est valide pendant 15 minutes.\n\nLien: ${resetLink}\n\nSi vous n'êtes pas à l'origine de cette demande, ignorez cet e-mail.`,
    };
  }

  // This method handles the refresh token flow, allowing users to obtain new access tokens using a valid refresh
  // token. It includes comprehensive validation and security event logging to monitor refresh attempts.

  async refreshTokens(
    dto: RefreshTokenDto,
  ): Promise<{ message: string; access_token: string; refresh_token: string }> {
    const refreshSecret = this.getRefreshSecret();
    let payload: { sub: number; email: string; role?: string };
    const refreshSecrets = [refreshSecret, ...this.getPreviousRefreshSecrets()];
    let verifiedWithSecret: string | null = null;

    try {
      let verifiedPayload:
        | { sub: number; email: string; role?: string }
        | undefined;

      for (const secret of refreshSecrets) {
        try {
          verifiedPayload = await this.jwtService.verifyAsync<{
            sub: number;
            email: string;
            role?: string;
          }>(dto.refreshToken, {
            secret,
          });
          verifiedWithSecret = secret;
          break;
        } catch {
          // Try next rotation secret.
        }
      }

      if (!verifiedPayload) {
        throw new Error('Invalid refresh token for all configured secrets.');
      }

      payload = verifiedPayload;
    } catch {
      await this.logSecurityEvent('REFRESH', null, 'FAILED_INVALID_TOKEN');
      throw new UNAE('Refresh token invalide ou expiré.');
    }

    const user = await this.usersRepository.findOne({
      where: { id: payload.sub },
    });

    if (!user || !user.refreshTokenHash || !user.refreshTokenExpiresAt) {
      await this.logSecurityEvent('REFRESH', payload.email, 'FAILED_NOT_FOUND');
      throw new UNAE('Refresh token invalide ou expiré.');
    }

    if (user.refreshTokenExpiresAt <= new Date()) {
      await this.logSecurityEvent('REFRESH', user.email, 'FAILED_EXPIRED');
      throw new UNAE('Refresh token invalide ou expiré.');
    }

    const isRefreshValid = await argon2.verify(
      user.refreshTokenHash,
      dto.refreshToken,
    );
    if (!isRefreshValid) {
      await this.logSecurityEvent(
        'REFRESH',
        user.email,
        'FAILED_HASH_MISMATCH',
      );
      throw new UNAE('Refresh token invalide ou expiré.');
    }

    const role = user.role ?? 'user';
    const tokens = await this.issueTokens(user, role);

    await this.logSecurityEvent(
      'REFRESH',
      user.email,
      verifiedWithSecret === refreshSecret
        ? 'SUCCESS_CURRENT_SECRET'
        : 'SUCCESS_ROTATED_SECRET',
    );

    return {
      message: 'Session renouvelée.',
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
    };
  }

  // This method handles user logout by invalidating the refresh token. It checks the provided refresh token,
  // and if valid, it clears the stored refresh token hash and expiration for the user, effectively logging
  // them out. It also logs the logout event for security monitoring.

  async logout(dto: RefreshTokenDto): Promise<{ message: string }> {
    const refreshSecret = this.getRefreshSecret();
    if (!refreshSecret) {
      await this.logSecurityEvent('LOGOUT', null, 'SUCCESS_NOOP');
      return { message: 'Déconnexion réussie.' };
    }

    try {
      const payload = await this.jwtService.verifyAsync<{
        sub: number;
      }>(dto.refreshToken, {
        secret: refreshSecret,
      });

      const user = await this.usersRepository.findOne({
        where: { id: payload.sub },
      });

      if (user) {
        user.refreshTokenHash = null;
        user.refreshTokenExpiresAt = null;
        await this.usersRepository.save(user);
        await this.logSecurityEvent('LOGOUT', user.email, 'SUCCESS');
      }
    } catch {
      await this.logSecurityEvent('LOGOUT', null, 'SUCCESS_IDEMPOTENT');
    }

    return { message: 'Déconnexion réussie.' };
  }
}
