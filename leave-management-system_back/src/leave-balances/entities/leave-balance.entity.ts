import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Unique,
} from 'typeorm';
import { User } from '../../users/entities/users.entity';
import { LeaveTypeEntity } from '../../leave-types/entities/leave-type.entity';

@Entity('leave_balances')
@Unique(['user', 'leaveType', 'year'])
export class LeaveBalanceEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.id, { eager: true })
  user: User;

  @ManyToOne(() => LeaveTypeEntity, (lt) => lt.id, { eager: true })
  leaveType: LeaveTypeEntity;

  @Column('int')
  year: number;

  @Column('int')
  carryover: number;

  @Column('int')
  used: number;
}
