import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class userOption {
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  avatar: boolean;
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  roleOption: boolean;
}
