// import { Routes } from '@angular/router';
// import { authGuard } from './core/guards/auth-guard';
// import { roleGuard } from './core/guards/role-guard';

// export const routes: Routes = [
//     {
//         path: '',
//         redirectTo: '/home',
//         pathMatch: 'full'
//     },



//     {
//         path: 'pickup-requests',
//         loadChildren: () => import('./features/pickup-requests/pickup-requests-module')
//             .then(m => m.PickupRequestsModule),
//         canActivate: [authGuard]
//     },


//     {
//         path: '**',
//         redirectTo: '/home'
//     }
// ];
import { Routes } from '@angular/router';
// import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    {
        path: 'pickup-requests',
        loadChildren: () => import('./features/pickup-requests/pickup-requests-routing.module')
            .then(m => m.PickupRequestsRoutingModule), // ✅ Load the routing module
        // canActivate: [authGuard]
    },
    {
        path: '**',
        redirectTo: '/home'
    }
];