import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment.prod';

export interface Settings {
  [category: string]: {
    [key: string]: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class SettingService {
  private readonly baseUrl = `${environment.apiUrl}/Settings`;

  constructor(private http: HttpClient) {}

  // Get all settings grouped by category
  getAllSettings(): Observable<Settings> {
    return this.http.get<Settings>(this.baseUrl)
      .pipe(catchError(this.handleError));
  }

  // Get settings for a specific category
  getCategorySettings(category: string): Observable<{ [key: string]: string }> {
    return this.http.get<{ [key: string]: string }>(`${this.baseUrl}/${category}`)
      .pipe(catchError(this.handleError));
  }

  // Update settings for a specific category
  updateCategorySettings(category: string, settings: { [key: string]: string }): Observable<any> {
    return this.http.put(`${this.baseUrl}/${category}`, settings)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Settings API Error:', error);

    let errorMessage = 'An error occurred while processing settings';

    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    return throwError(() => new Error(errorMessage));
  }
}
