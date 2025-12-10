import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Request, PickupRequest, Driver } from '../models/assignment';
import { AssignmentRequest } from '../models/assignment';
import { environment } from '../../../../environments/environment';
import { AddressDto } from '../../../core/models/auth-response';

export interface Material {
  materialName: string;
  estimatedWeight: string;
}

export interface WaitingRequest {
  id: string;
  userName: string;
  preferredPickupDate: string;
  preferredPickupTime: string;
  address: AddressDto;
  phoneNumber: string;
  requestMaterials: Material[];
  totalEstimatedWeight: number;
  status: string;
  expanded: boolean | false;
}

export interface newStatus {
  NewStatus: string;
}

@Injectable({
  providedIn: 'root',
})
export class DriverService {
  private readonly apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  UpdatingStatus(id: string, newstatus: newStatus): Observable<any> {
    return this.http.patch(`${this.apiUrl}/PickupRequests/${id}/status`, newstatus).pipe(
      tap(() => console.log('checked request status:', id)),
      catchError(this.handleError)
    );
  }

  getAvailableDrivers(): Observable<Driver[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/DriverProfiles`
    ).pipe(
      map(drivers => drivers
        .filter(driver => driver.isAvailable) 
        .map(driver => ({
          id: driver.id,  
          name: `${driver.firstName} ${driver.lastName}`,
          initials: this.getInitials(`${driver.firstName} ${driver.lastName}`),
          rating: driver.rating || 0,
          currentLocation: driver.address 
            ? `${driver.address.city}, ${driver.address.governorate}` 
            : 'Available',
          phone: driver.phonenumber || driver.phoneNumber || 'N/A',
          todayPickups: driver.totalTrips || 0,
          profileImageUrl: driver.profileImageUrl || null 
         }))
      ),
      catchError(this.handleError)
    );
  }

  getWaitingRequests(): Observable<WaitingRequest[]> {
    return this.http.get<WaitingRequest[]>(`${this.apiUrl}/PickupRequests/Waiting`).pipe(
      tap((requests) => console.log('Fetched waiting requests:', requests.length)),
      catchError(this.handleError)
    );
  }

  getApprovedRequests(): Observable<Request[]> {
    return this.http.get<PickupRequest[]>(`${this.apiUrl}/PickupRequests/status/Pending`).pipe(
      map((requests) =>
        requests.map((req) => ({
          id: req.requestId,
          customerName: req.userName,
          address: req.fullAddress,
          material: this.getMaterialsText(req.materials),
          weight: req.totalEstimatedWeight,
          status: req.status,
        }))
      ),
      catchError(this.handleError)
    );
  }

 
  assignRequestToDriver(assignment: AssignmentRequest): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/DriverAssignments/assign`, assignment)
      .pipe(catchError(this.handleError));
  }

  private getMaterialsText(materials: any[]): string {
    if (!materials || materials.length === 0) {
      return 'Mixed Materials';
    }
    return materials.map((m) => m.materialName || m.name).join(', ');
  }

  private getInitials(name: string): string {
    if (!name) return 'NA';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  private handleError(error: any) {
    let errorMessage = 'An unknown error occurred fetching data from the server.';

    if (error.status === 400) {
      errorMessage = 'Errors in the submitted data';

      if (error.error?.errors) {
        const validationErrors = Object.values(error.error.errors).flat().join(', ');
        errorMessage += ': ' + validationErrors;
      } else if (error.error?.message) {
        errorMessage += ': ' + error.error.message;
      } else if (typeof error.error === 'string') {
        errorMessage += ': ' + error.error;
      }
    } else if (error.status === 401) {
      errorMessage = 'Unauthorized - Please login as Admin to access this resource';
    } else if (error.status === 403) {
      errorMessage = 'You do not have Admin permission to access this resource';
    } else if (error.status === 0) {
      errorMessage = 'Cannot connect to server. Please check your network connection.';
    } else if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = error.error?.message || `Error ${error.status}: ${error.message}`;
    }
    
    console.error('API Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
