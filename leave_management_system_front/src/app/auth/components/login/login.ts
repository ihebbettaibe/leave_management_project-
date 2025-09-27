import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../private/services/auth.service';

interface LoginCredentials {
  email: string;
  password: string;
}

interface User {
  username: string;
  role: string;
  lastLogin?: Date;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  standalone: false,
})
export class login implements OnInit, OnDestroy {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private authService: AuthService
  ) {
    this.initializeForm();
  }

  // UI State
  showSuccessPopup: boolean = false;
  showPassword: boolean = false;
  isLoading: boolean = false;
  showErrorToast: boolean = false;
  errorMessage: string = '';

  // Authentication
  private currentUser: User | null = null;
  private errorTimeout: any;

  ngOnInit(): void {
    // Clear any existing sessions
    this.clearUserSession();
  }

  ngOnDestroy(): void {
    // Clear any pending timeouts
    if (this.errorTimeout) {
      clearTimeout(this.errorTimeout);
    }
  }

  /**
   * Initialize the reactive form with validation
   */
  private initializeForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      rememberMe: [false],
    });
  }

  /**
   * Handle form submission
   */
  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched();
      this.showError('Please fill in all required fields correctly.');
      return;
    }

    if (this.isLoading) {
      return;
    }

    const formValues = this.loginForm.value;
    this.attemptLogin(formValues);
  }

  /**
   * Attempt to authenticate user
   */
  private async attemptLogin(
    credentials: LoginCredentials & { rememberMe: boolean }
  ): Promise<void> {
    this.isLoading = true;
    this.dismissError();

    try {
      const loginRequest = {
        email: credentials.email,
        password: credentials.password
      };

      const response = await this.authService.login(loginRequest).toPromise();
      
      if (response && response.success) {
        this.currentUser = {
          username: response.data.user.email,
          role: response.data.user.roles[0] || 'EMPLOYEE',
          lastLogin: new Date(),
        };

        // Handle remember me functionality
        if (credentials.rememberMe) {
          this.saveUserSession(this.currentUser);
        }

        this.showSuccessPopup = true;
        console.log('Login successful:', this.currentUser);
      } else {
        this.showError(response?.message || 'Invalid email or password. Please try again.');
        this.shakeLoginCard();
      }
    } catch (error: any) {
      const errorMessage = error?.error?.message || 'Invalid email or password. Please try again.';
      this.showError(errorMessage);
      this.shakeLoginCard();
      console.error('Login error:', error);
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Toggle password visibility
   */
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  /**
   * Handle forgot password
   */
  onForgotPassword(event: Event): void {
    event.preventDefault();
    console.log('Forgot password clicked');

    // You can implement forgot password logic here
    // For now, just show an alert
    alert('Please contact your system administrator to reset your password.');
  }

  /**
   * Close success popup and redirect
   */
  closePopup(): void {
    this.showSuccessPopup = false;
    this.redirectToDashboard();
  }

  /**
   * Continue to dashboard
   */
  continueToDashboard(): void {
    this.showSuccessPopup = false;
    this.redirectToDashboard();
  }

  /**
   * Redirect to dashboard with user context
   */
  private redirectToDashboard(): void {
    console.log('Redirecting to dashboard...');
    let currentUserRole = this.authService.getCurrentUser();
    console.log('currentUserRole', currentUserRole);
    if(currentUserRole?.roles.includes('ADMIN')){ 
      this.router.navigate(['/admin/dashboard'], {
        state: { user: this.currentUser },
      });
      } else {
        this.router.navigate(['/dashboard'], {
        state: { user: this.currentUser },
      });
      }
    
  }

  /**
   * Show error message
   */
  private showError(message: string): void {
    this.errorMessage = message;
    this.showErrorToast = true;

    // Auto dismiss after 5 seconds
    this.errorTimeout = setTimeout(() => {
      this.dismissError();
    }, 5000);
  }

  /**
   * Dismiss error toast
   */
  dismissError(): void {
    this.showErrorToast = false;
    this.errorMessage = '';

    if (this.errorTimeout) {
      clearTimeout(this.errorTimeout);
      this.errorTimeout = null;
    }
  }

  /**
   * Mark all form fields as touched to show validation errors
   */
  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach((key) => {
      const control = this.loginForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  /**
   * Add shake animation to login card
   */
  private shakeLoginCard(): void {
    const loginCard = document.querySelector('.login-card') as HTMLElement;
    if (loginCard) {
      loginCard.style.animation = 'shake 0.5s ease-in-out';
      setTimeout(() => {
        loginCard.style.animation = '';
      }, 500);
    }
  }

  /**
   * Save user session for remember me functionality
   */
  private saveUserSession(user: User): void {
    try {
      const sessionData = {
        user: user,
        timestamp: new Date().getTime(),
        rememberMe: true,
      };
      localStorage.setItem('hrms_session', JSON.stringify(sessionData));
    } catch (error) {
      console.warn('Could not save user session:', error);
    }
  }

  /**
   * Clear user session
   */
  private clearUserSession(): void {
    try {
      localStorage.removeItem('hrms_session');
    } catch (error) {
      console.warn('Could not clear user session:', error);
    }
  }

  /**
   * Utility method to create delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Check if running in development mode
   */
  private isDevelopmentMode(): boolean {
    return !environment.production;
  }

  // Getters for template
  get email(): string {
    return this.loginForm.get('email')?.value || '';
  }

  get password(): string {
    return this.loginForm.get('password')?.value || '';
  }

  get isFormValid(): boolean {
    return this.loginForm.valid;
  }

  get emailErrors(): string[] {
    const errors: string[] = [];
    const emailControl = this.loginForm.get('email');

    if (emailControl?.errors && emailControl.touched) {
      if (emailControl.errors['required']) {
        errors.push('Email is required');
      }
      if (emailControl.errors['email']) {
        errors.push('Please enter a valid email address');
      }
    }

    return errors;
  }

  get passwordErrors(): string[] {
    const errors: string[] = [];
    const passwordControl = this.loginForm.get('password');

    if (passwordControl?.errors && passwordControl.touched) {
      if (passwordControl.errors['required']) {
        errors.push('Password is required');
      }
      if (passwordControl.errors['minlength']) {
        errors.push('Password must be at least 4 characters');
      }
    }

    return errors;
  }

  /**
   * Get current time formatted for display
   */
  getCurrentTime(): string {
    return new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }

  /**
   * Get user's browser information
   */
  getBrowserInfo(): string {
    return navigator.userAgent.split(' ')[0] || 'Unknown Browser';
  }

  /**
   * Check if user has remember me session
   */
  hasRememberedSession(): boolean {
    try {
      const sessionData = localStorage.getItem('hrms_session');
      if (sessionData) {
        const parsed = JSON.parse(sessionData);
        const oneDayAgo = new Date().getTime() - 24 * 60 * 60 * 1000;
        return parsed.timestamp > oneDayAgo && parsed.rememberMe;
      }
    } catch (error) {
      console.warn('Could not check remembered session:', error);
    }
    return false;
  }

  /**
   * Auto-login from remembered session
   */
  autoLoginFromSession(): void {
    if (this.hasRememberedSession()) {
      try {
        const sessionData = JSON.parse(
          localStorage.getItem('hrms_session') || ''
        );
        this.currentUser = sessionData.user;
        this.redirectToDashboard();
      } catch (error) {
        console.warn('Could not auto-login from session:', error);
        this.clearUserSession();
      }
    }
  }
}

// Add environment import (you may need to adjust the path)
declare const environment: { production: boolean };
