import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { EmployeeProfile } from './employee-profile.entity';
import { User } from '../../users/entities/users.entity';

@Entity('performances')
export class Performance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'profile_id' })
  profileId: number;

  @ManyToOne(() => EmployeeProfile, (profile) => profile.performances)
  @JoinColumn({ name: 'profile_id' })
  profile: EmployeeProfile;

  @Column({ name: 'review_period' })
  reviewPeriod: string;

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  rating: number;

  @Column({ type: 'text', nullable: true })
  goals: string;

  @Column({ type: 'text', nullable: true })
  achievements: string;

  @Column({ type: 'text', nullable: true })
  feedback: string;

  @Column({ name: 'reviewer_id', nullable: true })
  reviewerId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'reviewer_id' })
  reviewer: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
