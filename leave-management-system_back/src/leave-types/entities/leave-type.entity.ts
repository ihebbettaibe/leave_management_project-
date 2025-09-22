import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('leave_types')
export class LeaveTypeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column('int', { name: 'max_days' })
  maxDays: number;
}
