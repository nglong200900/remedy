import { IntersectionType } from '@nestjs/swagger';
import { PaginationParam } from 'src/utils/paginationParam';
import { CreateProductCategoryDto } from './create-product_category.dto';

export class productCategoryQuery extends IntersectionType(
  CreateProductCategoryDto,
  PaginationParam,
) {}
