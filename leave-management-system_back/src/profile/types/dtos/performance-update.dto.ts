import {
  IsNumber,
  IsOptional,
  IsString,
  IsDateString,
  Min,
  Max,
} from 'class-validator';

export class PerformanceUpdateDto {
  @IsNumber()
  @Min(0)
  @Max(100)
  attendanceRate: number;

  @IsNumber()
  @Min(0)
  @Max(5)
  performanceScore: number;

  @IsNumber()
  @Min(0)
  activeProjects: number;

  @IsDateString()
  reviewDate: string;

  @IsOptional()
  @IsString()
  comments?: string;
}
