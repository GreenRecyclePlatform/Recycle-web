// review-list.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ReviewService, Review, UpdateReviewDto } from '../../../../core/services/review.service';
import { SharedModule } from '../../../../shared/shared.module';

@Component({
  selector: 'app-review-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, SharedModule],
  templateUrl: './review-list.html',
  styleUrls: ['./review-list.css'],
})
export class ReviewListComponent implements OnInit, OnDestroy {
  reviews: Review[] = [];
  loading: boolean = false;
  error: string = '';
  successMessage: string = '';
  private destroy$ = new Subject<void>();

  // Edit mode
  editingReviewId: string | null = null;
  editForm: FormGroup;
  updating: boolean = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private reviewService: ReviewService
  ) {
    this.editForm = this.fb.group({
      rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
    });
  }

  ngOnInit(): void {
    this.loadReviews();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load reviews from backend
   */
  loadReviews(): void {
    this.loading = true;
    this.error = '';

    this.reviewService
      .getMyReviews()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (reviews) => {
          this.reviews = reviews;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading reviews:', error);
          this.error = error.error?.message || 'Failed to load reviews. Please try again.';
          this.loading = false;
        },
      });
  }

  /**
   * Start editing a review
   */
  startEdit(review: Review): void {
    this.editingReviewId = review.reviewId;
    this.editForm.patchValue({
      rating: review.rating,
      comment: review.comment,
    });
    this.error = '';
    this.successMessage = '';
  }

  /**
   * Cancel editing
   */
  cancelEdit(): void {
    this.editingReviewId = null;
    this.editForm.reset();
    this.error = '';
  }

  /**
   * Check if a review is being edited
   */
  isEditing(reviewId: string): boolean {
    return this.editingReviewId === reviewId;
  }

  /**
   * Update a review via backend API
   */
  onUpdateReview(reviewId: string): void {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    this.updating = true;
    this.error = '';
    this.successMessage = '';

    const updateDto: UpdateReviewDto = {
      rating: this.editForm.value.rating,
      comment: this.editForm.value.comment.trim(),
    };

    this.reviewService
      .updateReview(reviewId, updateDto)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedReview) => {
          // Update the review in the local array
          const index = this.reviews.findIndex((r) => r.reviewId === reviewId);
          if (index !== -1) {
            this.reviews[index] = updatedReview;
          }

          this.successMessage = 'Review updated successfully! ✅';
          this.updating = false;
          this.cancelEdit();

          setTimeout(() => (this.successMessage = ''), 3000);
        },
        error: (error) => {
          console.error('Error updating review:', error);
          this.error = error.error?.message || 'Failed to update review. Please try again.';
          this.updating = false;
        },
      });
  }

  /**
   * Delete a review via backend API
   */
  onDeleteReview(reviewId: string): void {
    if (!confirm('Are you sure you want to delete this review?')) {
      return;
    }

    this.reviewService
      .deleteReview(reviewId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          // Remove from local array
          this.reviews = this.reviews.filter((r) => r.reviewId !== reviewId);
          this.successMessage = 'Review deleted successfully! 🗑️';
          setTimeout(() => (this.successMessage = ''), 3000);
        },
        error: (error) => {
          console.error('Error deleting review:', error);
          this.error = error.error?.message || 'Failed to delete review. Please try again.';
        },
      });
  }

  /**
   * Navigate to add review page
   */
  navigateToAddReview(): void {
    this.router.navigate(['/reviews/add']);
  }

  /**
   * Format date for display
   */
  formatDate(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  /**
   * Get star array for rating display
   */
  getStarArray(rating: number): boolean[] {
    return Array(5)
      .fill(false)
      .map((_, index) => index < rating);
  }

  /**
   * Handle rating change in edit mode
   */
  onRatingChange(rating: number): void {
    this.editForm.patchValue({ rating });
  }

  /**
   * Get rating description
   */
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

  /**
   * Get character count for comment
   */
  getCharacterCount(): number {
    return this.editForm.value.comment?.length || 0;
  }

  /**
   * Get form control
   */
  get ratingControl() {
    return this.editForm.get('rating');
  }

  get commentControl() {
    return this.editForm.get('comment');
  }
}
