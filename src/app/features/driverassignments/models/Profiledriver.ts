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
  phonenumber: string; 
  email: string;
  address: {
    street: string;
    city: string;
    governorate: string;
    postalCode: string;
  };
}

export interface UpdateDriverProfileRequest {
  firstName: string;
  lastName: string;
  profileImageUrl?: string;
  phoneNumber: string;  
  email: string;
  address: {
    street: string;
    city: string;
    governorate: string;
    postalCode: string;
  };
}

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