import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { Navbar } from '../../../../shared/components/navbar/navbar';
import { LucideAngularModule } from 'lucide-angular';
import { TokenService } from '../../../../core/services/tokenservice';
import { AuthService } from '../../../../core/services/authservice';
import { ReviewService } from '../../../../core/services/review.service';
import { PendingReviewDto, CreateReviewDto } from '../../../../core/models/review.model';

@Component({
  selector: 'app-add-review',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, Navbar, LucideAngularModule],
  templateUrl: './add-review.html',
  styleUrls: ['./add-review.css'],
})
export class AddReviewComponent implements OnInit, OnDestroy {
  reviewForm: FormGroup;
  pendingReviews: PendingReviewDto[] = [];
  selectedRequest: PendingReviewDto | null = null;
  loading: boolean = false;
  submitting: boolean = false;
  error: string = '';
  successMessage: string = '';
  private destroy$ = new Subject<void>();

  private fb = inject(FormBuilder);
  private reviewService = inject(ReviewService);
  private router = inject(Router);
  private tokenService = inject(TokenService);
  private authService = inject(AuthService);

  constructor() {
    this.reviewForm = this.fb.group({
      rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    console.log('🔍 ADD REVIEW - Token Check');
    console.log('Current URL:', this.router.url);

    const token = this.tokenService.getToken();
    console.log('Token exists:', !!token);

    if (!token) {
      console.error('❌ NO TOKEN FOUND! SessionStorage might be cleared.');
      console.log('SessionStorage contents:', sessionStorage.length, 'items');
      this.error = 'Session expired. Please login again.';
      setTimeout(() => {
        this.router.navigate(['/login'], {
          queryParams: { returnUrl: '/reviews/add' },
        });
      }, 1500);
      return;
    }

    // Check if token is expired
    const isExpired = this.tokenService.isTokenExpired();
    console.log('Token expired:', isExpired);

    if (isExpired) {
      console.error('❌ TOKEN EXPIRED!');
      this.error = 'Your session has expired. Please login again.';
      this.tokenService.clearToken();
      setTimeout(() => {
        this.router.navigate(['/login'], {
          queryParams: { returnUrl: '/reviews/add' },
        });
      }, 1500);
      return;
    }

    console.log('✅ Token is valid');
    console.log('User ID:', this.tokenService.getUserId());
    console.log('User Role:', this.tokenService.getRole());

    this.loadPendingReviews();
  }

  loadPendingReviews(): void {
    this.loading = true;
    this.error = '';

    console.log('📋 Loading pending reviews...');
    console.log('Token check before API call:', !!this.tokenService.getToken());

    this.reviewService
      .getPendingReviews()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (reviews) => {
          console.log('✅ Pending reviews loaded:', reviews);
          this.pendingReviews = reviews;
          this.loading = false;

          if (reviews.length === 0) {
            this.error =
              'No pending reviews available. You may have already reviewed all completed pickups.';
          } else if (reviews.length === 1) {
            this.selectRequest(reviews[0]);
          }
        },
        error: (error) => {
          console.error('❌ Error loading pending reviews:', error);
          console.error('Error status:', error.status);
          console.error('Error message:', error.message);

          this.loading = false;

          if (error.status === 401 || error.status === 403) {
            console.log('🔐 Unauthorized - redirecting to login');
            this.error = 'Authentication failed. Please login again.';
            this.tokenService.clearToken();
            setTimeout(() => {
              this.router.navigate(['/login'], {
                queryParams: { returnUrl: '/reviews/add' },
              });
            }, 1500);
          } else {
            this.error =
              error.error?.message ||
              error.message ||
              'Failed to load pending reviews. Please try again.';
          }
        },
      });
  }

  selectRequest(request: PendingReviewDto): void {
    console.log('📌 Request selected:', request);

    if (!request.requestId) {
      console.error('❌ Invalid request - no requestId');
      this.error = 'Invalid request. Please try another.';
      return;
    }

    this.selectedRequest = request;
    this.reviewForm.reset({ rating: 0, comment: '' });
    this.error = '';
    this.successMessage = '';
  }

  onRatingChange(rating: number): void {
    this.reviewForm.patchValue({ rating });
  }

  onSubmit(): void {
    console.log('📝 Form submission attempt');

    if (this.reviewForm.invalid) {
      console.warn('⚠️ Form is invalid');
      this.reviewForm.markAllAsTouched();
      return;
    }

    if (!this.selectedRequest) {
      console.error('❌ No request selected');
      this.error = 'Please select a request to review';
      return;
    }

    // Check token again before submission
    if (!this.tokenService.getToken() || this.tokenService.isTokenExpired()) {
      this.error = 'Session expired. Please login again.';
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 1500);
      return;
    }

    this.submitReview();
  }

  private submitReview(): void {
    if (!this.selectedRequest) return;

    this.submitting = true;
    this.error = '';
    this.successMessage = '';

    const createDto: CreateReviewDto = {
      requestId: this.selectedRequest.requestId,
      rating: this.reviewForm.value.rating,
      comment: this.reviewForm.value.comment.trim(),
    };

    console.log('📤 Submitting review:', createDto);

    this.reviewService
      .createReview(createDto)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('✅ Review submitted successfully:', response);
          this.submitting = false;
          this.successMessage = 'Review submitted successfully! 🎉';

          setTimeout(() => {
            this.router.navigate(['/reviews']);
          }, 1500);
        },
        error: (error) => {
          console.error('❌ Error submitting review:', error);
          this.submitting = false;

          if (error.status === 401 || error.status === 403) {
            this.error = 'Session expired. Please login again.';
            this.tokenService.clearToken();
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 1500);
          } else {
            let errorMessage = 'Failed to submit review. ';
            if (error.error?.message) {
              errorMessage += error.error.message;
            } else if (error.message) {
              errorMessage += error.message;
            } else {
              errorMessage += 'Please try again.';
            }
            this.error = errorMessage;
          }
        },
      });
  }

  get ratingControl() {
    return this.reviewForm.get('rating');
  }

  get commentControl() {
    return this.reviewForm.get('comment');
  }

  getCharacterCount(): number {
    return this.reviewForm.value.comment?.length || 0;
  }

  getRatingDescription(rating: number): string {
    const descriptions: { [key: number]: string } = {
      1: 'Poor',
      2: 'Fair',
      3: 'Good',
      4: 'Very Good',
      5: 'Excellent',
    };
    return descriptions[rating] || '';
  }

  formatDate(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
}
