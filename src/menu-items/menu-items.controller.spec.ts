import { Test, TestingModule } from '@nestjs/testing';
import { MenuItemsController } from './menu-items.controller';
import { MenuItemsService } from './menu-items.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MenuItem } from './entities/menu-item.entity';
import { Category } from '../categories/entities/category.entity';

describe('MenuItemsController', () => {
  let controller: MenuItemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MenuItemsController],
      providers: [
        MenuItemsService,
        { provide: getRepositoryToken(MenuItem), useValue: {} },
        { provide: getRepositoryToken(Category), useValue: {} },
      ],
    }).compile();

    controller = module.get<MenuItemsController>(MenuItemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
