import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationParam } from 'src/utils/paginationParam';
import { CreatePostDto } from './create-post.dto';
import { postOption } from './postOption.dto';

export class postQuery extends IntersectionType(
  CreatePostDto,
  PaginationParam,
) {
  @ApiProperty({ required: false })
  @IsOptional()
  option: postOption;
}
