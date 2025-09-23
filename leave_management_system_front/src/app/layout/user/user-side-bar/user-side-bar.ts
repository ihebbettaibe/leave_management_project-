import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../private/services/auth.service';

interface MenuItem {
  icon: string;
  label: string;
  route: string;
  active?: boolean;
  requiresRole?: string[];
}

@Component({
  selector: 'app-user-side-bar',
  standalone: false,
  templateUrl: './user-side-bar.html',
  styleUrls: ['./user-side-bar.css'],
})
export class UserSideBar implements OnInit {
  menuItems: MenuItem[] = [
    { icon: '📊', label: 'Dashboard', route: '/dashboard' },
    { icon: '📈', label: 'Analytics', route: '/analytics' },
    { icon: '👥', label: 'profil', route: '/profile', active: true },
    { icon: '📋', label: 'Requests', route: '/leaverequests' },
    { icon: '✅', label: 'Approve', route: '/approves', requiresRole: ['admin', 'hr'] },
    { icon: '📆', label: 'Calender', route: '/calender' },
  ];

  filteredMenuItems: MenuItem[] = [];

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.filterMenuItems();
  }

  private filterMenuItems(): void {
    this.filteredMenuItems = this.menuItems.filter(item => {
      if (!item.requiresRole) {
        return true;
      }
      return item.requiresRole.some(role => this.authService.hasRole(role));
    });
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
