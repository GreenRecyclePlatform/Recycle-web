
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PickupRequestsRoutingModule } from './pickup-requests-routing.module';
import { SharedModule } from '../../shared/shared.module';  // Import shared module
//import { LayoutsModule } from '../../shared/layouts/layouts.module'; // ✅ Import layouts

@NgModule({
  declarations: [],  //  Keep empty for standalone components
  imports: [
    CommonModule,
    PickupRequestsRoutingModule,
    SharedModule,  // Include shared module
    //LayoutsModule,  // Include layouts module

  ]
})
export class PickupRequestsModule { }