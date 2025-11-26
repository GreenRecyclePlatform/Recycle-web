import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AssignDriver } from './features/driverassignments/components/assign-driver/assign-driver';
import { DriverDashboard } from "./features/driverassignments/components/driver-dashboard/driver-dashboard";
import { AllDrivers } from './features/driverassignments/components/all-drivers/all-drivers';
import { LandingPageComponent } from "./features/landingpage/components/landing-page/landing-page";

@Component({
  selector: 'app-root',
  imports: [AssignDriver, RouterOutlet, DriverDashboard, AllDrivers, LandingPageComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('my-app');
}
