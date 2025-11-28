// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
// import { Router, RouterModule } from '@angular/router';
// import { MatCardModule } from '@angular/material/card';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatButtonModule } from '@angular/material/button';
// import { MatCheckboxModule } from '@angular/material/checkbox';
// import { MatSnackBar } from '@angular/material/snack-bar';
// import { LucideAngularModule, Leaf } from 'lucide-angular';
// import { AuthService } from '../../../core/services/authservice';
// import { LoginRequest } from '../../../core/models/auth-response';

// @Component({
//   selector: 'app-login-page',
//   imports: [
//     CommonModule,
//     ReactiveFormsModule,
//     RouterModule,
//     MatCardModule,
//     MatFormFieldModule,
//     MatInputModule,
//     MatButtonModule,
//     MatCheckboxModule,
//     LucideAngularModule,
//   ],
//   templateUrl: './login-page.html',
//   styleUrl: './login-page.css',
// })
// export class LoginPage {
//   Leaf = Leaf;
//   loginForm: FormGroup;
//   loginMethod: 'email' | 'username' = 'email';

//   constructor(
//     private fb: FormBuilder,
//     private router: Router,
//     private authService: AuthService,
//     private snackBar: MatSnackBar
//   ) {
//     this.loginForm = this.fb.group({
//       email: [
//         '',
//         [
//           Validators.required,
//           this.loginMethod === 'email' ? Validators.email : Validators.required,
//         ],
//       ],
//       password: ['', Validators.required],
//       rememberMe: [false],
//     });
//   }

//   toggleLoginMethod(method: 'email' | 'username'): void {
//     this.loginMethod = method;
//     const emailControl = this.loginForm.get('email');
//     if (emailControl) {
//       if (method === 'email') {
//         emailControl.setValidators([Validators.required, Validators.email]);
//       } else {
//         emailControl.setValidators([Validators.required]);
//       }
//       emailControl.updateValueAndValidity();
//     }
//   }
//   //========================================================commented to test new code below===================================
//   // handleLogin(): void {
//   //   if (this.loginForm.valid) {
//   //     const LoginRequest: LoginRequest = {
//   //       password: this.loginForm.value.password,
//   //       username: '',
//   //       email: '',
//   //     };
//   //     if (this.loginMethod === 'email') {
//   //       LoginRequest.username = '';
//   //       LoginRequest.email = this.loginForm.value.email;
//   //     } else {
//   //       LoginRequest.email = '';
//   //       LoginRequest.username = this.loginForm.value.email;
//   //     }

//   //     this.authService.login(LoginRequest).subscribe({
//   //       next: () => {
//   //         this.router.navigate(['/']);
//   //       },
//   //       error: (error) => {
//   //         console.log(error);
//   //       },
//   //     });

//   // const role = this.authService.userRole;
//   // if (role === 'admin') {
//   //   this.router.navigate(['/admin/dashboard']);
//   // } else if (role === 'driver') {
//   //   this.router.navigate(['/driver/dashboard']);
//   // } else {
//   //   this.router.navigate(['/individual/dashboard']);
//   // }

//   //     this.snackBar.open('Welcome back!', 'Close', { duration: 3000 });
//   //   } else {
//   //     this.snackBar.open('Please enter your credentials', 'Close', { duration: 3000 });
//   //   }
//   // }
//   //========================================================commented to test new code below===================================


//   handleLogin(): void {
//     if (this.loginForm.valid) {
//       const loginRequest: LoginRequest = {
//         password: this.loginForm.value.password,
//         username: this.loginMethod === 'username' ? this.loginForm.value.email : '',
//         email: this.loginMethod === 'email' ? this.loginForm.value.email : '',
//         rememberMe: this.loginForm.value.rememberMe
//       };

//       this.authService.login(loginRequest).subscribe({
//         next: (response) => {
//           console.log('Login successful, token stored:', response.accessToken); // Debug log
//           this.snackBar.open('Welcome back!', 'Close', { duration: 3000 });

//           // Give a tiny delay to ensure token is stored
//           setTimeout(() => {
//             this.router.navigate(['/pickup-requests/my-requests']);
//           }, 100);
//         },
//         error: (error) => {
//           console.error('Login error:', error);
//           this.snackBar.open('Login failed. Please check your credentials.', 'Close', {
//             duration: 3000
//           });
//         }
//       });
//     } else {
//       this.snackBar.open('Please enter your credentials', 'Close', { duration: 3000 });
//     }
//   }


//}
//================================================================================
//================================================================================
//================================================================================
//================================================================================
//================================================================================
//================================================================================
// src/app/features/auth/login-page/login-page.ts

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
      email: ['', [Validators.required]], // Start with just required
      password: ['', Validators.required],
      rememberMe: [false],
    });

    // Update validators based on login method
    this.updateValidators();
  }

  toggleLoginMethod(method: 'email' | 'username'): void {
    this.loginMethod = method;
    this.updateValidators();
  }

  private updateValidators(): void {
    const emailControl = this.loginForm.get('email');
    if (emailControl) {
      if (this.loginMethod === 'email') {
        emailControl.setValidators([Validators.required, Validators.email]);
      } else {
        emailControl.setValidators([Validators.required]);
      }
      emailControl.updateValueAndValidity();
    }
  }

  // src/app/features/auth/login-page/login-page.ts

  handleLogin(): void {
    if (this.loginForm.valid) {
      const loginRequest: LoginRequest = {
        username: this.loginMethod === 'username' ? this.loginForm.value.email : '',
        email: this.loginMethod === 'email' ? this.loginForm.value.email : '',
        password: this.loginForm.value.password,
        rememberMe: this.loginForm.value.rememberMe
      };

      console.log('Attempting login with:', {
        method: this.loginMethod,
        username: loginRequest.username,
        email: loginRequest.email,
        hasPassword: !!loginRequest.password
      });

      this.authService.login(loginRequest).subscribe({
        next: (response) => {
          console.log(' Login successful!');
          console.log('Token received:', response.token.substring(0, 20) + '...'); //  Changed to .token

          this.snackBar.open('Welcome back!', 'Close', { duration: 3000 });

          // Small delay to ensure token is stored
          setTimeout(() => {
            this.router.navigate(['/pickup-requests/my-requests']);
          }, 100);
        },
        error: (error) => {
          console.error(' Login failed:', error);

          let errorMessage = 'Login failed. Please check your credentials.';

          if (error.error && typeof error.error === 'string') {
            errorMessage = error.error;
          } else if (error.error && error.error.message) {
            errorMessage = error.error.message;
          }

          this.snackBar.open(errorMessage, 'Close', { duration: 5000 });
        }
      });
    } else {
      this.snackBar.open('Please enter your credentials', 'Close', { duration: 3000 });
    }
  }
}