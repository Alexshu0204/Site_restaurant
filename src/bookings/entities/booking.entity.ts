import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum BookingStatus {
  Pending = 'pending',
  Confirmed = 'confirmed',
  Cancelled = 'cancelled',
}

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp' })
  reservationDate: Date; // Lunch or Dinner reservation time

  @CreateDateColumn({ type: 'timestamp' })
  bookedOn: Date; // The date and time when the booking was made

  @Column({ type: 'int' })
  guestsNumber: number;

  @Column({ type: 'text', nullable: true })
  specialRequest: string | null;

  @Column({ type: 'boolean', default: false })
  isMarketable: boolean;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.Pending,
  })
  status: BookingStatus;

  // Contact information (for public bookings)
  @Column({ type: 'varchar', length: 100, nullable: true })
  firstName: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  lastName: string | null;

  @Column({ type: 'varchar', length: 150, nullable: true })
  email: string | null;

  @Column({ type: 'varchar', length: 30, nullable: true })
  phone: string | null;

  // Relation to User (Many bookings can belong to one user)
  @ManyToOne(() => User, (user) => user.bookings, { onDelete: 'CASCADE', nullable: true })
  user: User | null;

  @Column({ nullable: true })
  userId: number | null; // Nullable to accommodate public bookings
}

