import { Module } from '@nestjs/common';
import { UserPermissionsRoleService } from './user-permissions_role.service';
import { UserPermissionsRoleController } from './user-permissions_role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPermissionsRole } from './entities/user-permissions_role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserPermissionsRole])],
  controllers: [UserPermissionsRoleController],
  providers: [UserPermissionsRoleService],
})
export class UserPermissionsRoleModule {}
