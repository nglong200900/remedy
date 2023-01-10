import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';
import { PaginationParam } from 'src/utils/paginationParam';
import { IsOptional } from 'class-validator';
import { productOption } from './productOption.dto';

export class productQuery extends IntersectionType(
  CreateProductDto,
  PaginationParam,
) {
  @ApiProperty({ required: false })
  @IsOptional()
  option: productOption;
}
