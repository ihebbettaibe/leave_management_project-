import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  HostListener,
} from '@angular/core';
import { EmployeeData } from '../../../types/user/profileType/employee-data.type';
import { LeaveData } from '../../../types/user/profileType/leave-data.type';
import { ApiService, ProfileData, DashboardData } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-employee-profile',
  templateUrl: './user-profile.html',
  styleUrls: ['./user-profile.css'],
  standalone: false,
})
export class UserProfile implements OnInit, AfterViewInit, OnDestroy {
  employeeData: EmployeeData = {
    name: '',
    role: 'employee',
    department: '',
    email: '',
    phone: '',
    joinDate: '',
    experience: '',
  };

  leaveData: LeaveData = {
    annual: { total: 0, used: 0, remaining: 0 },
    sick: { total: 0, used: 0, remaining: 0 },
    personal: { total: 0, used: 0, remaining: 0 },
  };

  profileData: ProfileData | null = null;
  dashboardData: DashboardData | null = null;
  profileImageUrl: string | null = null;
  isLoading = true;
  error: string | null = null;
  isUploading = false;

  private autoSaveTimer?: number;
  private clockInterval?: number;

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const w = window as any;
    w.closeModal = this.closeModal.bind(this);
    w.downloadProfile = this.downloadProfile.bind(this);
    w.changeProfileImage = this.changeProfileImage.bind(this);
    w.viewLeaveDetails = this.viewLeaveDetails.bind(this);
    w.requestLeave = this.requestLeave.bind(this);
    w.sendMessage = this.sendMessage.bind(this);
    w.scheduleCall = this.scheduleCall.bind(this);
    w.viewReports = this.viewReports.bind(this);
    w.filterHolidays = this.filterHolidays.bind(this);
    w.showNotification = this.showNotification.bind(this);
    w.searchEmployee = this.searchEmployee.bind(this);
    w.printProfile = this.printProfile.bind(this);
    w.toggleDarkMode = this.toggleDarkMode.bind(this);
    w.editProfile = this.editProfile.bind(this);
    w.saveProfile = this.saveProfile.bind(this);

