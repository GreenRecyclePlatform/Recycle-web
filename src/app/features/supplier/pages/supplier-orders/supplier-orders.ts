import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SupplierService } from '../../service/supplierservice';
import { SupplierOrderResponse } from '../../models/supplier.models';
import { Navbar } from '../../../../shared/components/navbar/navbar';

@Component({
  selector: 'app-supplier-orders',
  standalone: true,
  imports: [CommonModule,Navbar],
  templateUrl: './supplier-orders.html',
  styleUrls: ['./supplier-orders.css']
})
export class SupplierOrdersComponent implements OnInit {
  private supplierService = inject(SupplierService);
  private router = inject(Router);

  orders = signal<SupplierOrderResponse[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  selectedOrder = signal<SupplierOrderResponse | null>(null);

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.loading.set(true);
    this.error.set(null);

    this.supplierService.getMyOrders().subscribe({
      next: (data) => {
        this.orders.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load orders');
        this.loading.set(false);
        console.error(err);
      }
    });
  }

  viewOrderDetails(order: SupplierOrderResponse) {
    this.selectedOrder.set(order);
  }

  closeDetails() {
    this.selectedOrder.set(null);
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Completed':
        return 'status-completed';
      case 'Pending':
        return 'status-pending';
      case 'Failed':
        return 'status-failed';
      default:
        return 'status-default';
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  goToDashboard() {
    this.router.navigate(['/supplier/dashboard']);
  }

  getTotalCompletedAmount(): number {
    return this.orders()
      .filter(order => order.paymentStatus === 'Completed')
      .reduce((sum, order) => sum + order.totalAmount, 0);
  }

  getCompletedOrdersCount(): number {
    return this.orders().filter(order => order.paymentStatus === 'Completed').length;
  }

  getPendingOrdersCount(): number {
    return this.orders().filter(order => order.paymentStatus === 'Pending').length;
  }
}