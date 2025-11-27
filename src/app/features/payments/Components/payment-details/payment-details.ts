import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PaymentService } from '../../../../core/services/payment.service';
import { AuthService } from '../../../../core/services/auth.service';
import { PaymentDto } from '../../../../core/models/payments/payment.dto';
import { PaymentStatus } from '../../../../core/models/payments/PaymentStatus';

@Component({
  selector: 'app-payment-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './payment-details.html',
  styleUrls: ['./payment-details.css']
})
export class PaymentDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private paymentService = inject(PaymentService);
  private authService = inject(AuthService);

  payment?: PaymentDto;
  loading = false;
  error?: string;
  paymentId: string = '';

  // Mock payment data
  private mockPayment: PaymentDto = {
    paymentId: '1',
    pickupRequestId: 'REQ008',
    recipientUserId: 'test-user-123',
    amount: 18.75,
    currency: 'usd',
    paymentStatus: PaymentStatus.COMPLETED,
    stripePayoutId: 'po_1234567890ABCDEF',
    adminId: 'admin-456',
    adminNotes: 'Payment approved. Plastic bottles collected and verified. Weight confirmed at 18kg.',
    requestedAt: new Date('2025-11-02T10:30:00').toISOString(),
    approvedAt: new Date('2025-11-02T14:15:00').toISOString(),
    completedAt: new Date('2025-11-03T09:00:00').toISOString(),
    createdAt: new Date('2025-11-02T10:30:00').toISOString(),
    materialType: 'Plastic Bottles',
    weight: '18 kg',
    pickupAddress: '123 Green Street, Eco City, EC 12345',
    driverName: 'John Driver',
    pricePerKg: 1.04
  };

  ngOnInit() {
    this.paymentId = this.route.snapshot.paramMap.get('id') || '';
    this.loadPaymentDetails();
  }

  loadPaymentDetails() {
    this.loading = true;
    this.error = undefined;

    // Use mock data for testing
    setTimeout(() => {
      if (this.paymentId === '1' || this.paymentId) {
        this.payment = { ...this.mockPayment, paymentId: this.paymentId };
        this.loading = false;
      } else {
        this.error = 'Payment not found';
        this.loading = false;
      }
    }, 500);

    // Uncomment when backend is ready:
    /*
    this.paymentService.getPaymentById(this.paymentId).subscribe({
      next: (payment) => {
        this.payment = payment;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading payment:', err);
        this.error = 'Unable to load payment details. Please try again.';
        this.loading = false;
      }
    });
    */
  }

  goBack() {
    this.router.navigate(['/payments']);
  }

  downloadReceipt() {
    // TODO: Implement receipt download
    alert('Receipt download will be implemented');
  }

  contactSupport() {
    // TODO: Implement support contact
    alert('Support contact will be implemented');
  }

  viewPickupDetails() {
    if (this.payment) {
      this.router.navigate(['/pickups', this.payment.pickupRequestId]);
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

  getStatusIcon(status: string): string {
    const iconMap: Record<string, string> = {
      'completed': '✓',
      'pending': '⏳',
      'approved': '👍',
      'processing': '⚙️',
      'failed': '✗',
      'cancelled': '⊘'
    };
    return iconMap[status.toLowerCase()] || '•';
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
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

  getStatusBadgeStyle(status: string): { backgroundColor: string; color: string } {
    const styles: Record<string, { backgroundColor: string; color: string }> = {
      'completed': { backgroundColor: '#d1fae5', color: '#065f46' },
      'pending': { backgroundColor: '#fed7aa', color: '#92400e' },
      'approved': { backgroundColor: '#dbeafe', color: '#1e40af' },
      'processing': { backgroundColor: '#e9d5ff', color: '#6b21a8' },
      'failed': { backgroundColor: '#fee2e2', color: '#991b1b' },
      'cancelled': { backgroundColor: '#e5e7eb', color: '#374151' }
    };
    return styles[status.toLowerCase()] || { backgroundColor: '#e5e7eb', color: '#374151' };
  }

  retry() {
    this.loadPaymentDetails();
  }
}