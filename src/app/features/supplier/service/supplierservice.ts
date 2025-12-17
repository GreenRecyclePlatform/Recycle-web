// src/app/features/supplier/services/supplier.service.ts

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  // 1.Get Available Materials
  getAvailableMaterials(): Observable<AvailableMaterial[]> {
    return this.http.get<AvailableMaterial[]>(`${this.apiUrl}/available-materials`);
  }

  //  2.Create Order
  createOrder(dto: CreateSupplierOrderDto): Observable<SupplierOrderResponse> {
    return this.http.post<SupplierOrderResponse>(this.apiUrl, dto);
  }

  // 3.Create Payment Intent
  createPaymentIntent(orderId: string): Observable<PaymentIntentDto> {
    return this.http.post<PaymentIntentDto>(
      `${this.apiUrl}/${orderId}/create-payment-intent`,
      {}
    );
  }

  // 4.Confirm Payment
  confirmPayment(dto: ConfirmPaymentDto): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/confirm-payment`,
      dto
    );
  }

  // ✅ 5. Get My Orders
  getMyOrders(): Observable<SupplierOrderResponse[]> {
    return this.http.get<SupplierOrderResponse[]>(`${this.apiUrl}/my-orders`);
  }

  // ✅ 6. Get Order by ID
  getOrderById(orderId: string): Observable<SupplierOrderResponse> {
    return this.http.get<SupplierOrderResponse>(`${this.apiUrl}/${orderId}`);
  }
}