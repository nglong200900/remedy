import { IntersectionType } from '@nestjs/swagger';
import { PaginationParam } from 'src/utils/paginationParam';
import { CreateRemedyCategoryDto } from './create-remedy_category.dto';

export class RemedyCategoryQueryDto extends IntersectionType(
  CreateRemedyCategoryDto,
  PaginationParam,
) {}
