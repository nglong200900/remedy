import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
export class CreateRemedyDto {
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
  nameLatin: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  nameCommon: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  mainConstituents: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  mainEffects: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  precautionsForUse: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  botanicalDescriptons: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  drugs: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  nameId: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  about: string;

  @ApiProperty({
    type: Number,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  plant_family: number;

  @ApiProperty({
    type: Number,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  average_rate: number;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  locate: string;

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

  @ApiProperty({
    type: Date,
    required: false,
  })
  @IsOptional()
  updated_at: Date;
}
