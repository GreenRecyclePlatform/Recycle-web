import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PaymentService } from '../../../../core/services/payment.service';
import { StripeService } from '../../../../core/services/stripe.service';
import { AuthService } from '../../../../core/services/auth.service';
import { PayoutRequestDto } from '../../../../core/models/payments/payout-request.dto';
import { AccountStatusBadgeComponent, AccountStatus } from '../account-status-badge/account-status-badge';

@Component({
  selector: 'app-payout-request',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, AccountStatusBadgeComponent],
  templateUrl: './payout-request.html',
  styleUrls: ['./payout-request.css']
})
export class PayoutRequestComponent implements OnInit {
  private paymentService = inject(PaymentService);
  private stripeService = inject(StripeService);
  private authService = inject(AuthService);
  private router = inject(Router);

  // Form data
  requestAmount: number = 0;
  description: string = '';

  // Balance info
  availableBalance: number = 0;
  pendingPayouts: number = 0;
  minimumPayout: number = 10;
  currency: string = 'usd';

  // Stripe account status
  stripeAccountVerified: boolean = false;
  accountStatus: AccountStatus = 'loading';
  requirementsNeeded: string[] = [];

  // UI state
  loading: boolean = false;
  loadingBalance: boolean = false;
  error?: string;
  success: boolean = false;
  submitting: boolean = false;

  // Mock data
  private mockBalance = {
    availableBalance: 127.50,
    pendingPayouts: 45.75,
    completedPickups: 8,
    currency: 'usd'
  };

  private mockStripeAccount = {
    verified: true,
    status: 'verified' as AccountStatus,
    requirementsNeeded: []
  };

  ngOnInit() {
    this.loadBalance();
    this.checkStripeAccount();
  }

  loadBalance() {
    this.loadingBalance = true;

    // Mock data for testing
    setTimeout(() => {
      this.availableBalance = this.mockBalance.availableBalance;
      this.pendingPayouts = this.mockBalance.pendingPayouts;
      this.currency = this.mockBalance.currency;
      this.loadingBalance = false;
    }, 500);

    // Uncomment when backend is ready:
    /*
    const userId = this.authService.getCurrentUserId();
    this.paymentService.getAvailableBalance(userId).subscribe({
      next: (balance) => {
        this.availableBalance = balance.availableBalance;
        this.pendingPayouts = balance.pendingPayouts;
        this.currency = balance.currency;
        this.loadingBalance = false;
      },
      error: (err) => {
        console.error('Error loading balance:', err);
        this.error = 'Unable to load balance. Please try again.';
        this.loadingBalance = false;
      }
    });
    */
  }

  checkStripeAccount() {
    // Mock data for testing
    setTimeout(() => {
      this.stripeAccountVerified = this.mockStripeAccount.verified;
      this.accountStatus = this.mockStripeAccount.status;
      this.requirementsNeeded = this.mockStripeAccount.requirementsNeeded;
    }, 300);

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
      },
      error: (err) => {
        console.error('Error checking Stripe account:', err);
        this.stripeAccountVerified = false;
        this.accountStatus = 'none';
      }
    });
    */
  }

  handleAccountAction(action: string) {
    if (action === 'action' || action === 'click') {
      if (this.accountStatus === 'none' || this.accountStatus === 'action_required' || this.accountStatus === 'pending') {
        this.router.navigate(['/payments/onboard']);
      } else if (this.accountStatus === 'verified') {
        this.openStripeDashboard();
      }
    }
  }

  openStripeDashboard() {
    const userId = this.authService.getCurrentUserId();
    
    // Mock dashboard link
    setTimeout(() => {
      const mockDashboardUrl = 'https://dashboard.stripe.com/express/mock-account-id';
      window.open(mockDashboardUrl, '_blank');
    }, 500);

    // Uncomment when backend is ready:
    /*
    this.stripeService.getDashboardLoginLink(userId).subscribe({
      next: (response) => {
        window.open(response.loginUrl, '_blank');
      },
      error: (err) => {
        console.error('Error opening dashboard:', err);
        this.error = 'Unable to open Stripe dashboard';
      }
    });
    */
  }

  setMaxAmount() {
    this.requestAmount = this.availableBalance;
    this.error = undefined;
  }

  setQuickAmount(amount: number) {
    if (amount <= this.availableBalance) {
      this.requestAmount = amount;
      this.error = undefined;
    } else {
      this.error = 'Amount exceeds available balance';
    }
  }

  validateAmount(): boolean {
    if (!this.requestAmount || this.requestAmount <= 0) {
      this.error = 'Please enter a valid amount';
      return false;
    }

    if (this.requestAmount < this.minimumPayout) {
      this.error = `Minimum payout amount is ${this.formatAmount(this.minimumPayout, this.currency)}`;
      return false;
    }

    if (this.requestAmount > this.availableBalance) {
      this.error = 'Amount exceeds available balance';
      return false;
    }

    this.error = undefined;
    return true;
  }

  submitRequest() {
    if (!this.validateAmount()) {
      return;
    }

    if (!this.stripeAccountVerified) {
      this.error = 'Please complete Stripe account verification first';
      return;
    }

    this.submitting = true;
    this.error = undefined;

    const request: PayoutRequestDto = {
      userId: this.authService.getCurrentUserId(),
      amount: this.requestAmount,
      currency: this.currency,
      description: this.description || undefined
    };

    // Mock submission for testing
    setTimeout(() => {
      this.success = true;
      this.submitting = false;
      
      // Redirect after 2 seconds
      setTimeout(() => {
        this.router.navigate(['/payments']);
      }, 2000);
    }, 1000);

    // Uncomment when backend is ready:
    /*
    this.paymentService.requestPayout(request).subscribe({
      next: (payment) => {
        this.success = true;
        this.submitting = false;
        
        // Redirect to payment details or list after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/payments', payment.paymentId]);
        }, 2000);
      },
      error: (err) => {
        console.error('Error submitting payout request:', err);
        this.error = err.error?.message || 'Unable to submit payout request. Please try again.';
        this.submitting = false;
      }
    });
    */
  }

  goToOnboarding() {
    this.router.navigate(['/payments/onboard']);
  }

  formatAmount(amount: number, currency: string): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(amount);
  }

  getEstimatedArrival(): string {
    const today = new Date();
    const arrivalDate = new Date(today);
    arrivalDate.setDate(today.getDate() + 3); // 3 business days
    
    return arrivalDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  }

  calculateFee(): number {
    // Most payment processors charge around 2% + fixed fee
    // For simplicity, using 0% here (adjust based on your fee structure)
    return 0;
  }

  getNetAmount(): number {
    return this.requestAmount - this.calculateFee();
  }

  retry() {
    this.error = undefined;
    this.success = false;
    this.loadBalance();
    this.checkStripeAccount();
  }
}