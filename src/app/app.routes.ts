
// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { LandingPage } from './pages/landing-page/landing-page';
import { LoginPage } from './features/auth/login-page/login-page';
import { RegistrationPage } from './features/auth/registration-page/registration-page';
import { ForgotPasswordPage } from './features/auth/forgot-password/forgot-password';
import { ResetPassword } from './features/auth/reset-password/reset-password';
import { authGuard } from './core/guards/auth-guard';
import { adminGuard } from './core/guards/admin-guard';

export const routes: Routes = [
    { path: '', component: LandingPage },
    { path: 'login', component: LoginPage },
    { path: 'register', component: RegistrationPage },
    { path: 'forgot-password', component: ForgotPasswordPage },
    { path: 'reset-password', component: ResetPassword },
    {
        path: 'pickup-requests',
        loadChildren: () => import('./features/pickup-requests/pickup-requests-routing.module')
            .then(m => m.PickupRequestsRoutingModule),
        canActivate: [authGuard]
    },
    { path: '**', redirectTo: '' }

  // Catch all
  { path: '**', redirectTo: '' },
  {
    path: 'admin',
    loadComponent: () => import('./shared/layouts/admin-layout.component/admin-layout.component').then(m => m.AdminLayoutComponent),
    // canActivate: [adminGuard], // Uncomment when auth is ready
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/admin/dashboard/dashboard').then(m => m.Dashboard)
      },
      {
        path: 'manage-materials',
        loadComponent: () => import('./features/manage-materials/manage-materials').then(m => m.ManageMaterialsComponent)
      },
      {
        path: 'review-requests',
        loadComponent: () => import('./features/admin/review-requests/review-requests').then(m => m.ReviewRequests)
      },
      {
        path: 'assign-drivers',
        loadComponent: () => import('./features/admin/assign-drivers/assign-drivers').then(m => m.AssignDrivers)
      },
      {
        path: 'inventory',
        loadComponent: () => import('./features/admin/inventory/inventory').then(m => m.Inventory)
      },
      {
        path: 'drivers',
        loadComponent: () => import('./features/admin/drivers/drivers').then(m => m.Drivers)
      },
      {
        path: 'reports',
        loadComponent: () => import('./features/admin/reports/reports').then(m => m.Reports)
      },
      {
        path: 'settings',
        loadComponent: () => import('./features/admin/settings/settings').then(m => m.Settings)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  
];
