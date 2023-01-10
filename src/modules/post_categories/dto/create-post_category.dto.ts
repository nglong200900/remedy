import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePostCategoryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  locale: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  created_by: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  updated_by: number;
}
