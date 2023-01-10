import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateUploadFileDto {
  @ApiProperty({
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  alternativeText: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  caption: string;
  
  @ApiProperty({
    type: Number,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  width: number;

  @ApiProperty({
    type: Number,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  height: number;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  formats: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  hash: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  ext: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  mime: string;

  @ApiProperty({
    type: Number,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  size: number;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  url: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  previewUrl: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  provider: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  provider_metadata: string;

  @ApiProperty({
    type: Number,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  created_by: number;

  @ApiProperty({
    type: Number,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  updated_by: number;
}
