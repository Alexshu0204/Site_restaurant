import {
  ConflictException,
  Injectable,
  UnauthorizedException as UNAE,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
// We use argon2 for secure password hashing, which is a modern and secure hashing algorithm
import * as argon2 from 'argon2';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

// The AuthService is responsible for handling user registration and login logic.
@Injectable()
export class AuthService {
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

    // Generate a JWT token for the authenticated user
    const payload = {
      sub: user.id, // It's the unique identifier for the user, often the user ID
      email: user.email,
    };

    // Return the access token to the client
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  } // Close login method
}
