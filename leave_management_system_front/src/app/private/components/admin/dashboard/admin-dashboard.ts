import { Component, OnInit, effect, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';

interface DashboardStats {
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  totalLeaveTypes: number;
  activeHolidays: number;
}

interface RecentActivity {
  id: string;
  type: 'leave_request' | 'user_created' | 'holiday_added';
  message: string;
  timestamp: Date;
  status?: 'pending' | 'approved' | 'rejected';
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: false,
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css'],
})
export class AdminDashboard implements OnInit {
  UserCount = signal<number>(0);
  pendingLeaveRequestsCount = signal<number>(0);
  approuvedLeaveRequestsCount = signal<number>(0);
  rejectedLeaveRequestsCount = signal<number>(0);
  stats: DashboardStats = {
    pendingRequests: 8,
    approvedRequests: 23,
    rejectedRequests: 3,
    totalLeaveTypes: 9,
    activeHolidays: 12,
  };

  recentActivities: RecentActivity[] = [
    {
      id: '1',
      type: 'leave_request',
      message: 'John Doe submitted a sick leave request',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: 'pending'
    },
    {
      id: '2',
      type: 'user_created',
      message: 'New employee Sarah Wilson added to system',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    },
    {
      id: '3',
      type: 'leave_request',
      message: 'Maria Garcia annual leave approved',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      status: 'approved'
    }
  ];

  constructor(private router: Router, private apiService: ApiService) {
  }

  ngOnInit(): void {
    this.apiService.getAllUsersCount().subscribe(count => {
      this.UserCount.set(count);
    });

    this.apiService.getAllPendingRequests().subscribe(response => {
      this.pendingLeaveRequestsCount.set(response);
    });

    this.apiService.getAllRejectedRequests().subscribe(response => {
      this.rejectedLeaveRequestsCount.set(response);
    });

    this.apiService.getAllApprouvedRequests().subscribe(response => {
      this.approuvedLeaveRequestsCount.set(response);
    });
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  getActivityIcon(type: string): string {
    switch (type) {
      case 'leave_request': return '📝';
      case 'user_created': return '👤';
      case 'holiday_added': return '🎉';
      default: return '📋';
    }
  }

  formatTime(date: Date): string {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  }

  // Get color for activity status
  getStatusColor(status: string): string {
    switch (status) {
      case 'pending': return '#f39c12';
      case 'approved': return '#27ae60';  
      case 'rejected': return '#e74c3c';
      default: return '#95a5a6';
    }
  }
}
