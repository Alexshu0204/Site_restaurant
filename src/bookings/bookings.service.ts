import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BOOKING_MAX_GUESTS, CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Booking, BookingStatus } from './entities/booking.entity';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';

type RequestUser = {
  sub: number;
  role?: string;
};

@Injectable()
export class BookingsService {
  // The BookingsService is responsible for handling all business logic related to bookings.
  // It provides methods to create, retrieve, update, and delete bookings. The service also
  // includes access control logic to ensure that users can only manage their own bookings
  // unless they have admin privileges.
  constructor(
    @InjectRepository(Booking)
    private readonly bookingsRepository: Repository<Booking>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  private isAdmin(user: RequestUser): boolean {
    return user.role === 'admin';
  }

  private validateReservationDate(reservationDate: Date): void {
    if (Number.isNaN(reservationDate.getTime())) {
      throw new BadRequestException('Date de reservation invalide.');
    }

    if (reservationDate <= new Date()) {
      throw new BadRequestException(
        'La reservation doit etre fixee dans le futur.',
      );
    }
  }

  private validateGuestsNumber(guestsNumber: number): void {
    if (guestsNumber < 1 || guestsNumber > BOOKING_MAX_GUESTS) {
      throw new BadRequestException(
        `Le nombre de convives doit etre compris entre 1 et ${BOOKING_MAX_GUESTS}.`,
      );
    }
  }

  private ensureCanAccessBooking(
    booking: Booking,
    requester: RequestUser,
  ): void {
    if (!this.isAdmin(requester) && booking.userId !== requester.sub) {
      throw new ForbiddenException('Acces refuse a cette reservation.');
    }
  }

  // The ensureCanSetStatus method checks if the requester has permission to set a specific booking status.
  private ensureCanSetStatus(
    status: BookingStatus | undefined,
    requester: RequestUser,
  ): void {
    if (status === BookingStatus.Confirmed && !this.isAdmin(requester)) {
      throw new ForbiddenException(
        'Seul un administrateur peut confirmer une reservation.',
      );
    }
  }

  async create(createBookingDto: CreateBookingDto, requester: RequestUser) {
    const user = await this.usersRepository.findOne({
      where: { id: requester.sub },
    });

    if (!user) {
      throw new NotFoundException(
        'Utilisateur introuvable pour la reservation.',
      );
    }

    const reservationDate = new Date(createBookingDto.reservationDate);
    this.validateReservationDate(reservationDate);
    this.validateGuestsNumber(createBookingDto.guestsNumber);

    const booking = this.bookingsRepository.create({
      reservationDate,
      guestsNumber: createBookingDto.guestsNumber,
      specialRequest: createBookingDto.specialRequest ?? null,
      isMarketable: createBookingDto.isMarketable ?? false,
      status: this.isAdmin(requester)
        ? (createBookingDto.status ?? BookingStatus.Pending)
        : BookingStatus.Pending,
      userId: user.id,
      user,
    });

    return this.bookingsRepository.save(booking);
  }

  // The findAll method retrieves all bookings. If the requester is an admin, it returns
  // all bookings in the system.
  async findAll(requester: RequestUser) {
    const where = this.isAdmin(requester)
      ? {}
      : {
          userId: requester.sub,
        };

    return this.bookingsRepository.find({
      where,
      order: {
        reservationDate: 'ASC',
      },
    });
  }

  // The findOne method retrieves a single booking by its ID. It checks if the booking exists and
  // if the requester has permission to access it (either they are the owner or an admin).
  async findOne(id: number, requester: RequestUser) {
    const booking = await this.bookingsRepository.findOne({ where: { id } });
    if (!booking) {
      throw new NotFoundException('Reservation non trouvee.');
    }

    this.ensureCanAccessBooking(booking, requester);
    return booking;
  }

  async update(
    id: number,
    updateBookingDto: UpdateBookingDto,
    requester: RequestUser,
  ) {
    const booking = await this.bookingsRepository.findOne({ where: { id } });
    if (!booking) {
      throw new NotFoundException('Reservation non trouvee.');
    }

    this.ensureCanAccessBooking(booking, requester);

    if (updateBookingDto.reservationDate !== undefined) {
      const reservationDate = new Date(updateBookingDto.reservationDate);
      this.validateReservationDate(reservationDate);
      booking.reservationDate = reservationDate;
    }
    if (updateBookingDto.guestsNumber !== undefined) {
      this.validateGuestsNumber(updateBookingDto.guestsNumber);
      booking.guestsNumber = updateBookingDto.guestsNumber;
    }
    if (updateBookingDto.specialRequest !== undefined) {
      booking.specialRequest = updateBookingDto.specialRequest ?? null;
    }
    if (updateBookingDto.isMarketable !== undefined) {
      booking.isMarketable = updateBookingDto.isMarketable;
    }
    if (updateBookingDto.status !== undefined) {
      this.ensureCanSetStatus(updateBookingDto.status, requester);
      booking.status = updateBookingDto.status;
    }

    return this.bookingsRepository.save(booking);
  }

  async remove(id: number, requester: RequestUser) {
    const booking = await this.bookingsRepository.findOne({ where: { id } });
    if (!booking) {
      throw new NotFoundException('Reservation non trouvee.');
    }

    this.ensureCanAccessBooking(booking, requester);
    await this.bookingsRepository.remove(booking);
    return { message: 'Reservation supprimee avec succes.' };
  }
}
