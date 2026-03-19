import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString, Matches, MaxLength } from 'class-validator';
import { ContactStatus } from '../entities/contact.entity';

export class UpdateContactDto {
	@IsOptional()
	@IsEnum(ContactStatus)
	status?: ContactStatus;

	@IsOptional()
	@Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
	@IsString()
	@MaxLength(2000)
	@Matches(/^[^<>]*$/, {
		message: 'Les notes admin ne doivent pas contenir de balises HTML.',
	})
	adminNotes?: string | null;
}
