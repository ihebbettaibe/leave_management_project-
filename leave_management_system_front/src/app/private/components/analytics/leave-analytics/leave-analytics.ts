import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';

interface LeaveTrend {
  month: string;
  approved: number;
  pending: number;
  rejected: number;
}

interface DepartmentStats {
  department: string;
  totalLeaves: number;
  approvedLeaves: number;
  pendingLeaves: number;
  averageDays: number;
}

interface SeasonalPattern {
  quarter: string;
  leaveCount: number;
  percentage: number;
}

@Component({
  selector: 'app-leave-analytics',
  standalone: false,
  templateUrl: './leave-analytics.html',
  styleUrls: ['./leave-analytics.css'],
})
export class LeaveAnalytics implements OnInit {
  // Chart data
  leaveTrendsData: LeaveTrend[] = [];
  departmentStats: DepartmentStats[] = [];
  seasonalPatterns: SeasonalPattern[] = [];
  
  // Filter properties
  selectedTimeRange: string = '12months';
  selectedDepartment: string = 'all';
  isLoading: boolean = false;
  
  // Chart configurations
  leaveTrendsChart: any = {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        {
          label: 'Approved',
          data: [],
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Pending',
          data: [],
          borderColor: '#f59e0b',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Rejected',
          data: [],
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          tension: 0.4,
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Leave Requests Trend (Last 12 Months)',
          font: { size: 16, weight: 'bold' }
        },
        legend: {
          position: 'top' as const,
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0
          }
        }
      }
    }
  };

  departmentChart: any = {
    type: 'bar',
    data: {
      labels: [],
      datasets: [
        {
          label: 'Total Leaves',
          data: [],
          backgroundColor: '#3b82f6',
          borderColor: '#2563eb',
          borderWidth: 1
        },
        {
          label: 'Approved',
          data: [],
          backgroundColor: '#10b981',
          borderColor: '#059669',
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Leave Requests by Department',
          font: { size: 16, weight: 'bold' }
        },
        legend: {
          position: 'top' as const,
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0
          }
        }
      }
    }
  };

  seasonalChart: any = {
    type: 'doughnut',
    data: {
      labels: [],
      datasets: [{
        data: [],
        backgroundColor: [
          '#3b82f6',
          '#10b981',
          '#f59e0b',
          '#ef4444'
        ],
        borderWidth: 2,
        borderColor: '#ffffff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Seasonal Leave Distribution',
          font: { size: 16, weight: 'bold' }
        },
        legend: {
          position: 'bottom' as const,
        }
      }
    }
  };

  // Statistics
  totalStats = {
    totalRequests: 0,
    approvedRequests: 0,
    pendingRequests: 0,
    rejectedRequests: 0,
    averageProcessingTime: 0
  };


  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadAnalyticsData();
  }

  private loadAnalyticsData(): void {
    this.isLoading = true;
    
    // Load different analytics data
    Promise.all([
      this.loadLeaveTrends(),
      this.loadDepartmentStats(),
      this.loadSeasonalPatterns(),
      this.loadTotalStats()
    ]).finally(() => {
      this.isLoading = false;
    });
  }

  private loadLeaveTrends(): Promise<void> {
    return new Promise((resolve) => {
      // Simulate API call - replace with actual API
      setTimeout(() => {
        this.leaveTrendsData = [
          { month: 'Jan', approved: 45, pending: 12, rejected: 3 },
          { month: 'Feb', approved: 52, pending: 8, rejected: 2 },
          { month: 'Mar', approved: 38, pending: 15, rejected: 4 },
          { month: 'Apr', approved: 61, pending: 6, rejected: 1 },
          { month: 'May', approved: 48, pending: 11, rejected: 3 },
          { month: 'Jun', approved: 55, pending: 9, rejected: 2 },
          { month: 'Jul', approved: 42, pending: 13, rejected: 5 },
          { month: 'Aug', approved: 58, pending: 7, rejected: 1 },
          { month: 'Sep', approved: 49, pending: 10, rejected: 3 },
          { month: 'Oct', approved: 53, pending: 8, rejected: 2 },
          { month: 'Nov', approved: 46, pending: 12, rejected: 4 },
          { month: 'Dec', approved: 41, pending: 14, rejected: 6 }
        ];
        
        this.updateTrendsChart();
        resolve();
      }, 1000);
    });
  }

  private loadDepartmentStats(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.departmentStats = [
          { department: 'Engineering', totalLeaves: 156, approvedLeaves: 142, pendingLeaves: 14, averageDays: 3.2 },
          { department: 'Marketing', totalLeaves: 89, approvedLeaves: 78, pendingLeaves: 11, averageDays: 2.8 },
          { department: 'Sales', totalLeaves: 134, approvedLeaves: 125, pendingLeaves: 9, averageDays: 4.1 },
          { department: 'HR', totalLeaves: 67, approvedLeaves: 61, pendingLeaves: 6, averageDays: 2.5 },
          { department: 'Finance', totalLeaves: 98, approvedLeaves: 89, pendingLeaves: 9, averageDays: 3.0 }
        ];
        
        this.updateDepartmentChart();
        resolve();
      }, 1200);
    });
  }

  private loadSeasonalPatterns(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.seasonalPatterns = [
          { quarter: 'Q1 (Jan-Mar)', leaveCount: 135, percentage: 28 },
          { quarter: 'Q2 (Apr-Jun)', leaveCount: 164, percentage: 34 },
          { quarter: 'Q3 (Jul-Sep)', leaveCount: 149, percentage: 31 },
          { quarter: 'Q4 (Oct-Dec)', leaveCount: 140, percentage: 29 }
        ];
        
        this.updateSeasonalChart();
        resolve();
      }, 800);
    });
  }

  private loadTotalStats(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.totalStats = {
          totalRequests: 588,
          approvedRequests: 535,
          pendingRequests: 49,
          rejectedRequests: 24,
          averageProcessingTime: 2.3
        };
        resolve();
      }, 600);
    });
  }

  private updateTrendsChart(): void {
    this.leaveTrendsChart.data.labels = this.leaveTrendsData.map(trend => trend.month);
    this.leaveTrendsChart.data.datasets[0].data = this.leaveTrendsData.map(trend => trend.approved);
    this.leaveTrendsChart.data.datasets[1].data = this.leaveTrendsData.map(trend => trend.pending);
    this.leaveTrendsChart.data.datasets[2].data = this.leaveTrendsData.map(trend => trend.rejected);
  }

  private updateDepartmentChart(): void {
    this.departmentChart.data.labels = this.departmentStats.map(dept => dept.department);
    this.departmentChart.data.datasets[0].data = this.departmentStats.map(dept => dept.totalLeaves);
    this.departmentChart.data.datasets[1].data = this.departmentStats.map(dept => dept.approvedLeaves);
  }

  private updateSeasonalChart(): void {
    this.seasonalChart.data.labels = this.seasonalPatterns.map(pattern => pattern.quarter);
    this.seasonalChart.data.datasets[0].data = this.seasonalPatterns.map(pattern => pattern.leaveCount);
  }

  onTimeRangeChange(): void {
    this.loadAnalyticsData();
  }

  onDepartmentChange(): void {
    this.loadAnalyticsData();
  }

  refreshData(): void {
    this.loadAnalyticsData();
  }

  exportData(): void {
    const data = {
      trends: this.leaveTrendsData,
      departments: this.departmentStats,
      seasonal: this.seasonalPatterns,
      stats: this.totalStats
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'leave-analytics.json';
    link.click();
    URL.revokeObjectURL(url);
  }
}
