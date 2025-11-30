// driverprofileservice.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DriverProfileResponse ,UpdateDriverProfileRequest} from '.././models/Profiledriver';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DriverProfileService {
  private apiUrl = `${environment.apiUrl}/DriverProfiles`;

  constructor(private http: HttpClient) {}

  getDriverProfile(driverId: string): Observable<DriverProfileResponse> {
    return this.http.get<DriverProfileResponse>(`${this.apiUrl}/${driverId}`);
  }

  updateDriverProfile(driverId: string, profileData: UpdateDriverProfileRequest): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'accept': '*/*'
    });
    
    return this.http.put(`${this.apiUrl}/${driverId}`, profileData, { headers });
  }

  // method to update availability
  updateAvailability(isAvailable: boolean): Observable<boolean> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'accept': '*/*'
    });
    
    return this.http.put<boolean>(`${this.apiUrl}/availability`, isAvailable, { headers });
  }

  uploadProfileImage(file: File): Observable<{imageUrl: string}> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.http.post<{imageUrl: string}>(`${this.apiUrl}/upload-image`, formData);
  }
}