import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiBody } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { PublicBookingDto } from './dto/public-booking.dto';

@ApiTags('bookings-public')
@Controller('bookings')
export class PublicBookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post('public')
  @ApiBody({
    type: PublicBookingDto,
    examples: {
      simpleBooking: {
        summary: 'Réservation publique simple',
        value: {
          reservationDate: '2026-03-20T20:00:00',
          guestsNumber: 2,
          firstName: 'Jean',
          lastName: 'Dupont',
          email: 'jean@example.com',
          phone: '0123456789',
          specialRequest: 'Table près de la fenêtre',
        },
      },
    },
  })
  async createPublic(@Body() publicBookingDto: PublicBookingDto) {
    return this.bookingsService.createPublic(publicBookingDto);
  }
}
