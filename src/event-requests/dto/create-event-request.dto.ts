import { Transform } from 'class-transformer';
import {
	IsBoolean,
	IsEmail,
	IsEnum,
	IsIn,
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsString,
	Matches,
	Max,
	MaxLength,
	Min,
} from 'class-validator';
import { EventRequestStatus } from '../entities/event-request.entity';

export const EVENT_REQUEST_MIN_PARTICIPANTS = 15;
export const EVENT_REQUEST_MAX_PARTICIPANTS = 80;

export const EVENT_REQUEST_START_TIMES = Array.from({ length: 33 }, (_, i) => {
	const totalMinutes = 7 * 60 + 30 + i * 30;
	const hours = Math.floor(totalMinutes / 60)
		.toString()
		.padStart(2, '0');
	const minutes = (totalMinutes % 60).toString().padStart(2, '0');
	return `${hours}:${minutes}`;
});

export const EVENT_REQUEST_SPACES = [
	'RESERVER_QUELQUES_TABLES_15_80',
	'PRIVATISER_SALLE_1ER_ETAGE_15_30',
	'PRIVATISER_SALLE_2_RDC_15_30',
	'PRIVATISER_SALLE_1_RDC_25_50',
] as const;

export class CreateEventRequestDto {
	@Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
	@IsString()
	@IsNotEmpty()
	@Matches(/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2})?)?/, {
		message: 'La date de l evenement doit etre un datetime ISO valide.',
	})
	eventDate: string;

	@Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
	@IsString()
	@IsIn(EVENT_REQUEST_START_TIMES)
	startTime: string;

	@IsInt()
	@Min(EVENT_REQUEST_MIN_PARTICIPANTS)
	@Max(EVENT_REQUEST_MAX_PARTICIPANTS)
	participants: number;

	@Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
	@IsString()
	@IsIn(EVENT_REQUEST_SPACES as unknown as string[])
	spaceRequested: string;

	@Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
	@IsString()
	@IsNotEmpty()
	@MaxLength(100)
	@Matches(/^[^<>]*$/, {
		message: 'Le type d evenement ne doit pas contenir de balises HTML.',
	})
	eventType: string;

	@IsOptional()
	@Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
	@IsString()
	@MaxLength(2000)
	@Matches(/^[^<>]*$/, {
		message: 'Les notes additionnelles ne doivent pas contenir de balises HTML.',
	})
	additionalNotes?: string | null;

	@IsOptional()
	@IsEnum(EventRequestStatus)
	status?: EventRequestStatus;

	@IsOptional()
	@IsBoolean()
	isProfessional?: boolean;

	@IsOptional()
	@Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
	@IsString()
	@MaxLength(2000)
	@Matches(/^[^<>]*$/, {
		message: 'Le message ne doit pas contenir de balises HTML.',
	})
	message?: string | null;

	@IsOptional()
	@Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
	@IsString()
	@MaxLength(100)
	@Matches(/^[^<>]*$/, {
		message: 'Le nom ne doit pas contenir de balises HTML.',
	})
	contactLastName?: string | null;

	@IsOptional()
	@Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
	@IsString()
	@MaxLength(100)
	@Matches(/^[^<>]*$/, {
		message: 'Le prenom ne doit pas contenir de balises HTML.',
	})
	contactFirstName?: string | null;

	@IsOptional()
	@Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
	@IsEmail()
	@MaxLength(150)
	contactEmail?: string | null;

	@IsOptional()
	@Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
	@IsString()
	@MaxLength(30)
	@Matches(/^[0-9+().\s-]{6,30}$/, {
		message: 'Le numero de telephone est invalide.',
	})
	contactPhone?: string | null;
}
