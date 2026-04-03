import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { PublicBookingsController } from './public-bookings.controller';
import { Booking } from './entities/booking.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, User])],
  controllers: [BookingsController, PublicBookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
