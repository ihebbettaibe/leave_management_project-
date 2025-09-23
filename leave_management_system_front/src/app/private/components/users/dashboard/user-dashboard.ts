import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeData } from '../../../types/user/profileType/employee-data.type';
import { LeaveData } from '../../../types/user/profileType/leave-data.type';
import { ApiService, DashboardData } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './user-dashboard.html',
  styleUrls: ['./user-dashboard.css'],
})
export class Dashboard implements OnInit {
  employeeData: EmployeeData = {
    id: '',
    name: '',
    role: 'employee',
    department: '',
    email: '',
    phone: '',
    joinDate: '',
    experience: '',
    status: '',
  };

  leaveData: LeaveData = {
    annual: { total: 0, used: 0, remaining: 0 },
    sick: { total: 0, used: 0, remaining: 0 },
    personal: { total: 0, used: 0, remaining: 0 },
  };

  isLoading = true;
  error: string | null = null;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.isLoading = true;
    this.error = null;

    this.apiService.getDashboardData().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.updateEmployeeData(response.data);
          this.updateLeaveData(response.data);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
        this.error = 'Failed to load dashboard data. Please try again.';
        this.isLoading = false;
        
        // Fallback to current user info
        const currentUser = this.authService.getCurrentUser();
        if (currentUser) {
          this.employeeData.name = `${currentUser.firstName} ${currentUser.lastName}`;
          this.employeeData.email = currentUser.email;
        }
      }
    });
  }

  private updateEmployeeData(data: DashboardData): void {
    const currentUser = this.authService.getCurrentUser();
    
    this.employeeData = {
      id: data.employeeInfo.employeeId || '',
      name: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Unknown User',
      role: currentUser?.roles?.[0] || 'employee',
      department: data.employeeInfo.department || 'N/A',
      email: data.contactInfo.email || currentUser?.email || '',
      phone: data.contactInfo.phone || '',
      joinDate: data.employeeInfo.joinDate ? new Date(data.employeeInfo.joinDate).toLocaleDateString() : '',
      experience: data.employeeInfo.workExperience || '0 Years',
  status: 'Active',
    };
  }

  private updateLeaveData(data: DashboardData): void {
    if (data.leaveBalance) {
      this.leaveData = {
        annual: {
          total: data.leaveBalance.annual?.total || 0,
          used: data.leaveBalance.annual?.used || 0,
          remaining: data.leaveBalance.annual?.remaining || 0,
        },
        sick: {
          total: data.leaveBalance.sick?.total || 0,
          used: data.leaveBalance.sick?.used || 0,
          remaining: data.leaveBalance.sick?.remaining || 0,
        },
        personal: {
          total: data.leaveBalance.personal?.total || 0,
          used: data.leaveBalance.personal?.used || 0,
          remaining: data.leaveBalance.personal?.remaining || 0,
        },
      };
    }
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  refreshData(): void {
    this.loadDashboardData();
  }
}