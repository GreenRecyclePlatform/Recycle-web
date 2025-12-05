import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// API Response Models
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  page: number;
  pageSize: number;
  totalCount: number;
}

// Review Models
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

export interface PendingReviewDto {
  requestId: string;
  pickupAddress: string;
  completedAt: Date | string;
  daysSinceCompletion: number;
  driverId: string;
  driverName: string;
  driverRating: number;
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

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5139/api/Reviews';

  // /**
  //  * Get authorization headers with JWT token
  //  */
  // private getAuthHeaders(): HttpHeaders {
  //   const token = this.authHelper.getToken();
  //   return new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     Authorization: token ? `Bearer ${token}` : '',
  //   });
  // }

  /**
   * Create a new review
   * POST /api/Reviews
   */
  createReview(dto: CreateReviewDto): Observable<Review> {
    return this.http
      .post<ApiResponse<Review>>(this.apiUrl, dto)
      .pipe(map((response) => this.convertDates(response.data)));
  }

  /**
   * Get all reviews for the current user
   * GET /api/Reviews/my-reviews
   */
  getMyReviews(page: number = 1, pageSize: number = 20): Observable<Review[]> {
    return this.http
      .get<PaginatedResponse<Review>>(`${this.apiUrl}/my-reviews?page=${page}&pageSize=${pageSize}`)
      .pipe(map((response) => response.data.map((review) => this.convertDates(review))));
  }

  /**
   * Get pending reviews (completed pickups without reviews)
   * GET /api/Reviews/pending
   */
  getPendingReviews(): Observable<PendingReviewDto[]> {
    return this.http.get<ApiResponse<PendingReviewDto[]>>(`${this.apiUrl}/pending`).pipe(
      map((response) =>
        response.data.map((pending) => ({
          ...pending,
          completedAt: new Date(pending.completedAt),
        }))
      )
    );
  }

  /**
   * Get a specific review by ID
   * GET /api/Reviews/{reviewId}
   */
  getReviewById(reviewId: string): Observable<Review> {
    return this.http
      .get<ApiResponse<Review>>(`${this.apiUrl}/${reviewId}`)
      .pipe(map((response) => this.convertDates(response.data)));
  }

  /**
   * Update an existing review
   * PUT /api/Reviews/{reviewId}
   */
  updateReview(reviewId: string, dto: UpdateReviewDto): Observable<Review> {
    return this.http
      .put<ApiResponse<Review>>(`${this.apiUrl}/${reviewId}`, dto)
      .pipe(map((response) => this.convertDates(response.data)));
  }

  /**
   * Delete a review
   * DELETE /api/Reviews/{reviewId}
   */
  deleteReview(reviewId: string): Observable<void> {
    return this.http
      .delete<ApiResponse<null>>(`${this.apiUrl}/${reviewId}`)
      .pipe(map(() => void 0));
  }

  /**
   * Get reviews for a specific driver
   * GET /api/Reviews/driver/{driverId}
   */
  getReviewsForDriver(
    driverId: string,
    page: number = 1,
    pageSize: number = 20
  ): Observable<Review[]> {
    return this.http
      .get<PaginatedResponse<Review>>(
        `${this.apiUrl}/driver/${driverId}?page=${page}&pageSize=${pageSize}`
      )
      .pipe(map((response) => response.data.map((review) => this.convertDates(review))));
  }

  /**
   * Get driver rating statistics
   * GET /api/Reviews/driver/{driverId}/stats
   */
  getDriverRatingStats(driverId: string): Observable<DriverRatingDto> {
    return this.http
      .get<ApiResponse<DriverRatingDto>>(`${this.apiUrl}/driver/${driverId}/stats`)
      .pipe(map((response) => response.data));
  }

