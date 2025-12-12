// src/app/features/payments/components/admin-payment-dashboard/admin-payment-dashboard.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { PaymentService } from '../../services/payment.service';
import {
  Payment,
  PaymentFilter,
  PaymentStatus,
  PaymentType,
  PAYMENT_STATUS_LABELS,
  PAYMENT_TYPE_LABELS
} from '../../models/payment.model';

interface PaymentStats {
  totalPayments: number;
  totalEarnings: number;
  totalWithdrawals: number;
  pendingWithdrawals: number;
  processingWithdrawals: number;
  completedToday: number;
  failedPayments: number;
}

@Component({
  selector: 'app-admin-payment-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-payment-dashboard.html',
  styleUrls: ['./admin-payment-dashboard.css']
})
export class AdminPaymentDashboard implements OnInit {
  payments: Payment[] = [];
  filteredPayments: Payment[] = [];
  isLoading = false;
  error: string | null = null;

  // Stats
  stats: PaymentStats = {
    totalPayments: 0,
    totalEarnings: 0,
    totalWithdrawals: 0,
    pendingWithdrawals: 0,
    processingWithdrawals: 0,
    completedToday: 0,
    failedPayments: 0
  };

  // Filter properties
  selectedType: string = 'all';
  selectedStatus: string = 'all';
  searchTerm: string = '';
  fromDate: string = '';
  toDate: string = '';

  // Pagination
  currentPage = 1;
  pageSize = 15;
  totalCount = 0;
  totalPages = 0;

  // Labels
  statusLabels = PAYMENT_STATUS_LABELS;
  typeLabels = PAYMENT_TYPE_LABELS;
  availableStatuses = Object.keys(PaymentStatus);
  availableTypes = Object.keys(PaymentType);

  constructor(
    private paymentService: PaymentService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadAllPayments();
  }

  loadAllPayments(): void {
    this.isLoading = true;
    this.error = null;

    const filter: PaymentFilter = {
      type: this.selectedType !== 'all' ? (this.selectedType as PaymentType) : undefined,
      status: this.selectedStatus !== 'all' ? (this.selectedStatus as PaymentStatus) : undefined,
      fromDate: this.fromDate ? new Date(this.fromDate) : undefined,
      toDate: this.toDate ? new Date(this.toDate) : undefined,
      pageNumber: this.currentPage,
      pageSize: this.pageSize
    };

    // Admin can see all payments
    this.paymentService.filter(filter).subscribe({
      next: (response) => {
        this.payments = response.data;
        this.filteredPayments = response.data;
        this.totalCount = response.totalCount;
        this.totalPages = response.totalPages;
        this.calculateStats();
        this.applyLocalFilters();
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.error = 'Failed to load payments. Please try again.';
        console.error('Error loading payments:', err);
        this.isLoading = false;
      }
    });
  }

  calculateStats(): void {
    // Get all payments for stats (not just current page)
    this.paymentService.getAll().subscribe({
      next: (allPayments) => {
        this.stats.totalPayments = allPayments.length;

        this.stats.totalEarnings = allPayments
          .filter(p => p.type === PaymentType.Earning && p.status === PaymentStatus.Completed)
          .reduce((sum, p) => sum + p.amount, 0);

        this.stats.totalWithdrawals = allPayments
          .filter(p => p.type === PaymentType.Withdrawal && p.status === PaymentStatus.Completed)
          .reduce((sum, p) => sum + p.amount, 0);

        this.stats.pendingWithdrawals = allPayments
          .filter(p => p.type === PaymentType.Withdrawal && p.status === PaymentStatus.Pending)
          .length;

        this.stats.processingWithdrawals = allPayments
          .filter(p => p.type === PaymentType.Withdrawal && p.status === PaymentStatus.Processing)
          .length;

        this.stats.failedPayments = allPayments
          .filter(p => p.status === PaymentStatus.Failed)
          .length;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        this.stats.completedToday = allPayments
          .filter(p => p.status === PaymentStatus.Completed &&
            new Date(p.completedAt || p.createdAt) >= today)
          .length;
      },
      error: (err) => {
        console.error('Error calculating stats:', err);
      }
    });
  }

  applyLocalFilters(): void {
    this.filteredPayments = this.payments.filter(payment => {
      const matchesSearch = !this.searchTerm ||
        payment.paymentId.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        payment.userName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        payment.transactionId?.toLowerCase().includes(this.searchTerm.toLowerCase());

      return matchesSearch;
    });
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadAllPayments();
  }

  onSearchChange(): void {
    this.applyLocalFilters();
  }

  clearFilters(): void {
    this.selectedType = 'all';
    this.selectedStatus = 'all';
    this.searchTerm = '';
    this.fromDate = '';
    this.toDate = '';
    this.currentPage = 1;
    this.loadAllPayments();
  }

  viewDetails(paymentId: string): void {
    this.router.navigate(['/payments/admin/details', paymentId]);
  }

  viewPendingWithdrawals(): void {
    this.selectedType = 'Withdrawal';
    this.selectedStatus = 'Pending';
    this.onFilterChange();
  }

  viewProcessingWithdrawals(): void {
    this.selectedType = 'Withdrawal';
    this.selectedStatus = 'Processing';
    this.onFilterChange();
  }

  viewFailedPayments(): void {
    this.selectedStatus = 'Failed';
    this.onFilterChange();
  }

  getStatusBadgeClass(status: string): string {
    const colorMap: { [key: string]: string } = {
      'Pending': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'Processing': 'bg-blue-100 text-blue-700 border-blue-200',
      'Completed': 'bg-green-100 text-green-700 border-green-200',
      'Failed': 'bg-red-100 text-red-700 border-red-200',
      'Cancelled': 'bg-gray-100 text-gray-700 border-gray-200'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-700';
  }

  getTypeBadgeClass(type: string): string {
    const colorMap: { [key: string]: string } = {
      'Earning': 'bg-green-100 text-green-700 border-green-200',
      'Withdrawal': 'bg-blue-100 text-blue-700 border-blue-200',
      'Refund': 'bg-purple-100 text-purple-700 border-purple-200'
    };
    return colorMap[type] || 'bg-gray-100 text-gray-700';
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadAllPayments();
    }
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatCurrency(amount: number): string {
    return `EGP ${amount.toFixed(2)}`;
  }

  getAmountClass(type: PaymentType): string {
    return type === PaymentType.Earning ? 'text-green-600' : 'text-blue-600';
  }

  getAmountPrefix(type: PaymentType): string {
    return type === PaymentType.Earning ? '+' : '-';
  }

  exportToCSV(): void {
    // TODO: Implement CSV export
    alert('Export feature coming soon!');
  }

  manageWithdrawals(): void {
    this.router.navigate(['/payments/admin/manage-withdrawals']);
  }
}