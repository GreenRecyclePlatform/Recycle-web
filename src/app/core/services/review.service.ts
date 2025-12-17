// review.service.ts - FINAL FIXED VERSION
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment.prod';
import {
  Review,
  PendingReviewDto,
  CreateReviewDto,
  UpdateReviewDto,
  ApiResponse,
} from '../models/review.model';
import { TokenService } from './tokenservice'; // ← ADD THIS

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private apiUrl = environment.apiUrl || 'https://localhost:7001/api';
  private reviewEndpoint = `${this.apiUrl}/Reviews`;
  private tokenService = inject(TokenService); // ← ADD THIS

  constructor(private http: HttpClient) {
    console.log('ReviewService initialized with URL:', this.reviewEndpoint);
  }

  /**
   * Get pending reviews for current user
   */
  getPendingReviews(): Observable<PendingReviewDto[]> {
    const url = `${this.reviewEndpoint}/pending`;

    // ✅ USE TokenService instead of localStorage
    const token = this.tokenService.getToken();
    console.log('🔍 getPendingReviews - Token check:', {
      exists: !!token,
      length: token?.length || 0,
      preview: token?.substring(0, 30) + '...' || 'NONE',
    });

    if (!token) {
      console.error('❌ NO TOKEN - Request will fail!');
    }

    console.log('📡 Fetching pending reviews from:', url);

    return this.http.get<ApiResponse<PendingReviewDto[]>>(url).pipe(
      tap((response) => {
        console.log('✅ Pending reviews response received:', response);
      }),
      map((response) => {
        // Handle both formats: {data: [...]} or direct array
        const data = (response as any).data || (response as any).Data || response || [];
        console.log('📦 Extracted data:', data);
        return this.convertPendingReviewDates(Array.isArray(data) ? data : []);
      }),
      catchError((error) => this.handleError(error, 'getPendingReviews'))
    );
  }

  /**
   * Create a new review
   */
  createReview(dto: CreateReviewDto): Observable<Review> {
    const token = this.tokenService.getToken();
    console.log('🔍 createReview - Token check:', !!token);
    console.log('📤 Creating review:', dto);

    return this.http.post<ApiResponse<Review>>(this.reviewEndpoint, dto).pipe(
      tap((response) => {
        console.log('✅ Create review response:', response);
      }),
      map((response) => {
        const data = response.data || response;
        return this.convertReviewDates(data);
      }),
      catchError((error) => this.handleError(error, 'createReview'))
    );
  }

  /**
   * Get review by ID
   */
  getReviewById(reviewId: string): Observable<Review> {
    const token = this.tokenService.getToken();
    console.log('🔍 getReviewById - Token check:', !!token);

    return this.http.get<ApiResponse<Review>>(`${this.reviewEndpoint}/${reviewId}`).pipe(
      tap((response) => {
        console.log('✅ Get review by ID response:', response);
      }),
      map((response) => {
        const data = response.data || response;
        return this.convertReviewDates(data);
      }),
      catchError((error) => this.handleError(error, 'getReviewById'))
    );
  }

  /**
   * Get current user's reviews
   */
  getMyReviews(page: number = 1, pageSize: number = 20): Observable<Review[]> {
    const url = `${this.reviewEndpoint}/my-reviews?page=${page}&pageSize=${pageSize}`;

    // ✅ USE TokenService instead of localStorage
    const token = this.tokenService.getToken();
    console.log('🔍 getMyReviews - Token check:', {
      exists: !!token,
      length: token?.length || 0,
      preview: token?.substring(0, 30) + '...' || 'NONE',
    });

    if (!token) {
      console.error('❌ NO TOKEN FOUND - This request WILL FAIL!');
      console.error('💡 User needs to login first');
    }

    console.log('📡 Fetching my reviews from:', url);

    return this.http.get<ApiResponse<Review[]>>(url).pipe(
      tap((response) => {
        console.log('✅ My reviews response received:', response);
      }),
      map((response) => {
        console.log('🔄 Processing response...');

        // Handle different response formats
        let reviews: Review[] = [];

        if (response.data) {
          reviews = Array.isArray(response.data) ? response.data : [];
        } else if (Array.isArray(response)) {
          reviews = response;
        }

        console.log('📦 Extracted reviews count:', reviews.length);

        return reviews.map((review) => this.convertReviewDates(review));
      }),
      catchError((error) => this.handleError(error, 'getMyReviews'))
    );
  }

  /**
   * Update an existing review
   */
  updateReview(reviewId: string, dto: UpdateReviewDto): Observable<Review> {
    const token = this.tokenService.getToken();
    console.log('🔍 updateReview - Token check:', !!token);
    console.log('📤 Updating review:', reviewId, dto);

    return this.http.put<ApiResponse<Review>>(`${this.reviewEndpoint}/${reviewId}`, dto).pipe(
      tap((response) => {
        console.log('✅ Update review response:', response);
      }),
      map((response) => {
        const data = response.data || response;
        return this.convertReviewDates(data);
      }),
      catchError((error) => this.handleError(error, 'updateReview'))
    );
  }

  /**
   * Delete a review
   */
  deleteReview(reviewId: string): Observable<void> {
    const token = this.tokenService.getToken();
    console.log('🔍 deleteReview - Token check:', !!token);
    console.log('🗑️ Deleting review:', reviewId);

    return this.http.delete<void>(`${this.reviewEndpoint}/${reviewId}`).pipe(
      tap(() => {
        console.log('✅ Review deleted successfully');
      }),
      catchError((error) => this.handleError(error, 'deleteReview'))
    );
  }

  /**
   * Convert date strings to Date objects for a single review
   */
  private convertReviewDates(review: Review): Review {
    return {
      ...review,
      createdAt: new Date(review.createdAt),
      updatedAt: review.updatedAt ? new Date(review.updatedAt) : undefined,
      flaggedAt: review.flaggedAt ? new Date(review.flaggedAt) : undefined,
    };
  }

  /**
   * Convert date strings to Date objects for pending reviews
   */
  private convertPendingReviewDates(reviews: PendingReviewDto[]): PendingReviewDto[] {
    return reviews.map((review) => ({
      ...review,
      completedAt: new Date(review.completedAt),
    }));
  }

  /**
   * Handle HTTP errors with context
   */
  private handleError(error: HttpErrorResponse, context: string = '') {
    console.error(`❌ API Error in ${context}:`, error);

    // Log detailed information
    console.error('📊 Error Details:', {
      status: error.status,
      statusText: error.statusText,
      url: error.url,
      message: error.message,
    });

    // Check if token is missing for 401 errors
    if (error.status === 401) {
      const token = this.tokenService.getToken();
      console.error('🔐 401 Unauthorized Error');
      console.error('Token present:', !!token);

      if (!token) {
        console.error('💡 CAUSE: No token in sessionStorage');
        console.error('💡 SOLUTION: User needs to login');
      } else {
        console.error('💡 CAUSE: Token may be expired or invalid');
        console.error('💡 SOLUTION: User needs to re-login');
      }
    }

    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage =
        error.error?.message ||
        error.error?.title ||
        error.message ||
        `Server returned code ${error.status}`;

      console.error('Status:', error.status);
      console.error('Error body:', error.error);
    }

    return throwError(() => ({
      status: error.status,
      message: errorMessage,
      error: error.error,
    }));
  }
}

export { PendingReviewDto, CreateReviewDto };
