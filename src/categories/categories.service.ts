import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

// The CategoriesService is responsible for handling all business logic related to categories,
// including creating, retrieving, updating, and deleting categories. It uses the TypeORM
// repository to interact with the database and performs necessary checks to ensure data
// integrity (like checking for existing categories before creating or updating). The service
// methods are called by the CategoriesController to handle incoming HTTP requests.

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {}

  create(createCategoryDto: CreateCategoryDto) {
    return this.createCategory(createCategoryDto);
  }

  findAll() {
    return this.categoriesRepository.find({
      order: { id: 'ASC' },
      relations: { menuItems: true },
    });
  }

  findOne(id: number) {
    return this.findCategoryById(id);
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return this.updateCategory(id, updateCategoryDto);
  }

  remove(id: number) {
    return this.removeCategory(id);
  }

  // The following private methods implement the actual logic for each operation, including
  // checking for existing categories to prevent duplicates and ensuring that categories exist
  // before updating or deleting them. This separation of concerns keeps the public methods
  // clean and focused on handling the interface, while the private methods handle the
  // business logic and database interactions.

  private async createCategory(createCategoryDto: CreateCategoryDto) {
    const existing = await this.categoriesRepository.findOne({
      where: { name: createCategoryDto.name },
    });

    if (existing) {
      throw new ConflictException('Cette categorie existe deja.');
    }

    const category = this.categoriesRepository.create({
      name: createCategoryDto.name,
    });
    return this.categoriesRepository.save(category);
  }

  private async findCategoryById(id: number) {
    const category = await this.categoriesRepository.findOne({
      where: { id },
      relations: { menuItems: true },
    });

    if (!category) {
      throw new NotFoundException('Categorie non trouvee.');
    }

    return category;
  }

  private async updateCategory(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findCategoryById(id);

    if (
      updateCategoryDto.name &&
      updateCategoryDto.name !== category.name
    ) {
      const existing = await this.categoriesRepository.findOne({
        where: { name: updateCategoryDto.name },
      });

      if (existing) {
        throw new ConflictException('Cette categorie existe deja.');
      }

      category.name = updateCategoryDto.name;
    }

    return this.categoriesRepository.save(category);
  }

  private async removeCategory(id: number) {
    const category = await this.findCategoryById(id);
    await this.categoriesRepository.remove(category);

    return { message: 'Categorie supprimee avec succes.' };
  }
}
