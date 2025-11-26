import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NotificationService } from '../../../core/services/notification.service';
import { SignalRService } from '../../../core/services/signalr.service';
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
    private signalRService: SignalRService
  ) {}

  ngOnInit(): void {
    // Subscribe to unread count from service
    this.notificationService.unreadCount$.pipe(takeUntil(this.destroy$)).subscribe((count) => {
      this.unreadCount = count;
    });

    // Subscribe to SignalR connection state
    this.signalRService.connectionState$.pipe(takeUntil(this.destroy$)).subscribe((state) => {
      this.isConnected = state;
    });

    // Initial load of unread count
    this.loadUnreadCount();

    // Initialize SignalR connection if token exists
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
        next: (count) => {
          // Count is already updated in service
        },
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
      this.signalRService
        .startConnection(token)
        .then(() => {
          console.log('SignalR initialized successfully');
        })
        .catch((err) => {
          console.error('Failed to initialize SignalR:', err);
        });
    } else {
      console.warn('No authentication token found. SignalR will not connect.');
    }
  }

  /**
   * Toggle dropdown visibility
   */
  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;

    // Load notifications when opening dropdown
    if (this.isDropdownOpen) {
      this.notificationService
        .getUserNotifications()
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          error: (error) => {
            console.error('Error loading notifications:', error);
          },
        });
    }
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