  /**
   * Convert date strings to Date objects
   */
  private convertDates(review: Review): Review {
    return {
      ...review,
      createdAt: new Date(review.createdAt),
      updatedAt: review.updatedAt ? new Date(review.updatedAt) : undefined,
      flaggedAt: review.flaggedAt ? new Date(review.flaggedAt) : undefined,
    };
  }
}
// ===================================
// mock service file for review.model.ts
// ===================================

// import { Injectable, inject } from '@angular/core';
// import { HttpClient, HttpParams } from '@angular/common/http';
// import { Observable, BehaviorSubject, of, delay } from 'rxjs';
// import { map, tap } from 'rxjs/operators';

// // Review Models
// export interface Review {
//   reviewId: string;
//   requestId: string;
//   driverId: string;
//   customerId: string;
//   rating: number;
//   comment: string;
//   createdAt: Date | string;
//   updatedAt?: Date | string;
//   isFlagged: boolean;
//   isHidden: boolean;
//   flagReason?: string;
//   flaggedAt?: Date | string;
//   customerName: string;
//   driverName: string;
// }

// export interface PendingReviewDto {
//   requestId: string;
//   pickupAddress: string;
//   completedAt: Date | string;
//   daysSinceCompletion: number;
//   driverId: string;
//   driverName: string;
//   driverRating: number;
// }

// export interface CreateReviewDto {
//   requestId: string;
//   driverId: string;
//   rating: number;
//   comment: string;
// }

// export interface UpdateReviewDto {
//   rating: number;
//   comment: string;
// }

// export interface DriverRatingDto {
//   driverId: string;
//   averageRating: number;
//   totalReviews: number;
//   fiveStarCount: number;
//   fourStarCount: number;
//   threeStarCount: number;
//   twoStarCount: number;
//   oneStarCount: number;
// }

// export interface ApiResponse<T> {
//   success: boolean;
//   data: T;
//   message: string;
// }

// export interface PaginatedResponse<T> {
//   success: boolean;
//   data: T[];
//   page: number;
//   pageSize: number;
//   totalCount: number;
// }

// @Injectable({
//   providedIn: 'root',
// })
// export class ReviewService {
//   private http = inject(HttpClient);
//   private apiUrl = 'http://localhost:5139/api/Reviews';
//   private reviewsSubject = new BehaviorSubject<Review[]>([]);
//   public reviews$ = this.reviewsSubject.asObservable();

//   // MOCK MODE - For testing without backend
//   private mockMode = true; // Set to false when backend is ready

//   private mockReviews: Review[] = [
//     {
//       reviewId: 'rev-001',
//       requestId: 'req-001',
//       driverId: 'drv-001',
//       driverName: 'Ahmed Hassan',
//       rating: 5,
//       comment: 'Excellent service! Very professional and on time.',
//       createdAt: new Date(Date.now() - 2 * 86400000),
//       customerId: 'cust-001',
//       isFlagged: false,
//       isHidden: false,
//       customerName: 'Test Customer',
//     },
//     {
//       reviewId: 'rev-002',
//       requestId: 'req-002',
//       driverId: 'drv-002',
//       driverName: 'Mohamed Ali',
//       rating: 4,
//       comment: 'Good service overall. Driver was friendly and handled everything well.',
//       createdAt: new Date(Date.now() - 5 * 86400000),
//       customerId: 'cust-001',
//       isFlagged: false,
//       isHidden: false,
//       customerName: 'Test Customer',
//     },
//     {
//       reviewId: 'rev-003',
//       requestId: 'req-003',
//       driverId: 'drv-003',
//       driverName: 'Mahmoud Salah',
//       rating: 3,
//       comment: 'Service was okay but could be improved. Driver was a bit late.',
//       createdAt: new Date(Date.now() - 7 * 86400000),
//       customerId: 'cust-001',
//       isFlagged: false,
//       isHidden: false,
//       customerName: 'Test Customer',
//     },
//   ];

