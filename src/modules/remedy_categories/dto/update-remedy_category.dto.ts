import { PartialType } from '@nestjs/swagger';
import { CreateRemedyCategoryDto } from './create-remedy_category.dto';

export class UpdateRemedyCategoryDto extends PartialType(
  CreateRemedyCategoryDto,
) {}
