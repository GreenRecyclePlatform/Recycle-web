// review.model.ts - Updated models

export interface Review {
  reviewId: string;
  requestId: string;
  driverId: string;
  customerId: string;
  rating: number;
  comment: string;
  createdAt: Date | string;
  updatedAt?: Date | string;
  isFlagged: boolean;
  isHidden: boolean;
  flagReason: string;
  flaggedAt?: Date | string;
  customerName: string;
  driverName: string;
}

/**
 * DTO for pending reviews
 */
export interface PendingReviewDto {
  requestId: string;
  pickupAddress: string;
  completedAt: Date | string;
  daysSinceCompletion: number;
  driverId: string; // ← This should NOT be empty or all zeros
  driverName: string;
  driverRating: number;
}

/**
 * DTO for creating a new review
 * DriverId is optional - backend will get it from the PickupRequest
 */
export interface CreateReviewDto {
  requestId: string;
  driverId?: string; // ← Optional now
  rating: number;
  comment: string;
}

/**
 * DTO for updating a review
 */
export interface UpdateReviewDto {
  rating: number;
  comment: string;
}

/**
 * Driver rating statistics
 */
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

/**
 * API Response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
