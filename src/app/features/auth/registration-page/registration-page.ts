import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/authservice';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LucideAngularModule, Leaf, User, Truck, ChevronRight, ChevronLeft } from 'lucide-angular';
import { RegisterRequest } from '../../../core/models/auth-response';
import { DriverProfileService } from '../../../core/services/driverprofileservice';
import { passwordUpperValidator } from '../../../core/validators/passwordUpperValidator';
import { passwordLowerValidator } from '../../../core/validators/passwordLowerValidator';
import { passwordSpecialValidator } from '../../../core/validators/passwordSpecialValidator';
import { passwordMatchValidator } from '../../../core/validators/passwordMatchValidator';

interface Role {
  id: string;
  title: string;
  description: string;
  icon: any;
}

@Component({
  selector: 'app-registration-page',
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
    MatProgressBarModule,
    LucideAngularModule,
  ],
  templateUrl: './registration-page.html',
  styleUrls: ['./registration-page.css'],
})
export class RegistrationPage {
  Leaf = Leaf;
  User = User;
  Truck = Truck;
  ChevronRight = ChevronRight;
  ChevronLeft = ChevronLeft;

  userId: string | null = null;

  step = 1;
  registrationForm: FormGroup;

  selectedFile: File | null = null; // Store the actual file
  fileName: string = 'No file chosen';

  roles: Role[] = [
    {
      id: 'User',
      title: 'Individual',
      description: 'Sell your recyclable materials',
      icon: this.User,
    },
    { id: 'Driver', title: 'Driver', description: 'Collect materials and earn', icon: this.Truck },
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private driverProfileService: DriverProfileService
  ) {
    this.registrationForm = this.fb.group(
      {
        firstName: ['', [Validators.required, Validators.minLength(3)]],
        lastName: ['', [Validators.required, Validators.minLength(3)]],
        userName: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', Validators.required],
        birthDate: ['', Validators.required],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            passwordUpperValidator,
            passwordLowerValidator,
            passwordSpecialValidator,
          ],
        ],
        confirmPassword: ['', Validators.required],
        role: ['', Validators.required],
        street: ['', Validators.required],
        governorate: ['', Validators.required],
        city: ['', Validators.required],
        postalcode: ['', Validators.required],
        IDNumber: [''],
        termsAccepted: [false, Validators.requiredTrue],
      },
      {
        validators: passwordMatchValidator('password', 'confirmPassword'),
      }
    );
  }

  get progress(): number {
    return (this.step / 2) * 100;
  }

  handleNext(): void {
    if (this.step === 1) {
      const {
        firstName,
        lastName,
        userName,
        email,
        phone,
        birthDate,
        password,
        confirmPassword,
        role,
      } = this.registrationForm.value;
      if (
        !firstName ||
        !lastName ||
        !userName ||
        !birthDate ||
        !email ||
        !phone ||
        !password ||
        !confirmPassword ||
        !role
      ) {
        Object.keys(this.registrationForm.controls).forEach((key) => {
          this.registrationForm.get(key)?.markAsTouched();
        });

        this.snackBar.open('Please fill all required fields and select a role', 'Close', {
          duration: 3000,
        });

        const page2Fields = ['street', 'governorate', 'city', 'postalcode'];

        page2Fields.forEach((field) => {
          const control = this.registrationForm.get(field);
          control?.markAsPristine();
          control?.markAsUntouched();
        });
        return;
      }
    }
    if (this.step < 2) {
      this.step++;
    }
  }

  handleBack(): void {
    if (this.step > 1) {
      this.step--;
    }
  }

  onImageChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.snackBar.open('File size should be less than 5MB', 'Close', {
          duration: 3000,
        });
        event.target.value = '';
        this.selectedFile = null;
        this.fileName = 'No file chosen';

        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.snackBar.open('Please upload an image file', 'Close', {
          duration: 3000,
        });
        event.target.value = '';
        this.selectedFile = null;
        this.fileName = 'No file chosen';
        this.registrationForm.patchValue({ ProfileImage: '' });
        return;
      }

      // Store the file
      this.selectedFile = file;
      this.fileName = file.name;

      console.log('✅ File stored successfully:', {
        name: file.name,
        size: file.size,
        type: file.type,
      });
      console.log('selectedFile variable:', this.selectedFile);
    }
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      userName: 'Username',
      phone: 'Phone Number',
      birthDate: 'Date OF Birth',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      role: 'Role',
      street: 'Street',
      city: 'City',
      governorate: 'Governorate',
      postalcode: 'PostalCode',
    };
    return labels[fieldName] || fieldName;
  }

  hasError(fieldName: string): boolean {
    const field = this.registrationForm.get(fieldName);
    return (field?.invalid && (field?.dirty || field?.touched)) || false;
  }

  errorMessage(fieldName: string) {
    const field = this.registrationForm.get(fieldName);

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

    if (field.errors['email']) {
      return 'Email is not Valid';
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

  handleSubmit(): void {
    const { street, city, governorate, postalcode } = this.registrationForm.value;

    if (!street || !city || !governorate || !postalcode) {
      const page2Fields = ['street', 'governorate', 'city', 'postalcode'];

      page2Fields.forEach((field) => {
        const control = this.registrationForm.get(field);
        control?.markAsTouched();
      });

      return;
    }

    if (!this.registrationForm.get('termsAccepted')?.value) {
      this.snackBar.open('Please accept the terms and conditions', 'Close', { duration: 3000 });
      return;
    }

    // const { password, confirmPassword } = this.registrationForm.value;
    // if (password !== confirmPassword) {
    //   this.snackBar.open('Passwords do not match', 'Close', { duration: 3000 });
    //   return;
    // }
    const registerRequest: RegisterRequest = {
      firstName: this.registrationForm.value.firstName,
      lastName: this.registrationForm.value.lastName,
      email: this.registrationForm.value.email,
      userName: this.registrationForm.value.userName,
      dateofBirth: this.registrationForm.value.birthDate,
      phoneNumber: this.registrationForm.value.phone,
      password: this.registrationForm.value.password,
      confirmPassword: this.registrationForm.value.confirmPassword,
      role: this.registrationForm.value.role,
      address: {
        street: this.registrationForm.value.street,
        city: this.registrationForm.value.city,
        governorate: this.registrationForm.value.governorate,
        postalcode: this.registrationForm.value.postalcode,
      },
    };

    this.authService.register(registerRequest).subscribe({
      next: (response) => {
        this.router.navigate(['/login']);
        this.userId = response.userId;
        if (this.registrationForm.value.role == 'Driver') {
          const formData = new FormData();

          formData.append('stringUserId', this.userId!);
          formData.append('IdNumber', this.registrationForm.value.IDNumber);

          // Append the actual file
          if (this.selectedFile) {
            formData.append('Image', this.selectedFile, this.selectedFile.name);
          }

          this.driverProfileService.createdriverprofile(formData);
        }
        this.snackBar.open('Account created successfully!', 'Close', { duration: 3000 });
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  selectRole(roleId: string): void {
    this.registrationForm.patchValue({ role: roleId });
  }

  get selectedRole(): string {
    return this.registrationForm.get('role')?.value || '';
  }
}
