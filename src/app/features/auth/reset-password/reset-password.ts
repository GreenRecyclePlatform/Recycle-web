import { Component } from '@angular/core';
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

@Component({
  selector: 'app-reset-password',
  imports: [
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

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    this.resetPasswordForm = this.fb.group({
      newPassword: ['', Validators.required],
      confirmNewPassword: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token') ?? '';
  }

  handleSubmit() {
    const { newPassword, confirmNewPassword } = this.resetPasswordForm.value;
    if (newPassword !== confirmNewPassword) {
      this.snackBar.open('Passwords do not match', 'Close', { duration: 3000 });
      return;
    }

    const resetPasswordRequest: ResetPasswordRequest = {
      token: this.token!,
      newPassword: this.resetPasswordForm.value.newPassword,
    };

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
