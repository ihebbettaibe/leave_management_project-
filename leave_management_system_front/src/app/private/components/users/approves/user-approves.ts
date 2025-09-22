import { Component, OnInit } from '@angular/core';

interface LeaveStatistic {
  type: string;
  count: number;
  icon: string;
  color: string;
  bgColor: string;
}

interface LeaveRequest {
  id: string;
  employee: string;
  startDate: string;
  endDate: string;
  duration: string;
  status: 'Approved' | 'Pending' | 'Declined';
  leaveType: string;
}

interface FilterOptions {
  leaveType: string;
  status: string;
  dateRange: string;
}

@Component({
  selector: 'app-leave-statistics',
  standalone: false,
  templateUrl: './user-approves.html',
  styleUrls: ['./user-approves.css'],
})
export class UserApproves implements OnInit {
  // Leave statistics data
  leaveStats: LeaveStatistic[] = [
    {
      type: 'Approved',
      count: 12,
      icon: '✓',
      color: '#10b981',
      bgColor: '#dcfce7',
    },
    {
      type: 'Pending',
      count: 3,
      icon: '⏳',
      color: '#f59e0b',
      bgColor: '#fef3c7',
    },
    {
      type: 'Requests',
      count: 20,
      icon: '📋',
      color: '#ef4444',
      bgColor: '#fecaca',
    },
    {
      type: 'Declined',
      count: 5,
      icon: '✗',
      color: '#ef4444',
      bgColor: '#fecaca',
    },
  ];

  // Leave allowance and usage data
  leaveAllowance = 20;
  leaveUsed = 10;

  // Leave requests data
  leaveRequests: LeaveRequest[] = [
    {
      id: '1',
      employee: 'Jacob Jones',
      startDate: 'Apr. 31',
      endDate: 'Apr. 29',
      duration: '3 days',
      status: 'Approved',
      leaveType: 'Annual Leave',
    },
    {
      id: '2',
      employee: 'Kristen Webb',
      startDate: 'Jan. 17',
      endDate: 'Jan. 30',
      duration: '2 days',
      status: 'Pending',
      leaveType: 'Sick Leave',
    },
    {
      id: '3',
      employee: 'Eleanor Pena',
      startDate: 'Feb. 21',
      endDate: 'Feb. 25',
      duration: '1 day',
      status: 'Approved',
      leaveType: 'Personal Leave',
    },
    {
      id: '4',
      employee: 'Kathryn Murphy',
      startDate: 'Jan. 31',
      endDate: 'Jan. 31',
      duration: 'No days',
      status: 'Approved',
      leaveType: 'Half Day',
    },
  ];

  // Filtered requests
  filteredRequests: LeaveRequest[] = [];

  // Filter options
  filters: FilterOptions = {
    leaveType: 'all',
    status: 'all',
    dateRange: 'all',
  };

  // Dropdown options
  leaveTypes = [
    'All Types',
    'Annual Leave',
    'Sick Leave',
    'Personal Leave',
    'Half Day',
  ];
  statusOptions = ['All Status', 'Approved', 'Pending', 'Declined'];
  dateRangeOptions = ['All Dates', 'This Week', 'This Month', 'Last 30 Days'];

  // UI state
  showFilters = false;
  sortColumn = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  selectedRequests: string[] = [];

  constructor() {}

  ngOnInit(): void {
    this.filteredRequests = [...this.leaveRequests];
  }

  // Filter methods
  applyFilters(): void {
    this.filteredRequests = this.leaveRequests.filter((request) => {
      const matchesType =
        this.filters.leaveType === 'all' ||
        request.leaveType
          .toLowerCase()
          .includes(this.filters.leaveType.toLowerCase());
      const matchesStatus =
        this.filters.status === 'all' ||
        request.status.toLowerCase() === this.filters.status.toLowerCase();

      // Simple date range filtering (you can enhance this with actual date comparison)
      const matchesDateRange = this.filters.dateRange === 'all' || true; // Placeholder logic

      return matchesType && matchesStatus && matchesDateRange;
    });
  }

  onFilterChange(filterType: keyof FilterOptions, value: string): void {
    this.filters[filterType] = value;
    this.applyFilters();
  }

