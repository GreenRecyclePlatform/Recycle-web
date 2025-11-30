export interface Review {
  reviewId: string;
  requestId: string;
  driverId: string;
  customerId: string;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt?: Date;
  isFlagged: boolean;
  isHidden: boolean;
  customerName: string;
  driverName: string;
  driverProfileImage?: string;
}

export interface CreateReviewDto {
  requestId: string;
  driverId: string;
  rating: number;
  comment: string;
}

export interface UpdateReviewDto {
  rating: number;
  comment: string;
}

export interface DriverRatingDto {
  driverId: string;
  averageRating: number;
  totalReviews: number;
  fiveStarCount: number;
  fourStarCount: number;
  threeStarCount: number;
  twoStarCount: number;
  oneStarCount: number;
}

export interface PendingReviewDto {
  requestId: string;
  driverId: string;
  completedAt: Date;
  driverName: string;
  driverProfileImage?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
}
