import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, Matches, MaxLength } from 'class-validator';

export class CreateUserDto {
	@Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	@MaxLength(100)
	@Matches(/^[^<>]*$/, {
		message: 'Le nom ne doit pas contenir de balises HTML.',
	})
	lastName?: string | null;

	@Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	@MaxLength(100)
	@Matches(/^[^<>]*$/, {
		message: 'Le prenom ne doit pas contenir de balises HTML.',
	})
	firstName?: string | null;

	@Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	@MaxLength(30)
	@Matches(/^[0-9+().\s-]{6,30}$/, {
		message: 'Le numero de telephone est invalide.',
	})
	phone?: string | null;
}
