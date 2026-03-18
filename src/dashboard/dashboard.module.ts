import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { User } from '../users/entities/user.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { EventRequest } from '../event-requests/entities/event-request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Booking, EventRequest])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
