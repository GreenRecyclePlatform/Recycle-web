import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { ArrowLeft, Leaf, Mail, LucideAngularModule } from 'lucide-angular';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
  MatCardSubtitle,
} from '@angular/material/card';
import { AuthService } from '../../../core/services/authservice';
import { ForgotRequest } from '../../../core/models/auth-response';

@Component({
  selector: 'app-forgot-password',
  imports: [
    LucideAngularModule,
    RouterLink,
    MatCard,
    MatCardContent,
    ReactiveFormsModule,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
  ],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPasswordPage {
  Leaf = Leaf;
  ArrowLeft = ArrowLeft;
  Mail = Mail;

  forgotPasswordForm: FormGroup;
  isSubmitted = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  hasError(fieldName: string): boolean {
    const field = this.forgotPasswordForm.get(fieldName);
    return !!(field?.touched || field?.dirty) && field?.invalid;
  }

  errorMessage() {
    const field = this.forgotPasswordForm.get('email');

    if (!field || !field.errors) {
      return '';
    }

    if (field.errors['required']) {
      return `Email is required`;
    }

    if (field.errors['email']) {
      return 'Email is not Valid';
    }
    return '';
  }

  handleSubmit(): void {
    if (this.forgotPasswordForm.valid) {
      const forgotRequest: ForgotRequest = {
        email: this.forgotPasswordForm.value.email,
      };

      this.authService.forgotpassword(forgotRequest).subscribe({
        next: () => {
          this.isSubmitted = true;
        },
        error: (error) => {
          console.log(error);
        },
      });

      this.snackBar.open('Password reset link sent to your email!', 'Close', { duration: 3000 });
    } else {
      Object.keys(this.forgotPasswordForm.controls).forEach((key) => {
        this.forgotPasswordForm.get(key)?.markAsTouched();
      });

      this.snackBar.open('Please enter your email address', 'Close', { duration: 3000 });
    }
  }

  get email(): string {
    return this.forgotPasswordForm.get('email')?.value || '';
  }
}
