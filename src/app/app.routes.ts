import { Routes } from '@angular/router';
import { AllDrivers} from './features/driverassignments/components/all-drivers/all-drivers';
import { AssignDriver } from './features/driverassignments/components/assign-driver/assign-driver';
import { DriverDashboard } from './features/driverassignments/components/driver-dashboard/driver-dashboard';

import { LandingPage } from './pages/landing-page/landing-page';
import { LoginPage } from './features/auth/login-page/login-page';
import { RegistrationPage } from './features/auth/registration-page/registration-page';
import { ForgotPasswordPage } from './features/auth/forgot-password/forgot-password';
import { ResetPassword } from './features/auth/reset-password/reset-password';

export const routes: Routes = [

    

    { path: 'AllDriver', component: AllDrivers},
    {path: 'AssignDrivers', component: AssignDriver},
    { path: 'DashBoardDrivers', component: DriverDashboard },
    { path: '', component: LandingPage },
  { path: 'login', component: LoginPage },
  { path: 'register', component: RegistrationPage },
  { path: 'forgot-password', component: ForgotPasswordPage },
  { path: 'reset-password', component: ResetPassword },

  // Catch all
  { path: '**', redirectTo: '' },];

