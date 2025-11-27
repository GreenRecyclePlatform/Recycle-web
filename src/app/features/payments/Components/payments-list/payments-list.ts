import { AccountStatus } from './../account-status-badge/account-status-badge';
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentService } from '../../../../core/services/payment.service';
import { AuthService } from '../../../../core/services/auth.service';
import { StripeService } from '../../../../core/services/stripe.service';
import { RouterModule, Router } from '@angular/router';
import { PaymentDto } from '../../../../core/models/payments/payment.dto';
import { PaymentStatus } from '../../../../core/models/payments/PaymentStatus';

@Component({
  selector: 'app-payments-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './payments-list.html',
  styleUrls: ['./payments-list.css']
})
export class PaymentsListComponent implements OnInit {
  private paymentService = inject(PaymentService);
  private authService = inject(AuthService);
  private router = inject(Router);

  payments: PaymentDto[] = [];
  filteredPayments: PaymentDto[] = [];
  loading = false;
  error?: string;
  currentUserId: string = '';
  accountStatus: string = 'none';
  stripeAccountVerified: boolean = false;
  requirementsNeeded: string[] = [];
  showAccountBadge: boolean = true;

  // Mock data matching the React design
  private mockPayments: PaymentDto[] = [
    {
      paymentId: '1',
      pickupRequestId: 'REQ008',
      recipientUserId: 'test-user-123',
      amount: 18.75,
      currency: 'usd',
      paymentStatus: PaymentStatus.COMPLETED,
      stripePayoutId: 'po_1234567890',
      adminNotes: 'Plastic Bottles - 18 kg',
      requestedAt: new Date('2025-11-02').toISOString(),
      completedAt: new Date('2025-11-03').toISOString(),
      createdAt: new Date('2025-11-02').toISOString(),
      materialType: 'Plastic Bottles',
      weight: '18 kg'
    },
    {
      paymentId: '2',
      pickupRequestId: 'REQ001',
      recipientUserId: 'test-user-123',
      amount: 15.50,
      currency: 'usd',
      paymentStatus: PaymentStatus.COMPLETED,
      stripePayoutId: 'po_0987654321',
      adminNotes: 'Plastic Bottles - 15 kg',
      requestedAt: new Date('2025-10-28').toISOString(),
      completedAt: new Date('2025-10-29').toISOString(),
      createdAt: new Date('2025-10-28').toISOString(),
      materialType: 'Plastic Bottles',
      weight: '15 kg'
    },
    {
      paymentId: '3',
      pickupRequestId: 'REQ002',
      recipientUserId: 'test-user-123',
      amount: 15.50,
      currency: 'usd',
      paymentStatus: PaymentStatus.COMPLETED,
      adminNotes: 'Cardboard - 25 kg',
      requestedAt: new Date('2025-10-25').toISOString(),
      completedAt: new Date('2025-10-26').toISOString(),
      createdAt: new Date('2025-10-25').toISOString(),
      materialType: 'Cardboard',
      weight: '25 kg'
    },
    {
      paymentId: '4',
      pickupRequestId: 'REQ003',
      recipientUserId: 'test-user-123',
      amount: 11.50,
      currency: 'usd',
      paymentStatus: PaymentStatus.PENDING,
      adminNotes: 'Electronics - 8 kg - Awaiting approval',
      requestedAt: new Date('2025-10-23').toISOString(),
      createdAt: new Date('2025-10-23').toISOString(),
      materialType: 'Electronics',
      weight: '8 kg'
    },
    {
      paymentId: '5',
      pickupRequestId: 'REQ004',
      recipientUserId: 'test-user-123',
      amount: 19.75,
      currency: 'usd',
      paymentStatus: PaymentStatus.APPROVED,
      adminNotes: 'Metals - 12 kg - Approved, processing',
      requestedAt: new Date('2025-10-20').toISOString(),
      approvedAt: new Date('2025-10-21').toISOString(),
      createdAt: new Date('2025-10-20').toISOString(),
      materialType: 'Metals',
      weight: '12 kg'
    },
    {
      paymentId: '6',
      pickupRequestId: 'REQ005',
      recipientUserId: 'test-user-123',
      amount: 14.75,
      currency: 'usd',
      paymentStatus: PaymentStatus.COMPLETED,
      stripePayoutId: 'po_5555555555',
      adminNotes: 'Paper - 20 kg',
      requestedAt: new Date('2025-10-15').toISOString(),
      completedAt: new Date('2025-10-16').toISOString(),
      createdAt: new Date('2025-10-15').toISOString(),
      materialType: 'Paper',
      weight: '20 kg'
    },
    {
      paymentId: '7',
      pickupRequestId: 'REQ006',
      recipientUserId: 'test-user-123',
      amount: 9.25,
      currency: 'usd',
      paymentStatus: PaymentStatus.COMPLETED,
      stripePayoutId: 'po_6666666666',
      adminNotes: 'Glass Bottles - 15 kg',
      requestedAt: new Date('2025-10-10').toISOString(),
      completedAt: new Date('2025-10-11').toISOString(),
      createdAt: new Date('2025-10-10').toISOString(),
      materialType: 'Glass Bottles',
      weight: '15 kg'
    },
    {
      paymentId: '8',
      pickupRequestId: 'REQ007',
      recipientUserId: 'test-user-123',
      amount: 22.50,
      currency: 'usd',
      paymentStatus: PaymentStatus.COMPLETED,
      stripePayoutId: 'po_7777777777',
      adminNotes: 'Mixed Plastics - 22 kg',
      requestedAt: new Date('2025-10-05').toISOString(),
      completedAt: new Date('2025-10-06').toISOString(),
      createdAt: new Date('2025-10-05').toISOString(),
      materialType: 'Mixed Plastics',
      weight: '22 kg'
    }
  ];

