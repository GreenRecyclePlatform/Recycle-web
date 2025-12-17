// src/app/core/services/user-profile.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface UpdatePayPalEmailDto {
    payPalEmail: string;
}

@Injectable({
    providedIn: 'root'
})
export class UserProfileService {
    private readonly baseUrl = `${environment.apiUrl}/Profile`;

    constructor(private http: HttpClient) { }

    updatePayPalEmail(email: string): Observable<any> {
        return this.http.put(`${this.baseUrl}/paypal-email`, { payPalEmail: email });
    }

    getProfile(): Observable<any> {
        return this.http.get(this.baseUrl);
    }
}