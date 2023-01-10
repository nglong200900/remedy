import { PostCategory } from 'src/modules/post_categories/entities/post_category.entity';
import { UploadFile } from 'src/modules/upload_file/entities/upload_file.entity';
import { UserPermissionsUser } from 'src/modules/user-permissions_user/entities/user-permissions_user.entity';
import Tags from 'src/tags.emun';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity(Tags.Post)
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  body: string;

  @Column({ type: 'timestamp', nullable: true })
  published_date: Date;

  @Column({ nullable: true })
  author: string;

  @Column({ nullable: true })
  locale: string;

  @Column({ type: 'timestamp', nullable: true })
  published_at: Date;

  @Column({ nullable: true })
  created_by: number;

  @Column({ nullable: true })
  updated_by: number;

  @ManyToMany(
    () => UserPermissionsUser,
    (User: UserPermissionsUser) => User.fav_posts,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
  )
  @JoinColumn()
  user: UserPermissionsUser;

  @ManyToMany(
    () => PostCategory,
    (post_category: PostCategory) => post_category.fav_post,
  )
  @JoinTable()
  post_category: PostCategory[];

  @ManyToMany(() => UploadFile, (images: UploadFile) => images.posts)
  @JoinTable()
  images: UploadFile[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
