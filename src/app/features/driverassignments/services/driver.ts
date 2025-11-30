

  import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Request, PickupRequest,Driver } from '../models/assignment';
import { AssignmentRequest } from '../models/assignment';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DriverService {
  private readonly apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) { }
//  Headers (without Token until Login)
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    //after login, use this:
    // const token = localStorage.getItem('token');
    // return new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'Authorization': `Bearer ${token}`
    // });
  }

//pickup requests with status 'Pending'
  getApprovedRequests(): Observable<Request[]> {
    return this.http.get<PickupRequest[]>(
      `${this.apiUrl}/PickupRequests/status/Pending`,
      { headers: this.getHeaders() }
    ).pipe(
      map(requests => requests.map(req => ({
        id: req.requestId,
        customerName: req.userName,
        address: req.fullAddress,
        material: this.getMaterialsText(req.materials),
        weight: req.totalEstimatedWeight,
        status: req.status
      }))),
      catchError(this.handleError)
    );
  }
// Get available drivers
  getAvailableDrivers(): Observable<Driver[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/DriverProfiles`,
      { headers: this.getHeaders() }
    ).pipe(
      map(drivers => drivers
        .filter(driver => driver.isAvailable) 
        .map(driver => ({
          id: driver.userId || driver.id,
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

// Assign request to driver
  assignRequestToDriver(assignment: AssignmentRequest): Observable<any> {
   // console.log(' Assignment data being sent:', assignment);
    //console.log(' Request URL:', `${this.apiUrl}/DriverAssignments/assign`);
    
    return this.http.post(
      `${this.apiUrl}/DriverAssignments/assign`,
      assignment,
      { 
        headers: this.getHeaders(),
      }
    ).pipe(
     
      catchError(this.handleError)
    );
  }

//helper to get materials text
  private getMaterialsText(materials: any[]): string {
    if (!materials || materials.length === 0) {
      return 'Mixed Materials';
    }
    return materials.map(m => m.materialName || m.name).join(', ');
  }
//helper to get initials letters
  private getInitials(name: string): string {
    if (!name) return 'NA';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

//error handler//error handler
private handleError(error: any) {
  let errorMessage = 'An unknown error occurred fetching data from the server.';
  
  console.log('🔴 Full Error Object:', error);
  console.log('🔴 Error Status:', error.status);
  console.log('🔴 Error error property:', error.error);
  
  if (error.error) {
    console.log('🔴 Error keys:', Object.keys(error.error));
    console.log('🔴 Error stringified:', JSON.stringify(error.error));
  }
  
  if (error.status === 400) {
    errorMessage ='Errors in the submitted data';
    
    if (error.error?.errors) {
      console.log(' Validation Errors:', error.error.errors);
      const validationErrors = Object.values(error.error.errors).flat().join(', ');
      errorMessage += ': ' + validationErrors;
    } else if (error.error?.message) {
      errorMessage += ': ' + error.error.message;
    } else if (typeof error.error === 'string') {
      errorMessage += ': ' + error.error;
    }
  } else if (error.status === 401) {
    errorMessage = 'Unauthorized access - please log in again';
  } else if (error.status === 403) {
    errorMessage = 'You do not have Admin permission to access this data';
  } else if (error.status === 0) {
    errorMessage = 'Cannot connect to server. Please check your network connection.';
  } else if (error.error instanceof ErrorEvent) {
    errorMessage = `error: ${error.error.message}`;
  } else {
    errorMessage = error.error?.message || `error ${error.status}: ${error.message}`;
  }
  
  console.error('Final Error Message:', errorMessage);
  return throwError(() => new Error(errorMessage));
}
}


