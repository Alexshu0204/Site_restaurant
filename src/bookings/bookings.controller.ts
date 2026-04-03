import {
  ApiBearerAuth,
  ApiBody,
  ApiTags,
} from '@nestjs/swagger';
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
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
//import { PublicBookingDto } from './dto/public-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { JwtAuthGuard as JwtAG } from 'src/auth/guards/jwt-auth.guard';
import { BookingStatus } from './entities/booking.entity';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

type AuthenticatedRequest = {
  user: {
    sub: number;
    role?: string;
  };
};

@ApiTags('bookings')
@ApiBearerAuth()
@UseGuards(JwtAG)
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @ApiBody({
    type: CreateBookingDto,
    examples: {
      dinnerForTwo: {
        summary: 'Reservation simple',
        value: {
          reservationDate: '2026-03-20T20:00:00',
          guestsNumber: 2,
          specialRequest: 'TABLE_WINDOW',
          isMarketable: false,
          status: BookingStatus.Pending,
        },
      },
      familyBooking: {
        summary: 'Reservation groupe',
        value: {
          reservationDate: '2026-03-22T12:30:00',
          guestsNumber: 6,
          specialRequest: 'CHILD_SEAT_NEEDED',
          isMarketable: true,
          status: BookingStatus.Pending,
        },
      },
    },
  })
  create(
    @Body() createBookingDto: CreateBookingDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.bookingsService.create(createBookingDto, req.user);
  }

  @Get()
  findAll(@Req() req: AuthenticatedRequest) {
    return this.bookingsService.findAll(req.user);
  }

  @Get('admin/all')
  @UseGuards(RolesGuard)
  @Roles('admin')
  findAllAdmin() {
    return this.bookingsService.findAllAdmin();
  }

  @Get('stats')
  @UseGuards(RolesGuard)
  @Roles('admin')
  getStats() {
    return this.bookingsService.getStats();
  }

  @Get('admin/stats')
  @UseGuards(RolesGuard)
  @Roles('admin')
  getAdminStats() {
    return this.bookingsService.getAdminStats();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req: AuthenticatedRequest) {
    return this.bookingsService.findOne(id, req.user);
  }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles('admin')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: 'confirmed' | 'cancelled',
  ) {
    return this.bookingsService.updateStatus(id, status);
  }

  @Patch(':id')
  @ApiBody({
    type: UpdateBookingDto,
    examples: {
      confirmBooking: {
        summary: 'Confirmer une reservation',
        value: {
          status: BookingStatus.Confirmed,
        },
      },
      rescheduleBooking: {
        summary: 'Changer date et convives',
        value: {
          reservationDate: '2026-03-25T21:00:00',
          guestsNumber: 4,
          specialRequest: 'QUIET_TABLE',
        },
      },
      cancelBooking: {
        summary: 'Annuler une reservation',
        value: {
          status: BookingStatus.Cancelled,
        },
      },
    },
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBookingDto: UpdateBookingDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.bookingsService.update(id, updateBookingDto, req.user);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: AuthenticatedRequest) {
    return this.bookingsService.remove(id, req.user);
  }
}
