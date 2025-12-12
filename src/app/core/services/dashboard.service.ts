import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

/**
 * Dashboard statistics interface
 */
export interface DashboardStats {
  totalRequests: number;
  activeDrivers: number;
  completedPickups: number;
  pendingApprovals: number;
  todayPickups: number;
  revenueThisMonth: number;
}

/**
 * Recent activity interface
 */
export interface RecentActivity {
  id: string;
  type: 'assignment' | 'pickup' | 'approval' | 'registration';
  message: string;
  timestamp: Date;
  icon: string;
}

/**
 * Dashboard Service
 * Handles all dashboard-related API calls and state management
 */
@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly apiUrl = `${environment.apiUrl}/AdminDashboard`;

  // State management with BehaviorSubject
  private statsSubject = new BehaviorSubject<DashboardStats | null>(null);
  private activitiesSubject = new BehaviorSubject<RecentActivity[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);

  // Public observables
  public stats$ = this.statsSubject.asObservable();
  public activities$ = this.activitiesSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();
  public error$ = this.errorSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Get dashboard statistics from API
   */
  getDashboardStats(): Observable<DashboardStats> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return this.http.get<DashboardStats>(`${this.apiUrl}/stats`).pipe(
      tap(stats => {
        console.log('✅ Dashboard stats loaded:', stats);
        this.statsSubject.next(stats);
        this.loadingSubject.next(false);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('❌ Error loading dashboard stats:', error);
        this.errorSubject.next('Failed to load dashboard statistics');
        this.loadingSubject.next(false);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get recent activities from API
   */
  getRecentActivities(): Observable<RecentActivity[]> {
    return this.http.get<RecentActivity[]>(`${this.apiUrl}/recent-activities`).pipe(
      tap(activities => {
        console.log('✅ Recent activities loaded:', activities.length, 'items');
        this.activitiesSubject.next(activities);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('❌ Error loading recent activities:', error);
        this.errorSubject.next('Failed to load recent activities');
        return throwError(() => error);
      })
    );
  }

  /**
   * Load all dashboard data
   */
  loadDashboardData(): void {
    this.getDashboardStats().subscribe();
    this.getRecentActivities().subscribe();
  }

  /**
   * Refresh dashboard data
   */
  refreshDashboard(): void {
    console.log('🔄 Refreshing dashboard data...');
    this.loadDashboardData();
  }

  /**
   * Clear error state
   */
  clearError(): void {
    this.errorSubject.next(null);
  }

  /**
   * Get current stats value
   */
  getCurrentStats(): DashboardStats | null {
    return this.statsSubject.value;
  }

  /**
   * Get current activities value
   */
  getCurrentActivities(): RecentActivity[] {
    return this.activitiesSubject.value;
  }
}
