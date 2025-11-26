import { Routes } from '@angular/router';
import { AllDrivers} from './features/driverassignments/components/all-drivers/all-drivers';
import { AssignDriver } from './features/driverassignments/components/assign-driver/assign-driver';
import { DriverDashboard } from './features/driverassignments/components/driver-dashboard/driver-dashboard';

export const routes: Routes = [

    

    { path: 'AllDriver', component: AllDrivers},
    {path: 'AssignDrivers', component: AssignDriver},
    { path: 'DashBoardDrivers', component: DriverDashboard },
];
