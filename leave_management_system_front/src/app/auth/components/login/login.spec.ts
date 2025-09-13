import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { login } from './login';

describe('LoginComponent', () => {
  let component: login;
  let fixture: ComponentFixture<login>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    // Create spy object for Router
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [login],
      imports: [ReactiveFormsModule],
      providers: [{ provide: Router, useValue: routerSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(login);
    component = fixture.componentInstance;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    // Mock localStorage
    spyOn(Storage.prototype, 'setItem');
    spyOn(Storage.prototype, 'getItem').and.returnValue(null);
    spyOn(Storage.prototype, 'removeItem');

    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize the form with empty values', () => {
      expect(component.loginForm).toBeDefined();
      expect(component.loginForm.get('username')?.value).toBe('');
      expect(component.loginForm.get('password')?.value).toBe('');
      expect(component.loginForm.get('rememberMe')?.value).toBe(false);
    });

    it('should have initial UI state set correctly', () => {
      expect(component.showSuccessPopup).toBeFalse();
      expect(component.showPassword).toBeFalse();
      expect(component.isLoading).toBeFalse();
      expect(component.showErrorToast).toBeFalse();
      expect(component.errorMessage).toBe('');
    });

    it('should clear user session on initialization', () => {
      component.ngOnInit();
      expect(localStorage.removeItem).toHaveBeenCalledWith('hrms_session');
    });
  });

  describe('Form Validation', () => {
    it('should be invalid when empty', () => {
      expect(component.loginForm.valid).toBeFalse();
    });

    it('should be invalid with only username', () => {
      component.loginForm.patchValue({
        username: 'testuser',
      });
      expect(component.loginForm.valid).toBeFalse();
    });

    it('should be invalid with only password', () => {
      component.loginForm.patchValue({
        password: 'testpass',
      });
      expect(component.loginForm.valid).toBeFalse();
    });

    it('should be valid with both username and password', () => {
      component.loginForm.patchValue({
        username: 'meriem',
        password: 'meriem',
      });
      expect(component.loginForm.valid).toBeTrue();
    });

    it('should require minimum length for username', () => {
      const usernameControl = component.loginForm.get('username');
      usernameControl?.setValue('ab');
      usernameControl?.markAsTouched();

      expect(usernameControl?.hasError('minlength')).toBeTrue();
      expect(component.usernameErrors).toContain(
        'Username must be at least 3 characters'
      );
    });

    it('should require minimum length for password', () => {
      const passwordControl = component.loginForm.get('password');
      passwordControl?.setValue('123');
      passwordControl?.markAsTouched();

      expect(passwordControl?.hasError('minlength')).toBeTrue();
      expect(component.passwordErrors).toContain(
        'Password must be at least 4 characters'
      );
    });
  });

  describe('Form Submission', () => {
    it('should not submit invalid form', () => {
      spyOn(component, 'showError' as any);

      component.onSubmit();

      expect(component['showError']).toHaveBeenCalledWith(
        'Please fill in all required fields correctly.'
      );
    });

    it('should show loading state during submission', fakeAsync(() => {
      component.loginForm.patchValue({
        username: 'meriem',
        password: 'meriem',
      });

      component.onSubmit();
      expect(component.isLoading).toBeTrue();

      tick(1500); // Wait for the delay
      expect(component.isLoading).toBeFalse();
    }));

    it('should show success popup on valid credentials', fakeAsync(() => {
      component.loginForm.patchValue({
        username: 'meriem',
        password: 'meriem',
      });

      component.onSubmit();
      tick(1500);

      expect(component.showSuccessPopup).toBeTrue();
    }));

    it('should show error on invalid credentials', fakeAsync(() => {
      spyOn(component, 'showError' as any);

      component.loginForm.patchValue({
        username: 'invalid',
        password: 'invalid',
      });

      component.onSubmit();
      tick(1500);

      expect(component['showError']).toHaveBeenCalledWith(
        'Invalid username or password. Please try again.'
      );
      expect(component.showSuccessPopup).toBeFalse();
    }));

    it('should save session when remember me is checked', fakeAsync(() => {
      component.loginForm.patchValue({
        username: 'meriem',
        password: 'meriem',
        rememberMe: true,
      });

      component.onSubmit();
      tick(1500);

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'hrms_session',
        jasmine.any(String)
      );
    }));
  });

  describe('Password Toggle', () => {
    it('should toggle password visibility', () => {
      expect(component.showPassword).toBeFalse();

      component.togglePassword();
      expect(component.showPassword).toBeTrue();

      component.togglePassword();
      expect(component.showPassword).toBeFalse();
    });

    it('should update input type when password visibility is toggled', () => {
      const passwordInput = fixture.debugElement.query(By.css('#password'));

      expect(passwordInput.nativeElement.type).toBe('password');

      component.togglePassword();
      fixture.detectChanges();

      expect(passwordInput.nativeElement.type).toBe('text');
    });
  });

  describe('Success Modal', () => {
    beforeEach(() => {
      component.showSuccessPopup = true;
      fixture.detectChanges();
    });

    it('should display success modal when showSuccessPopup is true', () => {
      const modal = fixture.debugElement.query(By.css('.modal-overlay'));
      expect(modal).toBeTruthy();
    });

    it('should close modal and redirect on close button click', () => {
      spyOn(component, 'redirectToDashboard' as any);

      component.closePopup();

      expect(component.showSuccessPopup).toBeFalse();
      expect(component['redirectToDashboard']).toHaveBeenCalled();
    });

    it('should continue to dashboard on continue button click', () => {
      spyOn(component, 'redirectToDashboard' as any);

      component.continueToDashboard();

      expect(component.showSuccessPopup).toBeFalse();
      expect(component['redirectToDashboard']).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should display error toast', () => {
      component['showError']('Test error message');
      fixture.detectChanges();

      expect(component.showErrorToast).toBeTrue();
      expect(component.errorMessage).toBe('Test error message');

      const errorToast = fixture.debugElement.query(By.css('.error-toast'));
      expect(errorToast).toBeTruthy();
    });

    it('should dismiss error toast', () => {
      component.showErrorToast = true;
      component.errorMessage = 'Test error';

      component.dismissError();

      expect(component.showErrorToast).toBeFalse();
      expect(component.errorMessage).toBe('');
    });

    it('should auto-dismiss error after 5 seconds', fakeAsync(() => {
      component['showError']('Test error message');

      expect(component.showErrorToast).toBeTrue();

      tick(5000);

      expect(component.showErrorToast).toBeFalse();
    }));
  });

  describe('Forgot Password', () => {
    it('should handle forgot password click', () => {
      spyOn(window, 'alert');
      const event = new Event('click');
      spyOn(event, 'preventDefault');

      component.onForgotPassword(event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith(
        'Please contact your system administrator to reset your password.'
      );
    });
  });

  describe('Navigation', () => {
    it('should navigate to dashboard with user state', () => {
      component['currentUser'] = {
        username: 'meriem',
        role: 'HR Manager',
        lastLogin: new Date(),
      };

      component['redirectToDashboard']();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard'], {
        state: { user: component['currentUser'] },
      });
    });
  });

  describe('Session Management', () => {
    it('should check for remembered session', () => {
      (localStorage.getItem as jasmine.Spy).and.returnValue(
        JSON.stringify({
          user: { username: 'meriem', role: 'HR Manager' },
          timestamp: new Date().getTime(),
          rememberMe: true,
        })
      );

      const hasSession = component.hasRememberedSession();
      expect(hasSession).toBeTrue();
    });

    it('should return false for expired session', () => {
      const oneDayAgo = new Date().getTime() - 25 * 60 * 60 * 1000; // 25 hours ago
      (localStorage.getItem as jasmine.Spy).and.returnValue(
        JSON.stringify({
          user: { username: 'meriem', role: 'HR Manager' },
          timestamp: oneDayAgo,
          rememberMe: true,
        })
      );

      const hasSession = component.hasRememberedSession();
      expect(hasSession).toBeFalse();
    });

    it('should clear session on invalid session data', () => {
      (localStorage.getItem as jasmine.Spy).and.returnValue('invalid json');
      spyOn(component, 'clearUserSession' as any);

      component.autoLoginFromSession();

      expect(component['clearUserSession']).toHaveBeenCalled();
    });
  });

  describe('Utility Methods', () => {
    it('should get current time formatted', () => {
      const time = component.getCurrentTime();
      expect(time).toContain(','); // Date format should contain comma
      expect(time).toBeTruthy();
    });

    it('should get browser info', () => {
      const browserInfo = component.getBrowserInfo();
      expect(browserInfo).toBeTruthy();
      expect(typeof browserInfo).toBe('string');
    });

    it('should return correct username from form', () => {
      component.loginForm.patchValue({ username: 'testuser' });
      expect(component.username).toBe('testuser');
    });

    it('should return correct password from form', () => {
      component.loginForm.patchValue({ password: 'testpass' });
      expect(component.password).toBe('testpass');
    });

    it('should return correct form validity', () => {
      expect(component.isFormValid).toBeFalse();

      component.loginForm.patchValue({
        username: 'meriem',
        password: 'meriem',
      });

      expect(component.isFormValid).toBeTrue();
    });
  });

  describe('Component Cleanup', () => {
    it('should clear timeouts on destroy', () => {
      component['errorTimeout'] = setTimeout(() => {}, 1000);
      spyOn(window, 'clearTimeout');

      component.ngOnDestroy();

      expect(clearTimeout).toHaveBeenCalled();
    });
  });

  describe('UI Interactions', () => {
    it('should mark form as touched when submitted with invalid data', () => {
      component.onSubmit();

      expect(component.loginForm.get('username')?.touched).toBeTrue();
      expect(component.loginForm.get('password')?.touched).toBeTrue();
    });

    it('should display validation errors when fields are touched', () => {
      const usernameControl = component.loginForm.get('username');
      const passwordControl = component.loginForm.get('password');

      usernameControl?.markAsTouched();
      passwordControl?.markAsTouched();

      fixture.detectChanges();

      const errorMessages = fixture.debugElement.queryAll(
        By.css('.error-message')
      );
      expect(errorMessages.length).toBeGreaterThan(0);
    });
  });
});
