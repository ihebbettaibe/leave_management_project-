import { IsString, IsInt, Min } from 'class-validator';

export class CreateLeaveTypeDto {
  @IsString() readonly name: string;
  @IsInt() @Min(0) readonly maxDays: number;
}
