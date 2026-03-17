import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard as JwtAG } from '../auth/guards/jwt-auth.guard';
import { EventRequestsService } from './event-requests.service';
import { CreateEventRequestDto } from './dto/create-event-request.dto';
import { UpdateEventRequestDto } from './dto/update-event-request.dto';
import { EventRequestStatus } from './entities/event-request.entity';

type AuthenticatedRequest = {
  user: {
    sub: number;
    role?: string;
  };
};

@ApiTags('event-requests')
@ApiBearerAuth()
@UseGuards(JwtAG)
@Controller('event-requests')
export class EventRequestsController {
  constructor(private readonly eventRequestsService: EventRequestsService) {}

  @Post()
  @ApiBody({
    type: CreateEventRequestDto,
    examples: {
      birthdayEvent: {
        summary: 'Demande evenement particulier',
        value: {
          eventDate: '2026-04-20T00:00:00',
          startTime: '19:00',
          participants: 25,
          spaceRequested: 'PRIVATISER_SALLE_1_RDC_25_50',
          eventType: 'ANNIVERSAIRE',
          additionalNotes: 'Besoin d un gateau et d un micro.',
          status: EventRequestStatus.InquiryReceived,
          isProfessional: false,
          message: 'Merci de me rappeler en fin de journee.',
          contactLastName: 'CONTACT_LASTNAME',
          contactFirstName: 'CONTACT_FIRSTNAME',
          contactEmail: 'contact-event@local.test',
          contactPhone: '0000000000',
        },
      },
      corporateEvent: {
        summary: 'Demande evenement professionnel',
        value: {
          eventDate: '2026-05-05T00:00:00',
          startTime: '12:30',
          participants: 60,
          spaceRequested: 'RESERVER_QUELQUES_TABLES_15_80',
          eventType: 'SEMINAIRE_PRO',
          additionalNotes: 'Prevoir menu sans gluten pour 4 personnes.',
          status: EventRequestStatus.InquiryReceived,
          isProfessional: true,
          message: 'Besoin d une facture entreprise.',
        },
      },
    },
  })
  create(
    @Body() createEventRequestDto: CreateEventRequestDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.eventRequestsService.create(createEventRequestDto, req.user);
  }

  @Get()
  findAll(@Req() req: AuthenticatedRequest) {
    return this.eventRequestsService.findAll(req.user);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req: AuthenticatedRequest) {
    return this.eventRequestsService.findOne(id, req.user);
  }

  @Patch(':id')
  @ApiBody({
    type: UpdateEventRequestDto,
    examples: {
      sendQuote: {
        summary: 'Envoi devis (admin)',
        value: {
          status: EventRequestStatus.QuoteSent,
        },
      },
      updateDetails: {
        summary: 'Modification details evenement',
        value: {
          participants: 45,
          startTime: '20:30',
          message: 'Ajouter une option vegetarienne.',
        },
      },
      cancelRequest: {
        summary: 'Annuler la demande',
        value: {
          status: EventRequestStatus.Cancelled,
        },
      },
    },
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEventRequestDto: UpdateEventRequestDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.eventRequestsService.update(id, updateEventRequestDto, req.user);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: AuthenticatedRequest) {
    return this.eventRequestsService.remove(id, req.user);
  }
}
