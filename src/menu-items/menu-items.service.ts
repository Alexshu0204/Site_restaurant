import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { MenuItem } from './entities/menu-item.entity';
import { Category } from '../categories/entities/category.entity';

// This file defines the MenuItemsService, which is responsible for handling all business logic related
// to menu items, including creating, retrieving, updating, and deleting menu items. It uses the TypeORM
// repository to interact with the database and performs necessary checks to ensure data integrity
// (like checking for existing categories before creating or updating a menu item). The service methods
// are called by the MenuItemsController to handle incoming HTTP requests.

@Injectable()
export class MenuItemsService {
  constructor(
    @InjectRepository(MenuItem)
    private readonly menuItemsRepository: Repository<MenuItem>,
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {}

  create(createMenuItemDto: CreateMenuItemDto) {
    return this.createMenuItem(createMenuItemDto);
  }

  findAll() {
    return this.menuItemsRepository.find({
      order: { id: 'ASC' },
      relations: { category: true },
    });
  }

  findOne(id: number) {
    return this.findMenuItemById(id);
  }

  update(id: number, updateMenuItemDto: UpdateMenuItemDto) {
    return this.updateMenuItem(id, updateMenuItemDto);
  }

  remove(id: number) {
    return this.removeMenuItem(id);
  }

  private async createMenuItem(createMenuItemDto: CreateMenuItemDto) {
    const category = await this.categoriesRepository.findOne({
      where: { id: createMenuItemDto.categoryId },
    });

    if (!category) {
      throw new NotFoundException('Categorie non trouvee.');
    }

    const menuItem = this.menuItemsRepository.create({
      name: createMenuItemDto.name,
      description: createMenuItemDto.description ?? null,
      price: createMenuItemDto.price,
      imageUrl: createMenuItemDto.imageUrl ?? null,
      isAvailable: createMenuItemDto.isAvailable ?? true,
      category,
    });

    return this.menuItemsRepository.save(menuItem);
  }

  private async findMenuItemById(id: number) {
    const item = await this.menuItemsRepository.findOne({
      where: { id },
      relations: { category: true },
    });

    if (!item) {
      throw new NotFoundException('Plat non trouve.');
    }

    return item;
  }

  private async updateMenuItem(
    id: number,
    updateMenuItemDto: UpdateMenuItemDto,
  ) {
    const item = await this.findMenuItemById(id);

    if (updateMenuItemDto.categoryId) {
      const category = await this.categoriesRepository.findOne({
        where: { id: updateMenuItemDto.categoryId },
      });

      if (!category) {
        throw new NotFoundException('Categorie non trouvee.');
      }

      item.category = category;
    }

    if (updateMenuItemDto.name !== undefined) {
      item.name = updateMenuItemDto.name;
    }
    if (updateMenuItemDto.description !== undefined) {
      item.description = updateMenuItemDto.description ?? null;
    }
    if (updateMenuItemDto.price !== undefined) {
      item.price = updateMenuItemDto.price;
    }
    if (updateMenuItemDto.imageUrl !== undefined) {
      item.imageUrl = updateMenuItemDto.imageUrl;
    }
    if (updateMenuItemDto.isAvailable !== undefined) {
      item.isAvailable = updateMenuItemDto.isAvailable;
    }

    return this.menuItemsRepository.save(item);
  }

  private async removeMenuItem(id: number) {
    const item = await this.findMenuItemById(id);
    await this.menuItemsRepository.remove(item);

    return { message: 'Plat supprime avec succes.' };
  }
}
