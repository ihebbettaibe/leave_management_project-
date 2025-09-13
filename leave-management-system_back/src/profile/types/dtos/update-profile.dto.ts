import {
  IsOptional,
  IsString,
  IsEnum,
  IsDateString,
  IsNumber,
} from 'class-validator';
import { Gender } from '../enums/gender.enum';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  department?: string;

  @IsOptional()
  @IsString()
  designation?: string;

  @IsOptional()
  @IsDateString()
  joinDate?: string;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  emergencyContact?: string;

  @IsOptional()
  @IsString()
  currentAddress?: string;

  @IsOptional()
  @IsNumber()
  workExperience?: number;

  @IsOptional()
  @IsString()
  idProofType?: string;

  @IsOptional()
  @IsString()
  idProofNumber?: string;
}
