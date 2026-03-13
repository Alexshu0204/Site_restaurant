// This file defines the Data Transfer Object (DTO) for creating a new menu item in the application.
// It uses class-validator decorators to enforce validation rules on the properties of the DTO.
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateMenuItemDto {
  @ApiProperty({
    example: 'Tiramisu maison',
    maxLength: 255,
    description: 'Nom commercial du plat.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({
    example: 'Creme mascarpone, cafe, cacao.',
    description: 'Description detaillee du plat.',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  description?: string | null;

  @ApiProperty({
    example: 950,
    description: 'Prix en centimes (950 = 9.50 EUR).',
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  price: number;

  @ApiPropertyOptional({
    example: 1450,
    description: 'Prix format gourmand en centimes. Null si le plat n\'a pas de format gourmand.',
    minimum: 0,
    nullable: true,
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  priceGourmand?: number | null;

  @ApiPropertyOptional({
    example: 'https://cdn.example.com/images/tiramisu.jpg',
    description: 'URL image du plat.',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  imageUrl?: string | null;

  @ApiPropertyOptional({
    example: true,
    description: 'Indique si le plat est disponible a la commande.',
  })
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;

  @ApiProperty({
    example: 2,
    description: 'Identifiant de la categorie associee.',
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  categoryId: number;
}
