import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  EmailValidator,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LucideAngularModule, Leaf } from 'lucide-angular';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../../core/services/authservice';
import { LoginRequest } from '../../../core/models/auth-response';
import { NotificationService } from '../../../core/services/notification.service';
import { SignalrService } from '../../../core/services/signalr.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
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
export class LoginPage implements OnDestroy {
  Leaf = Leaf;
  loginForm: FormGroup;
  loginMethod: 'email' | 'username' = 'email';
  isLoading = false; // ✅ Added missing property
  private destroy$ = new Subject<void>(); // ✅ Added missing property

  showPassword = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private signalRService: SignalrService,
    private notificationService: NotificationService
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

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      email: this.loginMethod === 'email' ? 'Email' : 'Username',
      password: 'Password',
    };
    return labels[fieldName] || fieldName;
  }

  hasError(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field?.touched || field?.dirty) && field?.invalid;
  }

  errorMessage(fieldName: string) {
    const field = this.loginForm.get(fieldName);

    if (!field || !field.errors) {
      return '';
    }

    if (field.errors['required']) {
      return `${this.getFieldLabel(fieldName)} is required`;
    }

    if (field.errors['email']) {
      return 'Email is not Valid';
    }
    return '';
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
    // Validate form
    if (!this.loginForm.valid) {
      Object.keys(this.loginForm.controls).forEach((key) => {
        this.loginForm.get(key)?.markAsTouched();
      });

      this.snackBar.open('Please enter valid credentials', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar'],
      });

      return;
    }

    // Prevent double submission
    if (this.isLoading) {
      return;
    }

    this.isLoading = true;

    // Prepare login request
    const loginRequest: LoginRequest = {
      password: this.loginForm.value.password,
      username: '',
      email: '',
    };

    if (this.loginMethod === 'email') {
      loginRequest.email = this.loginForm.value.email;
      loginRequest.username = '';
    } else {
      loginRequest.username = this.loginForm.value.email;
      loginRequest.email = '';
    }

    // Attempt login
    this.authService.login(loginRequest).subscribe({
      next: (response) => {
        this.initializeNotifications(response.accessToken);
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.log(error);
        this.snackBar.open(error, 'Close', { duration: 3000 });
        this.isLoading = false;
      },
    });

    //   // Show success message
    //   this.snackBar.open('Welcome back!', 'Close', {
    //     duration: 3000,
    //     panelClass: ['success-snackbar'],
    //   });

    // },
    // error: (error) => {
    //   console.error('❌ Login error:', error);
    //   this.isLoading = false;

    //   let errorMessage = 'Login failed. Please try again.';

    //   if (error.status === 401) {
    //     errorMessage = 'Invalid email/username or password';
    //   } else if (error.status === 404) {
    //     errorMessage = 'User not found';
    //   } else if (error.status === 0) {
    //     errorMessage = 'Unable to connect to server';
    //   } else if (error.error?.message) {
    //     errorMessage = error.error.message;
    //   }

    //   this.snackBar.open(errorMessage, 'Close', {
    //     duration: 5000,
    //     panelClass: ['error-snackbar'],
    //   });
    // },
    //});
  }

  /**
   * Initialize SignalR and load notifications
   */
  private initializeNotifications(token: string): void {
    console.log('🔄 Initializing notifications...');

    // Start SignalR connection
    this.signalRService
      .startConnection(token)
      .then(() => {
        console.log('✅ Real-time notifications enabled');

        // Load initial notifications
        this.notificationService
          .getAllNotifications()
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (notifications) => {
              console.log(`📥 Loaded ${notifications.length} notifications`);
            },
            error: (error) => {
              console.error('Error loading notifications:', error);
            },
          });

        // Load unread count
        this.notificationService
          .getUnreadCount()
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (count) => {
              console.log(`📊 Unread notifications: ${count}`);
            },
            error: (error) => {
              console.error('Error loading unread count:', error);
            },
          });
      })
      .catch((err: any) => {
        console.error('❌ Failed to initialize SignalR:', err);
        // Don't block the app even if SignalR fails
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
