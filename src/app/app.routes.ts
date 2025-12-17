import { Routes } from '@angular/router';
import { AllDrivers } from './features/driverassignments/components/all-drivers/all-drivers';
import { AssignDriver } from './features/driverassignments/components/assign-driver/assign-driver';
import { DriverDashboard } from './features/driverassignments/components/driver-dashboard/driver-dashboard';
import { authGuard } from './core/guards/auth-guard';
import { adminPagesGuard } from './core/guards/admin-pages-guard'; // ✅ Import new guard
import { LandingPage } from './pages/landing-page/landing-page';
import { LoginPage } from './features/auth/login-page/login-page';
import { RegistrationPage } from './features/auth/registration-page/registration-page';
import { ForgotPasswordPage } from './features/auth/forgot-password/forgot-password';
import { ResetPassword } from './features/auth/reset-password/reset-password';
import { TestNotificationsComponent } from './pages/test-notifications/test-notifications.component';
import { supplierRoutes } from './features/supplier/supplier.routes';
import { ManageMaterials } from './features/manage-materials/manage-materials';

import { Profiledriver } from './features/driverassignments/components/profiledriver/profiledriver';
import { adminGuard } from './core/guards/admin-guard';
import { AdminDashboardComponent } from './pages/admin-dashboard.component/admin-dashboard.component';
import { ReviewRequests } from './features/review-requests/review-requests';
//import { ProfileComponent } from './features/profile/profile.component';
import { UserLayoutComponent } from './shared/layouts/user-layout/user-layout';

export const routes: Routes = [
  //{
  //   path: 'admin',
  //   children: [
  //     { path: 'drivers', component: AllDrivers },
  //     { path: 'assign-drivers', component: AssignDriver },
  //     { path: 'settings', component: Settings },
  //     { path: 'manage-materials', component: ManageMaterials },
  //   ],
  // },
  /*{
   path: 'admin',
       children: [
     { path: 'drivers', component: AllDrivers },  
        { path: 'assign-drivers', component: AssignDriver },  
        {path:'settings',component:Settings},
        {path:'manage-materials',component:ManageMaterials},
  {path:'payments' , component:AdminPaymentsComponent, data:{ roles: ['Admin'] }}]},*/

  {
    path: 'driver',
    children: [
      { path: 'DashBoardDrivers', component: DriverDashboard },
      { path: 'DriverProfile', component: Profiledriver },
    ]
  },

  { path: '', component: LandingPage },
  { path: 'login', component: LoginPage },
  { path: 'register', component: RegistrationPage },
  { path: 'forgot-password', component: ForgotPasswordPage },
  { path: 'reset-password', component: ResetPassword },
  //{ path: 'profile', component: ProfileComponent },

  {
    path: 'supplier',
    children: supplierRoutes,
    // Add Auth Guard here if needed
    // canActivate: [AuthGuard]
  },

  // Driver routes
  { path: 'DashBoardDrivers', component: DriverDashboard },
  { path: 'DriverProfile', component: Profiledriver },

  // Reviews
  {
    path: '',
    component: UserLayoutComponent,
    children: [
      {
        path: 'reviews',
        loadChildren: () =>
          import('./features/reviews/reviews.routes').then((m) => m.REVIEW_ROUTES),
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent)
      }
    ]
  },
 
  // Pickup requests
  {
    path: 'pickup-requests',
    loadChildren: () =>
      import('./features/pickup-requests/pickup-requests-routing.module').then(
        (m) => m.PickupRequestsRoutingModule
      ),
    //canActivate: [authGuard],
  },

  // Payments Module
  {
    path: 'payments',
    loadChildren: () =>
      import('./features/payments/payments-routing.module').then((m) => m.PaymentsRoutingModule),
    //canActivate: [authGuard]
  },

  // Admin routes - COMBINED INTO ONE
  {
    path: 'admin',
    loadComponent: () =>
      import('./shared/layouts/admin-layout.component/admin-layout.component').then(
        (m) => m.AdminLayoutComponent
      ),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        component: AdminDashboardComponent,
        //canActivate: [adminPagesGuard], // ✅ Use new guard
        data: { title: 'Dashboard' }
      },
      { path: 'drivers', component: AllDrivers },
      { path: 'assign-drivers', component: AssignDriver },
      {
        path: 'manage-materials',
        component: ManageMaterials,
        //canActivate: [adminPagesGuard], // ✅ Use new guard
        data: { title: 'Manage Materials' }
      },
      { path: 'review-requests', component: ReviewRequests },
      

    ]
  },

  // Catch all - ONLY ONE AT THE END
  { path: '**', redirectTo: '' },
];