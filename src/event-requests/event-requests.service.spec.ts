import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EventRequestsService } from './event-requests.service';
import { EventRequest } from './entities/event-request.entity';
import { User } from '../users/entities/user.entity';

describe('EventRequestsService', () => {
  let service: EventRequestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventRequestsService,
        { provide: getRepositoryToken(EventRequest), useValue: {} },
        { provide: getRepositoryToken(User), useValue: {} },
      ],
    }).compile();

    service = module.get<EventRequestsService>(EventRequestsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
