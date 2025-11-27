import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { StripeService } from '../../../../core/services/stripe.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-onboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './onboard.html',
  styleUrls: ['./onboard.css']
})
export class OnboardComponent implements OnInit {
  private stripeService = inject(StripeService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // Account status
  accountStatus: 'none' | 'pending' | 'verified' | 'restricted' | 'loading' = 'loading';
  stripeAccountId?: string;
  accountLink?: string;
  requirementsNeeded: string[] = [];
  
  // UI states
  loading = false;
  error?: string;
  generatingLink = false;

  // Return from Stripe flags
  isReturn = false;
  returnSuccess = false;

  // Mock data
  private mockAccountStatus = {
    status: 'none', // Change to 'verified' to test verified state
    stripeAccountId: null,
    requirementsNeeded: []
  };

  ngOnInit() {
    // Check if returning from Stripe
    this.route.queryParams.subscribe(params => {
      if (params['return'] === 'true') {
        this.isReturn = true;
        this.returnSuccess = params['success'] === 'true';
      }
    });

    this.checkAccountStatus();
  }

  checkAccountStatus() {
    this.accountStatus = 'loading';
    this.error = undefined;

    // Mock data for testing
    setTimeout(() => {
      this.accountStatus = this.mockAccountStatus.status as any;
      this.stripeAccountId = this.mockAccountStatus.stripeAccountId || undefined;
      this.requirementsNeeded = this.mockAccountStatus.requirementsNeeded;
    }, 800);

    // Uncomment when backend is ready:
    /*
    const userId = this.authService.getCurrentUserId();
    this.stripeService.getAccountStatus(userId).subscribe({
      next: (account) => {
        if (!account.stripeAccountId) {
          this.accountStatus = 'none';
        } else if (account.payoutsEnabled && account.detailsSubmitted) {
          this.accountStatus = 'verified';
        } else if (account.requirements?.currentlyDue?.length > 0) {
          this.accountStatus = 'pending';
          this.requirementsNeeded = account.requirements.currentlyDue;
        } else {
          this.accountStatus = 'pending';
        }
        this.stripeAccountId = account.stripeAccountId;
      },
      error: (err) => {
        console.error('Error checking account status:', err);
        this.accountStatus = 'none';
        this.error = 'Unable to check account status';
      }
    });
    */
  }

  startOnboarding() {
    this.generatingLink = true;
    this.error = undefined;

    const userId = this.authService.getCurrentUserId();
    const email = this.authService.getCurrentUserEmail();
    const refreshUrl = `${window.location.origin}/payments/onboard?return=true&success=false`;
    const returnUrl = `${window.location.origin}/payments/onboard?return=true&success=true`;

    // Mock link generation for testing
    setTimeout(() => {
      // In real implementation, this would be the Stripe-generated URL
      const mockStripeUrl = 'https://connect.stripe.com/express/onboarding/mock-account-id';
      this.accountLink = mockStripeUrl;
      this.generatingLink = false;
      
      // Auto-redirect after 1 second to show the button
      setTimeout(() => {
        this.redirectToStripe();
      }, 1000);
    }, 1500);

    // Uncomment when backend is ready:
    /*
    this.stripeService.onboardUser(userId, email, refreshUrl, returnUrl).subscribe({
      next: (response) => {
        this.accountLink = response.accountLink;
        this.stripeAccountId = response.stripeAccountId;
        this.generatingLink = false;
        
        // Auto-redirect after showing the link briefly
        setTimeout(() => {
          this.redirectToStripe();
        }, 1000);
      },
      error: (err) => {
        console.error('Error starting onboarding:', err);
        this.error = err.error?.message || 'Unable to start onboarding. Please try again.';
        this.generatingLink = false;
      }
    });
    */
  }

  redirectToStripe() {
    if (this.accountLink) {
      // Open in same window - Stripe will redirect back to returnUrl
      window.location.href = this.accountLink;
    }
  }

  continueOnboarding() {
    // For users who started but didn't complete
    this.startOnboarding();
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

  goToDashboard() {
    this.router.navigate(['/payments']);
  }

  copyLink() {
    if (this.accountLink) {
      navigator.clipboard.writeText(this.accountLink).then(() => {
        alert('Link copied to clipboard!');
      }).catch(err => {
        console.error('Failed to copy link:', err);
        const input = document.querySelector('.link-input') as HTMLInputElement;
        if (input) {
          input.select();
          document.execCommand('copy');
        }
      });
    }
  }

  retry() {
    this.error = undefined;
    this.checkAccountStatus();
  }
}