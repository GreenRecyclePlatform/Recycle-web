// // src/app/features/payments/components/withdraw-earnings/withdraw-earnings.ts

// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
// import { Router, RouterModule } from '@angular/router';
// import { HttpErrorResponse } from '@angular/common/http';
// import { PaymentService } from '../../services/payment.service';
// import { PaymentSummary } from '../../models/payment.model';
// import { CreateWithdrawalDto } from '../../models/withdrawal.model';
// import { PaymentMethod, PaymentMethodType } from '../../models/payment-method.model';

// @Component({
//   selector: 'app-withdraw-earnings',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule, RouterModule],
//   templateUrl: './withdraw-earnings.html',
//   styleUrls: ['./withdraw-earnings.css']
// })
// export class WithdrawEarnings implements OnInit {
//   withdrawalForm: FormGroup;
//   paymentMethods: PaymentMethod[] = [];
//   summary: PaymentSummary | null = null;
//   isLoading = false;
//   isSubmitting = false;
//   error: string | null = null;
//   showAddPaymentMethod = false;

//   // New payment method form
//   newMethodForm: FormGroup;
//   selectedMethodType: PaymentMethodType = PaymentMethodType.BankAccount;
//   PaymentMethodType = PaymentMethodType;

//   // Egyptian governorates for bank branches
//   egyptianGovernorates = [
//     'Cairo', 'Giza', 'Alexandria', 'Qalyubia', 'Sharqia',
//     'Dakahlia', 'Beheira', 'Kafr El Sheikh', 'Gharbia', 'Monufia',
//     'Damietta', 'Port Said', 'Ismailia', 'Suez'
//   ];

//   constructor(
//     private fb: FormBuilder,
//     private paymentService: PaymentService,
//     private router: Router
//   ) {
//     this.withdrawalForm = this.fb.group({
//       amount: ['', [Validators.required, Validators.min(50)]],
//       paymentMethodId: ['', Validators.required],
//       notes: ['']
//     });

//     this.newMethodForm = this.fb.group({
//       type: [PaymentMethodType.BankAccount, Validators.required],
//       accountName: ['', Validators.required],
//       accountNumber: [''],
//       ifscCode: [''],
//       bankBranch: [''],
//       upiId: [''],
//       walletProvider: [''],
//       isDefault: [false]
//     });
//   }

//   ngOnInit(): void {
//     this.loadSummary();
//     this.loadPaymentMethods();
//   }

//   loadSummary(): void {
//     this.paymentService.getSummary().subscribe({
//       next: (data) => {
//         this.summary = data;
//       },
//       error: (err: HttpErrorResponse) => {
//         console.error('Error loading summary:', err);
//         this.error = 'Failed to load account summary';
//       }
//     });
//   }

//   loadPaymentMethods(): void {
//     this.isLoading = true;
//     this.paymentService.getAllPaymentMethods().subscribe({
//       next: (data) => {
//         this.paymentMethods = data.filter(m => m.isActive);

//         // Auto-select default method
//         const defaultMethod = this.paymentMethods.find(m => m.isDefault);
//         if (defaultMethod) {
//           this.withdrawalForm.patchValue({ paymentMethodId: defaultMethod.id });
//         }

//         this.isLoading = false;
//       },
//       error: (err: HttpErrorResponse) => {
//         console.error('Error loading payment methods:', err);
//         this.isLoading = false;
//       }
//     });
//   }

//   onMethodTypeChange(type: PaymentMethodType): void {
//     this.selectedMethodType = type;
//     this.newMethodForm.patchValue({ type });

//     // Reset validators based on type
//     this.resetMethodValidators();
//   }

//   resetMethodValidators(): void {
//     const accountNumber = this.newMethodForm.get('accountNumber');
//     const ifscCode = this.newMethodForm.get('ifscCode');
//     const upiId = this.newMethodForm.get('upiId');
//     const walletProvider = this.newMethodForm.get('walletProvider');

//     // Clear all validators first
//     accountNumber?.clearValidators();
//     ifscCode?.clearValidators();
//     upiId?.clearValidators();
//     walletProvider?.clearValidators();

//     // Set validators based on type
//     if (this.selectedMethodType === PaymentMethodType.BankAccount) {
//       accountNumber?.setValidators([Validators.required, Validators.pattern(/^\d{10,18}$/)]);
//       ifscCode?.setValidators([Validators.required]);
//     } else if (this.selectedMethodType === PaymentMethodType.UPI) {
//       upiId?.setValidators([Validators.required, Validators.pattern(/^[\w.-]+@[\w.-]+$/)]);
//     } else if (this.selectedMethodType === PaymentMethodType.Wallet) {
//       walletProvider?.setValidators([Validators.required]);
//     }

//     // Update validity
//     accountNumber?.updateValueAndValidity();
//     ifscCode?.updateValueAndValidity();
//     upiId?.updateValueAndValidity();
//     walletProvider?.updateValueAndValidity();
//   }