//   private mockPendingReviews: PendingReviewDto[] = [
//     {
//       requestId: 'req-004',
//       pickupAddress: '123 Tahrir Square, Cairo, Egypt',
//       completedAt: new Date(),
//       daysSinceCompletion: 1,
//       driverId: 'drv-004',
//       driverName: 'Khaled Ibrahim',
//       driverRating: 4.5,
//     },
//     {
//       requestId: 'req-005',
//       pickupAddress: '456 Giza Pyramids Road, Giza, Egypt',
//       completedAt: new Date(Date.now() - 2 * 86400000),
//       daysSinceCompletion: 2,
//       driverId: 'drv-005',
//       driverName: 'Omar Mahmoud',
//       driverRating: 4.8,
//     },
//     {
//       requestId: 'req-006',
//       pickupAddress: '789 Heliopolis Avenue, Cairo, Egypt',
//       completedAt: new Date(Date.now() - 4 * 86400000),
//       daysSinceCompletion: 4,
//       driverId: 'drv-006',
//       driverName: 'Youssef Ahmed',
//       driverRating: 4.3,
//     },
//   ];

//   /**
//    * Create a new review
//    */
//   createReview(dto: CreateReviewDto): Observable<Review> {
//     if (this.mockMode) {
//       console.log('Mock: Creating review', dto);

//       const newReview: Review = {
//         reviewId: `rev-${Date.now()}`,
//         requestId: dto.requestId,
//         driverId: dto.driverId,
//         customerId: 'cust-001',
//         rating: dto.rating,
//         comment: dto.comment,
//         createdAt: new Date(),
//         isFlagged: false,
//         isHidden: false,
//         customerName: 'Test Customer',
//         driverName:
//           this.mockPendingReviews.find((p) => p.driverId === dto.driverId)?.driverName ||
//           'Unknown Driver',
//       };

//       this.mockReviews.unshift(newReview);
//       this.mockPendingReviews = this.mockPendingReviews.filter(
//         (p) => p.requestId !== dto.requestId
//       );
//       this.reviewsSubject.next([...this.mockReviews]);

//       return of(newReview).pipe(delay(1000));
//     }

//     // Real API call (when mockMode = false)
//     return this.http
//       .post<ApiResponse<Review>>(this.apiUrl, dto)
//       .pipe(map((response) => this.convertDates(response.data)));
//   }

//   /**
//    * Get current user's reviews
//    */
//   getMyReviews(page: number = 1, pageSize: number = 20): Observable<Review[]> {
//     if (this.mockMode) {
//       console.log('Mock: Getting my reviews');
//       this.reviewsSubject.next([...this.mockReviews]);
//       return of([...this.mockReviews]).pipe(delay(500));
//     }

//     // Real API call
//     return this.http
//       .get<PaginatedResponse<Review>>(`${this.apiUrl}/my-reviews?page=${page}&pageSize=${pageSize}`)
//       .pipe(map((response) => response.data.map((review) => this.convertDates(review))));
//   }

//   /**
//    * Get pending reviews
//    */
//   getPendingReviews(): Observable<PendingReviewDto[]> {
//     if (this.mockMode) {
//       console.log('Mock: Getting pending reviews');
//       return of([...this.mockPendingReviews]).pipe(delay(500));
//     }

//     // Real API call
//     return this.http.get<ApiResponse<PendingReviewDto[]>>(`${this.apiUrl}/pending`).pipe(
//       map((response) =>
//         response.data.map((pending) => ({
//           ...pending,
//           completedAt: new Date(pending.completedAt),
//         }))
//       )
//     );
//   }

//   /**
//    * Update review
//    */
//   updateReview(reviewId: string, dto: UpdateReviewDto): Observable<Review> {
//     if (this.mockMode) {
//       console.log('Mock: Updating review', reviewId, dto);

