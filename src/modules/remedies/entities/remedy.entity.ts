import { RemedyCategory } from 'src/modules/remedy_categories/entities/remedy_category.entity';
import { UploadFile } from 'src/modules/upload_file/entities/upload_file.entity';
import { UserPermissionsUser } from 'src/modules/user-permissions_user/entities/user-permissions_user.entity';
import Tags from 'src/tags.emun';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity(Tags.Remedies, { orderBy: { id: 'ASC' } })
export class Remedy {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  nameLatin: string;

  @Column()
  nameCommon: string;

  @Column()
  mainConstituents: string;

  @Column()
  mainEffects: string;

  @Column()
  precautionsForUse: string;

  @Column()
  botanicalDescriptons: string;

  @Column()
  drugs: string;

  @Column()
  nameId: string;

  @Column()
  about: string;

  @Column()
  plant_family: number;

  @ManyToMany(
    () => RemedyCategory,
    (remedy_category: RemedyCategory) => remedy_category.remedy,
  )
  @JoinTable()
  remedy_category: RemedyCategory[];

  @ManyToMany(
    () => UserPermissionsUser,
    (user: UserPermissionsUser) => user.fav_remedies,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
  )
  @JoinColumn()
  user: UserPermissionsUser;

  @OneToMany(() => UploadFile, (image: UploadFile) => image.remedy, {
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  images: UploadFile[];

  @Column()
  average_rate: number;

  @Column()
  locate: string;

  @Column({ default: null })
  created_by: number;

  @Column({ default: null })
  updated_by: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
