import 'dotenv/config';
import { DataSource } from 'typeorm';
import { SecurityEvent } from '../auth/entities/security-event.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { Category } from '../categories/entities/category.entity';
import { Contact } from '../contacts/entities/contact.entity';
import { EventRequest } from '../event-requests/entities/event-request.entity';
import { MenuItem } from '../menu-items/entities/menu-item.entity';
import { User } from '../users/entities/user.entity';

// Create and export a new DataSource instance for TypeORM configuration
export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? '127.0.0.1',
  port: Number(process.env.DB_PORT ?? '5432'),
  username: process.env.DB_USER ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'postgres',
  database: process.env.DB_NAME ?? 'le-general',
  entities: [
    User,
    SecurityEvent,
    Category,
    MenuItem,
    Booking,
    EventRequest,
    Contact,
  ],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false, // Note: Set to true for development, but should
  // be false in production to avoid data loss
});
