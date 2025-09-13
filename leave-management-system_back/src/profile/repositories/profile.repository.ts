import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EmployeeProfile } from '../entities/employee-profile.entity';
import { CreateProfileDto } from '../types/dtos/create-profile.dto';
import { UpdateProfileDto } from '../types/dtos/update-profile.dto';

@Injectable()
export class ProfileRepository extends Repository<EmployeeProfile> {
  constructor(
    @InjectRepository(EmployeeProfile)
    private readonly repository: Repository<EmployeeProfile>,
    private dataSource: DataSource,
  ) {
    super(EmployeeProfile, dataSource.createEntityManager());
  }

  async findByUserId(userId: string): Promise<EmployeeProfile | null> {
    return this.repository.findOne({
      where: { userId },
      relations: ['user', 'activities', 'performances'],
    });
  }

  async findByEmployeeId(employeeId: string): Promise<EmployeeProfile | null> {
    return this.repository.findOne({
      where: { employeeId },
      relations: ['user'],
    });
  }

  async findAllProfiles(): Promise<EmployeeProfile[]> {
    return this.repository.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async createProfile(
    userId: string,
    profileData: CreateProfileDto,
  ): Promise<EmployeeProfile> {
    const profile = this.repository.create({
      userId,
      ...profileData,
      joinDate: new Date(profileData.joinDate),
      dateOfBirth: profileData.dateOfBirth
        ? new Date(profileData.dateOfBirth)
        : undefined,
    });
    return this.repository.save(profile);
  }

  async updateProfile(
    userId: string,
    updateData: UpdateProfileDto,
  ): Promise<EmployeeProfile> {
    const updatePayload: any = { ...updateData };
    if (updateData.joinDate) {
      updatePayload.joinDate = new Date(updateData.joinDate);
    }
    if (updateData.dateOfBirth) {
      updatePayload.dateOfBirth = new Date(updateData.dateOfBirth);
    }
    await this.repository.update({ userId }, updatePayload);
    const updated = await this.findByUserId(userId);
    if (!updated) throw new Error('Profile not found after update');
    return updated;
  }

  async findByDepartment(department: string): Promise<EmployeeProfile[]> {
    return this.repository.find({
      where: { department },
      relations: ['user'],
      order: { joinDate: 'ASC' },
    });
  }
}
