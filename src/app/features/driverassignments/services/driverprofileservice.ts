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

  // ✅ GET Driver Profile by User ID
  getDriverProfile(userId: string): Observable<DriverProfileResponse> {
    return this.http.get<DriverProfileResponse>(`${this.apiUrl}/${userId}`);
  }

  // ✅ UPDATE Driver Profile by User ID
  updateDriverProfile(userId: string, profileData: UpdateDriverProfileRequest): Observable<DriverProfileResponse> {
    return this.http.put<DriverProfileResponse>(`${this.apiUrl}/${userId}`, profileData);
  }

  // ✅ UPDATE Availability
  updateAvailability(isAvailable: boolean): Observable<boolean> {
    return this.http.put<boolean>(`${this.apiUrl}/availability`, { isAvailable });
  }

  // ✅ UPLOAD Profile Image
  uploadProfileImage(file: File): Observable<{imageUrl: string}> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.http.post<{imageUrl: string}>(`${this.apiUrl}/upload-image`, formData);
  }
}