import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class productOption {
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  user: boolean;

  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  images: boolean;

  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  product_category: boolean;
}
