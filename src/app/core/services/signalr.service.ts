import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';
import { NotificationService } from './notification.service';
import { Notification } from '../models/notification.model';

@Injectable({
  providedIn: 'root',
})
export class SignalRService {
  private hubConnection: signalR.HubConnection | null = null;
  private connectionStateSubject = new BehaviorSubject<boolean>(false);
  public connectionState$ = this.connectionStateSubject.asObservable();

  // Configuration - Update this to your actual API URL
  private apiUrl = 'https://localhost:7000';
  private hubUrl = '/notificationHub';

  constructor(private notificationService: NotificationService) {}

  /**
   * Start SignalR connection
   */
  public startConnection(token: string): Promise<void> {
    if (this.hubConnection?.state === signalR.HubConnectionState.Connected) {
      console.log('⚠️ SignalR already connected');
      return Promise.resolve();
    }

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${this.apiUrl}${this.hubUrl}`, {
        accessTokenFactory: () => token,
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: (retryContext) => {
          if (retryContext.elapsedMilliseconds < 60000) {
            return Math.min(1000 * Math.pow(2, retryContext.previousRetryCount), 30000);
          }
          return 30000;
        },
      })
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.setupEventHandlers();

    return this.hubConnection
      .start()
      .then(() => {
        console.log('✅ SignalR Connected');
        this.connectionStateSubject.next(true);
      })
      .catch((err) => {
        console.error('❌ SignalR Connection Error:', err);
        this.connectionStateSubject.next(false);
        throw err;
      });
  }

  /**
   * Setup SignalR event handlers
   */
  private setupEventHandlers(): void {
    if (!this.hubConnection) return;

    this.hubConnection.on('ReceiveNotification', (notification: Notification) => {
      console.log('🔔 New notification received:', notification);
      this.notificationService.addNotification(notification);
      this.playNotificationSound();
      this.showBrowserNotification(notification);
    });

    this.hubConnection.on('UpdateUnreadCount', (count: number) => {
      console.log('📊 Unread count updated:', count);
    });

    this.hubConnection.on('ReceiveUnreadCount', (count: number) => {
      console.log('📊 Initial unread count:', count);
    });

    this.hubConnection.on('NotificationMarkedAsRead', (notificationId: string) => {
      console.log('✅ Notification marked as read:', notificationId);
      this.notificationService.updateNotification(notificationId, {
        isRead: true,
        readAt: new Date(),
      });
    });

    this.hubConnection.on('NotificationBatchRead', (notificationIds: string[]) => {
      console.log('✅ Multiple notifications marked as read:', notificationIds);
      notificationIds.forEach((id) => {
        this.notificationService.updateNotification(id, {
          isRead: true,
          readAt: new Date(),
        });
      });
    });

    this.hubConnection.on('AllNotificationsRead', () => {
      console.log('✅ All notifications marked as read');
      this.notificationService.getUserNotifications().subscribe();
    });

    this.hubConnection.on('NotificationDeleted', (notificationId: string) => {
      console.log('🗑️ Notification deleted:', notificationId);
    });

    this.hubConnection.onreconnecting((error) => {
      console.log('🔄 Reconnecting...', error);
      this.connectionStateSubject.next(false);
    });

    this.hubConnection.onreconnected((connectionId) => {
      console.log('✅ Reconnected with ID:', connectionId);
      this.connectionStateSubject.next(true);
      this.notificationService.getUserNotifications().subscribe();
      this.notificationService.getUnreadCount().subscribe();
    });

    this.hubConnection.onclose((error) => {
      console.log('❌ Connection closed', error);
      this.connectionStateSubject.next(false);
    });
  }

  /**
   * Stop SignalR connection
   */
  public stopConnection(): Promise<void> {
    if (this.hubConnection) {
      return this.hubConnection.stop().then(() => {
        console.log('🛑 SignalR connection stopped');
        this.connectionStateSubject.next(false);
      });
    }
    return Promise.resolve();
  }

  /**
   * Get connection state
   */
  public getConnectionState(): boolean {
    return this.hubConnection?.state === signalR.HubConnectionState.Connected;
  }

  /**
   * Set API URL dynamically
   */
  public setApiUrl(url: string): void {
    this.apiUrl = url;
  }

  /**
   * Play notification sound
   */
  private playNotificationSound(): void {
    try {
      const audio = new Audio('assets/sounds/notification.mp3');
      audio.volume = 0.5;
      audio.play().catch((err) => console.log('Could not play sound:', err));
    } catch (error) {
      console.log('Sound playback error:', error);
    }
  }

  /**
   * Show browser notification
   */
  private showBrowserNotification(notification: Notification): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(notification.title, {
          body: notification.message,
          icon: 'assets/logo.png',
          badge: 'assets/logo.png',
          tag: notification.notificationId,
          requireInteraction: false,
          silent: false,
        });
      } catch (error) {
        console.log('Browser notification error:', error);
      }
    }
  }

  /**
   * Request notification permission
   */
  public requestNotificationPermission(): void {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then((permission) => {
        console.log('Notification permission:', permission);
      });
    }
  }
}
