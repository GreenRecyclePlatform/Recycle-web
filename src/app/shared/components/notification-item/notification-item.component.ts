import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Notification } from '../../../core/models/notification.model';

@Component({
  selector: 'app-notification-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification-item.component.html',
  styleUrls: ['./notification-item.component.css'],
})
export class NotificationItemComponent {
  @Input() notification!: Notification;
  @Output() read = new EventEmitter<Notification>();
  @Output() delete = new EventEmitter<string>();

  getNotificationIcon(type: string): string {
    const icons: { [key: string]: string } = {
      RequestCreated: 'fa-file-alt',
      DriverAssigned: 'fa-truck',
      DriverEnRoute: 'fa-route',
      PickupCompleted: 'fa-check-circle',
      PaymentApproved: 'fa-dollar-sign',
      PaymentPaid: 'fa-money-bill-wave',
      NewReview: 'fa-star',
      NewAssignment: 'fa-clipboard-list',
      SystemAnnouncement: 'fa-bullhorn',
      Welcome: 'fa-hand-wave',
      NewRequestPending: 'fa-clock',
      default: 'fa-bell',
    };
    return icons[type] || icons['default'];
  }

  getNotificationColor(type: string): string {
    const colors: { [key: string]: string } = {
      RequestCreated: '#0077B6',
      DriverAssigned: '#2D6A4F',
      DriverEnRoute: '#17a2b8',
      PickupCompleted: '#28a745',
      PaymentApproved: '#ffc107',
      PaymentPaid: '#28a745',
      NewReview: '#ff9800',
      NewAssignment: '#6f42c1',
      SystemAnnouncement: '#dc3545',
      Welcome: '#20c997',
      NewRequestPending: '#ff6b6b',
      default: '#6c757d',
    };
    return colors[type] || colors['default'];
  }

  getTimeAgo(date: Date | string | undefined): string {
    if (!date) return 'Unknown';

    try {
      let notificationDate: Date;

      // ✅ Handle both string and Date types
      if (typeof date === 'string') {
        // Add 'Z' if not present to force UTC interpretation
        if (!date.endsWith('Z') && !date.includes('+') && !date.includes('T00:00:00')) {
          notificationDate = new Date(date + 'Z');
        } else {
          notificationDate = new Date(date);
        }
      } else if (date instanceof Date) {
        notificationDate = date;
      } else {
        // Fallback for any other type
        notificationDate = new Date(date as any);
      }

      // Validate date
      if (isNaN(notificationDate.getTime())) {
        console.error('Invalid date:', date);
        return 'Invalid date';
      }

      // Get current time
      const now = new Date();

      // Calculate difference in milliseconds
      const diffMs = now.getTime() - notificationDate.getTime();

      // Handle negative differences (notification from future - clock sync issue)
      if (diffMs < 0) {
        return 'Just now';
      }

      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'Just now';
      if (diffMins === 1) return '1 minute ago';
      if (diffMins < 60) return `${diffMins} minutes ago`;
      if (diffHours === 1) return '1 hour ago';
      if (diffHours < 24) return `${diffHours} hours ago`;
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7);
        return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
      }

      // For older dates, show the actual date
      return notificationDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: notificationDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
      });
    } catch (error) {
      console.error('Error calculating time ago:', error, date);
      return 'Unknown';
    }
  }

  onMarkAsRead(): void {
    this.read.emit(this.notification);
  }

  onDelete(event: Event): void {
    event.stopPropagation();
    if (this.notification.notificationId) {
      this.delete.emit(this.notification.notificationId);
    }
  }
}
