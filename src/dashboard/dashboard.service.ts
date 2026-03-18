import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, MoreThanOrEqual, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Booking, BookingStatus } from '../bookings/entities/booking.entity';
import {
  EventRequest,
  EventRequestStatus,
} from '../event-requests/entities/event-request.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Booking)
    private readonly bookingsRepository: Repository<Booking>,
    @InjectRepository(EventRequest)
    private readonly eventRequestsRepository: Repository<EventRequest>,
  ) {}

  async getOverview() {
    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0,
      0,
    );
    const startOfTomorrow = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      0,
      0,
      0,
      0,
    );

    const [
      usersTotal,
      bookingsTotal,
      eventRequestsTotal,
      bookingsToday,
      bookingsUpcoming,
      eventRequestsToday,
      recentBookings,
      recentEventRequests,
    ] = await Promise.all([
      this.usersRepository.count(),
      this.bookingsRepository.count(),
      this.eventRequestsRepository.count(),
      this.bookingsRepository.count({
        where: {
          reservationDate: Between(startOfToday, startOfTomorrow),
        },
      }),
      this.bookingsRepository.count({
        where: {
          reservationDate: MoreThanOrEqual(now),
        },
      }),
      this.eventRequestsRepository.count({
        where: {
          eventDate: Between(startOfToday, startOfTomorrow),
        },
      }),
      this.bookingsRepository.find({
        order: { reservationDate: 'DESC' },
        take: 10,
      }),
      this.eventRequestsRepository.find({
        order: { eventDate: 'DESC' },
        take: 10,
      }),
    ]);

    const bookingsByStatusPairs = await Promise.all(
      Object.values(BookingStatus).map(async (status) => {
        const count = await this.bookingsRepository.count({ where: { status } });
        return [status, count] as const;
      }),
    );

    const eventRequestsByStatusPairs = await Promise.all(
      Object.values(EventRequestStatus).map(async (status) => {
        const count = await this.eventRequestsRepository.count({
          where: { status },
        });
        return [status, count] as const;
      }),
    );

    return {
      kpis: {
        usersTotal,
        bookingsTotal,
        eventRequestsTotal,
        bookingsToday,
        bookingsUpcoming,
        eventRequestsToday,
      },
      bookings: {
        byStatus: Object.fromEntries(bookingsByStatusPairs),
      },
      eventRequests: {
        byStatus: Object.fromEntries(eventRequestsByStatusPairs),
      },
      recent: {
        bookings: recentBookings,
        eventRequests: recentEventRequests,
      },
    };
  }
}