//   toggleAddPaymentMethod(): void {
//     this.showAddPaymentMethod = !this.showAddPaymentMethod;
//     if (!this.showAddPaymentMethod) {
//       this.newMethodForm.reset({
//         type: PaymentMethodType.BankAccount,
//         isDefault: false
//       });
//       this.selectedMethodType = PaymentMethodType.BankAccount;
//     }
//   }

//   addPaymentMethod(): void {
//     if (this.newMethodForm.invalid) {
//       this.markFormGroupTouched(this.newMethodForm);
//       return;
//     }

//     const formValue = this.newMethodForm.value;
//     const newMethod = {
//       type: formValue.type,
//       accountName: formValue.accountName,
//       accountNumber: formValue.accountNumber || undefined,
//       ifscCode: formValue.ifscCode || undefined,
//       upiId: formValue.upiId || undefined,
//       walletProvider: formValue.walletProvider || undefined,
//       isDefault: formValue.isDefault
//     };

//     this.paymentService.createPaymentMethod(newMethod).subscribe({
//       next: (method) => {
//         this.paymentMethods.push(method);
//         this.withdrawalForm.patchValue({ paymentMethodId: method.id });
//         this.toggleAddPaymentMethod();
//         alert('Payment method added successfully!');
//       },
//       error: (err: HttpErrorResponse) => {
//         alert('Failed to add payment method: ' + (err.error?.message || 'Unknown error'));
//       }
//     });
//   }

//   setWithdrawalAmount(percentage: number): void {
//     if (!this.summary) return;
//     const amount = (this.summary.availableBalance * percentage).toFixed(2);
//     this.withdrawalForm.patchValue({ amount: parseFloat(amount) });
//   }

//   onSubmit(): void {
//     if (this.withdrawalForm.invalid) {
//       this.markFormGroupTouched(this.withdrawalForm);
//       return;
//     }

//     if (!this.summary) {
//       this.error = 'Unable to process withdrawal. Please refresh and try again.';
//       return;
//     }

//     const amount = this.withdrawalForm.value.amount;
//     if (amount > this.summary.availableBalance) {
//       this.error = `Amount exceeds available balance (${this.formatCurrency(this.summary.availableBalance)})`;
//       return;
//     }

//     if (amount < 50) {
//       this.error = 'Minimum withdrawal amount is EGP 50.00';
//       return;
//     }

//     if (!confirm(`Withdraw ${this.formatCurrency(amount)}?`)) {
//       return;
//     }

//     this.isSubmitting = true;
//     this.error = null;

//     const withdrawalDto: CreateWithdrawalDto = {
//       amount: amount,
//       paymentMethodId: this.withdrawalForm.value.paymentMethodId,
//       notes: this.withdrawalForm.value.notes || undefined
//     };

//     this.paymentService.createWithdrawal(withdrawalDto).subscribe({
//       next: (response) => {
//         alert(`Withdrawal request submitted successfully!\n\nAmount: ${this.formatCurrency(response.amount)}\nStatus: ${response.status}\nEstimated Processing: ${response.estimatedProcessingTime}`);
//         this.router.navigate(['/payments/history']);
//       },
//       error: (err: HttpErrorResponse) => {
//         this.error = err.error?.message || 'Failed to process withdrawal. Please try again.';
//         this.isSubmitting = false;
//       }
//     });
//   }

//   getSelectedMethod(): PaymentMethod | undefined {
//     const methodId = this.withdrawalForm.value.paymentMethodId;
//     return this.paymentMethods.find(m => m.id === methodId);
//   }

//   getMethodDisplayText(method: PaymentMethod): string {
//     switch (method.type) {
//       case PaymentMethodType.BankAccount:
//         return `${method.accountName} - **** ${method.accountNumber?.slice(-4)}`;
//       case PaymentMethodType.UPI:
//         return `${method.accountName} - ${method.upiId}`;
//       case PaymentMethodType.Wallet:
//         return `${method.accountName} - ${method.walletProvider}`;
//       default:
//         return method.accountName;
//     }
//   }

//   private markFormGroupTouched(formGroup: FormGroup): void {
//     Object.keys(formGroup.controls).forEach(key => {
//       const control = formGroup.get(key);
//       control?.markAsTouched();

//       if (control instanceof FormGroup) {
//         this.markFormGroupTouched(control);
//       }
//     });
//   }

//   cancel(): void {
//     this.router.navigate(['/payments/history']);
//   }

//   formatCurrency(amount: number): string {
//     return `EGP ${amount.toFixed(2)}`;
//   }

//   calculateFee(amount: number): number {
//     // Example: 2% fee, max EGP 20
//     const feePercentage = 0.02;
//     const fee = amount * feePercentage;
//     return Math.min(fee, 20);
//   }

//   calculateNetAmount(amount: number): number {
//     return amount - this.calculateFee(amount);
//   }
// }