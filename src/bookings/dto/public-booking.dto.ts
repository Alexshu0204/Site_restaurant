/* eslint-disable prettier/prettier */
import { Transform } from 'class-transformer';
import {
	IsEmail,
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsString,
	Matches,
	Max,
	MaxLength,
	Min,
} from 'class-validator';
import { BOOKING_MAX_GUESTS } from './create-booking.dto';

export class PublicBookingDto {
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

	@Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
	@IsString()
	@IsNotEmpty()
	@MaxLength(100)
	@Matches(/^[^<>]*$/, {
		message: 'Le prenom ne doit pas contenir de balises HTML.',
	})
	firstName: string;

	@Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
	@IsString()
	@IsNotEmpty()
	@MaxLength(100)
	@Matches(/^[^<>]*$/, {
		message: 'Le nom ne doit pas contenir de balises HTML.',
	})
	lastName: string;

	@Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
	@IsEmail()
	email: string;

	@IsOptional()
	@Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
	@IsString()
	@MaxLength(30)
	@Matches(/^[0-9+().\s-]{6,30}$|^$/, {
		message: 'Le numero de telephone est invalide.',
	})
	phone?: string;

	@IsOptional()
	@Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
	@IsString()
	@MaxLength(1000)
	@Matches(/^[^<>]*$/, {
		message: 'La demande speciale ne doit pas contenir de balises HTML.',
	})
	specialRequest?: string | null;
}
