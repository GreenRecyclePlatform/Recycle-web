// src/app/features/payments/payments-routing.module.ts

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth-guard';
import { roleGuard } from '../../core/guards/role-guard';
import { PaymentHistory } from './components/payment-history/payment-history';
import { PaymentDetails } from './components/payment-details/payment-details';
import { WithdrawEarnings } from './components/withdraw-earnings/withdraw-earnings';
import { AdminPaymentDashboard } from './components/admin-payment-dashboard/admin-payment-dashboard';
import { ManageWithdrawals } from './components/manage-withdrawals/manage-withdrawals';

const routes: Routes = [
    {
        path: '',
        canActivate: [authGuard],
        children: [
            {
                path: '',
                redirectTo: 'history',
                pathMatch: 'full'
            },
            {
                path: 'history',
                component: PaymentHistory,
                data: { roles: ['User', 'Driver'] }
            },
            {
                path: 'details/:id',
                component: PaymentDetails,
                data: { roles: ['User', 'Driver'] }
            },
            {
                path: 'withdraw',
                component: WithdrawEarnings,
                data: { roles: ['User', 'Driver'] }
            },
            // Admin routes
            {
                path: 'admin/dashboard',
                component: AdminPaymentDashboard,
                canActivate: [roleGuard],
                data: { roles: ['Admin'] }
            },
            {
                path: 'admin/manage-withdrawals',
                component: ManageWithdrawals,
                canActivate: [roleGuard],
                data: { roles: ['Admin'] }
            },
            {
                path: 'admin/details/:id',
                component: PaymentDetails,
                canActivate: [roleGuard],
                data: { roles: ['Admin'] }
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PaymentsRoutingModule { }