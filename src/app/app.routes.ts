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
import { Routes } from '@angular/router';
import { TestNotificationsComponent } from './pages/test-notifications/test-notifications.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/test',
    pathMatch: 'full',
  },
  {
    path: 'test',
    component: TestNotificationsComponent,
  },
  {
    path: 'reviews',
    loadChildren: () => import('./features/reviews/reviews.routes').then((m) => m.REVIEW_ROUTES),
  },
  // Uncomment these when ready to use
  // {
  //   path: 'home',
  //   loadComponent: () =>
  //     import('./features/home/home.component').then(m => m.HomeComponent)
  // },
  // {
  //   path: 'login',
  //   loadComponent: () =>
  //     import('./features/auth/login/login.component').then(m => m.LoginComponent)
  // },
  // {
  //   path: 'register',
  //   loadComponent: () =>
  //     import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  // },
  {
    path: '**',
    redirectTo: '/test',
  },
];