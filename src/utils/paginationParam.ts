import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class PaginationParam {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  offset: number;

  @ApiProperty({ required: false, readOnly: true })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit: number;

  @ApiProperty({ required: false, readOnly: true })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page: number;
}
