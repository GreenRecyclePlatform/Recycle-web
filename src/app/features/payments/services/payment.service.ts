// src/app/features/payments/services/payment.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { API_ENDPOINTS } from '../../../core/constants/api-endpoints';
import {
  PaymentStatus
} from '../models/payment.model';
import {
  CreateWithdrawalDto,
  WithdrawalResponse
} from '../models/withdrawal.model';

import {
  Payment,
  PaymentSummary,
  PaymentFilter,
  PaymentPagedResponse
} from '../models/payment.model';
import {
  PaymentMethod,
  CreatePaymentMethodDto
} from '../models/payment-method.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private readonly baseUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) { }

  // Payment operations
  getAll(): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.baseUrl}/Payment`);
  }

  getById(id: string): Observable<Payment> {
    return this.http.get<Payment>(`${this.baseUrl}/Payment/${id}`);
  }

  getMyPayments(userId?: string): Observable<Payment[]> {
    // If userId not provided, backend should get from token
    // Otherwise use the user endpoint
    if (userId) {
      return this.http.get<Payment[]>(`${this.baseUrl}/Payment/user/${userId}`);
    }
    // For current user, we'll use getAll and filter client-side
    // Or backend should add /Payment/my-payments endpoint
    return this.http.get<Payment[]>(`${this.baseUrl}/Payment/user/${userId}`);
  }

  getUserPayments(userId: string): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.baseUrl}/Payment/user/${userId}`);
  }

  getSummary(): Observable<PaymentSummary> {
    // This needs to be implemented in backend
    // For now, calculate client-side from getMyPayments
    return new Observable(observer => {
      this.getMyPayments().subscribe({
        next: (payments) => {
          const summary = this.calculateSummary(payments);
          observer.next(summary);
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }

  private calculateSummary(payments: Payment[]): PaymentSummary {
    const completedPayments = payments.filter(p => p.status === 'Completed');
    const totalEarnings = completedPayments
      .filter(p => p.type === 'Earning')
      .reduce((sum, p) => sum + p.amount, 0);
    const totalWithdrawals = completedPayments
      .filter(p => p.type === 'Withdrawal')
      .reduce((sum, p) => sum + p.amount, 0);
    const pendingAmount = payments
      .filter(p => p.status === 'Pending' || p.status === 'Processing')
      .reduce((sum, p) => sum + p.amount, 0);

    return {
      totalEarnings,
      totalWithdrawals,
      pendingAmount,
      availableBalance: totalEarnings - totalWithdrawals,
      lastPaymentDate: payments.length > 0 ? payments[0].createdAt : undefined
    };
  }

  filter(filter: PaymentFilter): Observable<PaymentPagedResponse> {
    // Backend doesn't have filter endpoint, so get all and filter client-side
    return new Observable(observer => {
      this.getAll().subscribe({
        next: (payments) => {
          let filtered = payments;

          // Apply filters
          if (filter.status) {
            filtered = filtered.filter(p => p.status === filter.status);
          }
          if (filter.type) {
            filtered = filtered.filter(p => p.type === filter.type);
          }
          if (filter.userId) {
            filtered = filtered.filter(p => p.userId === filter.userId);
          }
          if (filter.fromDate) {
            filtered = filtered.filter(p => new Date(p.createdAt) >= filter.fromDate!);
          }
          if (filter.toDate) {
            filtered = filtered.filter(p => new Date(p.createdAt) <= filter.toDate!);
          }

          // Pagination
          const totalCount = filtered.length;
          const totalPages = Math.ceil(totalCount / filter.pageSize);
          const startIndex = (filter.pageNumber - 1) * filter.pageSize;
          const endIndex = startIndex + filter.pageSize;
          const pagedData = filtered.slice(startIndex, endIndex);

          const response: PaymentPagedResponse = {
            data: pagedData,
            totalCount,
            pageNumber: filter.pageNumber,
            pageSize: filter.pageSize,
            totalPages
          };

          observer.next(response);
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }

  createWithdrawal(withdrawal: CreateWithdrawalDto): Observable<WithdrawalResponse> {
    return this.http.post<WithdrawalResponse>(
      `${this.baseUrl}/Payment/request-payout`,
      withdrawal
    );
  }

  // Approve payment (Admin only)
  approvePayment(id: string): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(
      `${this.baseUrl}/Payment/${id}/approve`,
      {}
    );
  }

  // Reject payment (Admin only)
  rejectPayment(id: string, reason?: string): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(
      `${this.baseUrl}/Payment/${id}/reject`,
      { reason }
    );
  }

  // Get PayPal status
  getPayPalStatus(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/Payment/${id}/paypal-status`);
  }

  // Payment Method operations
  getAllPaymentMethods(): Observable<PaymentMethod[]> {
    return this.http.get<PaymentMethod[]>(
      `${this.baseUrl}${API_ENDPOINTS.PAYMENT_METHODS.getAll}`
    );
  }

  getPaymentMethodById(id: string): Observable<PaymentMethod> {
    return this.http.get<PaymentMethod>(
      `${this.baseUrl}${API_ENDPOINTS.PAYMENT_METHODS.getById(id)}`
    );
  }

  createPaymentMethod(method: CreatePaymentMethodDto): Observable<PaymentMethod> {
    return this.http.post<PaymentMethod>(
      `${this.baseUrl}${API_ENDPOINTS.PAYMENT_METHODS.create}`,
      method
    );
  }

  updatePaymentMethod(id: string, method: Partial<CreatePaymentMethodDto>): Observable<PaymentMethod> {
    return this.http.put<PaymentMethod>(
      `${this.baseUrl}${API_ENDPOINTS.PAYMENT_METHODS.update(id)}`,
      method
    );
  }

  deletePaymentMethod(id: string): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}${API_ENDPOINTS.PAYMENT_METHODS.delete(id)}`
    );
  }

  setDefaultPaymentMethod(id: string): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(
      `${this.baseUrl}${API_ENDPOINTS.PAYMENT_METHODS.setDefault(id)}`,
      {}
    );
  }

  // Admin operations
  updatePaymentStatus(id: string, status: PaymentStatus, failureReason?: string): Observable<{ message: string }> {
    // Map to backend approve/reject endpoints
    if (status === PaymentStatus.Processing || status === PaymentStatus.Completed) {
      return this.approvePayment(id);
    } else if (status === PaymentStatus.Failed || status === PaymentStatus.Cancelled) {
      return this.rejectPayment(id, failureReason);
    }
    return throwError(() => new Error('Invalid status transition'));
  }

  completePayment(id: string, transactionId: string): Observable<{ message: string }> {
    // Backend approve endpoint should handle completion
    // Or we need a separate complete endpoint
    return this.approvePayment(id);
  }

  private throwError(message: string) {
    throw new Error(message);
  }
}