import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsAlpha } from 'class-validator';
import { UserPermissionsRole } from 'src/modules/user-permissions_role/entities/user-permissions_role.entity';
export class CreateUserPermissionsUserDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  username: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  email: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  provider: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  password: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  resetPasswordToken: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  confirmationToken: string;

  @ApiProperty({ required: false })
  @IsOptional()
  confirmed: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  blocked: boolean;

  @ApiHideProperty()
  @IsOptional()
  role: UserPermissionsRole;

  @ApiProperty({ required: false })
  @IsOptional()
  isCertified: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  phone: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsAlpha()
  lastName: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsAlpha()
  firstName: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  address: string;

  @ApiProperty({ required: false })
  @IsOptional()
  school: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  isValidPEF: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  isValidNC: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  isValidProfile: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  office: number;

  @ApiProperty({ required: false })
  @IsOptional()
  yearOfGraduation: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  average_rate: number;

  @ApiProperty({ required: false })
  @IsOptional()
  birthday: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  postalCode: string;

  @ApiProperty({ required: false })
  @IsOptional()
  city: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  cityName: string;

  @ApiProperty({ readOnly: true, required: false })
  created_at: Date;

  @ApiProperty({ readOnly: true, required: false })
  updated_at: Date;
}
