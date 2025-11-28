// import { NgModule } from '@angular/core';
// import { RouterModule, Routes } from '@angular/router';
// import { authGuard } from '../../core/guards/auth-guard';
// import { roleGuard } from '../../core/guards/role-guard';

// import { CreateRequest } from './components/create-request/create-request';
// import { UserRequests } from './components/user-requests/user-requests';
// import { RequestDetails } from './components/request-details/request-details';
// import { AdminRequestsDashboard } from './components/admin-requests-dashboard/admin-requests-dashboard';

// const routes: Routes = [
//     {
//         path: '',
//         canActivate: [authGuard],
//         children: [
//             {
//                 path: '',
//                 redirectTo: 'my-requests',
//                 pathMatch: 'full'
//             },
//             {
//                 path: 'create',
//                 component: CreateRequest,
//                 data: { roles: ['User'] }
//             },
//             {
//                 path: 'my-requests',
//                 component: UserRequests,
//                 data: { roles: ['User'] }
//             },
//             {
//                 path: 'details/:id',
//                 component: RequestDetails
//             },
//             {
//                 path: 'admin-dashboard',
//                 component: AdminRequestsDashboard,
//                 canActivate: [roleGuard],
//                 data: { roles: ['Admin'] }
//             }
//         ]
//     }
// ];

// @NgModule({
//     imports: [RouterModule.forChild(routes)],
//     exports: [RouterModule]
// })
// export class PickupRequestsRoutingModule { }
//==========================================================================================
// import { NgModule } from '@angular/core';
// import { RouterModule, Routes } from '@angular/router';
// import { authGuard } from '../../core/guards/auth-guard';
// import { roleGuard } from '../../core/guards/role-guard';

// import { CreateRequest } from './components/create-request/create-request';
// import { UserRequests } from './components/user-requests/user-requests';
// import { RequestDetails } from './components/request-details/request-details';
// import { AdminRequestsDashboard } from './components/admin-requests-dashboard/admin-requests-dashboard';

// const routes: Routes = [
//     {
//         path: '', // This means /pickup-requests
//         children: [
//             {
//                 path: '',
//                 redirectTo: 'my-requests',
//                 pathMatch: 'full'
//             },
//             {
//                 path: 'create', // This becomes /pickup-requests/create
//                 component: CreateRequest
//             },
//             {
//                 path: 'my-requests', // This becomes /pickup-requests/my-requests
//                 component: UserRequests
//             },
//             {
//                 path: 'details/:id', // This becomes /pickup-requests/details/:id
//                 component: RequestDetails
//             },
//             {
//                 path: 'admin-dashboard',
//                 component: AdminRequestsDashboard,
//                 canActivate: [roleGuard],
//                 data: { roles: ['Admin'] }
//             }
//         ]
//     }
// ];

// @NgModule({
//     imports: [RouterModule.forChild(routes)],
//     exports: [RouterModule]
// })
// export class PickupRequestsRoutingModule { }

//==========================================================================================
// import { NgModule } from '@angular/core';
// import { RouterModule, Routes } from '@angular/router';
// import { authGuard } from '../../core/guards/auth-guard';
// import { roleGuard } from '../../core/guards/role-guard';
// import { CreateRequest } from './components/create-request/create-request';
// import { UserRequests } from './components/user-requests/user-requests';
// import { RequestDetails } from './components/request-details/request-details';
// import { AdminRequestsDashboard } from './components/admin-requests-dashboard/admin-requests-dashboard';

// const routes: Routes = [
//     {
//         path: '',
//         canActivate: [authGuard],


//         children: [
//             {
//                 path: '',
//                 redirectTo: 'my-requests',
//                 pathMatch: 'full'
//             },
//             {
//                 path: 'create',
//                 component: CreateRequest,
//                 data: { roles: ['User'] }
//             },
//             {
//                 path: 'my-requests',
//                 component: UserRequests,
//                 data: { roles: ['User'] }
//             },
//             {
//                 path: 'details/:id',
//                 component: RequestDetails
//             },
//             {
//                 path: 'admin-dashboard',
//                 component: AdminRequestsDashboard,
//                 canActivate: [roleGuard],
//                 data: { roles: ['Admin'] }
//             }
//         ]
//     }
// ];

// @NgModule({
//     imports: [RouterModule.forChild(routes)],
//     exports: [RouterModule]
// })
// export class PickupRequestsRoutingModule { }
// src/app/features/pickup-requests/pickup-requests-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth-guard';
import { roleGuard } from '../../core/guards/role-guard';
import { CreateRequest } from './components/create-request/create-request';
import { UserRequests } from './components/user-requests/user-requests';
import { RequestDetails } from './components/request-details/request-details';
import { AdminRequestsDashboard } from './components/admin-requests-dashboard/admin-requests-dashboard';

const routes: Routes = [
    {
        path: '',
        canActivate: [authGuard],
        children: [
            {
                path: '',
                redirectTo: 'my-requests',
                pathMatch: 'full'
            },
            {
                path: 'create',
                component: CreateRequest,
                data: { roles: ['User'] }
            },
            {
                path: 'my-requests',
                component: UserRequests,
                data: { roles: ['User'] }
            },
            {
                path: 'details/:id',
                component: RequestDetails
            },
            {
                path: 'admin-dashboard',
                component: AdminRequestsDashboard,
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
export class PickupRequestsRoutingModule { }