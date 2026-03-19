/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Transform } from 'class-transformer';
import {
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsString,
	Matches,
	MaxLength,
} from 'class-validator';

export class CreateContactDto {
	@Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
	@IsString()
	@IsNotEmpty()
	@MaxLength(120)
	@Matches(/^[^<>]*$/, {
		message: 'Le nom complet ne doit pas contenir de balises HTML.',
	})
	fullName: string;

	@Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
	@IsEmail()
	@MaxLength(150)
	email: string;

	@IsOptional()
	@Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
	@IsString()
	@MaxLength(30)
	@Matches(/^[0-9+().\s-]{6,30}$/, {
		message: 'Le numero de telephone est invalide.',
	})
	phone?: string | null;

	@Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
	@IsString()
	@IsNotEmpty()
	@MaxLength(150)
	@Matches(/^[^<>]*$/, {
		message: 'Le sujet ne doit pas contenir de balises HTML.',
	})
	subject: string;

	@Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
	@IsString()
	@IsNotEmpty()
	@MaxLength(3000)
	@Matches(/^[^<>]*$/, {
		message: 'Le message ne doit pas contenir de balises HTML.',
	})
	message: string;
}
