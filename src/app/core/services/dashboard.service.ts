import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError, forkJoin } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment.prod';

export interface DashboardStats {
  totalRequests: number;
  activeDrivers: number;
  completedPickups: number;
  pendingApprovals: number;
  todayPickups: number;
  revenueThisMonth: number;
  totalRevenue: number;
  completedOrdersCount: number;
  pendingPayments: number;
}

export interface RecentActivity {
  id: string;
  type: 'assignment' | 'pickup' | 'approval' | 'registration' | 'payment';
  message: string;
  timestamp: Date;
  icon: string;
}

export interface PaymentStats {
  totalRevenue: number;
  completedOrdersCount: number;
  pendingPayments: number;
  recentPayments: RecentPayment[];
}

export interface RecentPayment {
  orderId: string;
  supplierName: string;
  amount: number;
  paymentStatus: string;
  paidAt: string;
  orderDate: string;
}

export interface SupplierOrder {
  orderId: string;
  supplierName: string;
  totalAmount: number;
  paymentStatus: string;
  orderDate: string;
  paidAt?: string;
  itemsCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly apiUrl = `${environment.apiUrl}/AdminDashboard`;
  private readonly paymentsApiUrl = 'https://recycle.runasp.net/api/admin/supplier-orders';

  private statsSubject = new BehaviorSubject<DashboardStats>({
    totalRequests: 0,
    activeDrivers: 0,
    completedPickups: 0,
    pendingApprovals: 0,
    todayPickups: 0,
    revenueThisMonth: 0,
    totalRevenue: 0,
    completedOrdersCount: 0,
    pendingPayments: 0
  });
  
  private activitiesSubject = new BehaviorSubject<RecentActivity[]>([]);
  private ordersSubject = new BehaviorSubject<SupplierOrder[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);

  public stats$ = this.statsSubject.asObservable();
  public activities$ = this.activitiesSubject.asObservable();
  public orders$ = this.ordersSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();
  public error$ = this.errorSubject.asObservable();

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getPaymentStatistics(): Observable<PaymentStats> {
    console.log('🔵 Calling payment-stats API...');
    
    return this.http.get<PaymentStats>(`${this.paymentsApiUrl}/payment-stats`, {
      headers: this.getHeaders()
    }).pipe(
      tap(paymentStats => {
        console.log('✅ Payment stats loaded:', paymentStats);
        
        const currentStats = this.statsSubject.value;
        this.statsSubject.next({
          ...currentStats,
          totalRevenue: paymentStats.totalRevenue,
          completedOrdersCount: paymentStats.completedOrdersCount,
          pendingPayments: paymentStats.pendingPayments
        });

        if (paymentStats.recentPayments && paymentStats.recentPayments.length > 0) {
          const paymentActivities: RecentActivity[] = paymentStats.recentPayments.map(payment => ({
            id: payment.orderId,
            type: 'payment' as const,
            message: `${payment.supplierName} paid ${payment.amount.toFixed(2)} EGP`,
            timestamp: new Date(payment.paidAt),
            icon: '💰'
          }));

          const currentActivities = this.activitiesSubject.value;
          const allActivities = [...paymentActivities, ...currentActivities]
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, 10);
          
          this.activitiesSubject.next(allActivities);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('❌ Error loading payment stats:', error);
        this.errorSubject.next('Failed to load payment statistics');
        return throwError(() => error);
      })
    );
  }

  getAllOrders(): Observable<SupplierOrder[]> {
    console.log('🔵 Calling all orders API...');
    
    return this.http.get<SupplierOrder[]>(`${this.paymentsApiUrl}`, {
      headers: this.getHeaders()
    }).pipe(
      tap(orders => {
        console.log('✅ All orders loaded:', orders.length, 'orders');
        this.ordersSubject.next(orders);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('❌ Error loading orders:', error);
        return throwError(() => error);
      })
    );
  }

  getDashboardStats(): Observable<DashboardStats> {
    console.log('🔵 Calling dashboard stats API...');
    
    return this.http.get<any>(`${this.apiUrl}/stats`, {
      headers: this.getHeaders()
    }).pipe(
      tap(stats => {
        console.log('✅ Dashboard stats loaded:', stats);
        const currentStats = this.statsSubject.value;
        this.statsSubject.next({
          ...currentStats,
          ...stats
        });
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('❌ Error loading dashboard stats:', error);
        return throwError(() => error);
      })
    );
  }

  getRecentActivities(): Observable<RecentActivity[]> {
    console.log('🔵 Calling recent activities API...');
    
    return this.http.get<RecentActivity[]>(`${this.apiUrl}/recent-activities`, {
      headers: this.getHeaders()
    }).pipe(
      tap(activities => {
        console.log('✅ Recent activities loaded:', activities.length, 'items');
        const currentActivities = this.activitiesSubject.value;
        const allActivities = [...activities, ...currentActivities]
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, 3);
        this.activitiesSubject.next(allActivities);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('❌ Error loading recent activities:', error);
        return throwError(() => error);
      })
    );
  }

  loadDashboardData(): void {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    this.getPaymentStatistics().subscribe({
      next: () => {
        console.log('✅ Payment stats loaded successfully');
        
        forkJoin({
          stats: this.getDashboardStats().pipe(
            catchError(() => {
              console.warn('⚠️ Dashboard stats failed, continuing...');
              return new Observable(observer => observer.next(null));
            })
          ),
          activities: this.getRecentActivities().pipe(
            catchError(() => {
              console.warn('⚠️ Recent activities failed, continuing...');
              return new Observable(observer => observer.next([]));
            })
          ),
          orders: this.getAllOrders().pipe(
            catchError(() => {
              console.warn('⚠️ Orders failed, continuing...');
              return new Observable(observer => observer.next([]));
            })
          )
        }).subscribe({
          next: () => {
            console.log('✅ All dashboard data loaded');
            this.loadingSubject.next(false);
          },
          error: (error) => {
            console.error('❌ Error loading additional dashboard data:', error);
            this.loadingSubject.next(false);
          }
        });
      },
      error: (error) => {
        console.error('❌ Error loading payment stats:', error);
        this.errorSubject.next('Failed to load payment statistics');
        this.loadingSubject.next(false);
      }
    });
  }

  refreshDashboard(): void {
    console.log('🔄 Refreshing dashboard data...');
    this.loadDashboardData();
  }

  clearError(): void {
    this.errorSubject.next(null);
  }

  getCurrentStats(): DashboardStats {
    return this.statsSubject.value;
  }

  getCurrentActivities(): RecentActivity[] {
    return this.activitiesSubject.value;
  }

  getCurrentOrders(): SupplierOrder[] {
    return this.ordersSubject.value;
  }
}