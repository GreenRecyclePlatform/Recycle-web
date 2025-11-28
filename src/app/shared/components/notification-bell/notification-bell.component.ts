import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NotificationService } from '../../../core/services/notification.service';
import { SignalrService } from '../../../core/services/signalr.service';
import { NotificationDropdownComponent } from '../notification-dropdown/notification-dropdown.component';

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [CommonModule, NotificationDropdownComponent],
  templateUrl: './notification-bell.component.html',
  styleUrls: ['./notification-bell.component.css'],
})
export class NotificationBellComponent implements OnInit, OnDestroy {
  unreadCount = 0;
  isDropdownOpen = false;
  isConnected = false;
  private destroy$ = new Subject<void>();

  constructor(
    private notificationService: NotificationService,
    private signalRService: SignalrService
  ) {}

  ngOnInit(): void {
    // Subscribe to unread count
    this.notificationService.unreadCount$.pipe(takeUntil(this.destroy$)).subscribe((count) => {
      this.unreadCount = count;
    });

    // Subscribe to SignalR connection state
    this.signalRService.getConnectionState().pipe(takeUntil(this.destroy$)).subscribe((state: boolean) => {
      this.isConnected = state;
    });

    // Load initial unread count
    this.loadUnreadCount();

    // Initialize SignalR if user is authenticated
    this.initializeSignalR();
  }

  /**
   * Load unread count from API
   */
  private loadUnreadCount(): void {
    this.notificationService
      .getUnreadCount()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        error: (error) => {
          console.error('Error loading unread count:', error);
        },
      });
  }

  /**
   * Initialize SignalR connection
   */
  private initializeSignalR(): void {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    if (token) {
      this.signalRService.startConnection(token).catch((err) => {
        console.error('Failed to initialize SignalR:', err);
      });
    }
  }

  /**
   * Toggle dropdown
   */
  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  /**
   * Close dropdown
   */
  closeDropdown(): void {
    this.isDropdownOpen = false;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
