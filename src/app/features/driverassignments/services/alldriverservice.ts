// alldriverservice.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Driver, DriverProfileResponse, mapDriverProfileToDriver } from '../models/all-drivers';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Alldriverservice {
  private apiUrl = `${environment.apiUrl}/DriverProfiles`;
  

  constructor(private http: HttpClient) {}

  // Get all drivers
  getAllDrivers(): Observable<Driver[]> {
    return this.http.get<DriverProfileResponse[]>(this.apiUrl).pipe(
      map(profiles => profiles.map(profile => mapDriverProfileToDriver(profile))),
      catchError(this.handleError)
    );
  }

  // Get driver by ID
  getDriverById(id: string): Observable<Driver> {
    return this.http.get<DriverProfileResponse>(`${this.apiUrl}/${id}`).pipe(
      map(profile => mapDriverProfileToDriver(profile)),
      catchError(this.handleError)
    );
  }

  // Delete driver
  deleteDriver(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Update driver availability status
  updateDriverAvailability(id: string, isAvailable: boolean): Observable<Driver> {
    return this.http.patch<DriverProfileResponse>(
      `${this.apiUrl}/${id}/availability`, 
      { isAvailable }
    ).pipe(
      map(profile => mapDriverProfileToDriver(profile)),
      catchError(this.handleError)
    );
  }

  // Error handling
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage ='Unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Backend error
      errorMessage = ` Error from Server(${error.status}): ${error.message}`;
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}