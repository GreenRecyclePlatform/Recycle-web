// profile.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Navbar } from '../../shared/components/navbar/navbar';
import {
  ProfileService,
  UserProfileDto,
  UpdateProfileDto,
  UpdateAddressDto,
  NotificationPreferencesDto,
} from '../../core/services/profile.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, Navbar],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  isEditMode = false;
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  profile: UserProfileDto | null = null;

  editForm = {
    firstName: '',
    lastName: '',
    phoneNumber: '',
    dateOfBirth: '',
    street: '',
    city: '',
    governorate: '',
    postalCode: '',
  };

  private originalFormData: any = null;

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    console.log('🚀 Profile component initialized');
    this.loadProfile();

    this.profileService.loading$.pipe(takeUntil(this.destroy$)).subscribe((loading) => {
      this.isLoading = loading;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProfile(): void {
    console.log('📡 Fetching profile from API...');

    this.profileService
      .getProfile()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (profile) => {
          this.profile = profile;
          this.populateForm(profile);
          console.log('✅ Profile loaded successfully:', profile);
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Failed to load profile. Please try again.';
          console.error('❌ Error loading profile:', error);
          this.isLoading = false;
        },
      });
  }

  private populateForm(profile: UserProfileDto): void {
    this.editForm = {
      firstName: profile.firstName,
      lastName: profile.lastName,
      phoneNumber: profile.phoneNumber || '',
      dateOfBirth: this.formatDateForInput(profile.dateOfBirth),
      street: profile.primaryAddress?.street || '',
      city: profile.primaryAddress?.city || '',
      governorate: profile.primaryAddress?.governorate || '',
      postalCode: profile.primaryAddress?.postalCode || '',
    };
  }

  toggleEditMode(): void {
    if (!this.isEditMode) {
      this.originalFormData = { ...this.editForm };
    }
    this.isEditMode = !this.isEditMode;
    this.clearMessages();
  }

  saveProfile(): void {
    console.log('💾 Saving profile...');

    if (!this.validateForm()) {
      return;
    }

    this.clearMessages();

    const profileDto: UpdateProfileDto = {
      firstName: this.editForm.firstName.trim(),
      lastName: this.editForm.lastName.trim(),
      phoneNumber: this.editForm.phoneNumber.trim(),
      dateOfBirth: new Date(this.editForm.dateOfBirth),
    };

    this.profileService
      .updateProfile(profileDto)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedProfile) => {
          this.profile = updatedProfile;

          if (this.hasAddressData()) {
            this.updateAddress();
          } else {
            this.isEditMode = false;
            this.successMessage = 'Profile updated successfully!';
            this.autoHideMessage();
          }
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Failed to save profile. Please try again.';
        },
      });
  }

  private updateAddress(): void {
    const addressDto: UpdateAddressDto = {
      street: this.editForm.street.trim(),
      city: this.editForm.city.trim(),
      governorate: this.editForm.governorate.trim(),
      postalCode: this.editForm.postalCode.trim(),
    };

    this.profileService
      .updateAddress(addressDto)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.isEditMode = false;
          this.successMessage = 'Profile and address updated successfully!';
          this.autoHideMessage();
          this.loadProfile();
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Profile saved but address update failed.';
        },
      });
  }

  cancelEdit(): void {
    if (this.originalFormData) {
      this.editForm = { ...this.originalFormData };
      this.originalFormData = null;
    }
    this.isEditMode = false;
    this.clearMessages();
  }

  private validateForm(): boolean {
    if (!this.editForm.firstName.trim()) {
      this.errorMessage = 'First name is required';
      return false;
    }
    if (!this.editForm.lastName.trim()) {
      this.errorMessage = 'Last name is required';
      return false;
    }
    if (!this.editForm.phoneNumber.trim()) {
      this.errorMessage = 'Phone number is required';
      return false;
    }
    if (!this.editForm.dateOfBirth) {
      this.errorMessage = 'Date of birth is required';
      return false;
    }
    return true;
  }

  private hasAddressData(): boolean {
    return !!(
      this.editForm.street.trim() ||
      this.editForm.city.trim() ||
      this.editForm.governorate.trim() ||
      this.editForm.postalCode.trim()
    );
  }

  getInitials(): string {
    if (!this.profile) return '?';
    return `${this.profile.firstName[0]}${this.profile.lastName[0]}`.toUpperCase();
  }

  getFullName(): string {
    if (!this.profile) return 'Loading...';
    return `${this.profile.firstName} ${this.profile.lastName}`;
  }

  getMemberSince(): Date {
    return this.profile?.createdAt || new Date();
  }

  // ✅ Updated - Removed impactScore
  getStats() {
    if (!this.profile) {
      return {
        totalRequests: 0,
        completedPickups: 0,
        totalEarnings: 0,
      };
    }
    return this.profile.stats;
  }

  formatDate(date: Date | string | null): string {
    if (!date) return 'Not available';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  private formatDateForInput(date: Date | string): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  formatCurrency(amount: number): string {
    return `EGP ${amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  private clearMessages(): void {
    this.errorMessage = null;
    this.successMessage = null;
  }

  private autoHideMessage(): void {
    setTimeout(() => {
      this.successMessage = null;
    }, 3000);
  }

  refreshProfile(): void {
    this.loadProfile();
  }

  toggleNotification(preference: keyof NotificationPreferencesDto): void {
    if (!this.profile?.notificationPreferences) return;

    const currentPreferences = { ...this.profile.notificationPreferences };

    const updatedPreferences: NotificationPreferencesDto = {
      ...currentPreferences,
      [preference]: !currentPreferences[preference],
    };

    this.profile.notificationPreferences = updatedPreferences;

    this.profileService
      .updateNotificationPreferences(updatedPreferences)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.successMessage = 'Notification preferences updated!';
          this.autoHideMessage();
        },
        error: (error) => {
          this.profile!.notificationPreferences = currentPreferences;
          this.errorMessage = 'Failed to update notification preferences';
        },
      });
  }
}
