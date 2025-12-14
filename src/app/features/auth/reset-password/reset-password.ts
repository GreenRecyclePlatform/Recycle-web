import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {
  MatCard,
  MatCardHeader,
  MatCardTitle,
  MatCardSubtitle,
  MatCardContent,
} from '@angular/material/card';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ArrowLeft, Leaf, LucideAngularModule } from 'lucide-angular';
import { ResetPasswordRequest } from '../../../core/models/auth-response';
import { AuthService } from '../../../core/services/authservice';
import { passwordMatchValidator } from '../../../core/validators/passwordMatchValidator';
import { passwordUpperValidator } from '../../../core/validators/passwordUpperValidator';
import { passwordLowerValidator } from '../../../core/validators/passwordLowerValidator';
import { passwordSpecialValidator } from '../../../core/validators/passwordSpecialValidator';

@Component({
  selector: 'app-reset-password',
  imports: [
    CommonModule,
    MatCard,
    MatCardHeader,
    LucideAngularModule,
    MatCardTitle,
    MatCardSubtitle,
    MatCardContent,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPassword {
  Leaf = Leaf;
  token: string | null = null;
  resetPasswordForm: FormGroup;
  ArrowLeft = ArrowLeft;

  showPassword = false;
  showConfirmPassword = false;

  togglePassword(flag: string | null = null): void {
    if (flag === 'confirm') {
      this.showConfirmPassword = !this.showConfirmPassword;
      return;
    }
    this.showPassword = !this.showPassword;
  }

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    this.resetPasswordForm = this.fb.group(
      {
        newPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            passwordUpperValidator,
            passwordLowerValidator,
            passwordSpecialValidator,
          ],
        ],
        confirmNewPassword: ['', Validators.required],
      },
      {
        validators: passwordMatchValidator('newPassword', 'confirmNewPassword'),
      }
    );
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      newPassword: 'NewPassword',
      confirmNewPassword: 'ConfirmNewPassword',
    };
    return labels[fieldName] || fieldName;
  }

  hasError(fieldName: string): boolean {
    const field = this.resetPasswordForm.get(fieldName);
    return (field?.invalid && (field?.dirty || field?.touched)) || false;
  }

  errorMessage(fieldName: string) {
    const field = this.resetPasswordForm.get(fieldName);

    if (!field || !field.errors) {
      return '';
    }

    if (field.errors['required']) {
      return `${this.getFieldLabel(fieldName)} is required`;
    }

    if (field.errors['minlength']) {
      const requiredLength = field.errors['minlength'].requiredLength;
      return `${this.getFieldLabel(fieldName)} must be at least ${requiredLength} characters`;
    }

    if (field.errors['passwordUpper']) {
      return 'Password must contain uppercase character';
    }

    if (field.errors['passwordLower']) {
      return 'Password must contain lowercase character';
    }

    if (field.errors['passwordSpecial']) {
      return 'Password must contain special character';
    }
    if (field.errors['passwordMismatch']) {
      return 'Password and confirm Password must be same';
    }

    return '';
  }

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token') ?? '';
  }

  handleSubmit() {
    const resetPasswordRequest: ResetPasswordRequest = {
      token: this.token!,
      newPassword: this.resetPasswordForm.value.newPassword,
    };

    if (!this.resetPasswordForm.valid) {
      Object.keys(this.resetPasswordForm.controls).forEach((key) => {
        this.resetPasswordForm.get(key)?.markAsTouched();
      });
    }
    this.authService.resetpassword(resetPasswordRequest).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
