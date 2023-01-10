import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { PaginationParam } from '../../../utils/paginationParam';

export class roleQuery extends PaginationParam {
  @ApiProperty({ required: false })
  @IsOptional()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  description: string;

  @ApiProperty({ required: false })
  @IsOptional()
  type: string;
}
