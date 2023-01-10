import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class remedyOption {
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  user: boolean;

  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  images: boolean;

  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  remedy_category: boolean;
}
