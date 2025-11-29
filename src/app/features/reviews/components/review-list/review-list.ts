import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router'; // Import RouterLink directive
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ReviewService, Review, UpdateReviewDto } from '../../../../core/services/review.service';
import { Navbar } from '../../../../shared/components/navbar/navbar';
import { LucideAngularModule } from "lucide-angular";

@Component({
  selector: 'app-review-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink, // Use RouterLink instead of RouterModule
    Navbar,
    LucideAngularModule
],
  templateUrl: './review-list.html',
  styleUrls: ['./review-list.css'],
})
export class ReviewListComponent implements OnInit, OnDestroy {
  reviews: Review[] = [];
  loading: boolean = false;
  error: string = '';
  successMessage: string = '';
  private destroy$ = new Subject<void>();

  editingReviewId: string | null = null;
  editForm: FormGroup;
  updating: boolean = false;

  private router = inject(Router);
  private fb = inject(FormBuilder);
  private reviewService = inject(ReviewService);

  constructor() {
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

  startEdit(review: Review): void {
    this.editingReviewId = review.reviewId;
    this.editForm.patchValue({
      rating: review.rating,
      comment: review.comment,
    });
    this.error = '';
    this.successMessage = '';
  }

  cancelEdit(): void {
    this.editingReviewId = null;
    this.editForm.reset();
    this.error = '';
  }

  isEditing(reviewId: string): boolean {
    return this.editingReviewId === reviewId;
  }

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

  onDeleteReview(reviewId: string): void {
    if (!confirm('Are you sure you want to delete this review?')) {
      return;
    }

    this.reviewService
      .deleteReview(reviewId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
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

  navigateToAddReview(): void {
    this.router.navigate(['/reviews/add']);
  }

  formatDate(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  getStarArray(rating: number): boolean[] {
    return Array(5)
      .fill(false)
      .map((_, index) => index < rating);
  }

  onRatingChange(rating: number): void {
    this.editForm.patchValue({ rating });
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

  getCharacterCount(): number {
    return this.editForm.value.comment?.length || 0;
  }

  get ratingControl() {
    return this.editForm.get('rating');
  }

  get commentControl() {
    return this.editForm.get('comment');
  }
}
