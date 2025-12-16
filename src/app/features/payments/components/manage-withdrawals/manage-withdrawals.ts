// // src/app/features/payments/components/manage-withdrawals/manage-withdrawals.ts

// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { Router, RouterModule } from '@angular/router';
// import { HttpErrorResponse } from '@angular/common/http';
// import { PaymentService } from '../../services/payment.service';
// import {
//   Payment,
//   PaymentStatus,
//   PaymentType,
//   PAYMENT_STATUS_LABELS
// } from '../../models/payment.model';

// @Component({
//   selector: 'app-manage-withdrawals',
//   standalone: true,
//   imports: [CommonModule, FormsModule, RouterModule],
//   templateUrl: './manage-withdrawals.html',
//   styleUrls: ['./manage-withdrawals.css']
// })
// export class ManageWithdrawals implements OnInit {
//   pendingWithdrawals: Payment[] = [];
//   processingWithdrawals: Payment[] = [];
//   isLoading = false;
//   error: string | null = null;

//   statusLabels = PAYMENT_STATUS_LABELS;

//   constructor(
//     private paymentService: PaymentService,
//     private router: Router
//   ) { }

//   ngOnInit(): void {
//     this.loadWithdrawals();
//   }

//   loadWithdrawals(): void {
//     this.isLoading = true;
//     this.error = null;

//     // Load all payments and filter withdrawals
//     this.paymentService.getAll().subscribe({
//       next: (payments) => {
//         const withdrawals = payments.filter(p => p.type === PaymentType.Withdrawal);

//         this.pendingWithdrawals = withdrawals
//           .filter(p => p.status === PaymentStatus.Pending)
//           .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

//         this.processingWithdrawals = withdrawals
//           .filter(p => p.status === PaymentStatus.Processing);

//         this.isLoading = false;
//       },
//       error: (err: HttpErrorResponse) => {
//         this.error = 'Failed to load withdrawals. Please try again.';
//         console.error('Error loading withdrawals:', err);
//         this.isLoading = false;
//       }
//     });
//   }

//   approveWithdrawal(paymentId: string): void {
//     if (!confirm('Approve this withdrawal request?\n\nThis will mark it as Processing and initiate the transfer.')) {
//       return;
//     }

//     this.paymentService.updatePaymentStatus(paymentId, PaymentStatus.Processing).subscribe({
//       next: () => {
//         alert('Withdrawal approved and marked as processing');
//         this.loadWithdrawals();
//       },
//       error: (err: HttpErrorResponse) => {
//         alert('Failed to approve withdrawal: ' + (err.error?.message || 'Unknown error'));
//       }
//     });
//   }

//   rejectWithdrawal(paymentId: string): void {
//     const reason = prompt('Enter rejection reason:');
//     if (!reason) return;

//     if (!confirm(`Reject this withdrawal?\n\nReason: ${reason}`)) {
//       return;
//     }

//     this.paymentService.updatePaymentStatus(paymentId, PaymentStatus.Failed, reason).subscribe({
//       next: () => {
//         alert('Withdrawal rejected');
//         this.loadWithdrawals();
//       },
//       error: (err: HttpErrorResponse) => {
//         alert('Failed to reject withdrawal: ' + (err.error?.message || 'Unknown error'));
//       }
//     });
//   }

//   completeWithdrawal(paymentId: string): void {
//     const transactionId = prompt('Enter transaction/reference ID:');
//     if (!transactionId) return;

//     if (!confirm('Mark this withdrawal as completed?\n\nThis action cannot be undone.')) {
//       return;
//     }

//     this.paymentService.completePayment(paymentId, transactionId).subscribe({
//       next: () => {
//         alert('Withdrawal marked as completed');
//         this.loadWithdrawals();
//       },
//       error: (err: HttpErrorResponse) => {
//         alert('Failed to complete withdrawal: ' + (err.error?.message || 'Unknown error'));
//       }
//     });
//   }

//   viewDetails(paymentId: string): void {
//     this.router.navigate(['/payments/admin/details', paymentId]);
//   }

//   goBack(): void {
//     this.router.navigate(['/payments/admin/dashboard']);
//   }

//   formatDate(date: Date | string): string {
//     return new Date(date).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   }

//   formatCurrency(amount: number): string {
//     return `EGP ${amount.toFixed(2)}`;
//   }

//   getTimeSince(date: Date | string): string {
//     const now = new Date().getTime();
//     const created = new Date(date).getTime();
//     const diff = now - created;

//     const minutes = Math.floor(diff / 60000);
//     const hours = Math.floor(diff / 3600000);
//     const days = Math.floor(diff / 86400000);

//     if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
//     if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
//     if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
//     return 'Just now';
//   }

//   isUrgent(date: Date | string): boolean {
//     const now = new Date().getTime();
//     const created = new Date(date).getTime();
//     const hoursSince = (now - created) / 3600000;
//     return hoursSince > 24; // Urgent if older than 24 hours
//   }
// }