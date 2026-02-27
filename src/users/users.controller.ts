import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard as JwtAG } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { OwnerGuard } from './guards/owner.guard'; // Importing the OwnerGuard to protect certain routes so that only the owner of the resource can access them.
import { UsersService } from './users.service';

@ApiTags('users') // This decorator is used to group the endpoints of this controller under the "users" tag in the Swagger documentation.
@ApiBearerAuth() // This decorator is used to indicate that the endpoints of this controller require a bearer token for authentication in the Swagger documentation.
@UseGuards(JwtAG)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Only users with role "admin" can list all users.
  @Get()
  @UseGuards(RolesGuard)
  @Roles('admin')
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(OwnerGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(OwnerGuard)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(OwnerGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
} // Close UsersController class
