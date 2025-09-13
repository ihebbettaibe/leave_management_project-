import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { UserCalender } from './user-calender';

describe('Calendar', () => {
  let component: UserCalender;
  let fixture: ComponentFixture<UserCalender>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserCalender],
      imports: [RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(UserCalender);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should generate calendar days', () => {
    expect(component.calendarDays.length).toBe(42);
  });

  it('should navigate months correctly', () => {
    const initialMonth = component.currentMonth;
    component.nextMonth();
    expect(component.currentMonth).toBe((initialMonth + 1) % 12);
  });

  it('should filter events by type', () => {
    const paidLeaveEvents = component.getEventsByType('congé-payé');
    expect(paidLeaveEvents.length).toBeGreaterThan(0);
  });

  it('should change view correctly', () => {
    component.setView('validation');
    expect(component.selectedView).toBe('validation');
  });

  it('should handle department change', () => {
    const mockEvent = { target: { value: 'hr' } };
    component.onDepartmentChange(mockEvent);
    expect(component.selectedDepartment).toBe('hr');
  });

  it('should display current month and year', () => {
    const monthYear = component.getCurrentMonthYear();
    expect(monthYear).toContain(component.months[component.currentMonth]);
    expect(monthYear).toContain(component.currentYear.toString());
  });
});
