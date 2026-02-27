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
import { MoreThan, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

// The AuthService is responsible for handling user registration and login logic.
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService, // Injecting JwtService for token generation
  ) {}

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

    // Determine role from environment-managed admin email (no DB schema change required).
    const role =
      process.env.ADMIN_EMAIL && process.env.ADMIN_EMAIL === user.email
        ? 'admin'
        : 'user';

    // Generate a JWT token for the authenticated user
    const payload = {
      sub: user.id, // It's the unique identifier for the user, often the user ID
      email: user.email,
      role,
    };

    // Return the access token to the client
    return {
      message: 'Connexion réussie.',
      role,
      access_token: await this.jwtService.signAsync(payload),
    };
  } // Close login method

  // Handle forgot-password without leaking whether the email exists (anti-enumeration).
  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.usersRepository.findOne({
      where: { email: dto.email },
    });

    if (user) {
      const rawToken = randomBytes(32).toString('hex');
      const tokenHash = this.hashResetToken(rawToken);
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

      user.passwordResetTokenHash = tokenHash;
      user.passwordResetExpiresAt = expiresAt;
      await this.usersRepository.save(user);

      // For MVP: log reset link in development only.
      if (process.env.NODE_ENV === 'development') {
        const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:5173';
        this.logger.log(
          `Password reset link for ${user.email}: ${frontendUrl}/reset-password?token=${rawToken}`,
        );
      }
    }

    return {
      message:
        'Si un compte est associé à cet e-mail, un lien de réinitialisation a été envoyé.',
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

    user.passwordHash = await argon2.hash(dto.newPassword);
    user.passwordResetTokenHash = null;
    user.passwordResetExpiresAt = null;
    await this.usersRepository.save(user);

    return { message: 'Mot de passe réinitialisé avec succès.' };
  }

  // Hash the reset token before persistence to avoid storing sensitive token material.
  private hashResetToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}
