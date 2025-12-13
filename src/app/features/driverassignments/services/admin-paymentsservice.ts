import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PaymentStats {
  totalRevenue: number;
  completedOrdersCount: number;
  pendingPayments: number;
  recentPayments: RecentPayment[];
}

export interface RecentPayment {
  orderId: string;
  supplierName: string;
  amount: number;
  paymentStatus: string;
  paidAt: string;
  orderDate: string;
}

export interface SupplierOrder {
  orderId: string;
  supplierName: string;
  totalAmount: number;
  paymentStatus: string;
  orderDate: string;
  paidAt?: string;
  itemsCount: number;
  items: OrderItem[];
}

export interface OrderItem {
  materialName: string;
  quantity: number;
  pricePerKg: number;
  subtotal: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdminPaymentsService {
  private apiUrl = 'https://localhost:7099/api/admin/supplier-orders';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getPaymentStatistics(): Observable<PaymentStats> {
    return this.http.get<PaymentStats>(`${this.apiUrl}/payment-stats`, {
      headers: this.getHeaders()
    });
  }

  getAllOrders(): Observable<SupplierOrder[]> {
    return this.http.get<SupplierOrder[]>(this.apiUrl, {
      headers: this.getHeaders()
    });
  }

  getOrderById(orderId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${orderId}`, {
      headers: this.getHeaders()
    });
  }
}