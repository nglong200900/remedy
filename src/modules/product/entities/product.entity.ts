import { ProductCategory } from 'src/modules/product_category/entities/product_category.entity';
import { UploadFile } from 'src/modules/upload_file/entities/upload_file.entity';
import { UserPermissionsUser } from 'src/modules/user-permissions_user/entities/user-permissions_user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { JoinColumn } from 'typeorm/decorator/relations/JoinColumn';

@Entity('product')
@Unique(['name'])
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  link: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  extract: string;

  @Column({ nullable: true })
  composition: string;

  @Column({ nullable: true })
  precautions: string;

  @Column({ nullable: true })
  codeId: string;

  @Column({ nullable: true })
  provider: number;

  @Column()
  price: number;

  @Column({ nullable: true })
  average_rate: number;

  @Column({ nullable: true })
  locale: string;

  @ManyToMany(
    () => ProductCategory,
    (product_category: ProductCategory) => product_category.products,
  )
  @JoinTable()
  product_category: ProductCategory[];

  @ManyToMany(() => UploadFile, (image: UploadFile) => image.product)
  @JoinTable()
  images: UploadFile[];

  @ManyToMany(() => UserPermissionsUser, (user) => user.fav_product, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  user: UserPermissionsUser;

  @Column({ type: 'timestamp', nullable: true })
  published_at: Date;

  @Column({ nullable: true })
  created_by: number;

  @Column({ nullable: true })
  updated_by: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
