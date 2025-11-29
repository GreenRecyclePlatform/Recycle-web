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
      default: '#6c757d',
    };
    return colors[type] || colors['default'];
  }

  getTimeAgo(date: Date | undefined): string {
    if (!date) return 'Unknown';

    const now = new Date();
    const notificationDate = new Date(date);
    const diffMs = now.getTime() - notificationDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return notificationDate.toLocaleDateString();
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
