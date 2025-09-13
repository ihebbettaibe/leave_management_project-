import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LeaveRequest } from '../../../types/user/leaveRequestsType/leave-request.model';
import { LeaveType } from '../../../types/user/leaveRequestsType/leave-type.model';
import { LEAVE_TYPES } from '../../../types/user/leaveRequestsType/leave-types';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-leave-request',
  standalone: false,
  templateUrl: './user-leave-requests.html',
  styleUrls: ['./user-leave-requests.css'],
})
export class UserLeaveRequests implements OnInit {
  @Output() leaveSubmitted = new EventEmitter<LeaveRequest>();
  @Output() formCancel = new EventEmitter<void>();

  leaveRequestForm: FormGroup;
  isSubmitting: boolean = false;
  showSuccessMessage: boolean = false;
  attachedFiles: File[] = [];
  maxFileSize = 5 * 1024 * 1024; // 5MB
  allowedFileTypes = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'];

  leaveTypes: LeaveType[] = [];
  apiLeaveTypes: any[] = [];
  currentEmployee = {
    id: '',
    name: '',
    department: '',
  };

  isLoading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private apiService: ApiService,
    private authService: AuthService
  ) {
    this.leaveRequestForm = this.fb.group(
      {
        leaveType: ['', [Validators.required]],
        startDate: ['', [Validators.required]],
        endDate: ['', [Validators.required]],
        reason: ['', [Validators.required, Validators.minLength(10)]],
        halfDay: [false],
        halfDayPeriod: ['morning'],
        emergencyContact: [''],
        managerEmail: ['', [Validators.email]],
      },
      { validators: this.dateRangeValidatorFactory(this.leaveTypes) }
    );
  }

  ngOnInit(): void {
    this.loadLeaveTypes();
    this.loadCurrentUser();
  }

  private loadLeaveTypes(): void {
    this.apiService.getLeaveTypes().subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          this.apiLeaveTypes = response.data;
          // Convert API leave types to component format
          this.leaveTypes = response.data.map((lt: any) => ({
            value: lt.id,
            label: lt.name,
            maxDays: lt.maxDaysPerYear || 30,
            color: this.getLeaveTypeColor(lt.name),
            description: lt.description
          }));
          
          // Update form validator with new leave types
          this.leaveRequestForm.setValidators(this.dateRangeValidatorFactory(this.leaveTypes));
        } else {
          // Fallback to default leave types
          this.leaveTypes = LEAVE_TYPES;
        }
      },
      error: (error: any) => {
        console.error('Error loading leave types:', error);
        this.leaveTypes = LEAVE_TYPES; // Fallback
      }
    });
  }

  private loadCurrentUser(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.currentEmployee = {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        department: user.department || 'N/A',
      };
    }
  }

  private getLeaveTypeColor(name: string): string {
    const colorMap: { [key: string]: string } = {
      'Annual Leave': '#3b82f6',
      'Sick Leave': '#ef4444',
      'Personal Leave': '#10b981',
      'Emergency Leave': '#f59e0b',
      'Maternity Leave': '#8b5cf6',
      'Paternity Leave': '#06b6d4',
      'Study Leave': '#84cc16',
      'Compassionate Leave': '#f97316',
      'Half Day': '#f59e0b',
    };
    return colorMap[name] || '#6b7280';
  }

  // Factory function for the validator
  dateRangeValidatorFactory(leaveTypes: LeaveType[]) {
    return (control: any) => {
      const form = control as FormGroup;
      const startDate = form.get('startDate')?.value;
      const endDate = form.get('endDate')?.value;

      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (start < today) return { pastDate: true };
        if (end < start) return { invalidDateRange: true };

        const leaveType = form.get('leaveType')?.value;
        if (leaveType) {
          const selectedLeaveType = leaveTypes.find(
            (lt: LeaveType) => lt.value === leaveType
          );

          if (selectedLeaveType) {
            const daysDiff =
              Math.ceil(
                (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
              ) + 1;

            if (daysDiff > selectedLeaveType.maxDays) {
              return {
                exceedsMaxDays: {
                  max: selectedLeaveType.maxDays,
                  requested: daysDiff,
                },
              };
            }
          }
        }
      }

      return null;
    };
  }

  calculateTotalDays(): number {
    const startDate = this.leaveRequestForm.get('startDate')?.value;
    const endDate = this.leaveRequestForm.get('endDate')?.value;

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const timeDiff = end.getTime() - start.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1;

      if (this.leaveRequestForm.get('halfDay')?.value) {
        return 0.5;
      }

      return daysDiff > 0 ? daysDiff : 0;
    }

    return 0;
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const files = Array.from(input.files);

      const validFiles = files.filter((file) => {
        const isValidSize = file.size <= this.maxFileSize;
        const isValidType = this.allowedFileTypes.some((type) =>
          file.name.toLowerCase().endsWith(type.toLowerCase())
        );

        if (!isValidSize) {
          alert(`File ${file.name} is too large. Maximum size is 5MB.`);
          return false;
        }

        if (!isValidType) {
          alert(`File ${file.name} is not a supported file type.`);
          return false;
        }

        return true;
      });

      this.attachedFiles = [...this.attachedFiles, ...validFiles];
    }
  }

  removeFile(index: number): void {
    this.attachedFiles.splice(index, 1);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  onSubmit(): void {
    if (this.leaveRequestForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isSubmitting = true;
    this.error = null;

    const formData = this.leaveRequestForm.value;
    
    const leaveRequest = {
      leaveTypeId: formData.leaveType,
      startDate: formData.startDate,
      endDate: formData.endDate,
      reason: formData.reason,
      isHalfDay: formData.halfDay,
      halfDayPeriod: formData.halfDay ? formData.halfDayPeriod : undefined,
      attachments: this.attachedFiles
    };

    this.apiService.submitLeaveRequest(leaveRequest).subscribe({
      next: (response: any) => {
        this.isSubmitting = false;
        if (response.success) {
          this.showSuccessMessage = true;
          this.showNotification('Leave request submitted successfully!');
          
          // Emit the traditional leave request object for any parent components
          const traditionalLeaveRequest: LeaveRequest = {
            id: response.data?.id || this.generateId(),
            employeeId: this.currentEmployee.id,
            employeeName: this.currentEmployee.name,
            leaveType: formData.leaveType,
            startDate: formData.startDate,
            endDate: formData.endDate,
            totalDays: this.calculateTotalDays(),
            reason: formData.reason,
            status: 'pending',
            appliedDate: new Date().toISOString().split('T')[0],
            attachments: this.attachedFiles,
          };
          
          this.leaveSubmitted.emit(traditionalLeaveRequest);
          
          setTimeout(() => {
            this.showSuccessMessage = false;
            this.resetForm();
          }, 3000);
        } else {
          this.error = response.message || 'Failed to submit leave request';
        }
      },
      error: (error: any) => {
        this.isSubmitting = false;
        console.error('Error submitting leave request:', error);
        this.error = error.error?.message || 'Failed to submit leave request. Please try again.';
        this.showNotification(this.error!);
      }
    });
  }

  private showNotification(message: string): void {
    // Create a simple notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #10b981;
      color: white;
      padding: 1rem;
      border-radius: 0.5rem;
      z-index: 1000;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 5000);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.leaveRequestForm.controls).forEach((key) => {
      this.leaveRequestForm.get(key)?.markAsTouched();
    });
  }

  private generateId(): string {
    return 'LR_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  resetForm(): void {
    this.leaveRequestForm.reset();
    this.attachedFiles = [];
    this.isSubmitting = false;
    this.showSuccessMessage = false;
  }

  onCancel(): void {
    this.resetForm();
    this.formCancel.emit();
  }

  onHalfDayToggle(): void {
    const halfDayControl = this.leaveRequestForm.get('halfDay');
    const startDateControl = this.leaveRequestForm.get('startDate');
    const endDateControl = this.leaveRequestForm.get('endDate');

    if (halfDayControl?.value) {
      if (startDateControl?.value) {
        endDateControl?.setValue(startDateControl.value);
      }
    }
  }

  onStartDateChange(): void {
    const halfDayControl = this.leaveRequestForm.get('halfDay');
    const startDateControl = this.leaveRequestForm.get('startDate');
    const endDateControl = this.leaveRequestForm.get('endDate');

    if (halfDayControl?.value && startDateControl?.value) {
      endDateControl?.setValue(startDateControl.value);
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.leaveRequestForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.leaveRequestForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['email']) return 'Please enter a valid email';
      if (field.errors['minlength'])
        return `Minimum length is ${field.errors['minlength'].requiredLength} characters`;
    }

    if (this.leaveRequestForm.errors) {
      if (this.leaveRequestForm.errors['pastDate'])
        return 'Start date cannot be in the past';
      if (this.leaveRequestForm.errors['invalidDateRange'])
        return 'End date must be after start date';
      if (this.leaveRequestForm.errors['exceedsMaxDays']) {
        const error = this.leaveRequestForm.errors['exceedsMaxDays'];
        return `Maximum ${error.max} days allowed for this leave type (${error.requested} requested)`;
      }
    }

    return '';
  }

  get minDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  get hasFormErrors(): boolean {
    return this.leaveRequestForm.invalid && this.leaveRequestForm.touched;
  }
}
