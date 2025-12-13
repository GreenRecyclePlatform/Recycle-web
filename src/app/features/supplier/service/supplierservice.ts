// src/app/features/supplier/services/supplier.service.ts

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  AvailableMaterial,
  CreateSupplierOrderDto,
  SupplierOrderResponse,
  PaymentIntentDto,
  ConfirmPaymentDto
} from '../models/supplier.models';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl + '/SupplierOrders';

  // ✅ 1. Get Available Materials
  getAvailableMaterials(): Observable<AvailableMaterial[]> {
    return this.http.get<AvailableMaterial[]>(`${this.apiUrl}/available-materials`);
  }

  // ✅ 2. Create Order
  createOrder(dto: CreateSupplierOrderDto): Observable<SupplierOrderResponse> {
    return this.http.post<SupplierOrderResponse>(this.apiUrl, dto, {
      headers: this.getAuthHeaders()
    });
  }

  // ✅ 3. Create Payment Intent
  createPaymentIntent(orderId: string): Observable<PaymentIntentDto> {
    return this.http.post<PaymentIntentDto>(
      `${this.apiUrl}/${orderId}/create-payment-intent`,
      {},
      { headers: this.getAuthHeaders() }
    );
  }

  // ✅ 4. Confirm Payment
  confirmPayment(dto: ConfirmPaymentDto): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/confirm-payment`,
      dto,
      { headers: this.getAuthHeaders() }
    );
  }

  // ✅ 5. Get My Orders
  getMyOrders(): Observable<SupplierOrderResponse[]> {
    return this.http.get<SupplierOrderResponse[]>(`${this.apiUrl}/my-orders`, {
      headers: this.getAuthHeaders()
    });
  }

  // ✅ 6. Get Order by ID
  getOrderById(orderId: string): Observable<SupplierOrderResponse> {
    return this.http.get<SupplierOrderResponse>(`${this.apiUrl}/${orderId}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Helper: Get Auth Headers
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }
}