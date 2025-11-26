export interface DriverApiResponse {
  driverId: string;
  driverName: string;
  email: string;
  phoneNumber: string;
  profileImageUrl: string;
  rating: number;
  ratingCount: number;
  isAvailable: boolean;
  totalTrips: number;
}

export interface Driver {
  id: string;
  name: string;
  initials: string;
  rating: number;
  currentLocation: string;
  phone: string;
  todayPickups: number;
}