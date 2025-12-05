// profile.component.ts - FULLY API-DRIVEN
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
  AchievementDto, // ✅ ADD THIS
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

  // UI State
  isEditMode = false;
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  // Profile Data - NO STATIC DATA
  profile: UserProfileDto | null = null;

  // Editable form data
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

  // Store original values for cancel
  private originalFormData: any = null;

  // ❌ REMOVE STATIC ACHIEVEMENTS AND NOTIFICATION PREFERENCES
  // All data now comes from profile object

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    console.log('🚀 Profile component initialized');
    this.loadProfile();

    // Subscribe to loading state
    this.profileService.loading$.pipe(takeUntil(this.destroy$)).subscribe((loading) => {
      this.isLoading = loading;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * ✅ Load user profile from API
   */
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
          console.log('🏆 Achievements:', profile.achievements); // ← Add this

        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Failed to load profile. Please try again.';
          console.error('❌ Error loading profile:', error);
          this.isLoading = false;
        },
      });
  }

  /**
   * Populate form with profile data from API
   */
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

  /**
   * Toggle edit mode
   */
  toggleEditMode(): void {
    if (!this.isEditMode) {
      this.originalFormData = { ...this.editForm };
    }
    this.isEditMode = !this.isEditMode;
    this.clearMessages();
  }

  /**
   * ✅ Save profile changes to API
   */
  saveProfile(): void {
    console.log('💾 Saving profile...');
    console.log('📝 Form data:', this.editForm);

    if (!this.validateForm()) {
      console.log('❌ Validation failed:', this.errorMessage);
      return;
    }

    this.clearMessages();

    const profileDto: UpdateProfileDto = {
      firstName: this.editForm.firstName.trim(),
      lastName: this.editForm.lastName.trim(),
      phoneNumber: this.editForm.phoneNumber.trim(),
      dateOfBirth: new Date(this.editForm.dateOfBirth),
    };

    console.log('📤 Sending profile update to API:', profileDto);

    this.profileService
      .updateProfile(profileDto)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedProfile) => {
          console.log('✅ Profile updated successfully:', updatedProfile);
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
          console.error('❌ Error saving profile:', error);
        },
      });
  }

  /**
   * ✅ Update address via API
   */
  private updateAddress(): void {
    const addressDto: UpdateAddressDto = {
      street: this.editForm.street.trim(),
      city: this.editForm.city.trim(),
      governorate: this.editForm.governorate.trim(),
      postalCode: this.editForm.postalCode.trim(),
    };

    console.log('📤 Sending address update to API:', addressDto);

    this.profileService
      .updateAddress(addressDto)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedAddress) => {
          console.log('✅ Address updated successfully:', updatedAddress);
          this.isEditMode = false;
          this.successMessage = 'Profile and address updated successfully!';
          this.autoHideMessage();
          this.loadProfile();
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Profile saved but address update failed.';
          console.error('❌ Error saving address:', error);
        },
      });
  }

  /**
   * Cancel edit and restore original values
   */
  cancelEdit(): void {
    if (this.originalFormData) {
      this.editForm = { ...this.originalFormData };
      this.originalFormData = null;
    }
    this.isEditMode = false;
    this.clearMessages();
  }

  /**
   * Validate form fields
   */
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

  /**
   * Check if address data is provided
   */
  private hasAddressData(): boolean {
    return !!(
      this.editForm.street.trim() ||
      this.editForm.city.trim() ||
      this.editForm.governorate.trim() ||
      this.editForm.postalCode.trim()
    );
  }

  /**
   * ✅ Get user initials from API data
   */
  getInitials(): string {
    if (!this.profile) return '?';
    return `${this.profile.firstName[0]}${this.profile.lastName[0]}`.toUpperCase();
  }

  /**
   * ✅ Get full name from API data
   */
  getFullName(): string {
    if (!this.profile) return 'Loading...';
    return `${this.profile.firstName} ${this.profile.lastName}`;
  }

  /**
   * ✅ Get member since date from API data
   */
  getMemberSince(): Date {
    return this.profile?.createdAt || new Date();
  }

  /**
   * ✅ Get stats from API data
   */
  getStats() {
    if (!this.profile) {
      return {
        totalRequests: 0,
        completedPickups: 0,
        totalEarnings: 0,
        impactScore: 0,
      };
    }
    return this.profile.stats;
  }

  /**
   * ✅ Get environmental impact from API data
   */
  getEnvironmentalImpact() {
    if (!this.profile) {
      return {
        materialsRecycled: 0,
        co2Saved: 0,
        treesEquivalent: 0,
      };
    }
    return this.profile.environmentalImpact;
  }

  /**
   * ✅ Get achievements from API data
   */
  getAchievements(): AchievementDto[] {
    return this.profile?.achievements || [];
  }

  /**
   * ✅ Check if user has any achievements
   */
  hasAchievements(): boolean {
    return this.getAchievements().length > 0;
  }

  /**
   * Format date for display
   */
  formatDate(date: Date | string | null): string {
    if (!date) return 'Not yet earned';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  /**
   * Format date for input field (YYYY-MM-DD)
   */
  private formatDateForInput(date: Date | string): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Format currency (Egyptian Pounds)
   */
  formatCurrency(amount: number): string {
    return `EGP ${amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  /**
   * Clear error and success messages
   */
  private clearMessages(): void {
    this.errorMessage = null;
    this.successMessage = null;
  }

  /**
   * Auto-hide success message after 3 seconds
   */
  private autoHideMessage(): void {
    setTimeout(() => {
      this.successMessage = null;
    }, 3000);
  }

  /**
   * Refresh profile data from API
   */
  refreshProfile(): void {
    console.log('🔄 Refreshing profile...');
    this.loadProfile();
  }

  /**
   * ✅ Toggle notification preference (API-driven)
   */
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
          console.log('✅ Notification preference saved');
          this.successMessage = 'Notification preferences updated!';
          this.autoHideMessage();
        },
        error: (error) => {
          this.profile!.notificationPreferences = currentPreferences;
          this.errorMessage = 'Failed to update notification preferences';
          console.error('❌ Error:', error);
        },
      });
  }
}
