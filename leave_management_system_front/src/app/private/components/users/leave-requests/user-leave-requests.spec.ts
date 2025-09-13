import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserLeaveRequests } from './user-leave-requests';

describe('LeaveRequests', () => {
  let component: UserLeaveRequests;
  let fixture: ComponentFixture<UserLeaveRequests>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserLeaveRequests],
    }).compileComponents();

    fixture = TestBed.createComponent(UserLeaveRequests);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
