import { Component, OnInit, OnDestroy, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NotificationService } from '../../../core/services/notification.service';
import { Notification } from '../../../core/models/notification.model';
import { NotificationItemComponent } from '../notification-item/notification-item.component';

@Component({
  selector: 'app-notification-dropdown',
  standalone: true,
  imports: [CommonModule, RouterModule, NotificationItemComponent],
  templateUrl: './notification-dropdown.component.html',
  styleUrls: ['./notification-dropdown.component.css'],
})
export class NotificationDropdownComponent implements OnInit, OnDestroy {
  @Output() close = new EventEmitter<void>();

  notifications: Notification[] = [];
  showUnreadOnly = false;
  loading = false;
  error: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    // Subscribe to notifications from service
    this.notificationService.notifications$
      .pipe(takeUntil(this.destroy$))
      .subscribe((notifications) => {
        this.notifications = notifications;
      });

    // Subscribe to loading state
    this.notificationService.loading$.pipe(takeUntil(this.destroy$)).subscribe((loading) => {
      this.loading = loading;
    });

    // Initial load
    this.loadNotifications();
  }

  /**
   * Load notifications from API
   */
  loadNotifications(): void {
    this.error = null;
    this.notificationService
      .getUserNotifications(this.showUnreadOnly)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          // Notifications are updated via the service's BehaviorSubject
        },
        error: (error) => {
          console.error('Error loading notifications:', error);
          this.error = 'Failed to load notifications. Please try again.';
        },
      });
  }

  /**
   * Toggle filter between all and unread only
   */
  toggleFilter(): void {
    this.showUnreadOnly = !this.showUnreadOnly;
    this.loadNotifications();
  }

  /**
   * Mark notification as read
   */
  markAsRead(notification: Notification): void {
    if (!notification.isRead && notification.notificationId) {
      this.notificationService
        .markAsRead(notification.notificationId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            // State is updated in the service
          },
          error: (error) => {
            console.error('Error marking notification as read:', error);
          },
        });
    }
  }

  /**
   * Mark all notifications as read
   */
  markAllAsRead(): void {
    this.notificationService
      .markAllAsRead()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          // State is updated in the service
        },
        error: (error) => {
          console.error('Error marking all as read:', error);
          this.error = 'Failed to mark all as read. Please try again.';
        },
      });
  }

  /**
   * Delete notification
   */
  deleteNotification(notificationId: string): void {
    if (confirm('Are you sure you want to delete this notification?')) {
      this.notificationService
        .deleteNotification(notificationId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            // State is updated in the service
          },
          error: (error) => {
            console.error('Error deleting notification:', error);
            this.error = 'Failed to delete notification. Please try again.';
          },
        });
    }
  }

  /**
   * Retry loading notifications
   */
  retry(): void {
    this.loadNotifications();
  }

  /**
   * Close dropdown when clicking outside
   */
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.notification-dropdown') && !target.closest('.notification-bell-btn')) {
      this.close.emit();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Track by function for ngFor performance
   */
  trackByNotificationId(index: number, notification: Notification): string {
    return notification.notificationId || index.toString();
  }
}
