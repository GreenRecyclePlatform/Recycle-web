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
    this.registrationForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      birthDate: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      role: ['', Validators.required],
      street: ['', Validators.required],
      governorate: ['', Validators.required],
      city: ['', Validators.required],
      postalcode: ['', Validators.required],
      IDNumber: [''],
      termsAccepted: [false, Validators.requiredTrue],
    });
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
        this.snackBar.open('Please fill all required fields and select a role', 'Close', {
          duration: 3000,
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

  handleSubmit(): void {
    const { street, city, governorate, postalcode } = this.registrationForm.value;

    if (!street || !city || !governorate || !postalcode) {
      this.snackBar.open('Please fill all required fields', 'Close', {
        duration: 3000,
      });
      return;
    }

    if (!this.registrationForm.get('termsAccepted')?.value) {
      this.snackBar.open('Please accept the terms and conditions', 'Close', { duration: 3000 });
      return;
    }

    const { password, confirmPassword } = this.registrationForm.value;
    if (password !== confirmPassword) {
      this.snackBar.open('Passwords do not match', 'Close', { duration: 3000 });
      return;
    }
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
