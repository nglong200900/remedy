import { ApiProperty } from '@nestjs/swagger';
import { IsAlpha, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserPermissionsRoleDto {
  @ApiProperty({ description: 'role name', example: 'king' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'what the role is or how it should work',
    example: 'able to do something',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'role type/category', example: 'idk' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ readOnly: true })
  @IsOptional()
  @IsString()
  created_by: number;

  @ApiProperty({ readOnly: true })
  @IsOptional()
  @IsString()
  updated_by: number;
}
