import { Test, TestingModule } from '@nestjs/testing';
import { MenuItemsService } from './menu-items.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MenuItem } from './entities/menu-item.entity';
import { Category } from '../categories/entities/category.entity';

describe('MenuItemsService', () => {
  let service: MenuItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MenuItemsService,
        { provide: getRepositoryToken(MenuItem), useValue: {} },
        { provide: getRepositoryToken(Category), useValue: {} },
      ],
    }).compile();

    service = module.get<MenuItemsService>(MenuItemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
