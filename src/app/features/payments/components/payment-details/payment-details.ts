// src/app/features/payments/components/payment-details/payment-details.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { PaymentService } from '../../services/payment.service';
import { Navbar } from "../../../../shared/components/navbar/navbar";

import {
  Payment,
  PaymentStatus,
  PaymentType,
  PAYMENT_STATUS_LABELS,
  PAYMENT_TYPE_LABELS
} from '../../models/payment.model';

@Component({
  selector: 'app-payment-details',
  standalone: true,
  imports: [CommonModule, RouterModule, Navbar],
  templateUrl: './payment-details.html',
  styleUrls: ['./payment-details.css']
})
export class PaymentDetails implements OnInit {
  payment: Payment | null = null;
  isLoading = false;
  error: string | null = null;
  paymentId: string = '';

  // Labels
  statusLabels = PAYMENT_STATUS_LABELS;
  typeLabels = PAYMENT_TYPE_LABELS;
  PaymentType = PaymentType;
  PaymentStatus = PaymentStatus;

  // Timeline data
  timeline: Array<{
    status: string;
    date: Date | null;
    label: string;
    completed: boolean;
    icon: string;
  }> = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentService
  ) { }

  ngOnInit(): void {
    this.paymentId = this.route.snapshot.paramMap.get('id') || '';
    if (this.paymentId) {
      this.loadPaymentDetails();
    } else {
      this.error = 'Invalid payment ID';
    }
  }

  loadPaymentDetails(): void {
    this.isLoading = true;
    this.error = null;

    this.paymentService.getById(this.paymentId).subscribe({
      next: (data: Payment) => {
        this.payment = data;
        this.buildTimeline();
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 404) {
          this.error = 'Payment not found';
        } else if (err.status === 403) {
          this.error = 'You do not have permission to view this payment';
        } else {
          this.error = 'Failed to load payment details';
        }
        console.error('Error loading payment:', err);
        this.isLoading = false;
      }
    });
  }

  buildTimeline(): void {
    if (!this.payment) return;

    if (this.payment.type === PaymentType.Withdrawal) {
      // Withdrawal timeline
      const withdrawalFlow = [
        { status: PaymentStatus.Pending, label: 'Request Submitted', icon: '📝' },
        { status: PaymentStatus.Processing, label: 'Processing', icon: '⚙️' },
        { status: PaymentStatus.Completed, label: 'Transferred', icon: '✅' }
      ];

      const currentStatusIndex = withdrawalFlow.findIndex(s => s.status === this.payment?.status);

      this.timeline = withdrawalFlow.map((item, index) => ({
        status: item.status,
        date: index <= currentStatusIndex ? this.payment!.createdAt : null,
        label: item.label,
        icon: item.icon,
        completed: index <= currentStatusIndex
      }));

      // Handle failed/cancelled
      if (this.payment.status === PaymentStatus.Failed) {
        this.timeline = [
          { status: PaymentStatus.Pending, label: 'Request Submitted', icon: '📝', date: this.payment.createdAt, completed: true },
          { status: PaymentStatus.Failed, label: 'Failed', icon: '❌', date: this.payment.createdAt, completed: true }
        ];
      } else if (this.payment.status === PaymentStatus.Cancelled) {
        this.timeline = [
          { status: PaymentStatus.Pending, label: 'Request Submitted', icon: '📝', date: this.payment.createdAt, completed: true },
          { status: PaymentStatus.Cancelled, label: 'Cancelled', icon: '🚫', date: this.payment.createdAt, completed: true }
        ];
      }
    } else {
      // Earning timeline (simplified)
      this.timeline = [
        {
          status: PaymentStatus.Completed,
          label: 'Payment Received',
          icon: '💰',
          date: this.payment.createdAt,
          completed: true
        }
      ];
    }
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

  goBack(): void {
    this.router.navigate(['/payments/history']);
  }

  formatDate(date: Date | string | null | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatCurrency(amount: number): string {
    return `EGP ${amount.toFixed(2)}`;
  }

  getTimelineProgress(): string {
    if (!this.timeline.length) return '0%';
    return (this.timeline.filter(t => t.completed).length / this.timeline.length * 100) + '%';
  }

  getAmountClass(type: PaymentType): string {
    return type === PaymentType.Earning ? 'text-green-600' : 'text-blue-600';
  }

  getAmountPrefix(type: PaymentType): string {
    return type === PaymentType.Earning ? '+' : '-';
  }

  canRetry(): boolean {
    return this.payment?.status === PaymentStatus.Failed &&
      this.payment?.type === PaymentType.Withdrawal;
  }

  retryWithdrawal(): void {
    if (this.payment?.type === PaymentType.Withdrawal) {
      this.router.navigate(['/payments/withdraw']);
    }
  }

  viewPickupRequest(): void {
    if (this.payment?.pickupRequestId) {
      this.router.navigate(['/pickup-requests/details', this.payment.pickupRequestId]);
    }
  }
}