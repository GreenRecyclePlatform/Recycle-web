export interface AssignmentRequest {
  requestId: string;
  driverId: string;
}
///////////
export interface PickupRequest {
  requestId: string;
  userId: string;
  userName: string;
  addressId: string;
  fullAddress: string;
  preferredPickupDate: string;
  status: string;
  notes: string;
  totalEstimatedWeight: number;
  totalAmount: number;
  createdAt: string;
  completedAt: string | null;
  materials: any[];
}

export interface Request {
  id: string;
  customerName: string;
  address: string;
  material: string;
  weight: number;
  status: string;
}
////////////////
export interface DriverApiResponse {
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

export interface Driver {
  id: string;
  name: string;
  initials: string;
  rating: number;
  currentLocation: string;
  phone: string;
  todayPickups: number;
  profileImageUrl?: string; 
}