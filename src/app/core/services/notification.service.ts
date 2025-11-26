import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { Notification } from '../models/notification.model';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  // API Configuration - Update this to your actual API URL
  private apiUrl = 'https://localhost:7000/api/notifications';

  // State Management
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  private unreadCountSubject = new BehaviorSubject<number>(0);
  public unreadCount$ = this.unreadCountSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Get current notifications from local state (for testing)
   */
  getNotifications(unreadOnly: boolean = false): Notification[] {
    const notifications = this.notificationsSubject.value;
    if (unreadOnly) {
      return notifications.filter((n) => !n.isRead);
    }
    return notifications;
  }

  /**
   * Get user notifications from API
   */
  getUserNotifications(unreadOnly: boolean = false): Observable<any> {
    this.loadingSubject.next(true);

    return this.http
      .get<any>(`${this.apiUrl}?unreadOnly=${unreadOnly}`, {
        headers: this.getHeaders(),
      })
      .pipe(
        tap((response) => {
          const notifications = response.data || response || [];
          this.notificationsSubject.next(notifications);
          this.loadingSubject.next(false);
        }),
        catchError((error) => {
          console.error('Error fetching notifications:', error);
          this.loadingSubject.next(false);
          return throwError(() => error);
        })
      );
  }

  /**
   * Get unread notification count from API
   */
  getUnreadCount(): Observable<number> {
    return this.http
      .get<any>(`${this.apiUrl}/unread-count`, {
        headers: this.getHeaders(),
      })
      .pipe(
        map((response) => response.data || response.count || 0),
        tap((count) => {
          this.unreadCountSubject.next(count);
        }),
        catchError((error) => {
          console.error('Error fetching unread count:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Mark notification as read
   */
  markAsRead(notificationId: string): Observable<any> {
    return this.http
      .put<any>(
        `${this.apiUrl}/${notificationId}/read`,
        {},
        {
          headers: this.getHeaders(),
        }
      )
      .pipe(
        tap(() => {
          const notifications = this.notificationsSubject.value;
          const notification = notifications.find((n) => n.notificationId === notificationId);
          if (notification) {
            notification.isRead = true;
            notification.readAt = new Date();
            this.notificationsSubject.next([...notifications]);

            const unreadCount = notifications.filter((n) => !n.isRead).length;
            this.unreadCountSubject.next(unreadCount);
          }
        }),
        catchError((error) => {
          console.error('Error marking notification as read:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Mark all notifications as read
   */
  markAllAsRead(): Observable<any> {
    return this.http
      .put<any>(
        `${this.apiUrl}/read-all`,
        {},
        {
          headers: this.getHeaders(),
        }
      )
      .pipe(
        tap(() => {
          const notifications = this.notificationsSubject.value;
          notifications.forEach((n) => {
            n.isRead = true;
            n.readAt = new Date();
          });
          this.notificationsSubject.next([...notifications]);
          this.unreadCountSubject.next(0);
        }),
        catchError((error) => {
          console.error('Error marking all as read:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Delete notification
   */
  deleteNotification(notificationId: string): Observable<any> {
    return this.http
      .delete<any>(`${this.apiUrl}/${notificationId}`, {
        headers: this.getHeaders(),
      })
      .pipe(
        tap(() => {
          const notifications = this.notificationsSubject.value;
          const filtered = notifications.filter((n) => n.notificationId !== notificationId);
          this.notificationsSubject.next(filtered);

          const unreadCount = filtered.filter((n) => !n.isRead).length;
          this.unreadCountSubject.next(unreadCount);
        }),
        catchError((error) => {
          console.error('Error deleting notification:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Add notification to local state (for SignalR real-time updates)
   */
  addNotification(notification: Notification): void {
    const notifications = this.notificationsSubject.value;
    this.notificationsSubject.next([notification, ...notifications]);

    if (!notification.isRead) {
      const unreadCount = this.unreadCountSubject.value;
      this.unreadCountSubject.next(unreadCount + 1);
    }
  }

  /**
   * Update notification in local state
   */
  updateNotification(notificationId: string, updates: Partial<Notification>): void {
    const notifications = this.notificationsSubject.value;
    const notification = notifications.find((n) => n.notificationId === notificationId);
    if (notification) {
      Object.assign(notification, updates);
      this.notificationsSubject.next([...notifications]);

      const unreadCount = notifications.filter((n) => !n.isRead).length;
      this.unreadCountSubject.next(unreadCount);
    }
  }

  /**
   * Simulate new notification (for testing without backend)
   */
  simulateNewNotification(): void {
    const testNotification: Notification = {
      notificationId: Date.now().toString(),
      userId: 'user1',
      title: 'Test Notification',
      message: `This is a simulated notification at ${new Date().toLocaleTimeString()}`,
      type: 'SystemAnnouncement',
      isRead: false,
      priority: 'High',
      createdAt: new Date(),
    };
    this.addNotification(testNotification);
  }

  /**
   * Reset to mock data (for testing)
   */
  resetToMockData(): void {
    // Import mock data dynamically to avoid circular dependencies
    import('../constants/mock-notifications').then((module) => {
      this.notificationsSubject.next([...module.MOCK_NOTIFICATIONS]);
      const unreadCount = module.MOCK_NOTIFICATIONS.filter((n) => !n.isRead).length;
      this.unreadCountSubject.next(unreadCount);
    });
  }

  /**
   * Get HTTP headers with authentication token
   */
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    });
  }

  /**
   * Set API URL dynamically (useful for different environments)
   */
  setApiUrl(url: string): void {
    this.apiUrl = url;
  }

  /**
   * Clear all local state
   */
  clearState(): void {
    this.notificationsSubject.next([]);
    this.unreadCountSubject.next(0);
    this.loadingSubject.next(false);
  }
}
