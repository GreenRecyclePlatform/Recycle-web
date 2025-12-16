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

const routes: Routes = [

    // path: '',
    // component: UserLayoutComponent, // wrap all user routes with user layout
    // canActivate: [authGuard],
    // children: [
    //     {
    //         path: '',
    //         redirectTo: 'history',
    //         pathMatch: 'full'
    //     },
    //     {
    //         path: 'history',
    //         component: PaymentHistory,
    //         data: { roles: ['User', 'Driver'] }
    //     },
    //     {
    //         path: 'details/:id',
    //         component: PaymentDetails,
    //         data: { roles: ['User', 'Driver'] }
    //     },
    //     // {
    //     //     path: 'withdraw',
    //     //     component: WithdrawEarnings,
    //     //     data: { roles: ['User', 'Driver'] }
    //     // },
    //     // Admin routes
    //     {
    //         path: 'admin/dashboard',
    //         component: AdminPaymentDashboardComponent,
    //         canActivate: [roleGuard],
    //         data: { roles: ['Admin'] }
    //     },
    //     // {
    //     //     path: 'admin/manage-withdrawals',
    //     //     component: ManageWithdrawals,
    //     //     canActivate: [roleGuard],
    //     //     data: { roles: ['Admin'] }
    //     // },
    //     {
    //         path: 'admin/details/:id',
    //         component: PaymentDetails,
    //         canActivate: [roleGuard],
    //         data: { roles: ['Admin'] }
    //     }
    //]
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