import { IsInt, Min } from 'class-validator';

export class AdjustBalanceDto {
  @IsInt() year: number;
  @IsInt() @Min(0) carryover: number;
  @IsInt() @Min(0) used: number;
}