  ngOnInit() {
    this.currentUserId = this.authService.getCurrentUserId();
    this.loadPayments();
    this.checkAccountStatus();
  }

  checkAccountStatus() {
  // Mock data for testing
  setTimeout(() => {
    this.accountStatus = 'none'; // ✅ CORRECT - Try: 'none', 'pending', 'action_required', 'verified'
    this.stripeAccountVerified = false;
    this.requirementsNeeded = ['external_account'];
    
    // Hide badge if verified
    this.showAccountBadge = this.accountStatus !== 'verified';
  }, 600);

    // Uncomment when backend is ready:
    /*
    const userId = this.authService.getCurrentUserId();
    this.stripeService.getAccountStatus(userId).subscribe({
      next: (account) => {
        this.stripeAccountVerified = account.payoutsEnabled;
        
        // Map Stripe status to AccountStatus
        if (!account.stripeAccountId) {
          this.accountStatus = 'none';
        } else if (account.payoutsEnabled && account.detailsSubmitted) {
          this.accountStatus = 'verified';
        } else if (account.requirements?.currentlyDue?.length > 0) {
          this.accountStatus = 'action_required';
          this.requirementsNeeded = account.requirements.currentlyDue;
        } else if (account.requirements?.errors?.length > 0) {
          this.accountStatus = 'restricted';
        } else {
          this.accountStatus = 'pending';
        }
        
        // Only show badge if not verified
        this.showAccountBadge = this.accountStatus !== 'verified';
      },
      error: (err) => {
        console.error('Error checking account:', err);
        this.accountStatus = 'none';
        this.stripeAccountVerified = false;
        this.showAccountBadge = true;
      }
    });
    */
  }

  handleAccountAction(action: string) {
    if (action === 'action' || action === 'click') {
      this.router.navigate(['/payments/onboard']);
    }
  }

  loadPayments() {
    this.loading = true;
    this.error = undefined;

    // Use mock data for testing
    setTimeout(() => {
      this.payments = this.mockPayments;
      this.filteredPayments = this.payments;
      this.loading = false;
    }, 500);

    // Uncomment when backend is ready:
    /*
    this.paymentService.getUserPayments(this.currentUserId).subscribe({
      next: (payments) => {
        this.payments = payments;
        this.filteredPayments = payments;
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

  openDetail(paymentId: string) {
    this.router.navigate(['/payments', paymentId]);
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
      day: 'numeric' 
    });
  }

  formatAmount(amount: number, currency: string): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(amount);
  }

  getMaterialType(payment: any): string {
    return payment.materialType || 'Recyclable Material';
  }

  getWeight(payment: any): string {
    return payment.weight || 'N/A';
  }

  // Summary calculations
  getTotalEarnings(): number {
    return this.payments
      .filter(p => p.paymentStatus === 'completed')
      .reduce((sum, p) => sum + p.amount, 0);
  }

  getWeeklyEarnings(): number {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return this.payments
      .filter(p => p.paymentStatus === 'completed' && new Date(p.completedAt!) >= oneWeekAgo)
      .reduce((sum, p) => sum + p.amount, 0);
  }

  getMonthlyEarnings(): number {
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    
    return this.payments
      .filter(p => {
        const date = new Date(p.requestedAt);
        return p.paymentStatus === 'completed' && 
               date.getMonth() === thisMonth && 
               date.getFullYear() === thisYear;
      })
      .reduce((sum, p) => sum + p.amount, 0);
  }

  getLastMonthEarnings(): number {
    const lastMonth = new Date().getMonth() - 1;
    const year = lastMonth < 0 ? new Date().getFullYear() - 1 : new Date().getFullYear();
    const month = lastMonth < 0 ? 11 : lastMonth;
    
    return this.payments
      .filter(p => {
        const date = new Date(p.requestedAt);
        return p.paymentStatus === 'completed' && 
               date.getMonth() === month && 
               date.getFullYear() === year;
      })
      .reduce((sum, p) => sum + p.amount, 0);
  }

  getPendingAmount(): number {
    return this.payments
      .filter(p => p.paymentStatus === 'pending')
      .reduce((sum, p) => sum + p.amount, 0);
  }

  getPendingCount(): number {
    return this.payments.filter(p => p.paymentStatus === 'pending').length;
  }

  getProcessingAmount(): number {
    return this.payments
      .filter(p => p.paymentStatus === 'approved' || p.paymentStatus === 'processing')
      .reduce((sum, p) => sum + p.amount, 0);
  }

  getCompletedAmount(): number {
    return this.getTotalEarnings();
  }

  updatePaymentDetails() {
    // Navigate to onboard or settings page
    this.router.navigate(['/payments/onboard']);
  }

  retry() {
    this.loadPayments();
  }
}