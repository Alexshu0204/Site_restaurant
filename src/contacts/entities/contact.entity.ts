/* eslint-disable prettier/prettier */
import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';

export enum ContactStatus {
	New = 'new',
	InProgress = 'in_progress',
	Closed = 'closed',
	Spam = 'spam',
}

@Entity('contacts')
export class Contact {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'varchar', length: 120 })
	fullName: string;

	@Column({ type: 'varchar', length: 150 })
	email: string;

	@Column({ type: 'varchar', length: 30, nullable: true })
	phone: string | null;

	@Column({ type: 'varchar', length: 150 })
	subject: string;

	@Column({ type: 'text' })
	message: string;

	@Column({
		type: 'enum',
		enum: ContactStatus,
		default: ContactStatus.New,
	})
	status: ContactStatus;

	@Column({ type: 'text', nullable: true })
	adminNotes: string | null;

	@Column({ type: 'timestamp', nullable: true })
	handledAt: Date | null;

	@CreateDateColumn({ type: 'timestamp' })
	createdAt: Date;

	@UpdateDateColumn({ type: 'timestamp' })
	updatedAt: Date;
}
