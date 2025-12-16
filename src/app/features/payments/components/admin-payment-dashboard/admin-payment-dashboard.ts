// src/app/features/payments/components/admin-payment-dashboard/admin-payment-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { PaymentService } from '../../services/payment.service';
import { Navbar } from "../../../../shared/components/navbar/navbar";

import {
  Payment,
  PaymentStatus,
  PAYMENT_STATUS_LABELS
} from '../../models/payment.model';

@Component({
  selector: 'app-admin-payment-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, Navbar],
  templateUrl: './admin-payment-dashboard.html',
  styleUrls: ['./admin-payment-dashboard.css']
})
export class AdminPaymentDashboardComponent implements OnInit {
  payments: Payment[] = [];
  filteredPayments: Payment[] = [];
  isLoading = false;
  error: string | null = null;

  // Filter
  selectedStatus: string = 'Pending';

  // Stats
  pendingCount = 0;
  approvedTodayCount = 0;
  totalPaidAmount = 0;
  failedCount = 0;

  // Labels
  statusLabels = PAYMENT_STATUS_LABELS;

  // Selected payment for modal
  selectedPayment: Payment | null = null;
  showApprovalModal = false;
  showRejectionModal = false;
  adminNotes = '';
  rejectionReason = '';
  isProcessing = false;

  constructor(
    private paymentService: PaymentService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadPayments();
  }

  loadPayments(): void {
    this.isLoading = true;
    this.error = null;

    // Get all payments
    this.paymentService.getAll().subscribe({
      next: (data: Payment[]) => {
        this.payments = data;
        this.calculateStats();
        this.filterByStatus(this.selectedStatus);
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
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    this.pendingCount = this.payments.filter(p => p.status === PaymentStatus.Pending).length;

    this.approvedTodayCount = this.payments.filter(p => {
      if (p.status === PaymentStatus.Completed && p.completedAt) {
        const completedDate = new Date(p.completedAt);
        completedDate.setHours(0, 0, 0, 0);
        return completedDate.getTime() === today.getTime();
      }
      return false;
    }).length;

    this.totalPaidAmount = this.payments
      .filter(p => p.status === PaymentStatus.Completed)
      .reduce((sum, p) => sum + p.amount, 0);

    this.failedCount = this.payments.filter(p =>
      p.status === PaymentStatus.Failed || p.status === PaymentStatus.Cancelled
    ).length;
  }

  filterByStatus(status: string): void {
    this.selectedStatus = status;

    if (status === 'All') {
      this.filteredPayments = this.payments;
    } else {
      this.filteredPayments = this.payments.filter(p => p.status === status);
    }
  }

  openApprovalModal(payment: Payment): void {
    this.selectedPayment = payment;
    this.adminNotes = '';
    this.showApprovalModal = true;
  }

  openRejectionModal(payment: Payment): void {
    this.selectedPayment = payment;
    this.rejectionReason = '';
    this.showRejectionModal = true;
  }

  closeModals(): void {
    this.showApprovalModal = false;
    this.showRejectionModal = false;
    this.selectedPayment = null;
    this.adminNotes = '';
    this.rejectionReason = '';
  }

  approvePayment(): void {
    if (!this.selectedPayment) return;

    this.isProcessing = true;
    const adminId = this.getCurrentAdminId(); // You need to implement this

    this.paymentService.approvePayment(
      this.selectedPayment.paymentId,
      adminId,
      this.adminNotes || undefined
    ).subscribe({
      next: (response) => {
        alert(response.message || 'Payment approved and sent via PayPal successfully!');
        this.closeModals();
        this.loadPayments(); // Reload to get updated data
        this.isProcessing = false;
      },
      error: (err: HttpErrorResponse) => {
        alert('Failed to approve payment: ' + (err.error?.message || 'Unknown error'));
        this.isProcessing = false;
      }
    });
  }

  rejectPayment(): void {
    if (!this.selectedPayment || !this.rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    this.isProcessing = true;
    const adminId = this.getCurrentAdminId();

    this.paymentService.rejectPayment(
      this.selectedPayment.paymentId,
      adminId,
      this.rejectionReason
    ).subscribe({
      next: (response) => {
        alert(response.message || 'Payment rejected successfully');
        this.closeModals();
        this.loadPayments();
        this.isProcessing = false;
      },
      error: (err: HttpErrorResponse) => {
        alert('Failed to reject payment: ' + (err.error?.message || 'Unknown error'));
        this.isProcessing = false;
      }
    });
  }

  viewDetails(paymentId: string): void {
    this.router.navigate(['/payments/details', paymentId]);
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
    return `${amount.toFixed(2)} EGP`;
  }

  // Helper method - you need to implement getting admin ID from auth service
  private getCurrentAdminId(): string {
    // TODO: Get from AuthService or TokenService
    // For now, return a placeholder - YOU MUST IMPLEMENT THIS
    return localStorage.getItem('userId') || '';
  }
}