  clearFilters(): void {
    this.filters = {
      leaveType: 'all',
      status: 'all',
      dateRange: 'all',
    };
    this.filteredRequests = [...this.leaveRequests];
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  // Sorting methods
  sortBy(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.filteredRequests.sort((a, b) => {
      let aValue = this.getColumnValue(a, column);
      let bValue = this.getColumnValue(b, column);

      if (aValue < bValue) {
        return this.sortDirection === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  private getColumnValue(request: LeaveRequest, column: string): any {
    switch (column) {
      case 'employee':
        return request.employee;
      case 'startDate':
        return request.startDate;
      case 'endDate':
        return request.endDate;
      case 'duration':
        return request.duration;
      case 'status':
        return request.status;
      default:
        return '';
    }
  }

  // Action methods
  approveAllPending(): void {
    const pendingRequests = this.leaveRequests.filter(
      (req) => req.status === 'Pending'
    );
    pendingRequests.forEach((req) => (req.status = 'Approved'));

    // Update statistics
    const approvedStat = this.leaveStats.find(
      (stat) => stat.type === 'Approved'
    );
    const pendingStat = this.leaveStats.find((stat) => stat.type === 'Pending');

    if (approvedStat && pendingStat) {
      approvedStat.count += pendingRequests.length;
      pendingStat.count = 0;
    }

    this.applyFilters();
    console.log('All pending requests approved');
  }

  exportData(): void {
    const csvContent = this.generateCSV();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'leave_statistics.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    console.log('Data exported');
  }

  private generateCSV(): string {
    const headers = [
      'Employee',
      'Start Date',
      'End Date',
      'Duration',
      'Status',
      'Leave Type',
    ];
    const csvRows = [headers.join(',')];

    this.filteredRequests.forEach((request) => {
      const row = [
        request.employee,
        request.startDate,
        request.endDate,
        request.duration,
        request.status,
        request.leaveType,
      ];
      csvRows.push(row.join(','));
    });

    return csvRows.join('\n');
  }

  // Selection methods
  toggleRequestSelection(requestId: string): void {
    const index = this.selectedRequests.indexOf(requestId);
    if (index > -1) {
      this.selectedRequests.splice(index, 1);
    } else {
      this.selectedRequests.push(requestId);
    }
  }

  isRequestSelected(requestId: string): boolean {
    return this.selectedRequests.includes(requestId);
  }

  selectAllRequests(): void {
    if (this.selectedRequests.length === this.filteredRequests.length) {
      this.selectedRequests = [];
    } else {
      this.selectedRequests = this.filteredRequests.map((req) => req.id);
    }
  }

  // Status change methods
  changeRequestStatus(
    requestId: string,
    newStatus: 'Approved' | 'Pending' | 'Declined'
  ): void {
    const request = this.leaveRequests.find((req) => req.id === requestId);
    if (request && request.status !== newStatus) {
      const oldStatus = request.status;
      request.status = newStatus;

      // Update statistics
      this.updateStatistics(oldStatus, newStatus);
      this.applyFilters();

      console.log(
        `Request ${requestId} status changed from ${oldStatus} to ${newStatus}`
      );
    }
  }

  private updateStatistics(oldStatus: string, newStatus: string): void {
    const oldStat = this.leaveStats.find((stat) => stat.type === oldStatus);
    const newStat = this.leaveStats.find((stat) => stat.type === newStatus);

    if (oldStat) oldStat.count = Math.max(0, oldStat.count - 1);
    if (newStat) newStat.count += 1;
  }

  // Utility methods
  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'status-approved';
      case 'pending':
        return 'status-pending';
      case 'declined':
        return 'status-declined';
      default:
        return '';
    }
  }

  getLeaveUsagePercentage(): number {
    return this.leaveAllowance > 0
      ? (this.leaveUsed / this.leaveAllowance) * 100
      : 0;
  }

  getRemainingLeave(): number {
    return this.leaveAllowance - this.leaveUsed;
  }

  // Action menu methods
  showActionMenu(event: Event, requestId: string): void {
    event.stopPropagation();
    console.log('Show action menu for request:', requestId);
    // Implement dropdown menu logic here
  }

  editRequest(requestId: string): void {
    console.log('Edit request:', requestId);
    // Implement edit functionality
  }

  deleteRequest(requestId: string): void {
    const index = this.leaveRequests.findIndex((req) => req.id === requestId);
    if (index > -1) {
      const request = this.leaveRequests[index];
      this.leaveRequests.splice(index, 1);

      // Update statistics
      const stat = this.leaveStats.find((s) => s.type === request.status);
      if (stat) stat.count = Math.max(0, stat.count - 1);

      this.applyFilters();
      console.log('Request deleted:', requestId);
    }
  }

  viewRequestDetails(requestId: string): void {
    console.log('View request details:', requestId);
    // Implement view details functionality
  }

  // TrackBy function for Angular performance optimization
  trackByRequestId(index: number, item: LeaveRequest): string {
    return item.id;
  }
}
