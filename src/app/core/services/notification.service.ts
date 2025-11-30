import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { Notification } from '../models/notification.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private http = inject(HttpClient);

  // ✅ Use environment URL instead of hardcoded
  private apiUrl = `${environment.apiUrl}/Notifications`;

  // State Management
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  private unreadCountSubject = new BehaviorSubject<number>(0);
  public unreadCount$ = this.unreadCountSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  /**
   * Get all notifications for the current user
   */
  getAllNotifications(): Observable<Notification[]> {
    this.loadingSubject.next(true);
    console.log('📡 Fetching all notifications from:', `${this.apiUrl}/getAllNotification`);

    return this.http.get<Notification[]>(`${this.apiUrl}/getAllNotification`).pipe(
      tap((notifications) => {
        console.log('✅ Notifications loaded:', notifications);
        this.notificationsSubject.next(notifications);
        const unreadCount = notifications.filter((n) => !n.isRead).length;
        this.unreadCountSubject.next(unreadCount);
        this.loadingSubject.next(false);
      }),
      catchError((error) => {
        console.error('❌ Error fetching all notifications:', error);
        this.loadingSubject.next(false);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get unread notifications for the current user
   */
  getUnreadNotifications(): Observable<Notification[]> {
    this.loadingSubject.next(true);

    return this.http.get<Notification[]>(`${this.apiUrl}/unread-notification`).pipe(
      tap((notifications) => {
        this.notificationsSubject.next(notifications);
        this.unreadCountSubject.next(notifications.length);
        this.loadingSubject.next(false);
      }),
      catchError((error) => {
        console.error('❌ Error fetching unread notifications:', error);
        this.loadingSubject.next(false);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get unread notification count
   */
  getUnreadCount(): Observable<number> {
    console.log('📡 Fetching unread count from:', `${this.apiUrl}/unread-count`);

    return this.http.get<{ unreadCount: number }>(`${this.apiUrl}/unread-count`).pipe(
      map((response) => response.unreadCount),
      tap((count) => {
        console.log('✅ Unread count:', count);
        this.unreadCountSubject.next(count);
      }),
      catchError((error) => {
        console.error('❌ Error fetching unread count:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Mark all notifications as read
   */
  markAllAsRead(): Observable<any> {
    return this.http.put(`${this.apiUrl}/mark-all-read`, {}).pipe(
      tap(() => {
        // Update local state
        const notifications = this.notificationsSubject.value;
        notifications.forEach((n) => {
          n.isRead = true;
          n.readAt = new Date();
        });
        this.notificationsSubject.next([...notifications]);
        this.unreadCountSubject.next(0);
      }),
      catchError((error) => {
        console.error('❌ Error marking all as read:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Send notification to specific user (Admin only)
   */
  sendToUser(
    userId: string,
    notification: {
      title: string;
      message: string;
      type: string;
      relatedEntityType?: string;
    }
  ): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/send-to-user/${userId}`, notification, {
        responseType: 'text',
      })
      .pipe(
        catchError((error) => {
          console.error('❌ Error sending notification to user:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Send notification to all admins
   */
  sendToAdmins(notification: {
    title: string;
    message: string;
    type: string;
    relatedEntityType?: string;
  }): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/send-to-admins`, notification, {
        responseType: 'text',
      })
      .pipe(
        catchError((error) => {
          console.error('❌ Error sending notification to admins:', error);
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
   * Remove notification from local state
   */
  removeNotification(notificationId: string): void {
    const notifications = this.notificationsSubject.value;
    const filtered = notifications.filter((n) => n.notificationId !== notificationId);
    this.notificationsSubject.next(filtered);

    const unreadCount = filtered.filter((n) => !n.isRead).length;
    this.unreadCountSubject.next(unreadCount);
  }

  /**
   * Get current notifications from local state
   */
  getCurrentNotifications(): Notification[] {
    return this.notificationsSubject.value;
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
