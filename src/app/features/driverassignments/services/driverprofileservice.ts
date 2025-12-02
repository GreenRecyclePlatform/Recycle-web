import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DriverProfileResponse, UpdateDriverProfileRequest } from '../models/Profiledriver';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DriverProfileService {
  private apiUrl = `${environment.apiUrl}/DriverProfiles`;

  constructor(private http: HttpClient) {}

  // GET - with driverId parameter
  getDriverProfile(driverId: string): Observable<DriverProfileResponse> {
    return this.http.get<DriverProfileResponse>(`${this.apiUrl}/${driverId}`);
  }

  // PUT - with driverId parameter
  updateDriverProfile(driverId: string, profileData: UpdateDriverProfileRequest): Observable<any> {
    return this.http.put(`${this.apiUrl}/${driverId}`, profileData);
  }

  //  PUT availability 
  updateAvailability(isAvailable: boolean): Observable<boolean> {
    return this.http.put<boolean>(`${this.apiUrl}/availability`, isAvailable);
  }

  //  POST upload image 
  uploadProfileImage(file: File): Observable<{imageUrl: string}> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.http.post<{imageUrl: string}>(`${this.apiUrl}/upload-image`, formData);
  }
}