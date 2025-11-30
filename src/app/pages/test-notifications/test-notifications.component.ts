import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NotificationService } from '../../core/services/notification.service';
import { Notification } from '../../core/models/notification.model';

@Component({
  selector: 'app-test-notifications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="test-container">
      <h2>Notification System Test</h2>

      <!-- Stats -->
      <div class="stats">
        <div class="stat-card">
          <span class="stat-label">Total</span>
          <span class="stat-value">{{ totalCount }}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Unread</span>
          <span class="stat-value unread">{{ unreadCount }}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Read</span>
          <span class="stat-value">{{ readCount }}</span>
        </div>
      </div>

      <!-- Actions -->
      <div class="actions">
        <button (click)="loadAllNotifications()" [disabled]="loading">
          {{ loading ? 'Loading...' : 'Load All Notifications' }}
        </button>
        <button (click)="loadUnreadOnly()" [disabled]="loading">Load Unread Only</button>
        <button (click)="markAllRead()" [disabled]="loading || unreadCount === 0">
          Mark All as Read
        </button>
        <button (click)="refreshUnreadCount()" [disabled]="loading">Refresh Count</button>
        <button (click)="clearNotifications()" class="danger">Clear All</button>
      </div>

      <!-- Error Message -->
      <div *ngIf="errorMessage" class="error-message">
        {{ errorMessage }}
        <button (click)="clearError()">×</button>
      </div>

      <!-- Success Message -->
      <div *ngIf="successMessage" class="success-message">
        {{ successMessage }}
        <button (click)="clearSuccess()">×</button>
      </div>

      <!-- Notifications List -->
      <div class="notifications-list">
        <h3>Current Notifications ({{ notifications.length }})</h3>
        <div *ngIf="notifications.length === 0" class="empty-state">
          <p>No notifications to display</p>
          <small>Load notifications using the buttons above</small>
        </div>
        <div
          *ngFor="let notification of notifications; trackBy: trackByNotificationId"
          class="notification-item"
          [class.unread]="!notification.isRead"
        >
          <div class="notification-header">
            <span class="notification-title">{{ notification.title }}</span>
            <span class="notification-type" [class]="'type-' + notification.type?.toLowerCase()">
              {{ notification.type }}
            </span>
          </div>
          <p class="notification-message">{{ notification.message }}</p>
          <div class="notification-footer">
            <span class="notification-date">
              {{ formatDate(notification.createdAt) }}
            </span>
            <span class="notification-status" [class.read]="notification.isRead">
              {{ notification.isRead ? 'Read' : 'Unread' }}
            </span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .test-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
      }

      h2 {
        color: #2d6a4f;
        margin-bottom: 20px;
      }

      .stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 15px;
        margin-bottom: 30px;
      }

      .stat-card {
        background: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
      }

      .stat-label {
        color: #6c757d;
        font-size: 14px;
      }

      .stat-value {
        font-size: 32px;
        font-weight: bold;
        color: #2d6a4f;
      }

      .stat-value.unread {
        color: #dc3545;
      }

      .actions {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-bottom: 20px;
      }

      button {
        padding: 10px 20px;
        border: none;
        border-radius: 6px;
        background: #2d6a4f;
        color: white;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.3s ease;
      }

      button:hover:not(:disabled) {
        background: #1e4d38;
        transform: translateY(-2px);
      }

      button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none;
      }

      button.danger {
        background: #dc3545;
      }

      button.danger:hover:not(:disabled) {
        background: #c82333;
      }

      .error-message,
      .success-message {
        padding: 15px;
        border-radius: 6px;
        margin-bottom: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .error-message {
        background: #f8d7da;
        color: #721c24;
        border: 1px solid #f5c6cb;
      }

      .success-message {
        background: #d4edda;
        color: #155724;
        border: 1px solid #c3e6cb;
      }

      .error-message button,
      .success-message button {
        background: transparent;
        color: inherit;
        padding: 0;
        width: 24px;
        height: 24px;
        font-size: 20px;
      }

      .notifications-list {
        background: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .notifications-list h3 {
        margin-top: 0;
        color: #2d6a4f;
      }

      .empty-state {
        text-align: center;
        padding: 40px;
        color: #6c757d;
      }

      .empty-state small {
        display: block;
        margin-top: 10px;
        font-size: 12px;
      }

      .notification-item {
        padding: 15px;
        border: 1px solid #e0e0e0;
        border-radius: 6px;
        margin-bottom: 10px;
        transition: all 0.3s ease;
      }

      .notification-item:hover {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .notification-item.unread {
        background: #f8f9fa;
        border-left: 4px solid #2d6a4f;
      }

      .notification-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
      }

      .notification-title {
        font-weight: 600;
        color: #333;
      }

      .notification-type {
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 500;
        background: #e9ecef;
        color: #495057;
      }

      .type-requestcreated {
        background: #cfe2ff;
        color: #084298;
      }
      .type-requestapproved {
        background: #d1e7dd;
        color: #0f5132;
      }
      .type-requestrejected {
        background: #f8d7da;
        color: #842029;
      }
      .type-systemannouncement {
        background: #fff3cd;
        color: #664d03;
      }
      .type-paymentfailed {
        background: #f8d7da;
        color: #842029;
      }

      .notification-message {
        color: #6c757d;
        margin: 10px 0;
        font-size: 14px;
      }

      .notification-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 12px;
        color: #6c757d;
      }

      .notification-status {
        padding: 2px 8px;
        border-radius: 4px;
        background: #ffc107;
        color: white;
        font-weight: 500;
      }

      .notification-status.read {
        background: #28a745;
      }

      @media (max-width: 768px) {
        .actions {
          flex-direction: column;
        }

        button {
          width: 100%;
        }
      }
    `,
  ],
})
export class TestNotificationsComponent implements OnInit, OnDestroy {
  totalCount = 0;
  unreadCount = 0;
  readCount = 0;
  loading = false;
  notifications: Notification[] = [];
  errorMessage = '';
  successMessage = '';

  private destroy$ = new Subject<void>();

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    // Subscribe to notifications stream
    this.notificationService.notifications$
      .pipe(takeUntil(this.destroy$))
      .subscribe((notifications) => {
        this.notifications = notifications;
        this.updateStats();
      });

    // Subscribe to unread count
    this.notificationService.unreadCount$.pipe(takeUntil(this.destroy$)).subscribe((count) => {
      this.unreadCount = count;
    });

    // Subscribe to loading state
    this.notificationService.loading$.pipe(takeUntil(this.destroy$)).subscribe((loading) => {
      this.loading = loading;
    });

    // Load initial data
    this.loadAllNotifications();
  }

  /**
   * Load all notifications from API
   */
  loadAllNotifications(): void {
    this.clearMessages();
    this.notificationService
      .getAllNotifications()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (notifications) => {
          this.successMessage = `Loaded ${notifications.length} notifications`;
          this.autoHideSuccess();
        },
        error: (error) => {
          this.errorMessage = 'Failed to load notifications: ' + (error.message || 'Unknown error');
          console.error('Error loading notifications:', error);
        },
      });
  }

  /**
   * Load unread notifications only
   */
  loadUnreadOnly(): void {
    this.clearMessages();
    this.notificationService
      .getUnreadNotifications()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (notifications) => {
          this.successMessage = `Loaded ${notifications.length} unread notifications`;
          this.autoHideSuccess();
        },
        error: (error) => {
          this.errorMessage =
            'Failed to load unread notifications: ' + (error.message || 'Unknown error');
          console.error('Error loading unread notifications:', error);
        },
      });
  }

  /**
   * Mark all notifications as read
   */
  markAllRead(): void {
    this.clearMessages();
    this.notificationService
      .markAllAsRead()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.successMessage = 'All notifications marked as read';
          this.autoHideSuccess();
        },
        error: (error) => {
          this.errorMessage = 'Failed to mark all as read: ' + (error.message || 'Unknown error');
          console.error('Error marking all as read:', error);
        },
      });
  }

  /**
   * Refresh unread count
   */
  refreshUnreadCount(): void {
    this.clearMessages();
    this.notificationService
      .getUnreadCount()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (count) => {
          this.successMessage = `Unread count: ${count}`;
          this.autoHideSuccess();
        },
        error: (error) => {
          this.errorMessage = 'Failed to refresh count: ' + (error.message || 'Unknown error');
          console.error('Error refreshing count:', error);
        },
      });
  }

  /**
   * Clear all notifications from local state
   */
  clearNotifications(): void {
    this.notificationService.clearState();
    this.successMessage = 'Local state cleared';
    this.autoHideSuccess();
  }

  /**
   * Update statistics
   */
  private updateStats(): void {
    this.totalCount = this.notifications.length;
    this.unreadCount = this.notifications.filter((n) => !n.isRead).length;
    this.readCount = this.notifications.filter((n) => n.isRead).length;
  }

  /**
   * Format date for display
   */
  formatDate(date: Date | string | undefined): string {
    if (!date) return 'Unknown';
    const d = new Date(date);
    return d.toLocaleString();
  }

  /**
   * Track by function for ngFor
   */
  trackByNotificationId(index: number, notification: Notification): string {
    return notification.notificationId || index.toString();
  }

  /**
   * Clear error message
   */
  clearError(): void {
    this.errorMessage = '';
  }

  /**
   * Clear success message
   */
  clearSuccess(): void {
    this.successMessage = '';
  }

  /**
   * Clear all messages
   */
  private clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  /**
   * Auto-hide success message after 3 seconds
   */
  private autoHideSuccess(): void {
    setTimeout(() => {
      this.successMessage = '';
    }, 3000);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
