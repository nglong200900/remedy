import { IntersectionType } from '@nestjs/swagger';
import { PaginationParam } from 'src/utils/paginationParam';
import { CreatePostCategoryDto } from './create-post_category.dto';

export class postCategrogiesQuery extends IntersectionType(
  CreatePostCategoryDto,
  PaginationParam,
) {}
