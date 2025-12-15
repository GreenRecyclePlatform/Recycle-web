import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { DashboardService, DashboardStats, RecentActivity } from '../../core/services/dashboard.service';
import { AuthService } from '../../core/services/authservice';

/**
 * Admin Dashboard Component
 * Displays key metrics, statistics, and recent activities
 * ADMIN ACCESS ONLY
 */
@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  // Dashboard data
  stats: DashboardStats = {
    totalRequests: 0,
    activeDrivers: 0,
    completedPickups: 0,
    pendingApprovals: 0,
    todayPickups: 0,
    revenueThisMonth: 0
  };

  recentActivities: RecentActivity[] = [];

  // UI state
  isLoading: boolean = true;
  errorMessage: string = '';
  accessDenied: boolean = false;

  // Subscription management
  private destroy$ = new Subject<void>();

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService,
    private router: Router
  ) {}

  /**
   * Component initialization - Check admin access first
   */
  ngOnInit(): void {
    this.checkAdminAccess();
  }

  /**
   * Component cleanup
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Check if user has admin access
   */
  checkAdminAccess(): void {
    const token = this.authService.getToken();
    const isAdmin = this.authService.isAdmin();
    const userId = this.authService.getUserIdFromToken();

    console.log('🔐 Admin Dashboard - Access Check:', {
      hasToken: !!token,
      userId,
      isAdmin
    });

    // Check 1: Token exists
    if (!token) {
      this.errorMessage = 'Please login to access this page';
      this.accessDenied = true;
      console.warn('⚠️ No token found - redirecting to login');
      setTimeout(() => {
        this.router.navigate(['/login'], {
          queryParams: { returnUrl: '/admin/dashboard' }
        });
      }, 2000);
      return;
    }

    // Check 2: User has Admin role
    if (!isAdmin) {
      this.errorMessage = 'You need Admin privileges to access this page';
      this.accessDenied = true;
      console.warn('⚠️ Not an admin - access denied');
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 2000);
      return;
    }

    console.log('✅ Admin access confirmed - loading dashboard data');
    this.loadDashboardData();
    this.subscribeToDataStreams();
  }

  /**
   * Subscribe to dashboard service observables
   */
  private subscribeToDataStreams(): void {
    // Subscribe to stats
    this.dashboardService.stats$
      .pipe(takeUntil(this.destroy$))
      .subscribe(stats => {
        if (stats) {
          this.stats = stats;
          console.log('📊 Stats updated:', stats);
        }
      });

    // Subscribe to activities
    this.dashboardService.activities$
      .pipe(takeUntil(this.destroy$))
      .subscribe(activities => {
        this.recentActivities = activities;
        console.log('📋 Activities updated:', activities.length);
      });

    // Subscribe to loading state
    this.dashboardService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => {
        this.isLoading = loading;
      });

    // Subscribe to error state
    this.dashboardService.error$
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error && !this.accessDenied) {
          this.errorMessage = error;
        }
      });
  }

  /**
   * Load dashboard data from service
   */
  loadDashboardData(): void {
    this.dashboardService.loadDashboardData();
  }

  /**
   * Refresh dashboard data
   */
  refreshDashboard(): void {
    console.log('🔄 Refresh button clicked');
    this.errorMessage = '';
    this.dashboardService.refreshDashboard();
  }

  /**
   * Get time ago string from timestamp
   */
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

  /**
   * Get CSS class for activity type
   */
  getActivityClass(type: string): string {
    const classMap: { [key: string]: string } = {
      'assignment': 'activity-assignment',
      'pickup': 'activity-pickup',
      'approval': 'activity-approval',
      'registration': 'activity-registration'
    };
    return classMap[type] || 'activity-default';
  }

  /**
   * Calculate completion rate percentage
   */
  getCompletionRate(): string {
    if (this.stats.totalRequests === 0) return '0.0';
    const rate = (this.stats.completedPickups / this.stats.totalRequests) * 100;
    return rate.toFixed(1);
  }

  /**
   * Format revenue number
   */
  formatRevenue(): string {
    return this.stats.revenueThisMonth.toLocaleString('en-EG', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  }
}
