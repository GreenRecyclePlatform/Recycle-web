import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { DashboardService, DashboardStats, RecentActivity, SupplierOrder } from '../../core/services/dashboard.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  stats: DashboardStats = {
    totalRequests: 0,
    activeDrivers: 0,
    completedPickups: 0,
    pendingApprovals: 0,
    todayPickups: 0,
    revenueThisMonth: 0,
    totalRevenue: 0,
    completedOrdersCount: 0,
    pendingPayments: 0
  };

  recentActivities: RecentActivity[] = [];
  allOrders: SupplierOrder[] = [];

  isLoading: boolean = true;
  errorMessage: string = '';

  private destroy$ = new Subject<void>();

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadDashboardData();
    this.subscribeToDataStreams();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private subscribeToDataStreams(): void {
    this.dashboardService.stats$
      .pipe(takeUntil(this.destroy$))
      .subscribe(stats => {
        if (stats) {
          this.stats = stats;
          console.log('📊 Stats updated:', stats);
        }
      });

    this.dashboardService.activities$
      .pipe(takeUntil(this.destroy$))
      .subscribe(activities => {
        this.recentActivities = activities;
        console.log('📋 Activities updated:', activities.length);
      });

    this.dashboardService.orders$
      .pipe(takeUntil(this.destroy$))
      .subscribe(orders => {
        this.allOrders = orders;
        console.log('📦 Orders updated:', orders.length);
      });

    this.dashboardService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => {
        this.isLoading = loading;
      });

    this.dashboardService.error$
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        this.errorMessage = error || '';
      });
  }

  loadDashboardData(): void {
    this.dashboardService.loadDashboardData();
  }

  refreshDashboard(): void {
    console.log('🔄 Refresh button clicked');
    this.dashboardService.refreshDashboard();
  }

  getTimeAgo(timestamp: Date): string {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  }

  getActivityClass(type: string): string {
    const classMap: { [key: string]: string } = {
      'assignment': 'activity-assignment',
      'pickup': 'activity-pickup',
      'approval': 'activity-approval',
      'registration': 'activity-registration',
      'payment': 'activity-payment'
    };
    return classMap[type] || 'activity-default';
  }

  getCompletionRate(): string {
    if (this.stats.totalRequests === 0) return '0.0';
    const rate = (this.stats.completedPickups / this.stats.totalRequests) * 100;
    return rate.toFixed(1);
  }

  formatRevenue(amount?: number): string {
    if (!amount && amount !== 0) {
      amount = this.stats.revenueThisMonth;
    }
    return amount.toLocaleString('en-EG', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  }

  formatRevenueAmount(amount: number | undefined): string {
    if (!amount) return '0';
    return amount.toLocaleString('en-EG', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'status-completed';
      case 'pending':
        return 'status-pending';
      case 'failed':
        return 'status-failed';
      default:
        return '';
    }
  }

  getStatusText(status: string): string {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'Completed';
      case 'pending':
        return 'Pending';
      case 'failed':
        return 'Failed';
      default:
        return status;
    }
  }

  formatDate(date: string): string {
    if (!date) return '-';
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatCurrency(amount: number): string {
    return `EG ${amount.toFixed(2)}`;
  }
}