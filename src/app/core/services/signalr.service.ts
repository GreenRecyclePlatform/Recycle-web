import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';
import { Notification } from '../models/notification.model';

@Injectable({
  providedIn: 'root',
})
export class SignalrService {
  private hubConnection!: signalR.HubConnection;
  private connectionState = new BehaviorSubject<boolean>(false);
  private hubUrl = 'https://recycle.runasp.net/hubs/notifications';

  constructor() {}

  async requestNotificationPermission(): Promise<void> {
    console.log('🔔 Requesting notification permission...');

    if (!('Notification' in window)) {
      console.warn('⚠️ This browser does not support notifications');
      return;
    }

    if (Notification.permission === 'granted') {
      console.log('✅ Notification permission already granted');
      return;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        console.log('✅ Notification permission granted');
      } else {
        console.log('❌ Notification permission denied');
      }
    }
  }

  async startConnection(token: string): Promise<void> {
    console.log('🔌 Connecting to SignalR:', this.hubUrl);
    console.log('🔐 Using token:', token ? 'EXISTS' : 'MISSING');

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.hubUrl, {
        accessTokenFactory: () => token,
        skipNegotiation: false,
        transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    try {
      await this.hubConnection.start();
      console.log('✅ SignalR Connected');
      this.connectionState.next(true);
    } catch (error) {
      console.error('❌ SignalR Connection Error:', error);
      this.connectionState.next(false);
      throw error;
    }
  }

  async stopConnection(): Promise<void> {
    if (this.hubConnection) {
      await this.hubConnection.stop();
      this.connectionState.next(false);
      console.log('🔌 SignalR Disconnected');
    }
  }

  public onNotificationReceived(callback: (notification: Notification) => void): void {
    if (!this.hubConnection) {
      console.warn('⚠️ Cannot register callback - no hub connection');
      return;
    }

    this.hubConnection.on('ReceiveNotification', (notification: any) => {
      console.log('🔔 Raw notification received from SignalR:', notification);
      console.log('🔍 Raw IsRead value:', notification.isRead, notification.IsRead);

      // ✅ Ensure the notification has the correct structure and isRead is false
      const mappedNotification: Notification = {
        notificationId: notification.notificationId || notification.NotificationId,
        userId: notification.userId || notification.UserId,
        title: notification.title || notification.Title || '',
        message: notification.message || notification.Message || '',
        type:
          notification.notificationType ||
          notification.NotificationType ||
          notification.type ||
          notification.Type ||
          'default',
        relatedEntityType: notification.relatedEntityType || notification.RelatedEntityType,
        relatedEntityId: notification.relatedEntityId || notification.RelatedEntityId,
        priority: notification.priority || notification.Priority || 'Normal',
        isRead: false, // ✅ CRITICAL: Always set to false for new notifications
        createdAt: notification.createdAt
          ? new Date(notification.createdAt)
          : notification.CreatedAt
          ? new Date(notification.CreatedAt)
          : new Date(),
        readAt: undefined,
      };

      console.log('✅ Mapped notification:', mappedNotification);
      console.log('✅ Mapped IsRead value:', mappedNotification.isRead);

      callback(mappedNotification);

      // Show browser notification if permission granted
      this.showBrowserNotification(mappedNotification);
    });
  }

  // ✅ Add method to listen for unread count updates
  public onUnreadCountUpdate(callback: (count: number) => void): void {
    if (!this.hubConnection) {
      console.warn('⚠️ Cannot register callback - no hub connection');
      return;
    }

    this.hubConnection.on('UpdateUnreadCount', (count: number) => {
      console.log('🔔 Unread count update received:', count);
      callback(count);
    });
  }

  private showBrowserNotification(notification: Notification): void {
    if (Notification.permission === 'granted') {
      try {
        const browserNotification = new Notification(notification.title, {
          body: notification.message,
          icon: '/assets/icons/notification-icon.png', // Add your icon path
          badge: '/assets/icons/badge-icon.png',
          tag: notification.notificationId,
          requireInteraction: false,
          silent: false,
        });

        browserNotification.onclick = () => {
          window.focus();
          browserNotification.close();
        };

        // Auto-close after 5 seconds
        setTimeout(() => browserNotification.close(), 5000);
      } catch (error) {
        console.error('Error showing browser notification:', error);
      }
    }
  }

  getConnectionState() {
    return this.connectionState.asObservable();
  }

  isConnected(): boolean {
    return this.hubConnection?.state === signalR.HubConnectionState.Connected;
  }
}
