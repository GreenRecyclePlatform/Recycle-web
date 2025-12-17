import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, forkJoin, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment.prod';
import {
  Pickup,
  PickupStats,
  PickupStatus,
  RejectRequest,
  CompleteRequest,DriverResponseDto,UpdateAssignmentStatusDto
} from '../models/DashpickupDriver';

@Injectable({
  providedIn: 'root'
})
export class DashpickupDriverservice {
  
  private readonly apiUrl = `${environment.apiUrl}/DriverAssignments`;

  // State
  private pickupsSubject = new BehaviorSubject<Pickup[]>([]);
  private statsSubject = new BehaviorSubject<PickupStats>({
    all: 0, pending: 0, inProgress: 0, completed: 0, cancelled: 0
  });
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public pickups$ = this.pickupsSubject.asObservable();
  public stats$ = this.statsSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {}

  // ========== Load All Assignments ==========
  loadAllPickups(): Observable<Pickup[]> {
    this.loadingSubject.next(true);

    return forkJoin({
      pending: this.fetchByStatus(PickupStatus.Pending),
      inProgress: this.fetchByStatus(PickupStatus.InProgress),
      completed: this.fetchByStatus(PickupStatus.Completed),
      cancelled: this.fetchByStatus(PickupStatus.Cancelled)
    }).pipe(
      map(results => {
        const all = [
          ...results.pending,
          ...results.inProgress,
          ...results.completed,
          ...results.cancelled
        ];
        
        this.pickupsSubject.next(all);
        this.calculateStats(all);
        this.loadingSubject.next(false);
        
        return all;
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        return this.handleError(error);
      })
    );
  }

  // ========== Fetch by Status ==========

private fetchByStatus(status: PickupStatus): Observable<Pickup[]> {
  //  (number of Status)
  const params = new HttpParams().set('status', status.toString());
  const fullUrl = `${this.apiUrl}/my-assignments`;
  
  console.log(` Fetching ${PickupStatus[status]}`);
  console.log(`   URL: ${fullUrl}?status=${status}`);  
  
  return this.http.get<Pickup[]>(fullUrl, { params }).pipe(
    tap(response => {
      console.log(` ${PickupStatus[status]}: ${response?.length || 0} items`);
    }),
  
  );
}

  // ========== Get Pickups ==========
  getPickups(): Observable<Pickup[]> {
    return this.pickups$;
  }

  // ========== Get Stats ==========
  getStats(): Observable<PickupStats> {
    return this.stats$;
  }

  // ========== Calculate Stats ==========
  private calculateStats(pickups: Pickup[]): void {
    const stats: PickupStats = {
      all: pickups.length,
      pending: pickups.filter(p => p.status === PickupStatus.Pending).length,
      inProgress: pickups.filter(p => p.status === PickupStatus.InProgress).length,
      completed: pickups.filter(p => p.status === PickupStatus.Completed).length,
      cancelled: pickups.filter(p => p.status === PickupStatus.Cancelled).length
    };
    this.statsSubject.next(stats);
  }

  // ========== Accept Pickup ==========
  acceptPickup(assignmentId: string): Observable<any> {
    const body: DriverResponseDto = {
      assignmentId: assignmentId,
      action: 1 // Accept
    };

    return this.http.post(`${this.apiUrl}/respond`, body)
      .pipe(
        tap(() => {
          this.updateLocalStatus(assignmentId, PickupStatus.InProgress);
        }),
        catchError(this.handleError)
      );
  }

  // ========== Reject Pickup ==========
  rejectPickup(assignmentId: string, reason: string): Observable<any> {
    const body: DriverResponseDto = {
      assignmentId: assignmentId,
      action: 2, // Reject
      notes: reason
    };
    
    return this.http.post(`${this.apiUrl}/respond`, body)
      .pipe(
        tap(() => {
          this.updateLocalStatus(assignmentId, PickupStatus.Cancelled, reason);
        }),
        catchError(this.handleError)
      );
  }

  // ========== Complete Pickup ==========
  completePickup(assignmentId: string, driverNotes?: string): Observable<any> {
    const body: UpdateAssignmentStatusDto = {
      assignmentId: assignmentId,
      status: 1, //  1 = Completed
      notes: driverNotes
    };
    
    console.log('🔍 Complete Request Body:', body);
    
    return this.http.put(`${this.apiUrl}/update-status`, body)
      .pipe(
        tap((response) => {
          console.log(' Complete Response:', response);
          this.updateLocalStatus(assignmentId, PickupStatus.Completed);
        }),
        catchError((error) => {
          console.error(' Complete Error:', error);
          return this.handleError(error);
        })
      );
  }

  // ========== Update Local Status ==========
  private updateLocalStatus(id: string, status: PickupStatus, rejectReason?: string): void {
    const current = this.pickupsSubject.getValue();
    const updated = current.map(p => 
      p.assignmentId === id 
        ? { ...p, status, rejectReason, isActive: status === PickupStatus.InProgress } 
        : p
    );
    this.pickupsSubject.next(updated);
    this.calculateStats(updated);
  }

  // ========== Filter Pickups ==========
  filterPickups(status: PickupStatus | 'all', searchTerm: string): Observable<Pickup[]> {
    return this.pickups$.pipe(
      map(pickups => {
        let filtered = pickups;

        // Filter by status
        if (status !== 'all') {
          filtered = filtered.filter(p => p.status === status);
        }

        // Filter by search
        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          filtered = filtered.filter(p =>
            p.assignmentId.toLowerCase().includes(term) ||
            p.requestId.toLowerCase().includes(term) ||
            p.pickupAddress.toLowerCase().includes(term) ||
            p.driverName.toLowerCase().includes(term)
          );
        }

        return filtered;
      })
    );
  }

  // ========== Refresh ==========
  refreshData(): void {
    this.loadAllPickups().subscribe();
  }

  // ========== Error Handler ==========
  private handleError(error: any): Observable<never> {
    let message = 'An error occurred';
    
    if (error.error?.message) {
      message = error.error.message;
    } else if (error.status === 401) {
      message = 'Unauthorized';
    } else if (error.status === 404) {
      message = 'Not found';
    } else if (error.status >= 500) {
      message = 'Server error';
    }

    console.error('API Error:', message, error);
    return throwError(() => new Error(message));
  }
}