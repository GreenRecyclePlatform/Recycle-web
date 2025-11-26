import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LucideAngularModule, Leaf } from 'lucide-angular';
import { AuthService } from '../../../core/services/authservice';
import { LoginRequest } from '../../../core/models/auth-response';

@Component({
  selector: 'app-login-page',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    LucideAngularModule,
  ],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {
  Leaf = Leaf;
  loginForm: FormGroup;
  loginMethod: 'email' | 'username' = 'email';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          this.loginMethod === 'email' ? Validators.email : Validators.required,
        ],
      ],
      password: ['', Validators.required],
      rememberMe: [false],
    });
  }

  toggleLoginMethod(method: 'email' | 'username'): void {
    this.loginMethod = method;
    const emailControl = this.loginForm.get('email');
    if (emailControl) {
      if (method === 'email') {
        emailControl.setValidators([Validators.required, Validators.email]);
      } else {
        emailControl.setValidators([Validators.required]);
      }
      emailControl.updateValueAndValidity();
    }
  }
  handleLogin(): void {
    if (this.loginForm.valid) {
      const LoginRequest: LoginRequest = {
        password: this.loginForm.value.password,
        username: '',
        email: '',
      };
      if (this.loginMethod === 'email') {
        LoginRequest.username = '';
        LoginRequest.email = this.loginForm.value.email;
      } else {
        LoginRequest.email = '';
        LoginRequest.username = this.loginForm.value.email;
      }

      this.authService.login(LoginRequest).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.log(error);
        },
      });

      // const role = this.authService.userRole;
      // if (role === 'admin') {
      //   this.router.navigate(['/admin/dashboard']);
      // } else if (role === 'driver') {
      //   this.router.navigate(['/driver/dashboard']);
      // } else {
      //   this.router.navigate(['/individual/dashboard']);
      // }

      this.snackBar.open('Welcome back!', 'Close', { duration: 3000 });
    } else {
      this.snackBar.open('Please enter your credentials', 'Close', { duration: 3000 });
    }
  }
}
