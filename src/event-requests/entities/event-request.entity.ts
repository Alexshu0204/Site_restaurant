import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum EventRequestStatus {
	InquiryReceived = 'inquiry_received',
	QuoteSent = 'quote_sent',
	AwaitingClientConfirmation = 'awaiting_client_confirmation',
	Confirmed = 'confirmed',
	Declined = 'declined',
	Cancelled = 'cancelled',
}

@Entity('event_requests')
export class EventRequest {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'timestamp' })
	eventDate: Date;

	@Column({ type: 'varchar', length: 5 })
	startTime: string;

	@Column({ type: 'int' })
	participants: number;

	@Column({ type: 'varchar', length: 120 })
	spaceRequested: string;

	@Column({ type: 'varchar', length: 100 })
	eventType: string;

	@Column({ type: 'text', nullable: true })
	additionalNotes: string | null;

	@Column({
		type: 'enum',
		enum: EventRequestStatus,
		default: EventRequestStatus.InquiryReceived,
	})
	status: EventRequestStatus;

	@Column({ type: 'boolean', default: false })
	isProfessional: boolean;

	@Column({ type: 'text', nullable: true })
	message: string | null;

	@Column({ type: 'varchar', length: 100, nullable: true })
	contactLastName: string | null;

	@Column({ type: 'varchar', length: 100, nullable: true })
	contactFirstName: string | null;

	@Column({ type: 'varchar', length: 150, nullable: true })
	contactEmail: string | null;

	@Column({ type: 'varchar', length: 30, nullable: true })
	contactPhone: string | null;

	@CreateDateColumn({ type: 'timestamp' })
	bookedOn: Date;

	@ManyToOne(() => User, (user) => user.eventRequests, { onDelete: 'CASCADE' })
	user: User;

	@Column()
	userId: number;
}
