import { IsString, IsOptional } from 'class-validator';

export class UpdateTeamDto {
  @IsOptional() @IsString() readonly name?: string;
}
