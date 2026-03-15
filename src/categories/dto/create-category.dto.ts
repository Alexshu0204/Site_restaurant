// This file defines the Data Transfer Object (DTO) for creating a new category in the application.
// It uses class-validator decorators to enforce validation rules on the incoming data, ensuring
// that the 'name' property is a non-empty string with a maximum length of 50 characters.
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCategoryDto {
	@ApiProperty({
		example: 'Desserts',
		maxLength: 50,
		description: 'Nom de la categorie visible sur la carte.',
	})
	@IsString()
	@IsNotEmpty()
	@MaxLength(50)
	name: string;
}
