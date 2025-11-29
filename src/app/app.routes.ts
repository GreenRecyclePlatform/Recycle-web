// import { Routes } from '@angular/router';

// export const routes: Routes = [
//   {
//     path: 'reviews',
//     loadChildren: () => import('./features/reviews/reviews.routes').then((m) => m.REVIEW_ROUTES),
//   },
//   {
//     path: '',
//     redirectTo: '/reviews',
//     pathMatch: 'full',
//   },
//   {
//     path: '**',
//     redirectTo: '/reviews',
//   },
// ];
// //

// reviews.routes.ts
// app.routes.ts
// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { LandingPage } from './pages/landing-page/landing-page';
import { LoginPage } from './features/auth/login-page/login-page';
import { RegistrationPage } from './features/auth/registration-page/registration-page';
import { ForgotPasswordPage } from './features/auth/forgot-password/forgot-password';
import { ResetPassword } from './features/auth/reset-password/reset-password';
import { TestNotificationsComponent } from './pages/test-notifications/test-notifications.component';

export const routes: Routes = [
  { path: '', component: LandingPage },
  { path: 'login', component: LoginPage },
  { path: 'register', component: RegistrationPage },
  { path: 'forgot-password', component: ForgotPasswordPage },
  { path: 'reset-password', component: ResetPassword },
  {
    path: 'reviews',
    loadChildren: () => import('./features/reviews/reviews.routes').then((m) => m.REVIEW_ROUTES),
  },
  // Catch all
    path: 'pickup-requests',
    loadChildren: () =>
      import('./features/pickup-requests/pickup-requests-routing.module').then(
        (m) => m.PickupRequestsRoutingModule
      ),
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: '' },
  {
    path: 'admin',
    loadComponent: () =>
      import('./shared/layouts/admin-layout.component/admin-layout.component').then(
        (m) => m.AdminLayoutComponent
      ),
    // canActivate: [adminGuard], // Uncomment when auth is ready
    children: [
      {
        path: 'manage-materials',
        loadComponent: () =>
          import('./features/manage-materials/manage-materials').then((m) => m.ManageMaterials),
      },
      {
        path: 'settings',
        loadComponent: () => import('./features/admin/settings/settings').then((m) => m.Settings),
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
];
