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
