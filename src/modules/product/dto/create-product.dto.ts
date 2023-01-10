import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ProductCategory } from 'src/modules/product_category/entities/product_category.entity';

export class CreateProductDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  link: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  extract: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  composition: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  precautions: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  codeId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  provider: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  price: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  average_rate: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  locale: string;

  @ApiProperty({ required: false })
  @IsOptional()
  published_at: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  created_by: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  updated_by: number;

  @ApiProperty({ required: false })
  @IsOptional()
  created_at: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  updated_at: Date;
}
