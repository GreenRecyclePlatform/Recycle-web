import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: 'payments/onboard', loadComponent: () => import('../app/features/payments/Components/onboard/onboard').then(m => m.OnboardComponent) },
  { path: 'payments/status', loadComponent: () => import('../app/features/payments/Components/account-status-badge/account-status-badge').then(m => m.AccountStatusBadgeComponent) },
  { path: 'payments/request', loadComponent: () => import('../app/features/payments/Components/payout-request/payout-request').then(m => m.PayoutRequestComponent) },
  { path: 'payments/list', loadComponent: () => import('../app/features/payments/Components/payments-list/payments-list').then(m => m.PaymentsListComponent) },
  { path: 'payments/:id', loadComponent: () => import('../app/features/payments/Components/payment-details/payment-details').then(m => m.PaymentDetailsComponent) },
  { path: 'admin/payments', loadComponent: () => import('../app/features/payments/Components/admin-review/admin-review').then(m => m.AdminReviewComponent) },

];
