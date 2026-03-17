import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Booking } from '../../bookings/entities/booking.entity';

// The User entity represents the users of the application. It defines the structure of the users table in the database,
// including fields for email, password hash, and password reset information. The entity also includes a createdAt
// timestamp to track when each user was created.

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  lastName: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  firstName: string | null;

  @Column({ type: 'varchar', length: 30, nullable: true })
  phone: string | null;

  @Column({ type: 'varchar', length: 150, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  passwordHash: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'user',
  })
  role: 'user' | 'admin';

  @Column({
    name: 'passwordresettokenhash',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  passwordResetTokenHash: string | null;

  @Column({
    name: 'passwordresetexpiresat',
    type: 'timestamp',
    nullable: true,
  })
  passwordResetExpiresAt: Date | null;

  // New fields for refresh token management

  @Column({
    name: 'refreshtokenhash',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  refreshTokenHash: string | null;

  @Column({
    name: 'refreshtokenexpiresat',
    type: 'timestamp',
    nullable: true,
  })
  refreshTokenExpiresAt: Date | null;

  // New fields for account lockout management

  // These fields are used to implement an account lockout mechanism after a certain
  // number of failed login attempts.
  // FailedLoginAttempts counts the number of consecutive failed login attempts, and
  // loginLockedUntil stores the timestamp until which the account is locked.

  @Column({
    name: 'failedloginattempts',
    type: 'int',
    default: 0,
  })
  failedLoginAttempts: number;

  @Column({
    name: 'loginlockeduntil',
    type: 'timestamp',
    nullable: true,
  })
  loginLockedUntil: Date | null;

  // This field tracks the timestamp of the last failed login attempt, which is used to determine
  // when to reset the failed login attempts counter.
  @Column({
    name: 'lastfailedloginat',
    type: 'timestamp',
    nullable: true,
  })
  lastFailedLoginAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  // Relation to Booking (One user can have many bookings)
  @OneToMany(() => Booking, (booking) => booking.user)
  bookings: Booking[];
}
