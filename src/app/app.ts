import { Component, OnInit, OnDestroy } from '@angular/core';
import { SignalrService } from './core/services/signalr.service';
import { AuthService } from './core/services/authservice';
import { Subject, takeUntil } from 'rxjs';
import { RouterOutlet } from '@angular/router';
import { AssignDriver } from './features/driverassignments/components/assign-driver/assign-driver';
import { DriverDashboard } from "./features/driverassignments/components/driver-dashboard/driver-dashboard";
import { AllDrivers } from './features/driverassignments/components/all-drivers/all-drivers';
//import { LandingPageComponent } from "./features/landingpage/components/landing-page/landing-page";
import { RouterModule } from '@angular/router';

import { LandingPage } from './pages/landing-page/landing-page';
import { Navbar } from './shared/components/navbar/navbar';
import { DriverSidebar } from "./features/driverassignments/components/driver-sidebar/driver-sidebar";
import { Profiledriver } from './features/driverassignments/components/profiledriver/profiledriver';


@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  imports: [RouterOutlet,Profiledriver],
    //imports: [AssignDriver, RouterOutlet, DriverDashboard, AllDrivers, LandingPage, Navbar, DriverSidebar, Profiledriver], 

})
export class App implements OnInit, OnDestroy {
  title = 'RecycleHub';
  private destroy$ = new Subject<void>();

  constructor(private signalRService: SignalrService, private authService: AuthService) {}

  async ngOnInit(): Promise<void> {
    console.log('🚀 App initialized');

    // Request notification permission when app loads
    this.signalRService.requestNotificationPermission();

    // Connect to SignalR when user is authenticated
    this.authService.isAuthenticated$.pipe(takeUntil(this.destroy$)).subscribe(async (isAuth) => {
      console.log('🔐 Auth state changed:', isAuth ? 'AUTHENTICATED ✅' : 'NOT AUTHENTICATED ❌');

      if (isAuth) {
        const token = this.authService.getToken(); // ✅ Now this works!

        if (token && this.authService.isTokenValid()) {
          try {
            console.log('🔌 Starting SignalR connection...');
            await this.signalRService.startConnection(token);

            // Setup notification listener
            this.signalRService.onNotificationReceived((notification) => {
              console.log('📬 New notification received in app:', notification);
              // You can show a toast notification here
              // this.toastr.info(notification.message, notification.title);
            });

            console.log('✅ SignalR setup complete');
          } catch (error) {
            console.error('❌ Failed to start SignalR:', error);
          }
        } else {
          console.warn('⚠️ Token invalid or missing');
        }
      } else {
        // Disconnect when user logs out
        console.log('🔌 Stopping SignalR connection...');
        await this.signalRService.stopConnection();
        console.log('✅ SignalR disconnected');
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.signalRService.stopConnection();
  }
}

