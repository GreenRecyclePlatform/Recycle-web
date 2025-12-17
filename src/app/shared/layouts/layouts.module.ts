import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { UserLayoutComponent } from './user-layout/user-layout';
import { Navbar } from '../components/navbar/navbar'; // For navbar
import { ReviewListComponent } from '../../features/reviews/components/review-list/review-list';
import { ProfileComponent } from '../../features/profile/profile.component';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        RouterModule,    // ✅ CRITICAL: Needed for routerLink and router-outlet
        Navbar,
        UserLayoutComponent,
        ProfileComponent
        // ✅ Imports navbar component
    ],
    exports: [
        UserLayoutComponent,
        Navbar,
        ProfileComponent,  // ✅ Exports navbar component
    ]
})
export class LayoutsModule { }