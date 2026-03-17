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

  // Relation to User (Many bookings can belong to one user)
  @ManyToOne(() => User, (user) => user.bookings, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  userId: number; // To facilitate access to the user ID
}
