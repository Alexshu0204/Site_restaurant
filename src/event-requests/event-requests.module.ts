import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventRequestsService } from './event-requests.service';
import { EventRequestsController } from './event-requests.controller';
import { EventRequest } from './entities/event-request.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EventRequest, User])],
  controllers: [EventRequestsController],
  providers: [EventRequestsService],
})
export class EventRequestsModule {}
