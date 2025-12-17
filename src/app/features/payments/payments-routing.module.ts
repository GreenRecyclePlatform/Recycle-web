// src/app/features/payments/payments-routing.module.ts

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth-guard';
import { roleGuard } from '../../core/guards/role-guard';
import { PaymentHistory } from './components/payment-history/payment-history';
import { PaymentDetails } from './components/payment-details/payment-details';
//import { WithdrawEarnings } from './components/withdraw-earnings/withdraw-earnings';
import { AdminPaymentDashboardComponent } from './components/admin-payment-dashboard/admin-payment-dashboard';
import { UserLayoutComponent } from '../../shared/layouts/user-layout/user-layout';
//import { ManageWithdrawals } from './components/manage-withdrawals/manage-withdrawals';
import { AdminLayoutComponent } from '../../shared/layouts/admin-layout.component/admin-layout.component';

const routes: Routes = [

    {
        path: '',
        component: UserLayoutComponent, // ✅ Wrap with layout
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
            }
        ]
    },
    // ✅ Admin routes separate (no layout wrapper)
    {
        path: 'admin',
        component: AdminLayoutComponent,
        canActivate: [authGuard, roleGuard],
        data: { roles: ['Admin'] },
        children: [
            {
                path: 'dashboard',
                component: AdminPaymentDashboardComponent
            },
            {
                path: 'details/:id',
                component: PaymentDetails
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PaymentsRoutingModule { }
