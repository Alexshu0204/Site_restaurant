import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException as UNAE,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
// We use argon2 for secure password hashing, which is a modern and secure hashing algorithm
import * as argon2 from 'argon2';
import { createHash, randomBytes } from 'crypto';
import ms, { StringValue } from 'ms';
import { MoreThan, Raw, Repository } from 'typeorm';
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

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService, // Injecting JwtService for token generation
  ) {}

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  // Helper methods to manage refresh token configuration and expiration logic.
  private getRefreshSecret(): string {
    return process.env.JWT_REFRESH_SECRET ?? process.env.JWT_SECRET ?? '';
  }

  // The refresh token expiration is calculated based on the current time plus the configured
  // TTL, which allows for flexible session management.
  private getRefreshExpiresIn(): StringValue {
    return (process.env.JWT_REFRESH_EXPIRES_IN ?? '7d') as StringValue;
  }

  // This method calculates the exact expiration date for a refresh token based on the configured TTL.
  private getRefreshExpiresAt(): Date {
    const expiresIn = this.getRefreshExpiresIn();
    const ttlMs = ms(expiresIn);
    return new Date(Date.now() + ttlMs);
  }

  // The issueTokens method generates both access and refresh tokens for a user. The access token 
  // is signed with the main JWT secret, while the refresh token is signed with a separate secret 
  // to enhance security. The refresh token is hashed and stored in the database along with its 
  // expiration time, allowing for secure session management and token revocation if needed.
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
    const normalizedEmail = this.normalizeEmail(dto.email);

    // Check if a user with the provided email already exists
    const existingUser = await this.usersRepository.findOne({
      where: {
        email: Raw((alias) => `LOWER(${alias}) = LOWER(:email)`, {
          email: normalizedEmail,
        }),
      },
    });

    if (existingUser) {
      throw new ConflictException("L'adresse e-mail est déjà utilisée.");
    }

    const passwordHash = await argon2.hash(dto.password);

    const user = this.usersRepository.create({
      email: normalizedEmail,
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
    const normalizedEmail = this.normalizeEmail(dto.email);

    const user = await this.usersRepository.findOne({
      where: {
        email: Raw((alias) => `LOWER(${alias}) = LOWER(:email)`, {
          email: normalizedEmail,
        }),
      },
    });

    if (!user) {
      throw new UNAE(
        'La connexion a échoué. Veuillez vérifier vos identifiants.',
      );
    }

    const IsPasswordValid = await argon2.verify(
      user.passwordHash,
      dto.password,
    );
    if (!IsPasswordValid) {
      throw new UNAE(
        'La connexion a échoué. Veuillez vérifier vos identifiants.',
      );
    }

    const role = user.role ?? 'user'; // Default to 'user' role if not set

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
    const normalizedEmail = this.normalizeEmail(dto.email);

    const user = await this.usersRepository.findOne({
      where: {
        email: Raw((alias) => `LOWER(${alias}) = LOWER(:email)`, {
          email: normalizedEmail,
        }),
      },
    });

    if (user) {
      const rawToken = randomBytes(32).toString('hex');
      const tokenHash = this.hashResetToken(rawToken);
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

      user.passwordResetTokenHash = tokenHash;
      user.passwordResetExpiresAt = expiresAt;
      await this.usersRepository.save(user);
      await this.sendPasswordResetEmail(user.email, rawToken);
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
    const resetBaseUrl =
      process.env.RESET_PASSWORD_URL ??
      process.env.FRONTEND_URL ??
      'http://localhost:3003';
    const resetLink = `${resetBaseUrl}/reset-password?token=${token}`;
    const emailTemplate = this.buildPasswordResetEmail(resetLink);

    const resendApiKey = process.env.RESEND_API_KEY;
    const mailFrom = process.env.MAIL_FROM;

    if (!resendApiKey || !mailFrom) {
      if (process.env.NODE_ENV === 'development') {
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

  async refreshTokens(
    dto: RefreshTokenDto,
  ): Promise<{ message: string; access_token: string; refresh_token: string }> {
    const refreshSecret = this.getRefreshSecret();
    if (!refreshSecret) {
      throw new UNAE('Refresh token non configuré.');
    }

    let payload: { sub: number; email: string; role?: string };
    try {
      payload = await this.jwtService.verifyAsync(dto.refreshToken, {
        secret: refreshSecret,
      });
    } catch {
      throw new UNAE('Refresh token invalide ou expiré.');
    }

    const user = await this.usersRepository.findOne({
      where: { id: payload.sub },
    });

    if (!user || !user.refreshTokenHash || !user.refreshTokenExpiresAt) {
      throw new UNAE('Refresh token invalide ou expiré.');
    }

    if (user.refreshTokenExpiresAt <= new Date()) {
      throw new UNAE('Refresh token invalide ou expiré.');
    }

    const isRefreshValid = await argon2.verify(
      user.refreshTokenHash,
      dto.refreshToken,
    );
    if (!isRefreshValid) {
      throw new UNAE('Refresh token invalide ou expiré.');
    }

    const role = user.role ?? 'user';
    const tokens = await this.issueTokens(user, role);

    return {
      message: 'Session renouvelée.',
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
    };
  }

  async logout(dto: RefreshTokenDto): Promise<{ message: string }> {
    const refreshSecret = this.getRefreshSecret();
    if (!refreshSecret) {
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
      }
    } catch {
      // Keep logout idempotent and avoid leaking token validity.
    }

    return { message: 'Déconnexion réussie.' };
  }
}
