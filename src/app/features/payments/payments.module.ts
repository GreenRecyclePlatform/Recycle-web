// src/app/features/payments/payments.module.ts

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentsRoutingModule } from './payments-routing.module';
import { LayoutsModule } from '../../shared/layouts/layouts.module'; // ✅ Add this

@NgModule({
    declarations: [],  //  Keep empty for standalone components
    imports: [
        CommonModule,
        PaymentsRoutingModule,
        LayoutsModule  // ✅ Add this
    ]
})
export class PaymentsModule { }