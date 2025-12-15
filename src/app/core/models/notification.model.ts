export interface Notification {
  notificationId?: string;
  userId?: string;
  title: string;
  message: string;
  type: string;
  relatedEntityType?: string;
  relatedEntityId?: string;
  isRead: boolean;
  priority: string;
  createdAt: Date;
  readAt?: Date;
}

export enum NotificationType {
  RequestCreated = 'RequestCreated',
  DriverAssigned = 'DriverAssigned',
  DriverEnRoute = 'DriverEnRoute',
  PickupCompleted = 'PickupCompleted',
  PaymentApproved = 'PaymentApproved',
  PaymentPaid = 'PaymentPaid',
  NewReview = 'NewReview',
  NewAssignment = 'NewAssignment',
  SystemAnnouncement = 'SystemAnnouncement',
  Welcome = 'Welcome',
}

export enum NotificationPriority {
  Low = 'Low',
  Normal = 'Normal',
  High = 'High',
  Urgent = 'Urgent',
}

export function mapNotification(data: any): Notification {
  return {
    notificationId: data.notificationId || data.NotificationId,
    userId: data.userId || data.UserId,
    title: data.title || data.Title || '',
    message: data.message || data.Message || '',
    type: data.type || data.Type || data.notificationType || data.NotificationType || 'default',
    relatedEntityType: data.relatedEntityType || data.RelatedEntityType,
    relatedEntityId: data.relatedEntityId || data.RelatedEntityId,
    priority: data.priority || data.Priority || 'Normal',
    isRead: data.isRead !== undefined ? data.isRead : (data.IsRead !== undefined ? data.IsRead : false),
    createdAt: data.createdAt ? new Date(data.createdAt) : (data.CreatedAt ? new Date(data.CreatedAt) : new Date()),
    readAt: data.readAt ? new Date(data.readAt) : (data.ReadAt ? new Date(data.ReadAt) : undefined)
  };
}