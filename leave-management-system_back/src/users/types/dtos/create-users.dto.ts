import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsNumber } from 'class-validator';
export class CreateUsersDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @ApiPropertyOptional()
  fullname: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  roles: string[];

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  profilePictureUrl: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  bio: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  address: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  dateOfBirth: string;
}
