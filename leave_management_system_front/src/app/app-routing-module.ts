import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { login } from './auth/components/login/login';
import { RegisterComponent } from './public/register/register';

import { LandingPage } from './public/components/landing-page/landing-page';
import { Dashboard } from './private/components/users/dashboard/user-dashboard';
import { UserProfile } from './private/components/users/profile/user-profile';
import { UserCalender } from './private/components/users/calender/user-calender';
import { UserLeaveRequests } from './private/components/users/leave-requests/user-leave-requests';
import { UserApproves } from './private/components/users/approves/user-approves';
// Admin Components
import { AdminDashboard } from './private/components/admin/dashboard/admin-dashboard';

const routes: Routes = [
  { path: 'login', component: login },
  { path: 'register', component: RegisterComponent },
  // User Routes
  { path: 'profile', component: UserProfile },
  { path: 'dashboard', component: Dashboard },
  { path: 'calender', component: UserCalender },
  { path: 'approves', component: UserApproves },
  { path: 'leaverequests', component: UserLeaveRequests },
  // Admin Routes
  { path: 'admin/dashboard', component: AdminDashboard },
  // Settings and other pages
  { path: 'settings', redirectTo: '/profile', pathMatch: 'full' },
  { path: 'help', redirectTo: '/dashboard', pathMatch: 'full' },
  // Default route
  { path: '', component: LandingPage },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
