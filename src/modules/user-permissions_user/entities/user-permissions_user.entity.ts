import { Exclude } from 'class-transformer';
import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  UpdateDateColumn,
} from 'typeorm';
import { Column } from 'typeorm/decorator/columns/Column';
import { PrimaryGeneratedColumn } from 'typeorm/decorator/columns/PrimaryGeneratedColumn';
import { UserPermissionsRole } from '../../user-permissions_role/entities/user-permissions_role.entity';
import { Remedy } from 'src/modules/remedies/entities/remedy.entity';
import { Post } from 'src/modules/posts/entities/post.entity';
import { UploadFile } from 'src/modules/upload_file/entities/upload_file.entity';
import { Product } from 'src/modules/product/entities/product.entity';

@Entity('user-permisstion_user')
export class UserPermissionsUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  provider: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column({ nullable: true })
  @Exclude({ toPlainOnly: true })
  resetPasswordToken: string;

  @Column({ nullable: true })
  @Exclude({ toPlainOnly: true })
  confirmationToken: string;

  @Column({ nullable: true })
  @Exclude({ toPlainOnly: true })
  confirmed: boolean;

  @Column({ nullable: true })
  @Exclude({ toPlainOnly: true })
  blocked: boolean;

  @ManyToOne(
    () => UserPermissionsRole,
    (role: UserPermissionsRole) => role.user,
    { onDelete: 'SET NULL' },
  )
  @JoinColumn()
  role: UserPermissionsRole;

  @ManyToMany(() => Remedy, (remedy: Remedy) => remedy.user)
  @JoinTable()
  fav_remedies: Remedy[];

  @ManyToMany(() => Post, (post: Post) => post.user)
  @JoinTable()
  fav_posts: Post[];

  @ManyToMany(() => Product, (product: Product) => product.user)
  @JoinTable()
  fav_product: Product[];

  @OneToOne(() => UploadFile, (image: UploadFile) => image.user, {
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  avatar: UploadFile;

  @Column({ nullable: true })
  @Exclude({ toPlainOnly: true })
  isCertified: boolean;

  @Column({ nullable: true })
  phone: number;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  school: number;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  @Exclude({ toPlainOnly: true })
  isValidPEF: boolean;

  @Column({ nullable: true })
  @Exclude({ toPlainOnly: true })
  isValidNC: boolean;

  @Column({ nullable: true })
  @Exclude({ toPlainOnly: true })
  isValidProfile: boolean;

  @Column({ nullable: true })
  office: number;

  @Column({ type: 'timestamp', nullable: true })
  yearOfGraduation: Date;

  @Column({ nullable: true })
  average_rate: number;

  @Column({ type: 'timestamp', nullable: true })
  birthday: string;

  @Column({ nullable: true })
  postalCode: string;

  @Column({ nullable: true })
  city: number;

  @Column({ nullable: true })
  cityName: string;

  @Column({ nullable: true })
  created_by: number;

  @Column({ nullable: true })
  updated_by: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({
    nullable: true,
  })
  @Exclude()
  public currentHashedRefreshToken?: string;
}