//       const index = this.mockReviews.findIndex((r) => r.reviewId === reviewId);
//       if (index !== -1) {
//         this.mockReviews[index] = {
//           ...this.mockReviews[index],
//           rating: dto.rating,
//           comment: dto.comment,
//           updatedAt: new Date(),
//         };

//         this.reviewsSubject.next([...this.mockReviews]);
//         return of(this.mockReviews[index]).pipe(delay(500));
//       }

//       throw new Error('Review not found');
//     }

//     // Real API call
//     return this.http
//       .put<ApiResponse<Review>>(`${this.apiUrl}/${reviewId}`, dto)
//       .pipe(map((response) => this.convertDates(response.data)));
//   }

//   /**
//    * Delete review
//    */
//   deleteReview(reviewId: string): Observable<void> {
//     if (this.mockMode) {
//       console.log('Mock: Deleting review', reviewId);

//       this.mockReviews = this.mockReviews.filter((r) => r.reviewId !== reviewId);
//       this.reviewsSubject.next([...this.mockReviews]);

//       return of(void 0).pipe(delay(500));
//     }

//     // Real API call
//     return this.http
//       .delete<ApiResponse<null>>(`${this.apiUrl}/${reviewId}`)
//       .pipe(map(() => void 0));
//   }

//   /**
//    * Get review by ID
//    */
//   getReviewById(reviewId: string): Observable<Review> {
//     if (this.mockMode) {
//       const review = this.mockReviews.find((r) => r.reviewId === reviewId);
//       if (!review) throw new Error('Review not found');
//       return of(review).pipe(delay(300));
//     }

//     return this.http
//       .get<ApiResponse<Review>>(`${this.apiUrl}/${reviewId}`)
//       .pipe(map((response) => this.convertDates(response.data)));
//   }

//   /**
//    * Get reviews for a driver
//    */
//   getReviewsForDriver(
//     driverId: string,
//     page: number = 1,
//     pageSize: number = 20
//   ): Observable<Review[]> {
//     if (this.mockMode) {
//       const driverReviews = this.mockReviews.filter((r) => r.driverId === driverId);
//       return of(driverReviews).pipe(delay(500));
//     }

//     return this.http
//       .get<PaginatedResponse<Review>>(
//         `${this.apiUrl}/driver/${driverId}?page=${page}&pageSize=${pageSize}`
//       )
//       .pipe(map((response) => response.data.map((review) => this.convertDates(review))));
//   }

//   /**
//    * Get driver rating statistics
//    */
//   getDriverRatingStats(driverId: string): Observable<DriverRatingDto> {
//     if (this.mockMode) {
//       const driverReviews = this.mockReviews.filter((r) => r.driverId === driverId);
//       const avgRating =
//         driverReviews.length > 0
//           ? driverReviews.reduce((sum, r) => sum + r.rating, 0) / driverReviews.length
//           : 0;

//       return of({
//         driverId,
//         averageRating: avgRating,
//         totalReviews: driverReviews.length,
//         fiveStarCount: driverReviews.filter((r) => r.rating === 5).length,
//         fourStarCount: driverReviews.filter((r) => r.rating === 4).length,
//         threeStarCount: driverReviews.filter((r) => r.rating === 3).length,
//         twoStarCount: driverReviews.filter((r) => r.rating === 2).length,
//         oneStarCount: driverReviews.filter((r) => r.rating === 1).length,
//       }).pipe(delay(300));
//     }

//     return this.http
//       .get<ApiResponse<DriverRatingDto>>(`${this.apiUrl}/driver/${driverId}/stats`)
//       .pipe(map((response) => response.data));
//   }

//   /**
//    * Convert date strings to Date objects
//    */
//   private convertDates(review: Review): Review {
//     return {
//       ...review,
//       createdAt: new Date(review.createdAt),
//       updatedAt: review.updatedAt ? new Date(review.updatedAt) : undefined,
//       flaggedAt: review.flaggedAt ? new Date(review.flaggedAt) : undefined,
//     };
//   }
// }
