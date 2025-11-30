import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { LucideAngularModule, Leaf, Bell, Menu, User, LogOut } from 'lucide-angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../../core/services/authservice';
import { NotificationService } from '../../../core/services/notification.service';
import { SignalrService } from '../../../core/services/signalr.service';
import { NotificationDropdownComponent } from '../notification-dropdown/notification-dropdown.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    LucideAngularModule,
    NotificationDropdownComponent,
  ],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
})
export class Navbar implements OnInit, OnDestroy {
  @Input() transparent = false;

  // Icons
  Leaf = Leaf;
  Bell = Bell;
  Menu = Menu;
  User = User;
  LogOut = LogOut;

  // State
  isAuthenticated = false;
  unreadCount = 0;
  isNotificationDropdownOpen = false;
  mobileMenuOpen = false;

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService,
    private signalRService: SignalrService
  ) {}

  ngOnInit(): void {
    // Subscribe to authentication status
    this.authService.isAuthenticated$.subscribe((status) => {
      this.isAuthenticated = status;

      // Initialize notifications when user is authenticated
      if (status) {
        this.initializeNotifications();
      } else {
        this.cleanup();
      }
    });

    // Subscribe to unread count
    this.notificationService.unreadCount$.pipe(takeUntil(this.destroy$)).subscribe((count) => {
      this.unreadCount = count;
    });
  }

  /**
   * Initialize notifications when user is authenticated
   */
  /**
   * Initialize notifications when user is authenticated
   */
  private initializeNotifications(): void {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    if (token) {
      console.log('🔍 Token found, attempting to connect...');

      // Load initial unread count (this will work even without SignalR)
      this.notificationService
        .getUnreadCount()
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (count) => {
            console.log('✅ Unread count loaded:', count);
          },
          error: (error) => {
            console.error('❌ Error loading unread count:', error);
            console.error('Status:', error.status);
            console.error('Message:', error.message);
          },
        });

      // Start SignalR connection (optional - can be disabled for testing)
      // Comment this out if SignalR is not set up yet

      this.signalRService
        .startConnection(token)
        .then(() => {
          console.log('✅ Notifications initialized in navbar');
        })
        .catch((err: any) => {
          console.error('❌ Failed to initialize notifications:', err);
        });
    } else {
      console.error('❌ No token found in storage!');
    }
  }

  /**
   * Toggle notification dropdown
   */
  toggleNotificationDropdown(): void {
    this.isNotificationDropdownOpen = !this.isNotificationDropdownOpen;
  }

  /**
   * Close notification dropdown
   */
  closeNotificationDropdown(): void {
    this.isNotificationDropdownOpen = false;
  }

  /**
   * Logout user
   */
  logout() {
    // Stop SignalR connection
    this.signalRService.stopConnection().then(() => {
      console.log('✅ SignalR disconnected');
    });

    // Clear notification state
    this.notificationService.clearState();

    // Logout from auth service
    this.authService.logout();
  }

  /**
   * Navigate to path
   */
  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  /**
   * Cleanup on component destroy
   */
  private cleanup(): void {
    this.unreadCount = 0;
    this.isNotificationDropdownOpen = false;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
