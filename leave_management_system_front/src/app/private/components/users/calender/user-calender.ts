import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LEAVE_TYPES } from '../../../types/user/leaveRequestsType/leave-types';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';

interface CalendarEvent {
  id: string;
  title: string;
  type:
    | 'congé-payé'
    | 'congé-non-payé'
    | 'congé-maladie'
    | 'congé-maternité'
    | 'non-traité'
    | 'autres';
  startDate: Date;
  endDate: Date;
  color: string;
}

interface CalendarDay {
  date: Date;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: CalendarEvent[];
}

@Component({
  selector: 'app-calendar',
  templateUrl: './user-calender.html',
  styleUrls: ['./user-calender.css'],
  standalone: false,
})
export class UserCalender implements OnInit {
  currentDate = new Date();
  currentMonth = this.currentDate.getMonth(); // 0-based month
  currentYear = this.currentDate.getFullYear();

  months = [
    'Janvier',
    'Février',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juillet',
    'Août',
    'Septembre',
    'Octobre',
    'Novembre',
    'Décembre',
  ];
  days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  calendarDays: CalendarDay[] = [];
  selectedView = 'calendar';
  selectedDepartment = '';
  selectedMonth = '';

  leaveTypes = LEAVE_TYPES;

  events: CalendarEvent[] = [];

  isLoading = false;
  holidays: any[] = [];
  myLeaveRequests: any[] = [];

  constructor(
    private router: Router,
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.generateCalendar();
    this.loadCalendarData();
  }

  private loadCalendarData(): void {
    this.isLoading = true;
    
    Promise.all([
      this.apiService.getCalendarEvents(this.currentMonth + 1, this.currentYear).toPromise(),
      this.apiService.getHolidays(this.currentYear).toPromise(),
      this.apiService.getMyLeaveRequests().toPromise()
    ]).then(([eventsResponse, holidaysResponse, leaveResponse]) => {
      // Process calendar events from API
      if (eventsResponse?.success && eventsResponse.data) {
        const apiEvents = this.processCalendarEvents(eventsResponse.data);
        this.events = [...this.events, ...apiEvents]; // Merge with existing dummy data
      }

      // Process holidays
      if (holidaysResponse?.success && holidaysResponse.data) {
        this.holidays = holidaysResponse.data;
        this.addHolidaysToCalendar(holidaysResponse.data);
      }

      // Process my leave requests
      if (leaveResponse?.success && leaveResponse.data) {
        this.myLeaveRequests = leaveResponse.data;
        this.addLeaveRequestsToCalendar(leaveResponse.data);
      }

      this.isLoading = false;
      this.generateCalendar(); // Regenerate calendar with new data
    }).catch((error: any) => {
      console.error('Error loading calendar data:', error);
      this.isLoading = false;
    });
  }

  private processCalendarEvents(apiEvents: any[]): CalendarEvent[] {
    return apiEvents.map(event => ({
      id: event.id,
      title: event.title || `${event.user?.firstName} ${event.user?.lastName}`,
      type: this.mapLeaveTypeToCalendarType(event.leaveType?.name || event.type),
      startDate: new Date(event.startDate),
      endDate: new Date(event.endDate),
      color: this.getLeaveTypeColor(event.leaveType?.name || event.type),
    }));
  }

  private addHolidaysToCalendar(holidays: any[]): void {
    holidays.forEach(holiday => {
      if (this.isInCurrentMonth(new Date(holiday.date))) {
        this.events.push({
          id: `holiday-${holiday.id}`,
          title: holiday.name,
          type: 'autres', // holidays mapped to 'autres' type
          startDate: new Date(holiday.date),
          endDate: new Date(holiday.date),
          color: '#ef4444',
        });
      }
    });
  }

  private addLeaveRequestsToCalendar(leaveRequests: any[]): void {
    const currentUser = this.authService.getCurrentUser();
    
    leaveRequests
      .filter((req: any) => req.status === 'approved')
      .forEach((request: any) => {
        if (this.isDateRangeInCurrentMonth(new Date(request.startDate), new Date(request.endDate))) {
          this.events.push({
            id: `leave-${request.id}`,
            title: `My ${request.leaveType?.name || 'Leave'}`,
            type: this.mapLeaveTypeToCalendarType(request.leaveType?.name),
            startDate: new Date(request.startDate),
            endDate: new Date(request.endDate),
            color: this.getLeaveTypeColor(request.leaveType?.name),
          });
        }
      });
  }

