import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DriverSidebar } from "../driver-sidebar/driver-sidebar";
import { DriverProfile, DriverStats, DriverProfileResponse } from '../../models/Profiledriver';
import { DriverProfileService } from '../../services/driverprofileservice';
import { AuthService } from '../../../../core/services/authservice'; 
import { Navbar } from '../../../../shared/components/navbar/navbar';


@Component({
  imports: [FormsModule, CommonModule, DriverSidebar,Navbar],
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
  
  driverId: string = ''; // User ID
  driverProfileId: string = ''; // Driver Profile ID

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
    totalEarnings: 'EG0',
    isAvailable: false
  };

  originalData: DriverProfile = { ...this.profileData };
  private apiResponse: DriverProfileResponse | null = null;

  constructor(
    private driverProfileService: DriverProfileService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.checkDriverAccess();
  }

  checkDriverAccess(): void {
    const token = this.authService.getToken(); 
    const userId = this.authService.getUserIdFromToken();
    const userRole = this.authService.getUserRole();
    const isDriver = this.authService.isDriver();
    const isAdmin = this.authService.isAdmin();


    if (!token) {
      this.errorMessage = 'Please login to access your profile';
      console.warn('⚠️ No token found - redirecting to login');
      return;
    }

    if (!userId) {
      this.errorMessage = 'Unable to identify user';
      console.error('❌ User ID not found in token');
      return;
    }

    if (!isDriver && !isAdmin) {
      this.errorMessage = 'You need Driver privileges to access this page';
      console.warn('⚠️ Not a driver - access denied');
      return;
    }

    this.driverId = userId;
    this.loadDriverProfile();
  }

  loadDriverProfile(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.driverProfileService.getDriverProfile(this.driverId).subscribe({
      next: (response: DriverProfileResponse) => {
        console.log('📥 Full Response:', response);
        
        if (!response || !response.id) {
          console.error('❌ No driver profile found for user:', this.driverId);
          this.errorMessage = 'No driver profile found. Please contact support.';
          this.isLoading = false;
          return;
        }
        
        this.apiResponse = response;
        this.driverProfileId = response.id;
        
        console.log('🆔 Driver Profile ID:', this.driverProfileId);
        
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
        console.log('✅ Profile loaded successfully for:', response.email);
      },
      error: (error) => {
        console.error('❌ Error loading driver profile:', error);
        this.errorMessage = 'Failed to load driver profile. Please try again.';
        this.isLoading = false;
        
        if (error.message && (error.message.includes('Unauthorized') || error.message.includes('403'))) {
          console.warn('⚠️ Unauthorized access - redirecting');
        }
      }
    });
  }

  toggleAvailability(): void
   {
    if (this.isTogglingAvailability) return;
    
    this.isTogglingAvailability = true;
    this.errorMessage = '';
    
    const newStatus = !this.stats.isAvailable;
    
    this.driverProfileService.updateAvailability(newStatus).subscribe({
      next: (result) => {
        this.stats.isAvailable = result;
        this.successMessage = this.stats.isAvailable ? 
          'Availability enabled successfully!' : 
          'Availability disabled successfully!';
        this.isTogglingAvailability = false;
        
        console.log('✅ Availability updated to:', result);
        
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (error) => {
        console.error('❌ Error updating availability:', error);
        this.errorMessage = 'Failed to update availability status. Please try again.';
        this.isTogglingAvailability = false;
      }
    });
  }

  toggleEdit(): void {
    if (this.isEditing) {
      this.saveChanges();
    } else {
      this.originalData = { ...this.profileData };
      this.isEditing = true; //show input fields to Edit 
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
      phoneNumber: this.profileData.phone, 
      email: this.profileData.email,
      address: {
        street: addressParts.street,
        city: addressParts.city,
        governorate: addressParts.governorate,
        postalCode: addressParts.postalCode
      }
    };

    console.log('📤 Request Body:', JSON.stringify(updateRequest, null, 2));
    console.log('🔑 User ID (driverId):', this.driverId);

    this.driverProfileService.updateDriverProfile(this.driverId, updateRequest).subscribe({
      next: (response) => {
        console.log('✅ Profile updated successfully:', response);
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
        console.error('❌ Error updating profile:', error);
        
        if (error.error && error.error.errors) {
          console.error('🔴 Validation Errors:', error.error.errors);
          console.error('🔴 Full Error Object:', JSON.stringify(error.error, null, 2));
        }
        
        if (error.error) {
          this.errorMessage = JSON.stringify(error.error, null, 2);
        } else {
          this.errorMessage = 'Failed to save changes. Please try again.';
        }
        
        this.isSaving = false;
        
        if (error.message && error.message.includes('403')) {
          this.errorMessage = 'You can only update your own profile';
        }
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
        this.errorMessage = 'Please select a valid image file.';
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
    const earningsPerTrip = 200;
    const total = totalTrips * earningsPerTrip;
    return `EGP${total.toLocaleString('en-US')}`;
  }

  private uploadImage(file: File): void {
    this.driverProfileService.uploadProfileImage(file).subscribe({
      next: (response) => {
        this.previewImage = response.imageUrl;
        console.log('✅ Image uploaded successfully:', response.imageUrl);
      },
      error: (error) => {
        console.error('❌ Error uploading image:', error);
        this.errorMessage = 'Failed to upload image. Please try again.';
      }
    });
  }
}
