import { PartialType } from '@nestjs/swagger';
import { CreatePostCategoryDto } from './create-post_category.dto';

export class UpdatePostCategroryDto extends PartialType(
  CreatePostCategoryDto,
) {}
