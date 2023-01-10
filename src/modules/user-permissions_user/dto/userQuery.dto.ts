import { IsAlpha, IsEmail, IsOptional, IsString } from 'class-validator';
import { PaginationParam } from '../../../utils/paginationParam';
import { CreateUserPermissionsUserDto } from 'src/modules/user-permissions_user/dto/create-user-permissions_user.dto';
import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { userOption } from './userOption.dto';

export class userQuery extends IntersectionType(
  CreateUserPermissionsUserDto,
  PaginationParam,
) {
  @ApiProperty({ required: false })
  @IsOptional()
  option: userOption;
}
