import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PaymentService } from '../../../../core/services/payment.service';
import { AuthService } from '../../../../core/services/auth.service';
import { PaymentDto } from '../../../../core/models/payments/payment.dto';
import { PaymentStatus } from '../../../../core/models/payments/PaymentStatus';

interface PaymentReview extends PaymentDto {
  userName?: string;
  userEmail?: string;
  selected?: boolean;
}

@Component({
  selector: 'app-admin-review',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-review.html',
  styleUrls: ['./admin-review.css']
})
export class AdminReviewComponent implements OnInit {
  private paymentService = inject(PaymentService);
  private authService = inject(AuthService);
  private router = inject(Router);

  // Payments data
  pendingPayments: PaymentReview[] = [];
  filteredPayments: PaymentReview[] = [];
  selectedPayment?: PaymentReview;
  
  // Filters
  filterStatus: string = 'pending';
  searchQuery: string = '';
  sortBy: 'date' | 'amount' = 'date';
  sortOrder: 'asc' | 'desc' = 'desc';

  // UI states
  loading = false;
  error?: string;
  showReviewModal = false;
  reviewAction: 'approve' | 'reject' | null = null;
  reviewNotes: string = '';
  failureReason: string = '';
  submitting = false;

  // Bulk actions
  bulkSelectMode = false;
  selectedPayments: Set<string> = new Set();

  // Statistics
  stats = {
    totalPending: 0,
    totalAmount: 0,
    avgAmount: 0,
    oldestRequest: ''
  };

  // Mock data
  private mockPayments: PaymentReview[] = [
    {
      paymentId: '1',
      pickupRequestId: 'REQ009',
      recipientUserId: 'user-001',
      userName: 'John Smith',
      userEmail: 'john.smith@email.com',
      amount: 45.50,
      currency: 'usd',
      paymentStatus: PaymentStatus.PENDING,
      adminNotes: 'Plastic bottles - 25kg verified by driver',
      requestedAt: new Date('2025-11-25').toISOString(),
      createdAt: new Date('2025-11-25').toISOString(),
      materialType: 'Plastic Bottles',
      weight: '25 kg',
      pickupAddress: '123 Green St, Eco City'
    },
    {
      paymentId: '2',
      pickupRequestId: 'REQ010',
      recipientUserId: 'user-002',
      userName: 'Sarah Johnson',
      userEmail: 'sarah.j@email.com',
      amount: 32.75,
      currency: 'usd',
      paymentStatus: PaymentStatus.PENDING,
      adminNotes: 'Electronics - 12kg collected and sorted',
      requestedAt: new Date('2025-11-26').toISOString(),
      createdAt: new Date('2025-11-26').toISOString(),
      materialType: 'Electronics',
      weight: '12 kg',
      pickupAddress: '456 Eco Ave, Green Town'
    },
    {
      paymentId: '3',
      pickupRequestId: 'REQ011',
      recipientUserId: 'user-003',
      userName: 'Mike Chen',
      userEmail: 'mike.chen@email.com',
      amount: 58.25,
      currency: 'usd',
      paymentStatus: PaymentStatus.PENDING,
      adminNotes: 'Mixed recyclables - 30kg total weight',
      requestedAt: new Date('2025-11-27').toISOString(),
      createdAt: new Date('2025-11-27').toISOString(),
      materialType: 'Mixed Recyclables',
      weight: '30 kg',
      pickupAddress: '789 Recycle Rd, Clean City'
    },
    {
      paymentId: '4',
      pickupRequestId: 'REQ008',
      recipientUserId: 'user-004',
      userName: 'Emma Davis',
      userEmail: 'emma.d@email.com',
      amount: 28.00,
      currency: 'usd',
      paymentStatus: PaymentStatus.APPROVED,
      adminNotes: 'Approved - Processing payout',
      requestedAt: new Date('2025-11-24').toISOString(),
      approvedAt: new Date('2025-11-27').toISOString(),
      createdAt: new Date('2025-11-24').toISOString(),
      materialType: 'Cardboard',
      weight: '20 kg'
    }
  ];

  ngOnInit() {
    this.loadPayments();
  }

  loadPayments() {
    this.loading = true;
    this.error = undefined;

    // Mock data for testing
    setTimeout(() => {
      this.pendingPayments = this.mockPayments;
      this.applyFilters();
      this.calculateStats();
      this.loading = false;
    }, 800);

    // Uncomment when backend is ready:
    /*
    this.paymentService.getPayments('pending,approved').subscribe({
      next: (payments) => {
        this.pendingPayments = payments.map(p => ({
          ...p,
          selected: false
        }));
        this.applyFilters();
        this.calculateStats();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading payments:', err);
        this.error = 'Unable to load payments. Please try again.';
        this.loading = false;
      }
    });
    */
  }