    this.loadProfileData();
  }

  ngAfterViewInit(): void {
    document.querySelectorAll('.modal').forEach((modal) => {
      modal.addEventListener('click', (e: Event) => {
        if (e.target === modal) this.closeModal();
      });
    });

    this.initializeCharts();
    this.updateClock();
    this.clockInterval = window.setInterval(() => this.updateClock(), 1000);

    document.querySelectorAll('.info-item').forEach((item) => {
      item.addEventListener('mouseenter', (e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = 'translateX(5px)';
      });
      item.addEventListener('mouseleave', (e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = 'translateX(0)';
      });
    });

    // optional: keep this; it only wires autosave if an #editModal exists
    const editModal = document.getElementById('editModal');
    editModal?.addEventListener('click', () => this.setupAutoSave());
  }

  ngOnDestroy(): void {
    if (this.clockInterval) clearInterval(this.clockInterval);
    if (this.autoSaveTimer) clearTimeout(this.autoSaveTimer);
  }

  @HostListener('document:keydown', ['$event'])
  handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') this.closeModal();
    // removed: Ctrl+E (edit)
    if (e.ctrlKey && e.key.toLowerCase() === 'd') {
      e.preventDefault();
      this.downloadProfile();
    }
  }

  // removed: editProfile()

  closeModal(): void {
    document
      .querySelectorAll('.modal')
      .forEach((m) => m.classList.remove('show'));
  }

  // removed: saveProfile()

  async downloadProfile(): Promise<void> {
    this.showNotification('Preparing PDF…');

    try {
      // Dynamic imports avoid ESM config headaches
      const [{ jsPDF }, html2canvasModule] = await Promise.all([
        import('jspdf'),
        import('html2canvas'),
      ]);
      const html2canvas = html2canvasModule.default;

      // Choose what to print: wrap your profile in <div id="profilePrintable">…</div>
      const target =
        document.getElementById('profilePrintable') || document.body;

      // Render DOM to canvas (higher scale => sharper PDF)
      const canvas = await html2canvas(target, {
        scale: 2,
        useCORS: true,
        windowWidth: document.documentElement.scrollWidth,
        windowHeight: document.documentElement.scrollHeight,
      });

      const imgData = canvas.toDataURL('image/png');

      // A4 in mm
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Canvas size in px
      const imgWidthPx = canvas.width;
      const imgHeightPx = canvas.height;
      const imgRatio = imgWidthPx / imgHeightPx;

      // Convert px to mm by fitting width to page
      const pdfImgWidth = pageWidth;
      const pdfImgHeight = pdfImgWidth / imgRatio;

      let position = 0;
      let heightLeft = pdfImgHeight;

      // Add first page
      pdf.addImage(
        imgData,
        'PNG',
        0,
        position,
        pdfImgWidth,
        pdfImgHeight,
        '',
        'FAST'
      );
      heightLeft -= pageHeight;

      // Add extra pages if content overflows
      while (heightLeft > 0) {
        pdf.addPage();
        position = heightLeft * -1; // move up
        pdf.addImage(
          imgData,
          'PNG',
          0,
          position,
          pdfImgWidth,
          pdfImgHeight,
          '',
          'FAST'
        );
        heightLeft -= pageHeight;
      }

      const safeName = (this.employeeData?.name || 'profile').replace(
        /\s+/g,
        '_'
      );
      const date = new Date().toISOString().slice(0, 10);
      pdf.save(`${safeName}_Profile_${date}.pdf`);

      this.showNotification('PDF downloaded successfully!');
    } catch (err) {
      console.error(err);
      this.showNotification('PDF failed. Falling back to print…');
      // Zero-dependency fallback: user can "Save as PDF" from print dialog
      setTimeout(() => window.print(), 150);
    }
  }

  // removed: exportData()

  changeProfileImage(): void {
    const input = document.getElementById('profileImageInput') as HTMLInputElement;
    if (input) {
      input.click();
    }
  }

  viewLeaveDetails(leaveType: 'annual' | 'sick' | 'personal'): void {
    const leave = this.leaveData[leaveType];
    const percentage = Number(((leave.used / leave.total) * 100).toFixed(1));

    const content = `
      <div class="info-grid">
        <div class="info-item">
          <div class="info-label">Leave Type</div>
          <div class="info-value">${this.capFirst(leaveType)} Leave</div>
        </div>
        <div class="info-item">
          <div class="info-label">Total Allocated</div>
          <div class="info-value">${leave.total} days</div>
        </div>
        <div class="info-item">
          <div class="info-label">Used</div>
          <div class="info-value">${leave.used} days</div>
        </div>
        <div class="info-item">
          <div class="info-label">Remaining</div>
          <div class="info-value">${leave.remaining} days</div>
        </div>
        <div class="info-item" style="grid-column: 1 / -1;">
          <div class="info-label">Usage Percentage</div>
          <div class="progress-bar" style="margin-top: 8px;">
            <div class="progress-fill" style="width: ${percentage}%"></div>
          </div>
          <div class="info-value" style="margin-top: 5px;">${percentage}% used</div>
        </div>
      </div>
    `;

    const target = document.getElementById('leaveModalContent');
    if (target) target.innerHTML = content;

    document.getElementById('leaveModal')?.classList.add('show');
  }

  requestLeave(): void {
    this.showNotification('Leave request form opened!');
  }

  sendMessage(): void {
    this.showNotification('Opening messaging app...');
  }

  scheduleCall(): void {
    this.showNotification('Opening calendar to schedule call...');
  }

  viewReports(): void {
    this.showNotification('Loading employee reports...');
  }

  filterHolidays(
    filter: 'all' | 'upcoming' | 'optional' | string,
    ev?: Event
  ): void {
    document
      .querySelectorAll('.filter-tab')
      .forEach((tab) => tab.classList.remove('active'));
    if (ev && ev.target instanceof HTMLElement)
      ev.target.classList.add('active');

    const holidays = document.querySelectorAll(
      '.holiday-item'
    ) as NodeListOf<HTMLElement>;
    holidays.forEach((h) => {
      if (filter === 'all') h.style.display = 'flex';
      else {
        const category = h.getAttribute('data-category');
        h.style.display =
          filter === 'upcoming' || category === filter ? 'flex' : 'none';
      }
    });
  }

  showNotification(message: string): void {
    const notification = document.getElementById('notification');
    const text = document.getElementById('notificationText');
    if (!notification || !text) return;

    text.textContent = message;
    notification.classList.add('show');

    setTimeout(() => notification.classList.remove('show'), 3000);
  }

  searchEmployee(): void {
    const term = prompt('Enter employee name or ID:');
    if (term) this.showNotification(`Searching for: ${term}`);
  }

  printProfile(): void {
    window.print();
  }

  toggleDarkMode(): void {
    document.body.classList.toggle('dark-mode');
    this.showNotification('Dark mode toggled!');
  }

  setupAutoSave(): void {
    const inputs = document.querySelectorAll(
      '.form-input'
    ) as NodeListOf<HTMLInputElement>;
    inputs.forEach((input) => {
      input.addEventListener('input', () => {
        if (this.autoSaveTimer) clearTimeout(this.autoSaveTimer);
        this.autoSaveTimer = window.setTimeout(() => {
          // backend persist if needed
        }, 2000);
      });
    });
  }

  // API Methods
  loadProfileData(): void {
    this.isLoading = true;
    this.error = null;

    // Load both profile and dashboard data
    Promise.all([
      this.apiService.getProfile().toPromise(),
      this.apiService.getDashboardData().toPromise()
    ]).then(([profileResponse, dashboardResponse]) => {
      if (profileResponse?.success && profileResponse.data) {
        this.profileData = profileResponse.data;
        this.updateEmployeeDataFromProfile(profileResponse.data);
        this.profileImageUrl = profileResponse.data.profilePicture || null;
      }

      if (dashboardResponse?.success && dashboardResponse.data) {
        this.dashboardData = dashboardResponse.data;
        this.updateLeaveDataFromDashboard(dashboardResponse.data);
        this.updateEmployeeDataFromDashboard(dashboardResponse.data);
      }

      this.isLoading = false;
    }).catch((error: any) => {
      console.error('Error loading profile data:', error);
      this.error = 'Failed to load profile data. Please try again.';
      this.isLoading = false;

      // Fallback to current user info
      const currentUser = this.authService.getCurrentUser();
      if (currentUser) {
        this.employeeData.name = `${currentUser.firstName} ${currentUser.lastName}`;
        this.employeeData.email = currentUser.email;
      }
    });
  }

  private updateEmployeeDataFromProfile(profile: ProfileData): void {
    this.employeeData.name = `${profile.firstName} ${profile.lastName}`;
    this.employeeData.email = profile.email;
    this.employeeData.phone = profile.phone;
    this.employeeData.department = profile.department;
    
    if (profile.joinDate) {
      this.employeeData.joinDate = new Date(profile.joinDate).toLocaleDateString();
    }
    this.employeeData.experience = profile.workExperience || '0 Years';
  }

  private updateEmployeeDataFromDashboard(dashboard: DashboardData): void {
    if (dashboard.employeeInfo) {
      this.employeeData.department = dashboard.employeeInfo.department || this.employeeData.department;
      this.employeeData.experience = dashboard.employeeInfo.workExperience || this.employeeData.experience;
      if (dashboard.employeeInfo.joinDate) {
        this.employeeData.joinDate = new Date(dashboard.employeeInfo.joinDate).toLocaleDateString();
      }
    }

    if (dashboard.contactInfo) {
      this.employeeData.phone = dashboard.contactInfo.phone || this.employeeData.phone;
    }
  }

  private updateLeaveDataFromDashboard(dashboard: DashboardData): void {
    if (dashboard.leaveBalance) {
      this.leaveData = {
        annual: {
          total: dashboard.leaveBalance.annual?.total || 0,
          used: dashboard.leaveBalance.annual?.used || 0,
          remaining: dashboard.leaveBalance.annual?.remaining || 0,
        },
        sick: {
          total: dashboard.leaveBalance.sick?.total || 0,
          used: dashboard.leaveBalance.sick?.used || 0,
          remaining: dashboard.leaveBalance.sick?.remaining || 0,
        },
        personal: {
          total: dashboard.leaveBalance.personal?.total || 0,
          used: dashboard.leaveBalance.personal?.used || 0,
          remaining: dashboard.leaveBalance.personal?.remaining || 0,
        },
      };
    }
  }

  editProfile(): void {
    const modal = document.getElementById('editModal');
    if (modal) {
      // Populate form fields with current data
      this.populateEditForm();
      modal.style.display = 'block';
      this.setupAutoSave();
    }
  }

  private populateEditForm(): void {
    if (!this.profileData) return;

    const fields = {
      'edit-firstName': this.profileData.firstName,
      'edit-lastName': this.profileData.lastName,
      'edit-phone': this.profileData.phone,
      'edit-emergencyContact': this.profileData.emergencyContact,
      'edit-address': this.profileData.currentAddress,
      'edit-department': this.profileData.department,
      'edit-designation': this.profileData.designation,
    };

    Object.entries(fields).forEach(([id, value]) => {
      const element = document.getElementById(id) as HTMLInputElement;
      if (element && value) {
        element.value = value;
      }
    });
  }

  saveProfile(): void {
    if (!this.profileData) {
      this.showNotification('No profile data to save');
      return;
    }

    const formData = this.getFormData();
    if (!formData) {
      this.showNotification('Error reading form data');
      return;
    }

    this.apiService.updateProfile(formData).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.showNotification('Profile updated successfully!');
          if (this.profileData && formData) {
            this.profileData = { ...this.profileData, ...formData } as ProfileData;
            this.updateEmployeeDataFromProfile(this.profileData);
          }
          this.closeModal();
        } else {
          this.showNotification('Failed to update profile');
        }
      },
      error: (error: any) => {
        console.error('Error saving profile:', error);
        this.showNotification('Error saving profile. Please try again.');
      }
    });
  }

  private getFormData(): Partial<ProfileData> | null {
    const getFieldValue = (id: string): string => {
      const element = document.getElementById(id) as HTMLInputElement;
      return element?.value || '';
    };

    return {
      firstName: getFieldValue('edit-firstName'),
      lastName: getFieldValue('edit-lastName'),
      phone: getFieldValue('edit-phone'),
      emergencyContact: getFieldValue('edit-emergencyContact'),
      currentAddress: getFieldValue('edit-address'),
      department: getFieldValue('edit-department'),
      designation: getFieldValue('edit-designation'),
    };
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (file) {
      this.uploadProfileImage(file);
    }
  }

  private uploadProfileImage(file: File): void {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      this.showNotification('Please select a valid image file (JPEG, PNG, GIF)');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      this.showNotification('Image size must be less than 5MB');
      return;
    }

    this.isUploading = true;

    this.apiService.uploadProfilePicture(file).subscribe({
      next: (response: any) => {
        if (response.success && response.data.imageUrl) {
          this.profileImageUrl = response.data.imageUrl;
          this.showNotification('Profile picture updated successfully!');
          
          // Update the profile image in the DOM
          const profileImg = document.querySelector('.profile-image img') as HTMLImageElement;
          if (profileImg && this.profileImageUrl) {
            profileImg.src = this.profileImageUrl;
          }
        } else {
          this.showNotification('Failed to upload profile picture');
        }
        this.isUploading = false;
      },
      error: (error: any) => {
        console.error('Error uploading profile picture:', error);
        this.showNotification('Error uploading image. Please try again.');
        this.isUploading = false;
      }
    });
  }

  refreshProfile(): void {
    this.loadProfileData();
  }

  updateClock(): void {
    // minimal clock hook
  }

  initializeCharts(): void {
    // charts init placeholder
  }

  private capFirst(s: string): string {
    return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
  }
}
