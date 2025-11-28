
// import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { PickupRequestsRoutingModule } from './pickup-requests-routing.module';

// // Import standalone components
// import { CreateRequest } from './components/create-request/create-request';
// import { UserRequests } from './components/user-requests/user-requests';
// import { RequestDetails } from './components/request-details/request-details';
// import { StatusTimeline } from './components/status-timeline/status-timeline';
// import { AdminRequestsDashboard } from './components/admin-requests-dashboard/admin-requests-dashboard';

// @NgModule({
//   declarations: [],  //  EMPTY - no declarations for standalone components!
//   imports: [
//     CommonModule,
//     PickupRequestsRoutingModule,
//     // Import standalone components here
//     CreateRequest,
//     UserRequests,
//     RequestDetails,
//     StatusTimeline,
//     AdminRequestsDashboard
//   ]
// })
// export class PickupRequestsModule { }
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PickupRequestsRoutingModule } from './pickup-requests-routing.module';

@NgModule({
  declarations: [],  // ✅ Keep empty for standalone components
  imports: [
    CommonModule,
    PickupRequestsRoutingModule
  ]
})
export class PickupRequestsModule { }