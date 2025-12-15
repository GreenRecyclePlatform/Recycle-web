import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NotificationService } from '../../../core/services/notification.service';
import { SignalrService } from '../../../core/services/signalr.service';
import { NotificationDropdownComponent } from '../notification-dropdown/notification-dropdown.component';
import { Notification } from '../../../core/models/notification.model';

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [CommonModule, NotificationDropdownComponent],
  templateUrl: './notification-bell.component.html',
  styleUrls: ['./notification-bell.component.css'],
})
export class NotificationBellComponent implements OnInit, OnDestroy {
  unreadCount = 0;
  isDropdownOpen = false;
  isConnected = false;
  private destroy$ = new Subject<void>();

  constructor(
    private notificationService: NotificationService,
    private signalRService: SignalrService
  ) {}

  async ngOnInit(): Promise<void> {
    console.log('🚀 Initializing notification bell component...');

    // Subscribe to unread count from notification service
    this.notificationService.unreadCount$.pipe(takeUntil(this.destroy$)).subscribe((count) => {
      console.log('📊 Unread count updated in bell:', count);
      this.unreadCount = count;
    });

    // Subscribe to SignalR connection state
    this.signalRService
      .getConnectionState()
      .pipe(takeUntil(this.destroy$))
      .subscribe((state: boolean) => {
        console.log('🔌 SignalR connection state:', state);
        this.isConnected = state;
      });

    // Initialize SignalR FIRST (before loading notifications)
    await this.initializeSignalR();

    // Setup SignalR listeners
    this.setupSignalRListeners();

    // Load initial data AFTER SignalR is setup
    await this.loadInitialData();

    // Request browser notification permission
    this.signalRService.requestNotificationPermission();
  }

  /**
   * Initialize SignalR connection
   */
  private async initializeSignalR(): Promise<void> {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    if (token) {
      try {
        console.log('🔌 Starting SignalR connection...');
        await this.signalRService.startConnection(token);
        console.log('✅ SignalR initialized successfully');
      } catch (err) {
        console.error('❌ Failed to initialize SignalR:', err);
      }
    } else {
      console.warn('⚠️ No auth token found, skipping SignalR initialization');
    }
  }

  /**
   * Setup SignalR event listeners
   */
  private setupSignalRListeners(): void {
    console.log('🎧 Setting up SignalR listeners...');

    // Listen for new notifications
    this.signalRService.onNotificationReceived((notification: Notification) => {
      console.log('🔔 NEW NOTIFICATION RECEIVED:', notification);
      console.log('📌 IsRead status:', notification.isRead);

      // ✅ Add notification to service (this will automatically update unread count)
      this.notificationService.addNotification(notification);

      console.log('✅ Notification added to service');
      console.log('📊 Current unread count:', this.notificationService.unreadCountSubject.value);

      // Show visual/audio feedback
      this.playNotificationSound();
      this.animateBell();
    });

    // ✅ Listen for unread count updates from SignalR
    this.signalRService.onUnreadCountUpdate((count: number) => {
      console.log('🔔 Unread count update from SignalR:', count);
      this.notificationService.unreadCountSubject.next(count);
    });
  }

  /**
   * Load initial notifications and unread count
   */
  private async loadInitialData(): Promise<void> {
    console.log('📡 Loading initial data...');

    // Load all notifications first
    this.notificationService
      .getAllNotifications()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (notifications) => {
          console.log('✅ Initial notifications loaded:', notifications.length);
          console.log('📊 Unread notifications:', notifications.filter((n) => !n.isRead).length);
        },
        error: (error) => {
          console.error('❌ Error loading notifications:', error);
        },
      });

    // Load unread count
    this.notificationService
      .getUnreadCount()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (count) => {
          console.log('✅ Initial unread count loaded:', count);
        },
        error: (error) => {
          console.error('❌ Error loading unread count:', error);
        },
      });
  }

  /**
   * Play notification sound
   */
  private playNotificationSound(): void {
    try {
      const audio = new Audio('/assets/sounds/notification.mp3');
      audio.volume = 0.3;
      audio.play().catch((err) => console.log('Sound play failed:', err));
    } catch (error) {
      console.log('Could not play notification sound:', error);
    }
  }

  /**
   * Animate bell icon
   */
  private animateBell(): void {
    console.log('🔔 Bell animation triggered');
  }

  /**
   * Toggle dropdown
   */
  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
    console.log('📂 Dropdown toggled:', this.isDropdownOpen);
  }

  /**
   * Close dropdown
   */
  closeDropdown(): void {
    this.isDropdownOpen = false;
    console.log('📂 Dropdown closed');
  }

  ngOnDestroy(): void {
    console.log('🧹 Cleaning up notification bell component...');
    this.destroy$.next();
    this.destroy$.complete();
  }
}
