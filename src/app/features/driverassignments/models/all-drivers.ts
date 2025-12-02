export interface Address {
  street: string;
  city: string;
  governorate: string;
  postalCode: string;
}

export interface DriverProfileResponse {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  profileImageUrl: string;
  phonenumber: string;  
  idNumber: string;
  rating: number;
  ratingCount: number;
  isAvailable: boolean;
  totalTrips: number;
  createdAt: string;
  address: Address;
  email: string;
}

export interface Driver {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  phone: string;
  location: string;
  vehicle: {
    type: string;
    number: string;
  };
  rating: number;
  pickups: {
    total: number;
    todayCount: number;
  };
  status: 'active' | 'inactive';
  profileImageUrl?: string;
  idNumber?: string;
}

// Helper function to generate avatar color
export function generateAvatarColor(name: string): string {
  const colors = [
    '#2D6A4F', // Primary Green
    '#1976d2', // Blue
    '#00acc1', // Teal
    '#f57c00', // Orange
    '#7b1fa2', // Purple
    '#c62828', // Red
    '#558b2f', // Light Green
    '#5e35b1'  // Deep Purple
  ];
  
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

// Helper function to get initials
export function getInitials(name: string): string {
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return parts[0][0] + parts[1][0];
  }
  return name.substring(0, 2).toUpperCase();
}

// Helper function to map API response to Driver model
export function mapDriverProfileToDriver(profile: DriverProfileResponse): Driver {
  const fullName = `${profile.firstName} ${profile.lastName}`;
  const location = profile.address 
    ? `${profile.address.city}, ${profile.address.governorate}` 
    : 'N/A';
  
  return {
    id: profile.id,
    name: fullName,
    initials: getInitials(fullName),
    avatarColor: generateAvatarColor(fullName),
    phone: profile.phonenumber || 'N/A', 
    location: location,
    vehicle: {
      type: 'Unknown',
      number: 'N/A'
    },
    rating: profile.rating,
    pickups: {
      total: profile.totalTrips,
      todayCount: 0
    },
    status: profile.isAvailable ? 'active' : 'inactive',
    profileImageUrl: profile.profileImageUrl,
    idNumber: profile.idNumber
  };
}