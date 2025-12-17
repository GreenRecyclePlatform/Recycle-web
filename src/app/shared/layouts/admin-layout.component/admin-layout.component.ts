import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Navbar } from '../../components/navbar/navbar';
import { AuthService } from '../../../core/services/authservice';
import { NotificationService } from '../../../core/services/notification.service';
import { SignalrService } from '../../../core/services/signalr.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, Navbar],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent implements OnInit, OnDestroy {
  adminName: string = 'Admin User';
  adminRole: string = 'Admin';
  notificationCount: number = 0;
  isSidebarOpen = false;

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService,
    private signalRService: SignalrService
  ) {}

  ngOnInit(): void {
    this.loadUserData();

    // Subscribe to notification count for sidebar badge
    this.notificationService.unreadCount$
      .pipe(takeUntil(this.destroy$))
      .subscribe((count: number) => {
        this.notificationCount = count;
      });
  }

  private loadUserData(): void {
    try {
      const userDataStr = true;
      // localStorage.getItem('userData') || sessionStorage.getItem('userData');

      if (userDataStr) {
        // const userData = JSON.parse(userDataStr);
        this.adminName = this.authService.getUserName() || "AdminUser";
        console.log(`uuuuuuuuuuuuuuuuuuuuuuuuuuu${this.adminName}`);
        //this.adminRole = userData.role || 'Admin';
      } else {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (token) {
          const payload = this.decodeToken(token);
          this.adminName = payload?.name || payload?.username || 'Admin User';
          this.adminRole = payload?.role || 'Admin';
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }

  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  /**
   * Toggle sidebar for mobile
   */
  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  /**
   * Close sidebar when nav item is clicked on mobile
   */
  closeSidebarOnMobile(): void {
    if (window.innerWidth <= 768) {
      this.isSidebarOpen = false;
    }
  }

  /**
   * Close sidebar when window is resized to desktop
   */
  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    if (window.innerWidth > 768) {
      this.isSidebarOpen = false;
    }
  }

  logout(): void {
    // Stop SignalR connection
    this.signalRService.stopConnection().then(() => {
      console.log('✅ SignalR disconnected');
    });

    // Clear notification state
    this.notificationService.clearState();

    // Clear storage
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userData');

    // Logout from auth service
    this.authService.logout();

    // Navigate to landing page
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
