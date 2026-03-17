import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateEventRequestDto,
  EVENT_REQUEST_MAX_PARTICIPANTS,
  EVENT_REQUEST_MIN_PARTICIPANTS,
} from './dto/create-event-request.dto';
import { UpdateEventRequestDto } from './dto/update-event-request.dto';
import {
  EventRequest,
  EventRequestStatus,
} from './entities/event-request.entity';
import { User } from '../users/entities/user.entity';

type RequestUser = {
  sub: number;
  role?: string;
};

@Injectable()
export class EventRequestsService {
  constructor(
    @InjectRepository(EventRequest)
    private readonly eventRequestsRepository: Repository<EventRequest>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  private isAdmin(user: RequestUser): boolean {
    return user.role === 'admin';
  }

  private validateEventDate(eventDate: Date): void {
    if (Number.isNaN(eventDate.getTime())) {
      throw new BadRequestException('Date d evenement invalide.');
    }

    if (eventDate <= new Date()) {
      throw new BadRequestException('La date de l evenement doit etre dans le futur.');
    }
  }

  private validateParticipants(participants: number): void {
    if (
      participants < EVENT_REQUEST_MIN_PARTICIPANTS ||
      participants > EVENT_REQUEST_MAX_PARTICIPANTS
    ) {
      throw new BadRequestException(
        `Le nombre de participants doit etre compris entre ${EVENT_REQUEST_MIN_PARTICIPANTS} et ${EVENT_REQUEST_MAX_PARTICIPANTS}.`,
      );
    }
  }

  private ensureCanAccessEventRequest(
    eventRequest: EventRequest,
    requester: RequestUser,
  ): void {
    if (!this.isAdmin(requester) && eventRequest.userId !== requester.sub) {
      throw new ForbiddenException('Acces refuse a cette demande evenementielle.');
    }
  }

  private ensureCanSetStatus(
    status: EventRequestStatus | undefined,
    requester: RequestUser,
  ): void {
    const adminOnlyStatuses: EventRequestStatus[] = [
      EventRequestStatus.QuoteSent,
      EventRequestStatus.AwaitingClientConfirmation,
      EventRequestStatus.Confirmed,
      EventRequestStatus.Declined,
    ];

    if (status && adminOnlyStatuses.includes(status) && !this.isAdmin(requester)) {
      throw new ForbiddenException(
        'Seul un administrateur peut appliquer ce statut evenementiel.',
      );
    }
  }

  async create(createEventRequestDto: CreateEventRequestDto, requester: RequestUser) {
    const user = await this.usersRepository.findOne({
      where: { id: requester.sub },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable pour la demande evenementielle.');
    }

    const eventDate = new Date(createEventRequestDto.eventDate);
    this.validateEventDate(eventDate);
    this.validateParticipants(createEventRequestDto.participants);

    const status = this.isAdmin(requester)
      ? (createEventRequestDto.status ?? EventRequestStatus.InquiryReceived)
      : EventRequestStatus.InquiryReceived;

    const eventRequest = this.eventRequestsRepository.create({
      eventDate,
      startTime: createEventRequestDto.startTime,
      participants: createEventRequestDto.participants,
      spaceRequested: createEventRequestDto.spaceRequested,
      eventType: createEventRequestDto.eventType,
      additionalNotes: createEventRequestDto.additionalNotes ?? null,
      status,
      isProfessional: createEventRequestDto.isProfessional ?? false,
      message: createEventRequestDto.message ?? null,
      contactLastName: createEventRequestDto.contactLastName ?? user.lastName,
      contactFirstName: createEventRequestDto.contactFirstName ?? user.firstName,
      contactEmail: createEventRequestDto.contactEmail ?? user.email,
      contactPhone: createEventRequestDto.contactPhone ?? user.phone,
      userId: user.id,
      user,
    });

    return this.eventRequestsRepository.save(eventRequest);
  }

  async findAll(requester: RequestUser) {
    const where = this.isAdmin(requester)
      ? {}
      : {
          userId: requester.sub,
        };

    return this.eventRequestsRepository.find({
      where,
      order: {
        eventDate: 'ASC',
      },
    });
  }

  async findOne(id: number, requester: RequestUser) {
    const eventRequest = await this.eventRequestsRepository.findOne({ where: { id } });

    if (!eventRequest) {
      throw new NotFoundException('Demande evenementielle non trouvee.');
    }

    this.ensureCanAccessEventRequest(eventRequest, requester);
    return eventRequest;
  }

  async update(
    id: number,
    updateEventRequestDto: UpdateEventRequestDto,
    requester: RequestUser,
  ) {
    const eventRequest = await this.eventRequestsRepository.findOne({ where: { id } });

    if (!eventRequest) {
      throw new NotFoundException('Demande evenementielle non trouvee.');
    }

    this.ensureCanAccessEventRequest(eventRequest, requester);

    if (updateEventRequestDto.eventDate !== undefined) {
      const eventDate = new Date(updateEventRequestDto.eventDate);
      this.validateEventDate(eventDate);
      eventRequest.eventDate = eventDate;
    }

    if (updateEventRequestDto.startTime !== undefined) {
      eventRequest.startTime = updateEventRequestDto.startTime;
    }

    if (updateEventRequestDto.participants !== undefined) {
      this.validateParticipants(updateEventRequestDto.participants);
      eventRequest.participants = updateEventRequestDto.participants;
    }

    if (updateEventRequestDto.spaceRequested !== undefined) {
      eventRequest.spaceRequested = updateEventRequestDto.spaceRequested;
    }

    if (updateEventRequestDto.eventType !== undefined) {
      eventRequest.eventType = updateEventRequestDto.eventType;
    }

    if (updateEventRequestDto.additionalNotes !== undefined) {
      eventRequest.additionalNotes = updateEventRequestDto.additionalNotes ?? null;
    }

    if (updateEventRequestDto.message !== undefined) {
      eventRequest.message = updateEventRequestDto.message ?? null;
    }

    if (updateEventRequestDto.status !== undefined) {
      this.ensureCanSetStatus(updateEventRequestDto.status, requester);
      eventRequest.status = updateEventRequestDto.status;
    }

    if (updateEventRequestDto.isProfessional !== undefined) {
      eventRequest.isProfessional = updateEventRequestDto.isProfessional;
    }

    if (updateEventRequestDto.contactLastName !== undefined) {
      eventRequest.contactLastName = updateEventRequestDto.contactLastName ?? null;
    }

    if (updateEventRequestDto.contactFirstName !== undefined) {
      eventRequest.contactFirstName = updateEventRequestDto.contactFirstName ?? null;
    }

    if (updateEventRequestDto.contactEmail !== undefined) {
      eventRequest.contactEmail = updateEventRequestDto.contactEmail ?? null;
    }

    if (updateEventRequestDto.contactPhone !== undefined) {
      eventRequest.contactPhone = updateEventRequestDto.contactPhone ?? null;
    }

    return this.eventRequestsRepository.save(eventRequest);
  }

  async remove(id: number, requester: RequestUser) {
    const eventRequest = await this.eventRequestsRepository.findOne({ where: { id } });

    if (!eventRequest) {
      throw new NotFoundException('Demande evenementielle non trouvee.');
    }

    this.ensureCanAccessEventRequest(eventRequest, requester);
    await this.eventRequestsRepository.remove(eventRequest);
    return { message: 'Demande evenementielle supprimee avec succes.' };
  }
}
