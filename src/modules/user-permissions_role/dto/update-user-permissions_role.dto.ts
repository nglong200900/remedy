import { PartialType } from '@nestjs/swagger';
import { CreateUserPermissionsRoleDto } from './create-user-permissions_role.dto';

export class UpdateUserPermissionsRoleDto extends PartialType(
  CreateUserPermissionsRoleDto,
) {}
