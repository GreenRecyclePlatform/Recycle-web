// import { NgModule } from '@angular/core';
// import { RouterModule, Routes } from '@angular/router';
// import { authGuard } from '../../core/guards/auth.guard';
// import { roleGuard } from '../../core/guards/role-guard';
// import { CreateRequest } from './components/create-request/create-request';
// import { UserRequests } from './components/user-requests/user-requests';
// import { RequestDetails } from './components/request-details/request-details';
// import { AdminRequestsDashboard } from './components/admin-requests-dashboard/admin-requests-dashboard';
// import { EditRequest } from './components/edit-request/edit-request';

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
//                 path: 'my-requests',
//                 component: UserRequests,
//                 data: { roles: ['User'] }
//             },
//             {
//                 path: 'create',
//                 component: CreateRequest,
//                 data: { roles: ['User'] }
//             },
//             {
//                 path: 'edit/:id',
//                 component: EditRequest
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
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { roleGuard } from '../../core/guards/role-guard';
import { CreateRequest } from './components/create-request/create-request';
import { UserRequests } from './components/user-requests/user-requests';
import { RequestDetails } from './components/request-details/request-details';
import { AdminRequestsDashboard } from './components/admin-requests-dashboard/admin-requests-dashboard';
import { EditRequest } from './components/edit-request/edit-request';
import { UserLayoutComponent } from '../../shared/layouts/user-layout/user-layout';

const routes: Routes = [
    {
        //canActivate: [authGuard],
        path: '',
        children: [
            // ✅ USER ROUTES - Wrapped with layout
            {
                path: '',
                component: UserLayoutComponent,
                children: [
                    {
                        path: '',
                        redirectTo: 'my-requests',
                        pathMatch: 'full'
                    },
                    {
                        path: 'my-requests',
                        component: UserRequests,
                        data: { roles: ['User'] }
                    },
                    {
                        path: 'create',
                        component: CreateRequest,
                        data: { roles: ['User'] }
                    },
                    {
                        path: 'edit/:id',
                        component: EditRequest
                    },
                    {
                        path: 'details/:id',
                        component: RequestDetails
                    },
                  
                ]
            },
            // ✅ ADMIN ROUTES - No layout (your team member handles this)
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