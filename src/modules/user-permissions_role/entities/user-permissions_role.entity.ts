import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { UserPermissionsUser } from 'src/modules/user-permissions_user/entities/user-permissions_user.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user-permisstion_role')
export class UserPermissionsRole {
  @ApiProperty({ required: false })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ required: false })
  @Column()
  name: string;

  @ApiProperty({ required: false })
  @Column()
  description: string;

  @ApiProperty({ required: false })
  @Column()
  type: string;

  @ApiHideProperty()
  @Column({ nullable: true })
  created_by: number;

  @ApiHideProperty()
  @Column({ nullable: true })
  updated_by: number;

  @ApiHideProperty()
  @OneToMany(
    () => UserPermissionsUser,
    (user: UserPermissionsUser) => user.role,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
  )
  user: UserPermissionsUser[];
}
