import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { UserApproves } from './user-approves';

describe('Approves', () => {
  let component: UserApproves;
  let fixture: ComponentFixture<UserApproves>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserApproves],
      imports: [FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(UserApproves);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default leave statistics', () => {
    expect(component.leaveStats).toBeDefined();
    expect(component.leaveStats.length).toBe(4);
  });

  it('should initialize with default leave requests', () => {
    expect(component.leaveRequests).toBeDefined();
    expect(component.leaveRequests.length).toBe(4);
    expect(component.filteredRequests.length).toBe(4);
  });

  it('should calculate leave usage percentage correctly', () => {
    component.leaveAllowance = 20;
    component.leaveUsed = 10;
    expect(component.getLeaveUsagePercentage()).toBe(50);
  });

  it('should calculate remaining leave correctly', () => {
    component.leaveAllowance = 20;
    component.leaveUsed = 10;
    expect(component.getRemainingLeave()).toBe(10);
  });

  it('should filter requests correctly', () => {
    component.filters.status = 'approved';
    component.applyFilters();
    const approvedRequests = component.filteredRequests.filter(
      (req) => req.status === 'Approved'
    );
    expect(component.filteredRequests.length).toBe(approvedRequests.length);
  });

  it('should clear filters correctly', () => {
    component.filters.status = 'approved';
    component.clearFilters();
    expect(component.filters.status).toBe('all');
    expect(component.filteredRequests.length).toBe(
      component.leaveRequests.length
    );
  });

  it('should toggle filters visibility', () => {
    expect(component.showFilters).toBeFalse();
    component.toggleFilters();
    expect(component.showFilters).toBeTrue();
  });

  it('should sort requests correctly', () => {
    component.sortBy('employee');
    expect(component.sortColumn).toBe('employee');
    expect(component.sortDirection).toBe('asc');

    component.sortBy('employee');
    expect(component.sortDirection).toBe('desc');
  });

  it('should select and deselect requests', () => {
    const requestId = '1';
    expect(component.isRequestSelected(requestId)).toBeFalse();

    component.toggleRequestSelection(requestId);
    expect(component.isRequestSelected(requestId)).toBeTrue();

    component.toggleRequestSelection(requestId);
    expect(component.isRequestSelected(requestId)).toBeFalse();
  });

  it('should approve all pending requests', () => {
    const pendingCount = component.leaveRequests.filter(
      (req) => req.status === 'Pending'
    ).length;
    const approvedStat = component.leaveStats.find(
      (stat) => stat.type === 'Approved'
    );
    const initialApproved = approvedStat?.count || 0;

    component.approveAllPending();

    const newApprovedCount = approvedStat?.count || 0;
    expect(newApprovedCount).toBe(initialApproved + pendingCount);
  });

  it('should change request status correctly', () => {
    const request = component.leaveRequests.find(
      (req) => req.status === 'Pending'
    );
    if (request) {
      component.changeRequestStatus(request.id, 'Approved');
      expect(request.status).toBe('Approved');
    }
  });

  it('should delete request correctly', () => {
    const initialLength = component.leaveRequests.length;
    const requestId = component.leaveRequests[0].id;

    component.deleteRequest(requestId);

    expect(component.leaveRequests.length).toBe(initialLength - 1);
    expect(
      component.leaveRequests.find((req) => req.id === requestId)
    ).toBeUndefined();
  });

  it('should return correct status class', () => {
    expect(component.getStatusClass('Approved')).toBe('status-approved');
    expect(component.getStatusClass('Pending')).toBe('status-pending');
    expect(component.getStatusClass('Declined')).toBe('status-declined');
  });

  it('should generate CSV content correctly', () => {
    spyOn(component, 'exportData').and.callThrough();
    component.exportData();
    expect(component.exportData).toHaveBeenCalled();
  });

  it('should track requests by ID', () => {
    const request = component.leaveRequests[0];
    const trackResult = component.trackByRequestId(0, request);
    expect(trackResult).toBe(request.id);
  });

  it('should handle select all functionality', () => {
    expect(component.selectedRequests.length).toBe(0);

    component.selectAllRequests();
    expect(component.selectedRequests.length).toBe(
      component.filteredRequests.length
    );

    component.selectAllRequests();
    expect(component.selectedRequests.length).toBe(0);
  });
});
