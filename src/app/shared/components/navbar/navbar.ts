import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { LucideAngularModule, Leaf, Bell, Menu, User,ShoppingCart ,ClipboardList,LogOut } from 'lucide-angular';
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
  ShoppingCart = ShoppingCart;
  ClipboardList = ClipboardList;
  LogOut = LogOut;

  // State
  isAuthenticated = false;
  unreadCount = 0;
  isNotificationDropdownOpen = false;
  mobileMenuOpen = false;
  username: string | null = '';
  role: string | null = '';

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
        this.username = this.authService.getUserName();
        this.role = this.authService.userRole;
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
  private initializeNotifications(): void {
    const token = sessionStorage.getItem('accesstoken');

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

    this.router.navigate([' ']);
  }

  /**
   * Navigate to path
   */
  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  /**
   * Scroll to section with smooth animation
   */
  scrollToSection(sectionId: string): void {
    // First navigate to home if not already there
    if (this.router.url !== '/') {
      this.router.navigate(['/']).then(() => {
        // Wait for navigation to complete, then scroll
        setTimeout(() => {
          this.performScroll(sectionId);
        }, 100);
      });
    } else {
      this.performScroll(sectionId);
    }
  }

  /**
   * Perform the actual scroll
   */
  private performScroll(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      const navbarHeight = 64; // Height of navbar in pixels (4rem)
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
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
