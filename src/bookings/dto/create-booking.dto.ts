/* eslint-disable prettier/prettier */
import { Transform } from 'class-transformer';
import {
	IsBoolean,
	IsEnum,
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsString,
	Matches,
	Max,
	MaxLength,
	Min,
} from 'class-validator';
import { BookingStatus } from '../entities/booking.entity';

export const BOOKING_MAX_GUESTS = 12;

export class CreateBookingDto {
	@Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
	@IsString()
	@IsNotEmpty()
	@Matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?/, {
		message: 'La date de reservation doit etre un ISO datetime valide.',
	})
	reservationDate: string;

	@IsInt()
	@Min(1)
	@Max(BOOKING_MAX_GUESTS)
	guestsNumber: number;

	@IsOptional()
	@Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
	@IsString()
	@MaxLength(1000)
	@Matches(/^[^<>]*$/, {
		message: 'La demande speciale ne doit pas contenir de balises HTML.',
	})
	specialRequest?: string | null;

	@IsOptional()
	@IsBoolean()
	isMarketable?: boolean;

	@IsOptional()
	@IsEnum(BookingStatus)
	status?: BookingStatus;
}
