import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-test-notifications',
  standalone: true,
  imports: [CommonModule],
  template: ` <!-- Your existing template --> `,
  styles: [
    `
      /* Your existing styles */
    `,
  ],
})
export class TestNotificationsComponent implements OnInit, OnDestroy {
  totalCount = 0;
  unreadCount = 0;
  readCount = 0;
  private destroy$ = new Subject<void>();

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    // Initialize with mock data
    this.notificationService.resetToMockData();

    // Subscribe to changes
    this.notificationService.notifications$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.updateStats();
    });
  }

  simulateNotification(): void {
    this.notificationService.simulateNewNotification();
  }

  resetNotifications(): void {
    this.notificationService.resetToMockData();
  }

  markAllRead(): void {
    this.notificationService.markAllAsRead().subscribe({
      error: (error) => {
        console.error('Error marking all as read:', error);
        // For testing without API, just update locally
        const notifications = this.notificationService.getNotifications();
        notifications.forEach((n) => {
          n.isRead = true;
          n.readAt = new Date();
        });
        this.updateStats();
      },
    });
  }

  simulateMultiple(): void {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        this.notificationService.simulateNewNotification();
      }, i * 300);
    }
  }

  private updateStats(): void {
    const all = this.notificationService.getNotifications();
    this.totalCount = all.length;
    this.unreadCount = all.filter((n) => !n.isRead).length;
    this.readCount = all.filter((n) => n.isRead).length;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
