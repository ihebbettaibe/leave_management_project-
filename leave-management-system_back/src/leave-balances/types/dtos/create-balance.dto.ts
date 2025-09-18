import { IsInt, Min, IsString } from 'class-validator';

export class CreateBalanceDto {
  @IsString() userId: string; // UUID string
  @IsInt() leaveTypeId: number;
  @IsInt() year: number;
  @IsInt() @Min(0) carryover: number;
  @IsInt() @Min(0) used: number;
}
