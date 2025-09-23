import { User } from '../../users/entities/users.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('teams')
export class TeamEntity {
  @PrimaryGeneratedColumn() id: number;

  @Column({ unique: true }) name: string;

  @OneToMany(() => User, (user) => user.team)
  members: User[];
}
