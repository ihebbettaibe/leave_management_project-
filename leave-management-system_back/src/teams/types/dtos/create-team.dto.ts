import { IsString } from 'class-validator';

export class CreateTeamDto {
  @IsString() readonly name: string;
}
