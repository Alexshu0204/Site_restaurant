import {
  Entity,
  PrimaryGeneratedColumn as PGC,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
// foreign key to category
import type { Category } from '../../categories/entities/category.entity';

@Entity('menu_items')
export class MenuItem {
  @PGC()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'int' })
  price: number; // Price in centimes as planned

  @Column({ type: 'int', nullable: true })
  priceGourmand: number | null; // Prix format gourmand en centimes (null si pas de format)

  @Column({ type: 'varchar', length: 255, nullable: true })
  imageUrl: string | null;

  @Column({ default: true })
  isAvailable: boolean;

  // Many menu items can belong to one category. This sets up the foreign key relationship.

  // if a category is deleted, its menu items will also be deleted (cascade delete)
  @ManyToOne('Category', 'menuItems', {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'categoryId' })
  category: Relation<Category>;
}
