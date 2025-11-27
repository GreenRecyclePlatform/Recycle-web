import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { CreatePaymentDto } from '../models/payments/create-payment.dto';
import { PaymentDto } from '../models/payments/payment.dto';
import { PayoutRequestDto } from '../models/payments/payout-request.dto';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/payment`;

  // Create Payment Record
  createPayment(dto: CreatePaymentDto): Observable<PaymentDto> {
    return this.http.post<PaymentDto>(`${this.base}`, dto);
  }

  // Get All Payments (with optional status filter)
  getPayments(status?: string): Observable<PaymentDto[]> {
    const params = status ? new HttpParams().set('status', status) : undefined;
    return this.http.get<PaymentDto[]>(this.base, { params });
  }

  // Get Single Payment
  getPaymentById(paymentId: string): Observable<PaymentDto> {
    return this.http.get<PaymentDto>(`${this.base}/${paymentId}`);
  }

  // Get User's Payment History
  getUserPayments(userId: string): Observable<PaymentDto[]> {
    return this.http.get<PaymentDto[]>(`${this.base}/user/${userId}`);
  }

  // Get Available Balance for User (NEW - you'll need this!)
  getAvailableBalance(userId: string): Observable<{ balance: number; currency: string }> {
    return this.http.get<{ balance: number; currency: string }>(`${this.base}/balance/${userId}`);
  }

  // Request Payout
  requestPayout(dto: PayoutRequestDto): Observable<PaymentDto> {
    return this.http.post<PaymentDto>(`${this.base}/request-payout`, dto);
  }

  // Admin: Update Payment Status
  updatePaymentStatus(
    paymentId: string, 
    status: string, 
    adminId: string, 
    notes?: string, 
    failureReason?: string
  ): Observable<PaymentDto> {
    let params = new HttpParams()
      .set('status', status)
      .set('adminId', adminId);
    if (notes) params = params.set('notes', notes);
    if (failureReason) params = params.set('failureReason', failureReason);
    return this.http.put<PaymentDto>(`${this.base}/${paymentId}/status`, null, { params });
  }

  // REMOVE: createTestCharge - not relevant for recycling payment flow
}