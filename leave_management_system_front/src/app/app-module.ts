import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { login } from './auth/components/login/login';
import { RegisterComponent } from './public/register/register';
import { LandingPage } from './public/components/landing-page/landing-page';
import { HttpClientModule } from '@angular/common/http';
import { Dashboard } from './private/components/users/dashboard/user-dashboard';
import { UserProfile } from './private/components/users/profile/user-profile';
import { UserSideBar } from './layout/user/user-side-bar/user-side-bar';
import { UserNavBar } from './layout/user/user-nav-bar/user-nav-bar';
import { RouterModule } from '@angular/router';
import { UserCalender } from './private/components/users/calender/user-calender';
import { UserLeaveRequests } from './private/components/users/leave-requests/user-leave-requests';
import { UserApproves } from './private/components/users/approves/user-approves';
// Admin Components
import { AdminDashboard } from './private/components/admin/dashboard/admin-dashboard';
import { AdminSideBar } from './layout/admin/admin-side-bar/admin-side-bar';
import { AdminNavBar } from './layout/admin/admin-nav-bar/admin-nav-bar';
// Services
import { ApiService } from './private/services/api.service';
import { AuthService } from './private/services/auth.service';

@NgModule({
  declarations: [
    App,
    login,
    RegisterComponent,
    Dashboard,
    LandingPage,
    UserProfile,
    UserSideBar,
    UserNavBar,
    UserCalender,
    UserLeaveRequests,
    UserApproves,
    // Admin Components
    AdminDashboard,
    AdminSideBar,
    AdminNavBar,
  ],
  imports: [
    RouterModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    ApiService,
    AuthService,
  ],
  bootstrap: [App],
})
export class AppModule {}
