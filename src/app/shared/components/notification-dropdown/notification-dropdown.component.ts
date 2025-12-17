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
  displayedNotifications: Notification[] = [];
  showUnreadOnly = false;
  showAllInDropdown = false; // ✅ Add this flag
  loading = false;
  error: string | null = null;
  private destroy$ = new Subject<void>();
  readonly MAX_DISPLAYED = 5;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    // Subscribe to notifications
    this.notificationService.notifications$
      .pipe(takeUntil(this.destroy$))
      .subscribe((notifications) => {
        this.notifications = notifications;
        this.updateDisplayedNotifications();
      });

    // Subscribe to loading state
    this.notificationService.loading$.pipe(takeUntil(this.destroy$)).subscribe((loading) => {
      this.loading = loading;
    });

    // Load notifications
    this.loadNotifications();
  }

  /**
   * Update displayed notifications
   */
  private updateDisplayedNotifications(): void {
    // Sort by date (most recent first)
    const sorted = [...this.notifications].sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return dateB - dateA;
    });

    
    // Show only first 5, or all if expanded
    this.displayedNotifications = this.showAllInDropdown
      ? sorted
      : sorted.slice(0, this.MAX_DISPLAYED);
  }

  /**
   * Show all notifications in dropdown
   */
  showAllNotifications(): void {
    this.showAllInDropdown = true;
    this.updateDisplayedNotifications();
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
    this.showAllInDropdown = false; // Reset to limited view when filtering
    this.loadNotifications();
  }

  /**
   * Mark notification as read
   */
  markAsRead(notification: Notification): void {
    if (!notification.isRead && notification.notificationId) {
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
   * Delete notification
   */
  deleteNotification(notificationId: string): void {
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
   * Get total notification count for display
   */
  get totalCount(): number {
    return this.notifications.length;
  }

  /**
   * Check if there are more notifications
   */
  get hasMore(): boolean {
    return !this.showAllInDropdown && this.notifications.length > this.MAX_DISPLAYED;
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
