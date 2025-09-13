import { Component } from '@angular/core';
import { Router } from '@angular/router';
interface MenuItem {
  icon: string;
  label: string;
  route: string;
  active?: boolean;
}
@Component({
  selector: 'app-user-side-bar',
  standalone: false,
  templateUrl: './user-side-bar.html',
  styleUrl: './user-side-bar.css',
})
export class UserSideBar {
  menuItems: MenuItem[] = [
    { icon: '📊', label: 'Dashboard', route: '/dashboard' },
    { icon: '👥', label: 'profil', route: '/profile', active: true },
    { icon: '📋', label: 'Requests', route: '/leaverequests' },
    { icon: '✅', label: 'Approve', route: '/approve' },
    { icon: '📆', label: 'Calender', route: '/calender' },
  ];

  constructor(private router: Router) {}

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
