import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

// The User entity represents the users of the application. It defines the structure of the users table in the database,
// including fields for email, password hash, and password reset information. The entity also includes a createdAt
// timestamp to track when each user was created.

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

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

  @CreateDateColumn()
  createdAt: Date;
}
