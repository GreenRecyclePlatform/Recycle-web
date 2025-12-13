import { Component, OnInit } from '@angular/core';
import { AdminPaymentsService, PaymentStats, SupplierOrder } from '../../services/admin-paymentsservice';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-admin-payments',
  templateUrl: './admin-payments.html',
  styleUrls: ['./admin-payments.css'],
  imports:[CommonModule,
    FormsModule,]
})
export class AdminPaymentsComponent implements OnInit {
  stats: PaymentStats | null = null;
  allOrders: SupplierOrder[] = [];
  filteredOrders: SupplierOrder[] = [];
  loading = true;
  error = '';
  
  // Filter 
  searchTerm = '';
  selectedStatus = 'all';
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 0;

  // Selected Order Details
  selectedOrder: any = null;
  showDetailsModal = false;

  constructor(
    private paymentService: AdminPaymentsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.error = '';

    // Load statistics
    this.paymentService.getPaymentStatistics().subscribe({
      next: (data) => {
        this.stats = data;
      },
      error: (err) => {
        console.error('Error loading stats:', err);
        this.error = 'faild to load stats';
      }
    });

    // Load all orders
    this.paymentService.getAllOrders().subscribe({
      next: (data) => {
        this.allOrders = data;
        this.filteredOrders = data;
        this.updatePagination();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading orders:', err);
        this.error = 'Error loading orders';
        this.loading = false;
      }
    });
  }

  // Filter orders
  filterOrders() {
    let filtered = [...this.allOrders];

    // Filter by search term
    if (this.searchTerm) {
      filtered = filtered.filter(order =>
        order.supplierName.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (this.selectedStatus !== 'all') {
      filtered = filtered.filter(order =>
        order.paymentStatus.toLowerCase() === this.selectedStatus.toLowerCase()
      );
    }

    this.filteredOrders = filtered;
    this.currentPage = 1;
    this.updatePagination();
  }

  // Pagination
  updatePagination() {
    this.totalPages = Math.ceil(this.filteredOrders.length / this.itemsPerPage);
  }

  get paginatedOrders() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredOrders.slice(start, end);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  

  

  // Helper methods
  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'status-completed';
      case 'pending':
        return 'status-pending';
      case 'failed':
        return 'status-failed';
      default:
        return '';
    }
  }

  getStatusText(status: string): string {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'completed';
      case 'pending':
        return 'pending';
      case 'failed':
        return 'failed';
      default:
        return status;
    }
  }

  formatDate(date: string): string {
    if (!date) return '-';
    return new Date(date).toLocaleString('ar-EG');
  }

  formatCurrency(amount: number): string {
    return `${amount.toFixed(2)} EG`;
  }

 
}