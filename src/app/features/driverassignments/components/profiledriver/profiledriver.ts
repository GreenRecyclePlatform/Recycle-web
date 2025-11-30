// profiledriver.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DriverSidebar } from "../driver-sidebar/driver-sidebar";
import { DriverProfile, DriverStats, DriverProfileResponse } from '../../models/Profiledriver';
import { DriverProfileService } from '../../services/driverprofileservice';

@Component({
  imports: [FormsModule, CommonModule, DriverSidebar],
  selector: 'app-driver-profile',
  templateUrl: './profiledriver.html',
  styleUrls: ['./profiledriver.css']
})
export class Profiledriver implements OnInit {
  isEditing: boolean = false;
  selectedImage: File | null = null;
  previewImage: string | null = null;
  isLoading: boolean = false;
  isSaving: boolean = false;
  isTogglingAvailability: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  
  driverId: string = '22222222-2222-2222-2222-222222222222';

  sidebarData = {
    name: '',
    role: 'Driver',
    image: null as string | null,
    rating: 0
  };

  profileData: DriverProfile = {
    FirstName: '',
    LastName: '',
    ID: '',
    email: '',
    phone: '',
    address: '',
    profileImage: null
  };

  stats: DriverStats = {
    totalPickups: 0,
    rating: 0,
    completionRate: 0,
    totalEarnings: '₹0',
    isAvailable: false
  };

  originalData: DriverProfile = { ...this.profileData };
  private apiResponse: DriverProfileResponse | null = null;

  constructor(
    private driverProfileService: DriverProfileService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.driverId = params['id'];
      }
    });

    this.loadDriverProfile();
  }

  loadDriverProfile(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.driverProfileService.getDriverProfile(this.driverId).subscribe({
      next: (response: DriverProfileResponse) => {
        this.apiResponse = response;
        
        this.profileData = {
          FirstName: response.firstName,
          LastName: response.lastName,
          email: response.email,
          phone: response.phonenumber,
          ID: response.idNumber,
          address: `${response.address.street}, ${response.address.city}, ${response.address.governorate} ${response.address.postalCode}`,
          profileImage: response.profileImageUrl
        };

        this.stats = {
          totalPickups: response.totalTrips,
          rating: response.rating,
          completionRate: response.ratingCount,
          totalEarnings: this.calculateEarnings(response.totalTrips),
          isAvailable: response.isAvailable
        };

        this.sidebarData = {
          name: `${response.firstName} ${response.lastName}`,
          role: 'Driver',
          image: response.profileImageUrl,
          rating: response.rating
        };

        this.originalData = { ...this.profileData };
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading driver profile:', error);
        this.errorMessage = 'failed to load driver profile. Please try again.';
        this.isLoading = false;
      }
    });
  }

  // Toggle availability function
  toggleAvailability(): void {
    if (this.isTogglingAvailability) return;
    
    this.isTogglingAvailability = true;
    this.errorMessage = '';
    
    const newStatus = !this.stats.isAvailable;
    
    this.driverProfileService.updateAvailability(newStatus).subscribe({
      next: (result) => {
        this.stats.isAvailable = result;
        this.successMessage = this.stats.isAvailable ? 
          'availability enabled successfully!' : 
          'availability disabled successfully!';
        this.isTogglingAvailability = false;
        
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (error) => {
        console.error('Error updating availability:', error);
        this.errorMessage = 'failed to update availability status. Please try again.';
        this.isTogglingAvailability = false;
      }
    });
  }

  toggleEdit(): void {
    if (this.isEditing) {
      this.saveChanges();
    } else {
      this.originalData = { ...this.profileData };
      this.isEditing = true;
    }
  }

  saveChanges(): void {
    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';

    const addressParts = this.parseAddress(this.profileData.address);
    
    const updateRequest = {
      firstName: this.profileData.FirstName,
      lastName: this.profileData.LastName,
      profileImageUrl: this.previewImage || this.profileData.profileImage || '',
      phonenumber: this.profileData.phone,
      email: this.profileData.email,
      address: {
        street: addressParts.street,
        city: addressParts.city,
        governorate: addressParts.governorate,
        postalCode: addressParts.postalCode
      }
    };

    this.driverProfileService.updateDriverProfile(this.driverId, updateRequest).subscribe({
      next: (response) => {
        console.log('Profile updated successfully:', response);
        this.successMessage = 'Profile updated successfully!';
        this.isEditing = false;
        this.isSaving = false;
        
        if (this.previewImage) {
          this.profileData.profileImage = this.previewImage;
          this.sidebarData.image = this.previewImage;
        }
        
        this.sidebarData.name = `${this.profileData.FirstName} ${this.profileData.LastName}`;
        
        this.originalData = { ...this.profileData };
        this.selectedImage = null;
        this.previewImage = null;

        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (error) => {
        console.error('Error updating profile:', error);
        this.errorMessage =  'failed to save changes. Please try again.';
        this.isSaving = false;
      }
    });
  }

  cancelEdit(): void {
    this.profileData = { ...this.originalData };
    this.isEditing = false;
    this.previewImage = null;
    this.selectedImage = null;
    this.errorMessage = '';
    this.successMessage = '';
  }

  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        this.errorMessage = 'please select a valid image file.';
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        this.errorMessage = 'Image size should not exceed 5MB.';
        return;
      }

      this.selectedImage = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById('profileImageInput') as HTMLInputElement;
    fileInput?.click();
  }

  private parseAddress(address: string): { street: string; city: string; governorate: string; postalCode: string } {
    if (!this.apiResponse) {
      const parts = address.split(',').map(p => p.trim());
      return {
        street: parts[0] || '',
        city: parts[1] || '',
        governorate: parts[2] || '',
        postalCode: parts[3] || ''
      };
    }
    
    return this.apiResponse.address;
  }

  private calculateEarnings(totalTrips: number): string {
    const earningsPerTrip = 134;
    const total = totalTrips * earningsPerTrip;
    return `₹${total.toLocaleString('en-IN')}`;
  }

  private uploadImage(file: File): void {
    this.driverProfileService.uploadProfileImage(file).subscribe({
      next: (response) => {
        this.previewImage = response.imageUrl;
        console.log('Image uploaded successfully:', response.imageUrl);
      },
      error: (error) => {
        console.error('Error uploading image:', error);
        this.errorMessage = 'failed to upload image. Please try again.';
      }
    });
  }
}