import { IsInt, Min } from 'class-validator';

export class CreateBalanceDto {
  @IsInt() userId: number;
  @IsInt() leaveTypeId: number;
  @IsInt() year: number;
  @IsInt() @Min(0) carryover: number;
  @IsInt() @Min(0) used: number;
}
