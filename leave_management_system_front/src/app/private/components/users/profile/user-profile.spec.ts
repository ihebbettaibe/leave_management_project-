import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserProfile } from './user-profile';

describe('EmployeeProfileComponent', () => {
  let component: UserProfile;
  let fixture: ComponentFixture<UserProfile>;

  // Minimal DOM helpers your component expects
  function ensureDom() {
    const ids = [
      'editModal',
      'leaveModal',
      'leaveModalContent',
      'notification',
      'notificationText',
    ];
    ids.forEach((id) => {
      if (!document.getElementById(id)) {
        const el = document.createElement(
          id === 'notificationText' ? 'span' : 'div'
        );
        el.id = id;
        if (id === 'notification') el.className = 'notification';
        document.body.appendChild(el);
      }
    });

    // Optional nodes referenced by saveProfile()
    if (!document.querySelector('.profile-name')) {
      const n = document.createElement('div');
      n.className = 'profile-name';
      document.body.appendChild(n);
    }
    if (!document.querySelector('.profile-role')) {
      const n = document.createElement('div');
      n.className = 'profile-role';
      document.body.appendChild(n);
    }
    if (!document.querySelector('a[href^="mailto:"]')) {
      const a = document.createElement('a');
      a.setAttribute('href', 'mailto:test@x.com');
      document.body.appendChild(a);
    }
    if (!document.querySelector('a[href^="tel:"]')) {
      const a = document.createElement('a');
      a.setAttribute('href', 'tel:+111');
      document.body.appendChild(a);
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserProfile],
    }).compileComponents();

    fixture = TestBed.createComponent(UserProfile);
    component = fixture.componentInstance;

    ensureDom();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('closeModal should close all modals', () => {
    const editModal = document.getElementById('editModal')!;
    editModal.classList.add('show');
    component.closeModal();
    expect(editModal.classList.contains('show')).toBeFalse();
  });

  it('showNotification should set text and show banner', (done) => {
    const notif = document.getElementById('notification')!;
    const text = document.getElementById('notificationText')!;
    component.showNotification('Hello!');
    expect(text.textContent).toBe('Hello!');
    expect(notif.classList.contains('show')).toBeTrue();
    // It auto-hides after 3s; we won’t wait in unit test
    done();
  });

  it('viewLeaveDetails should populate leaveModalContent', () => {
    const content = document.getElementById('leaveModalContent')!;
    component.viewLeaveDetails('annual');
    expect(content.innerHTML).toContain('Leave Type');
    expect(
      document.getElementById('leaveModal')!.classList.contains('show')
    ).toBeTrue();
  });
});
