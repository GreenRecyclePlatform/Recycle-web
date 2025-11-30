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
    // Subscribe to notifications
    this.notificationService.notifications$
      .pipe(takeUntil(this.destroy$))
      .subscribe((notifications) => {
        this.notifications = notifications;
      });

    // Subscribe to loading state
    this.notificationService.loading$.pipe(takeUntil(this.destroy$)).subscribe((loading) => {
      this.loading = loading;
    });

    // Load notifications
    this.loadNotifications();
  }

  /**
   * Load notifications from API
   */
  loadNotifications(): void {
    this.error = null;

    const request$ = this.showUnreadOnly
      ? this.notificationService.getUnreadNotifications()
      : this.notificationService.getAllNotifications();

    request$.pipe(takeUntil(this.destroy$)).subscribe({
      error: (error) => {
        console.error('Error loading notifications:', error);
        this.error = 'Failed to load notifications. Please try again.';
      },
    });
  }

  /**
   * Toggle filter
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
      // Update local state immediately
      this.notificationService.updateNotification(notification.notificationId, {
        isRead: true,
        readAt: new Date(),
      });
    }
  }

  /**
   * Mark all as read
   */
  markAllAsRead(): void {
    this.notificationService
      .markAllAsRead()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        error: (error) => {
          console.error('Error marking all as read:', error);
          this.error = 'Failed to mark all as read. Please try again.';
        },
      });
  }

  /**
   * Delete notification (placeholder - implement if you add delete endpoint)
   */
  deleteNotification(notificationId: string): void {
    // Note: Your API doesn't have a delete endpoint yet
    // Remove from local state only
    this.notificationService.removeNotification(notificationId);
  }

  /**
   * Retry loading
   */
  retry(): void {
    this.loadNotifications();
  }

  /**
   * Track by function
   */
  trackByNotificationId(index: number, notification: Notification): string {
    return notification.notificationId || index.toString();
  }

  /**
   * Close dropdown on outside click
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
}
