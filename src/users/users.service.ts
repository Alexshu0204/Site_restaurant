import {
  ConflictException, // This exception is thrown when there is a conflict with the current state of the resource, such as when trying to create a user with an email that already exists.
  Injectable,
  NotFoundException as NFE, // This exception is thrown when a requested resource is not found, such as when trying to find a user that does not exist.
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  // This method is used to sanitize the user object before sending it in a response, by removing
  // sensitive information such as the password hash.

  private sanitizeUser(user: User) {
    return {
      id: user.id,
      lastName: user.lastName,
      firstName: user.firstName,
      phone: user.phone,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };
  }

  async findAll() {
    const users = await this.usersRepository.find({ order: { id: 'ASC' } });
    return users.map((user) => this.sanitizeUser(user));
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NFE('Aucun utilisateur trouvé.');
    }

    return this.sanitizeUser(user);
  } // Close findOne method

  async update(id: number, dto: UpdateUserDto) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NFE('Utilisateur non trouvé.');
    }

    const profileDto = dto as UpdateUserDto & {
      lastName?: string | null;
      firstName?: string | null;
      phone?: string | null;
    };

    // If the email is being updated, check if the new email is already in use by another user
    if (dto.email && dto.email !== user.email) {
      const existing = await this.usersRepository.findOne({
        // We check if there is another user with the same email, excluding the current user
        where: { email: dto.email },
      });
      if (existing) {
        throw new ConflictException("L'adresse e-mail est déjà utilisée.");
      }
      user.email = dto.email;
    } // close email conflict check

    // If the password is being updated, hash the new password
    if (dto.password) {
      user.passwordHash = await argon2.hash(dto.password);
    }

    if (profileDto.lastName !== undefined) {
      user.lastName = profileDto.lastName;
    }

    if (profileDto.firstName !== undefined) {
      user.firstName = profileDto.firstName;
    }

    if (profileDto.phone !== undefined) {
      user.phone = profileDto.phone;
    }

    // Save the updated user to the database
    const saved = await this.usersRepository.save(user);
    const safeUser = this.sanitizeUser(saved);

    // Determine the success message based on what was updated
    let message = '';
    if (dto.email && dto.password) {
      message = 'Email et mot de passe mis à jour avec succès.';
    } else if (dto.email) {
      message = 'Email mis à jour avec succès.';
    } else if (dto.password) {
      message = 'Mot de passe mis à jour avec succès.';
    } else if (
      dto.lastName !== undefined ||
      dto.firstName !== undefined ||
      dto.phone !== undefined
    ) {
      message = 'Profil mis à jour avec succès.';
    }

    return { ...safeUser, message };
  } // Close update method

  async remove(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NFE('Utilisateur non trouvé.');
    }

    await this.usersRepository.remove(user);
    return { message: 'Utilisateur supprimé avec succès.' }; // Return a success message after the user has been removed
  } // Close remove method
}
