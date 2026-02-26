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

  async findAll() {
    const users = await this.usersRepository.find({ order: { id: 'ASC' } });
    return users.map(({ passwordHash, ...user }) => user);
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NFE('Aucun utilisateur trouvé.');
    }

    const { passwordHash, ...safeUser } = user;
    return safeUser; // safeUser is the user object without the passwordHash, which we do not want to return for security reasons.
  } // Close findOne method

  async update(id: number, dto: UpdateUserDto) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NFE('Utilisateur non trouvé.');
    }

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
    
    // Save the updated user to the database
    const saved = await this.usersRepository.save(user);
    const { passwordHash, ...safeUser } = saved;

    // Determine the success message based on what was updated
    let message = '';
    if (dto.email && dto.password) {
      message = 'Email et mot de passe mis à jour avec succès.';
    } else if (dto.email) {
      message = 'Email mis à jour avec succès.';
    } else if (dto.password) {
      message = 'Mot de passe mis à jour avec succès.';
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
