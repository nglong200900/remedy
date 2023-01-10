import { Post } from 'src/modules/posts/entities/post.entity';
import Tags from 'src/tags.emun';
import {
  Column,
  CreateDateColumn,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Entity } from 'typeorm/decorator/entity/Entity';
@Entity(Tags.Post_categrories)
export class PostCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  locale: string;

  @Column({ nullable: true })
  created_by: number;

  @Column({ nullable: true })
  updated_by: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToMany(() => Post, (post) => post.post_category, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  fav_post: Post[];
}
