// reviews.routes.ts
import { Routes } from '@angular/router';

export const REVIEW_ROUTES: Routes = [
  {
    path: '',
    // canActivate: [authGuard], // ← COMMENTED OUT for testing
    loadComponent: () =>
      import('./components/review-list/review-list').then((m) => m.ReviewListComponent),
  },
  {
    path: 'add',
    // canActivate: [authGuard], // ← COMMENTED OUT for testing
    loadComponent: () =>
      import('./components/add-review/add-review').then((m) => m.AddReviewComponent),
  },
];
// ===================================
// FILE: review.model.ts
// ===================================

/**
 * DTO for pending reviews that need to be completed by the user
 * Matches the C# backend PendingReviewDto
 */
export interface PendingReviewDto {
  requestId: string;
  pickupAddress: string;
  completedAt: Date;
  daysSinceCompletion: number;
  driverId: string;
  driverName: string;
  driverRating: number;
}

/**
 * DTO for creating a new review
 * Sent to the backend when submitting a review
 */
export interface CreateReviewDto {
  requestId: string;
  driverId: string;
  rating: number;
  comment: string;
}

/**
 * DTO for displaying existing reviews
 * Received from the backend when fetching review list
 */
export interface ReviewDto {
  id: string;
  requestId: string;
  driverId: string;
  driverName: string;
  rating: number;
  comment: string;
  createdAt: Date;
  pickupAddress?: string;
}

/**
 * Response wrapper for API calls
 */
export interface ReviewResponse {
  success: boolean;
  message: string;
  data?: any;
}
