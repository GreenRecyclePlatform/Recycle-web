import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StripeService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/payment`;

  // Stripe Connect Onboarding
  onboardUser(userId: string, email: string, refreshUrl: string, returnUrl: string): Observable<any> {
    return this.http.post(`${this.base}/onboard-user`, null, {
      params: { userId, email, refreshUrl, returnUrl }
    });
  }

  // Check Stripe Account Status
  getAccountStatus(userId: string): Observable<any> {
    return this.http.get(`${this.base}/account-status/${userId}`);
  }

  // Get Stripe Dashboard Login Link (for users to manage their account)
  getDashboardLoginLink(userId: string): Observable<any> {
    return this.http.get(`${this.base}/stripe/login`, {
      params: { userId }
    });
  }

  // REMOVE: createTestCharge - not needed for payout flow
  // REMOVE: createPayment, getPayment, getPayments - duplicate with PaymentService
  // REMOVE: requestPayout, getUserPayments - should be in PaymentService only
}