  applyFilters() {
    let filtered = [...this.pendingPayments];

    // Status filter
    if (this.filterStatus !== 'all') {
      filtered = filtered.filter(p => p.paymentStatus === this.filterStatus);
    }

    // Search filter
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.userName?.toLowerCase().includes(query) ||
        p.userEmail?.toLowerCase().includes(query) ||
        p.pickupRequestId.toLowerCase().includes(query) ||
        p.paymentId.toLowerCase().includes(query)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      if (this.sortBy === 'date') {
        comparison = new Date(a.requestedAt).getTime() - new Date(b.requestedAt).getTime();
      } else {
        comparison = a.amount - b.amount;
      }
      return this.sortOrder === 'asc' ? comparison : -comparison;
    });

    this.filteredPayments = filtered;
  }

  calculateStats() {
    const pending = this.pendingPayments.filter(p => p.paymentStatus === 'pending');
    this.stats.totalPending = pending.length;
    this.stats.totalAmount = pending.reduce((sum, p) => sum + p.amount, 0);
    this.stats.avgAmount = this.stats.totalPending > 0 ? this.stats.totalAmount / this.stats.totalPending : 0;
    
    if (pending.length > 0) {
      const oldest = pending.reduce((oldest, p) => 
        new Date(p.requestedAt) < new Date(oldest.requestedAt) ? p : oldest
      );
      this.stats.oldestRequest = this.formatDate(oldest.requestedAt);
    }
  }

  openReviewModal(payment: PaymentReview, action: 'approve' | 'reject') {
    this.selectedPayment = payment;
    this.reviewAction = action;
    this.showReviewModal = true;
    this.reviewNotes = '';
    this.failureReason = '';
  }

  closeReviewModal() {
    this.showReviewModal = false;
    this.selectedPayment = undefined;
    this.reviewAction = null;
    this.reviewNotes = '';
    this.failureReason = '';
  }

  submitReview() {
    if (!this.selectedPayment || !this.reviewAction) return;

    this.submitting = true;
    const adminId = this.authService.getCurrentUserId();
    const status = this.reviewAction === 'approve' ? 'approved' : 'cancelled';

    // Mock submission
    setTimeout(() => {
      // Update payment status
      const payment = this.pendingPayments.find(p => p.paymentId === this.selectedPayment!.paymentId);
      if (payment) {
        payment.paymentStatus = PaymentStatus.APPROVED;
        payment.adminNotes = this.reviewNotes || payment.adminNotes;
        if (this.reviewAction === 'reject') {
          payment.failureReason = this.failureReason;
        }
      }

      this.submitting = false;
      this.closeReviewModal();
      this.applyFilters();
      this.calculateStats();
    }, 1000);

    // Uncomment when backend is ready:
    /*
    this.paymentService.updatePaymentStatus(
      this.selectedPayment.paymentId,
      status,
      adminId,
      this.reviewNotes || undefined,
      this.failureReason || undefined
    ).subscribe({
      next: () => {
        this.submitting = false;
        this.closeReviewModal();
        this.loadPayments();
      },
      error: (err) => {
        console.error('Error updating payment:', err);
        this.error = 'Failed to update payment status';
        this.submitting = false;
      }
    });
    */
  }

  viewPaymentDetails(paymentId: string) {
    this.router.navigate(['/payments', paymentId]);
  }

  toggleBulkSelect() {
    this.bulkSelectMode = !this.bulkSelectMode;
    if (!this.bulkSelectMode) {
      this.selectedPayments.clear();
    }
  }

  togglePaymentSelect(paymentId: string) {
    if (this.selectedPayments.has(paymentId)) {
      this.selectedPayments.delete(paymentId);
    } else {
      this.selectedPayments.add(paymentId);
    }
  }

  selectAll() {
    this.filteredPayments.forEach(p => this.selectedPayments.add(p.paymentId));
  }

  deselectAll() {
    this.selectedPayments.clear();
  }

  bulkApprove() {
    if (this.selectedPayments.size === 0) return;
    
    const count = this.selectedPayments.size;
    if (confirm(`Approve ${count} payout request${count > 1 ? 's' : ''}?`)) {
      // Mock bulk approval
      this.selectedPayments.forEach(id => {
        const payment = this.pendingPayments.find(p => p.paymentId === id);
        if (payment) {
          payment.paymentStatus = PaymentStatus.APPROVED;
          payment.adminNotes = 'Bulk approved';
        }
      });
      
      this.selectedPayments.clear();
      this.bulkSelectMode = false;
      this.applyFilters();
      this.calculateStats();
    }
  }

  getStatusClass(status: string): string {
    const statusMap: Record<string, string> = {
      'completed': 'status-completed',
      'pending': 'status-pending',
      'approved': 'status-approved',
      'processing': 'status-processing',
      'failed': 'status-failed',
      'cancelled': 'status-cancelled'
    };
    return statusMap[status.toLowerCase()] || 'status-default';
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

  formatAmount(amount: number, currency: string): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(amount);
  }

  getDaysAgo(dateString: string): number {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }

  retry() {
    this.loadPayments();
  }
}