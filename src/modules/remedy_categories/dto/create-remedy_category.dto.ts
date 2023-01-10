import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateRemedyCategoryDto {
  @ApiProperty({
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({
    type: Number,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  created_by: number;

  @ApiProperty({
    type: Number,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  updated_by: number;

  @ApiProperty({
    type: Date,
    required: false,
  })
  created_at: Date;

  @ApiProperty({
    type: Date,
    required: false,
  })
  updated_at: Date;
}
