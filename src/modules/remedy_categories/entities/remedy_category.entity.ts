import { Remedy } from 'src/modules/remedies/entities/remedy.entity';
import Tags from 'src/tags.emun';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
@Entity(Tags.Remedy_categories, { orderBy: { id: 'ASC' } })
export class RemedyCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => Remedy, (remedy: Remedy) => remedy.remedy_category, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  remedy: Remedy;

  @Column({ default: null })
  created_by: number;

  @Column({ default: null })
  updated_by: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
