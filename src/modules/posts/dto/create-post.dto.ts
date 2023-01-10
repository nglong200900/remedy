import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  body: string;

  @ApiProperty({ required: false })
  @IsOptional()
  published_date: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  author: string;

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
}
