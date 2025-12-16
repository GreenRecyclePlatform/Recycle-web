// src/app/features/payments/components/payment-history/payment-history.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { PaymentService } from '../../services/payment.service';
import { Navbar } from "../../../../shared/components/navbar/navbar";

import {
  Payment,
  PaymentFilter,
  PaymentSummary,
  PaymentStatus,
  PaymentType,
  PAYMENT_STATUS_LABELS,
  PAYMENT_TYPE_LABELS
} from '../../models/payment.model';

@Component({
  selector: 'app-payment-history',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, Navbar],
  templateUrl: './payment-history.html',
  styleUrls: ['./payment-history.css']
})
export class PaymentHistory implements OnInit {
  payments: Payment[] = [];
  filteredPayments: Payment[] = [];
  summary: PaymentSummary | null = null;
  isLoading = false;
  error: string | null = null;

  // Filter properties
  selectedType: string = 'all';
  selectedStatus: string = 'all';
  searchTerm: string = '';
  fromDate: string = '';
  toDate: string = '';

  // Pagination
  currentPage = 1;
  pageSize = 10;
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
    this.loadSummary();
    this.loadPayments();
  }

  loadSummary(): void {
    this.paymentService.getSummary().subscribe({
      next: (data) => {
        this.summary = data;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error loading summary:', err);
      }
    });
  }

  loadPayments(): void {
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

    this.paymentService.filter(filter).subscribe({
      next: (response) => {
        this.payments = response.data;
        this.filteredPayments = response.data;
        this.totalCount = response.totalCount;
        this.totalPages = response.totalPages;
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

  applyLocalFilters(): void {
    this.filteredPayments = this.payments.filter(payment => {
      const matchesSearch = !this.searchTerm ||
        payment.paymentId.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        payment.transactionId?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        payment.description.toLowerCase().includes(this.searchTerm.toLowerCase());

      return matchesSearch;
    });
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadPayments();
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
    this.loadPayments();
  }

  viewDetails(paymentId: string): void {
    this.router.navigate(['/payments/details', paymentId]);
  }

  initiateWithdrawal(): void {
    this.router.navigate(['/payments/withdraw']);
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
      this.loadPayments();
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
}