// src/app/features/payments/payments.module.ts

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentsRoutingModule } from './payments-routing.module';

@NgModule({
    declarations: [],  //  Keep empty for standalone components
    imports: [
        CommonModule,
        PaymentsRoutingModule,
        // ✅ Add this
    ]
})
export class PaymentsModule { }