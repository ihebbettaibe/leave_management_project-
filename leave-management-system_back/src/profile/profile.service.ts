import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { ProfileRepository } from './repositories/profile.repository';
import { PerformanceRepository } from './repositories/performance.repository';
import { ActivityRepository } from './repositories/activity.repository';
import { CreateProfileDto } from './types/dtos/create-profile.dto';
import { UpdateProfileDto } from './types/dtos/update-profile.dto';
import { PerformanceUpdateDto } from './types/dtos/performance-update.dto';
import { User } from '../users/entities/users.entity';
import { UserRole } from '../users/types/enums/user-role.enum';
import { ActivityType } from './types/enums/activity-type.enum';
// import { LeaveRepository } from '../leaves/repositories/leave.repository';

@Injectable()
export class ProfileService {
  constructor(
    private profileRepository: ProfileRepository,
  public performanceRepository: PerformanceRepository,
  public activityRepository: ActivityRepository,
  // private leaveRepository: LeaveRepository,
  ) {}

  async createProfile(
    userId: string,
    createProfileDto: CreateProfileDto,
    createdBy: User,
  ) {
    if (!createdBy.roles?.includes(UserRole.HR)) {
      throw new ForbiddenException('Only HR can create employee profiles');
    }

    const existingProfile = await this.profileRepository.findByEmployeeId(
      createProfileDto.employeeId,
    );
    if (existingProfile) {
      throw new ForbiddenException('Employee ID already exists');
    }

    const profile = await this.profileRepository.createProfile(
      userId,
      createProfileDto,
    );

    // Create initial activity
    await this.activityRepository.createActivity({
      userId,
      type: ActivityType.PROMOTION,
      title: `Joined as ${createProfileDto.designation}`,
      description: `Joined ${createProfileDto.department} department`,
    });

    return profile;
  }

  async getProfile(userId: string, requestingUser: User) {
    const profile = await this.profileRepository.findByUserId(userId);
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    // Check access permissions
    if (!this.canAccessProfile(userId, requestingUser)) {
      throw new ForbiddenException('Access denied');
    }

    return profile;
  }

  async getFullProfile(userId: string, requestingUser: User) {
    const profile = await this.getProfile(userId, requestingUser);

    // Get additional data
    const [performance, recentActivities, leaveBalance] = await Promise.all([
      this.performanceRepository.getLatestPerformance(userId),
      this.activityRepository.getRecentActivities(userId, 5),
      this.getLeaveBalanceOverview(userId),
    ]);

    return {
      profile,
      performance,
      recentActivities,
      leaveBalance,
    };
  }

  async updateProfile(
    userId: string,
    updateData: UpdateProfileDto,
    updatedBy: User,
  ) {
    // Only HR, managers, or the user themselves can update profile
    if (updatedBy.roles?.includes(UserRole.EMPLOYEE) && String(updatedBy.id) !== String(userId)) {
      throw new ForbiddenException('You can only update your own profile');
    }

    const profile = await this.profileRepository.updateProfile(
      userId,
      updateData,
    );

    // Log activity
    await this.activityRepository.createActivity({
      userId,
      type: ActivityType.TRAINING, // Generic update activity
      title: 'Profile Updated',
      description: 'Employee profile information was updated',
    });

    return profile;
  }

  async updatePerformance(
    userId: string,
    performanceDto: PerformanceUpdateDto,
    reviewerId: number,
  ) {
    const performance = await this.performanceRepository.createPerformance({
      userId,
      ...performanceDto,
      reviewerId,
      reviewDate: new Date(performanceDto.reviewDate),
    });

    // Log activity
    await this.activityRepository.createActivity({
      userId,
      type: ActivityType.PERFORMANCE_REVIEW,
      title: 'Completed Q3 Performance Review',
      description: `Performance score: ${performanceDto.performanceScore}/5.0`,
    });

    return performance;
  }

  async getLeaveBalanceOverview(userId: string) {
    const profile = await this.profileRepository.findByUserId(userId);
    if (!profile) return null;

    // annualLeaveBalance and sickLeaveBalance do not exist on User, so we comment these out
    return {
      annual: {
        total: 0, // profile.user.annualLeaveBalance + this.getUsedLeaves(userId, 'annual'),
        used: await this.getUsedLeaves(userId, 'annual'),
        remaining: 0, // profile.user.annualLeaveBalance,
      },
      sick: {
        total: 0, // profile.user.sickLeaveBalance + this.getUsedLeaves(userId, 'sick'),
        used: await this.getUsedLeaves(userId, 'sick'),
        remaining: 0, // profile.user.sickLeaveBalance,
      },
      personal: {
        total: 15,
        used: await this.getUsedLeaves(userId, 'emergency'),
        remaining: 15 - (await this.getUsedLeaves(userId, 'emergency')),
      },
    };
  }

  private async getUsedLeaves(
    userId: string,
    leaveType: string,
  ): Promise<number> {
    // This would integrate with leave repository to calculate used leaves
    const currentYear = new Date().getFullYear();
    // Implementation would fetch approved leaves for current year
    return 0; // Placeholder
  }

  private canAccessProfile(
    profileUserId: string,
    requestingUser: User,
  ): boolean {
    // HR can access all profiles
    if (requestingUser.roles?.includes(UserRole.HR)) return true;

    // Users can access their own profile
    if (String(requestingUser.id) === String(profileUserId)) return true;

    // Managers can access their team members' profiles
    if (requestingUser.roles?.includes(UserRole.MANAGER)) {
      // This would need to check if the profile user reports to this manager
      return true; // Simplified for now
    }

    return false;
  }

  async getDashboardData(userId: string) {
    const profile = await this.profileRepository.findByUserId(userId);
    const performance: any = await this.performanceRepository.getLatestPerformance(userId);
    const recentActivities = await this.activityRepository.getRecentActivities(
      userId,
      4,
    );
    const leaveBalance = await this.getLeaveBalanceOverview(userId);

    if (!profile) return null;
    return {
      employeeInfo: {
        department: profile.department,
        designation: profile.designation,
        joinDate: profile.joinDate,
        employeeId: profile.employeeId,
        yearsOfService: profile.yearsOfService,
        gender: profile.gender,
      },
      contactInfo: {
        email: profile.user?.email,
        phone: profile.phone,
        emergencyContact: profile.emergencyContactName,
        address: profile.address,
      },
      performance: (performance && typeof performance.toOverview === 'function')
        ? performance.toOverview()
        : {
            attendanceRate: 0,
            performanceScore: 0,
            activeProjects: 0,
          },
      leaveBalance,
      recentActivities: recentActivities?.map((activity) =>
        activity.toSummary(),
      ) || [],
    };
  }
}
