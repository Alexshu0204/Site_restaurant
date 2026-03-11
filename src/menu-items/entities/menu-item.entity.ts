import {
  Entity,
  PrimaryGeneratedColumn as PGC,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
// foreign key to category
import { Category } from '../../categories/entities/category.entity';

@Entity('menu_items')
export class MenuItem {
  @PGC()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'int' })
  price: number; // Price in centimes as planned

  @Column({ type: 'varchar', length: 255, nullable: true })
  imageUrl: string | null;

  @Column({ default: true })
  isAvailable: boolean;

  // Many menu items can belong to one category. This sets up the foreign key relationship.

  // if a category is deleted, its menu items will also be deleted (cascade delete)
  @ManyToOne(() => Category, (category) => category.menuItems, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'categoryId' })
  category: Category;
}
