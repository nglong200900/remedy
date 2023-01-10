import { Remedy } from 'src/modules/remedies/entities/remedy.entity';
import { Post } from 'src/modules/posts/entities/post.entity';
import { Product } from 'src/modules/product/entities/product.entity';
import { UserPermissionsUser } from 'src/modules/user-permissions_user/entities/user-permissions_user.entity';
import Tags from 'src/tags.emun';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ManyToOne } from 'typeorm/decorator/relations/ManyToOne';
@Entity(Tags.UploadFile, { orderBy: { id: 'ASC' } })
export class UploadFile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: null })
  name: string;

  @Column({ default: null })
  alternativeText: string;

  @Column({ default: null })
  caption: string;

  @Column({ default: null })
  width: number;

  @Column({ default: null })
  height: number;

  @Column({ default: null })
  formats: string;

  @Column({ default: null })
  hash: string;

  @Column({ default: null })
  ext: string;

  @Column({ default: null })
  mime: string;

  @Column({ default: null })
  size: number;

  @Column()
  url: string;

  @Column({ default: null })
  previewUrl: string;

  @Column()
  provider: string;

  @Column({ default: null })
  provider_metadata: string;

  @OneToOne(
    () => UserPermissionsUser,
    (user: UserPermissionsUser) => user.avatar,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
  )
  user: UserPermissionsUser;

  @ManyToOne(() => Remedy, (remedy: Remedy) => remedy.images, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  remedy: Remedy;

  @ManyToMany(() => Post, (Post: Post) => Post.images, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  posts: Post;

  @ManyToMany(() => Product, (product: Product) => product.images, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  product: Product;

  @Column()
  created_by: number;

  @Column({ default: null })
  updated_by: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
