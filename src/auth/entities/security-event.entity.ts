// This file defines the SecurityEvent entity, which represents security-related events
// in the application.

// The SecurityEvent entity is used to log important security events such as login attempts,
// password reset requests, and other authentication-related activities. This allows the application
// to maintain a record of security events for auditing and monitoring purposes.

import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('security_events')
export class SecurityEvent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 80 })
  type: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string | null;

  @Column({ type: 'varchar', length: 80, nullable: true })
  outcome: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  metadata: string | null;

  @CreateDateColumn()
  createdAt: Date;
}
