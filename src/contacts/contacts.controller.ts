import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard as JwtAG } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@ApiTags('contacts')
@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  @ApiBody({
    type: CreateContactDto,
    examples: {
      customerQuestion: {
        summary: 'Question generale client',
        value: {
          fullName: 'Jean Dupont',
          email: 'jean.dupont@local.test',
          phone: '+33600000000',
          subject: 'Horaires et options vegetariennes',
          message: 'Bonjour, proposez-vous des options vegetarianes le midi ?',
        },
      },
    },
  })
  create(@Body() createContactDto: CreateContactDto) {
    return this.contactsService.create(createContactDto);
  }

  @Get('admin/all')
  @ApiBearerAuth()
  @UseGuards(JwtAG, RolesGuard)
  @Roles('admin', 'employee')
  findAllAdmin() {
    return this.contactsService.findAllAdmin();
  }

  @Get('admin/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAG, RolesGuard)
  @Roles('admin', 'employee')
  findOneAdmin(@Param('id', ParseIntPipe) id: number) {
    return this.contactsService.findOneAdmin(id);
  }

  @Patch('admin/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAG, RolesGuard)
  @Roles('admin', 'employee')
  updateAdmin(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateContactDto: UpdateContactDto,
  ) {
    return this.contactsService.updateAdmin(id, updateContactDto);
  }

  @Delete('admin/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAG, RolesGuard)
  @Roles('admin')
  removeAdmin(@Param('id', ParseIntPipe) id: number) {
    return this.contactsService.removeAdmin(id);
  }
}
