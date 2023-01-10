import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { PaginationParam } from 'src/utils/paginationParam';
import { CreateRemedyDto } from './create-remedy.dto';
import { remedyOption } from './remedyOption.dto';
export class remedyQueryDto extends IntersectionType(
  CreateRemedyDto,
  PaginationParam,
) {
  @ApiProperty({ required: false })
  @IsOptional()
  option: remedyOption;
}
