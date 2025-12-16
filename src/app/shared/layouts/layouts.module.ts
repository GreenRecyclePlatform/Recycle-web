import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { UserLayoutComponent } from './user-layout/user-layout';
import { Navbar } from '../components/navbar/navbar'; // For navbar

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        RouterModule,    // ✅ CRITICAL: Needed for routerLink and router-outlet
        Navbar,
        UserLayoutComponent,
        // ✅ Imports navbar component
    ],
    exports: [
        UserLayoutComponent,
        Navbar  // ✅ Exports navbar component
    ]
})
export class LayoutsModule { }