  private mapLeaveTypeToCalendarType(leaveTypeName: string): 'congé-payé' | 'congé-non-payé' | 'congé-maladie' | 'congé-maternité' | 'non-traité' | 'autres' {
    const typeMap: { [key: string]: 'congé-payé' | 'congé-non-payé' | 'congé-maladie' | 'congé-maternité' | 'non-traité' | 'autres' } = {
      'Annual Leave': 'congé-payé',
      'Personal Leave': 'congé-payé',
      'Sick Leave': 'congé-maladie',
      'Maternity Leave': 'congé-maternité',
      'Paternity Leave': 'congé-maternité',
      'Emergency Leave': 'non-traité',
      'Study Leave': 'congé-non-payé',
      'Compassionate Leave': 'autres',
    };
    return typeMap[leaveTypeName] || 'autres';
  }

  private isInCurrentMonth(date: Date): boolean {
    return date.getMonth() === this.currentMonth && date.getFullYear() === this.currentYear;
  }

  private isDateRangeInCurrentMonth(startDate: Date, endDate: Date): boolean {
    const currentMonthStart = new Date(this.currentYear, this.currentMonth, 1);
    const currentMonthEnd = new Date(this.currentYear, this.currentMonth + 1, 0);
    
    return (startDate <= currentMonthEnd && endDate >= currentMonthStart);
  }

  private getLeaveTypeColor(leaveTypeName: string): string {
    const colorMap: { [key: string]: string } = {
      'Annual Leave': '#3b82f6',
      'Sick Leave': '#ef4444',
      'Personal Leave': '#10b981',
      'Emergency Leave': '#f59e0b',
      'Maternity Leave': '#8b5cf6',
      'Paternity Leave': '#06b6d4',
      'Study Leave': '#84cc16',
      'Compassionate Leave': '#f97316',
      'holiday': '#ef4444',
    };
    return colorMap[leaveTypeName] || '#6b7280';
  }

  private getJavaScriptMonth(month: number): number {
    return month - 1;
  }

  generateCalendar(): void {
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay()); // Start on the previous Sunday

    this.calendarDays = [];

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);

      const dayEvents = this.events.filter(
        (e) => date >= e.startDate && date <= e.endDate
      );

      this.calendarDays.push({
        date,
        dayNumber: date.getDate(),
        isCurrentMonth: date.getMonth() === this.currentMonth,
        isToday: this.sameYMD(date, new Date()),
        events: dayEvents,
      });
    }
  }

  private sameYMD(a: Date, b: Date): boolean {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  }

  previousMonth(): void {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.generateCalendar();
  }

  nextMonth(): void {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.generateCalendar();
    this.loadCalendarData(); // Reload data for new month
  }

  goToToday(): void {
    const today = new Date();
    this.currentMonth = today.getMonth();
    this.currentYear = today.getFullYear();
    this.generateCalendar();
    this.loadCalendarData();
  }

  goToMonth(month: number, year: number): void {
    this.currentMonth = month;
    this.currentYear = year;
    this.generateCalendar();
    this.loadCalendarData();
  }

  setView(view: string): void {
    this.selectedView = view;
  }

  onDepartmentChange(event: any): void {
    this.selectedDepartment = event.target.value;
  }

  onMonthChange(event: any): void {
    this.selectedMonth = event.target.value;
  }

  refreshCalendar(): void {
    this.loadCalendarData();
  }

  getCurrentMonthYear(): string {
    return `${this.months[this.currentMonth]} ${this.currentYear}`;
  }

  getEventsByType(type: string): CalendarEvent[] {
    return this.events.filter((event) => event.type === type);
  }

  onEventClick(event: CalendarEvent): void {
    console.log('Event clicked:', event);
    // You can implement a modal or detailed view here
  }

  onDayClick(day: CalendarDay): void {
    console.log('Day clicked:', day);
    // You can implement day-specific actions here
  }

  getEventsForDay(date: Date): CalendarEvent[] {
    return this.events.filter(event => 
      date >= event.startDate && date <= event.endDate
    );
  }

  getEventCountForDay(date: Date): number {
    return this.getEventsForDay(date).length;
  }

  isWeekend(date: Date): boolean {
    const day = date.getDay();
    return day === 0 || day === 6; // Sunday or Saturday
  }

  getHolidaysForMonth(): CalendarEvent[] {
    return this.events.filter(event => event.type === 'autres');
  }

  getLeaveRequestsForMonth(): CalendarEvent[] {
    return this.events.filter(event => event.type !== 'autres');
  }
}
