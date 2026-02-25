// This file is part of NestJS - https://nestjs.com/
// It defines the UsersModule, which is responsible for managing user-related functionality in the application.
// The module imports the TypeOrmModule to make the User repository available for dependency injection,
// and it declares the UsersController and UsersService as part of the module.

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // makes User repository injectable into UsersService
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // Export UsersService to be used in other modules (like AuthModule)
})
export class UsersModule {}
