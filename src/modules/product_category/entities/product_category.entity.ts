import { Product } from 'src/modules/product/entities/product.entity';
import Tags from 'src/tags.emun';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
@Entity(Tags.Product_category, { orderBy: { id: 'ASC' } })
export class ProductCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: null })
  created_by: number;

  @Column({ default: null })
  updated_by: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @ManyToMany(() => Product, (product) => product.product_category, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  products: Product[];
}
