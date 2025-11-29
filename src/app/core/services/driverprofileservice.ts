import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class DriverProfileService {
  constructor(private http: HttpClient) {}

  private readonly apiUrl = environment.apiUrl;

  createdriverprofile(profile: FormData): void {
    this.http.post(`${this.apiUrl}${API_ENDPOINTS.DRIVERPROFILE.Create}`, profile).subscribe({
      next: () => {
        console.log('profile created');
      },
      error: (error) => console.error('profile error', error),
    });
  }
}
