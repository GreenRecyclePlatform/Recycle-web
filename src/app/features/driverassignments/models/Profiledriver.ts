// ✅ All interfaces match backend DTOs exactly

export interface DriverProfileResponse {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  profileImageUrl: string;
  idNumber: string;
  rating: number;
  ratingCount: number;
  isAvailable: boolean;
  totalTrips: number;
  createdAt: string;
  phonenumber: string;  // Backend returns lowercase
  email: string;
  address: {
    street: string;
    city: string;
    governorate: string;
    postalCode: string;
  };
}

// ✅ FIXED: phoneNumber with capital N to match backend DTO
export interface UpdateDriverProfileRequest {
  firstName: string;
  lastName: string;
  profileImageUrl?: string;
  phoneNumber: string;  // ⬅️ Capital N to match backend UpdateDriverProfileDto
  email: string;
  address: {
    street: string;
    city: string;
    governorate: string;
    postalCode: string;
  };
}

// Internal component interfaces (no changes)
export interface DriverProfile {
  FirstName: string;
  LastName: string;
  email: string;
  phone: string;
  ID: string;
  address: string;
  profileImage: string | null;
}

export interface DriverStats {
  totalPickups: number;
  rating: number;
  completionRate: number;
  totalEarnings: string;
  isAvailable: boolean;
}