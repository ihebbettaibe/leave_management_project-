import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface NavItem {
  label: string;
  route: string;
  active?: boolean;
}

@Component({
  selector: 'app-user-nav-bar',
  standalone: false,
  templateUrl: './user-nav-bar.html',
  styleUrl: './user-nav-bar.css',
})
export class UserNavBar {
  navItems: NavItem[] = [
    { label: 'Dashboard', route: '/dashboard' },
    { label: 'Employee', route: '/profile', active: true },
    { label: 'Holiday Chart', route: '/holidays' },
    { label: 'Leaves', route: '/leaves' },
    { label: 'Leave Request', route: '/leave-request' },
  ];

  // User data
  currentUser = {
    name: 'Admin',
    email: 'admin@domain.in',
    avatar: 'A',
    role: 'Administrator',
  };

  // Dropdown states
  showNotificationDropdown = false;
  
  // HR and Manager contact information
  hrContacts = [
    {
      name: 'Sarah Johnson',
      title: 'HR Manager',
      email: 'sarah.johnson@company.com',
      department: 'Human Resources'
    },
    {
      name: 'Michael Chen',
      title: 'Department Manager',
      email: 'michael.chen@company.com',
      department: 'Operations'
    },
    {
      name: 'Lisa Williams',
      title: 'HR Specialist',
      email: 'lisa.williams@company.com',
      department: 'Human Resources'
    }
  ];

  constructor(private router: Router) {}

  // Method to navigate to a specific route
  navigateTo(route: string): void {
    // Update active state
    this.navItems.forEach((item) => (item.active = item.route === route));
    this.router.navigate([route]);
  }

  // Method to check if a route is active
  isActive(route: string): boolean {
    return this.router.url === route;
  }

  // User menu methods
  showUserMenu(): void {
    console.log('User menu clicked');
    // You can implement a dropdown menu here with options like:
    // - View Profile
    // - Account Settings
    // - Logout
    // For now, we'll show a simple alert or navigate to profile
    this.showUserOptions();
  }

  private showUserOptions(): void {
    // Example of user menu options
    const options = [
      'View Profile',
      'Account Settings',
      'Change Password',
      'Logout',
    ];

    // You can implement a proper dropdown component here
    console.log('User menu options:', options);
  }

  // Action button methods
  showNotifications(): void {
    console.log('Notifications clicked');
    this.showNotificationDropdown = !this.showNotificationDropdown;
  }

  closeDropdowns(): void {
    this.showNotificationDropdown = false;
  }

  sendEmailToContact(email: string, name: string): void {
    console.log(`Opening email to: ${name} (${email})`);
    // Open the user's default email client
    window.open(`mailto:${email}?subject=Leave Request Inquiry&body=Dear ${name},%0D%0A%0D%0AI would like to discuss my leave request.%0D%0A%0D%0AThank you,%0D%0A${this.currentUser.name}`, '_blank');
  }

  showSettings(): void {
    console.log('Settings clicked');
    // Show settings dropdown instead of navigating
    // You can implement settings panel/dropdown here
    // For now, let's just navigate to profile instead of non-existent settings
    this.router.navigate(['/profile']);
  }

  // Method to logout user
  logout(): void {
    // Implement logout logic here
    console.log('Logging out...');
    // Clear any stored authentication tokens
    // localStorage.removeItem('authToken');
    // sessionStorage.clear();

    // Redirect to login page
    this.router.navigate(['/login']);
  }

  // Method to update user info
  updateUserInfo(userInfo: any): void {
    this.currentUser = { ...this.currentUser, ...userInfo };
  }

  // Getter methods for template
  get userName(): string {
    return this.currentUser.name;
  }

  get userEmail(): string {
    return this.currentUser.email;
  }

  get userAvatar(): string {
    return this.currentUser.avatar;
  }

  // Method to handle keyboard navigation
  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      // Close any open dropdowns
      console.log('Escape pressed - closing dropdowns');
    }
  }
}
