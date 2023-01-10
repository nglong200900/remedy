import { PartialType } from '@nestjs/swagger';
import { CreateUserPermissionsUserDto } from './create-user-permissions_user.dto';

export class UpdateUserPermissionsUserDto extends PartialType(
  CreateUserPermissionsUserDto,
) {}
