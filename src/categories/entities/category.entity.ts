import {
  Entity,
  PrimaryGeneratedColumn as PGC,
  Column,
  OneToMany,
} from 'typeorm';
import type { Relation } from 'typeorm';
import type { MenuItem } from '../../menu-items/entities/menu-item.entity';

@Entity('categories')
export class Category {
  @PGC()
  id: number;

  @Column({ length: 50 })
  name: string;

  // Establish a one-to-many relationship with MenuItem. A category can have multiple menu
  // items, but each menu item belongs to one category.
  @OneToMany('MenuItem', 'category')
  menuItems: Relation<MenuItem[]>;
}
