import { IsOptional, IsString, IsInt, Min } from 'class-validator';

export class UpdateLeaveTypeDto {
  @IsOptional() @IsString() readonly name?: string;
  @IsOptional() @IsInt() @Min(0) readonly maxDays?: number;
}
