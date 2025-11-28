import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SignalrService {
  private hubConnection!: signalR.HubConnection;
  private connectionState = new BehaviorSubject<boolean>(false);
  private hubUrl = 'https://localhost:7099/hubs/notifications';

  constructor() {}

  // ✅ Add this method
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

    this.hubConnection.on('ReceiveNotification', (notification: Notification) => {
      console.log('🔔 New notification received:', notification);
      callback(notification);
    });
  }

  getConnectionState() {
    return this.connectionState.asObservable();
  }

  isConnected(): boolean {
    return this.hubConnection?.state === signalR.HubConnectionState.Connected;
  }
}
