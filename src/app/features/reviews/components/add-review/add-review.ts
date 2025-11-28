// ============================================
// SOLUTION: Remove RouterModule from imports
// Use RouterLink directive instead
// ============================================

// add-review.component.ts
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router'; // Import RouterLink directive
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  ReviewService,
  PendingReviewDto,
  CreateReviewDto,
} from '../../../../core/services/review.service';
import { CommonModule } from '@angular/common';
import { Navbar } from '../../../../shared/components/navbar/navbar';
import { LucideAngularModule } from "lucide-angular";

@Component({
  selector: 'app-add-review',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink, // Use RouterLink instead of RouterModule
    Navbar,
    LucideAngularModule
],
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
    this.loadPendingReviews();
  }

  loadPendingReviews(): void {
    this.loading = true;
    this.error = '';

    this.reviewService
      .getPendingReviews()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (reviews) => {
          this.pendingReviews = reviews;
          this.loading = false;

          if (reviews.length === 1) {
            this.selectRequest(reviews[0]);
          }
        },
        error: (error) => {
          console.error('Error loading pending reviews:', error);
          this.error = error.error?.message || 'Failed to load pending reviews. Please try again.';
          this.loading = false;
        },
      });
  }

  selectRequest(request: PendingReviewDto): void {
    this.selectedRequest = request;
    this.reviewForm.reset({ rating: 0, comment: '' });
    this.error = '';
    this.successMessage = '';
  }

  onRatingChange(rating: number): void {
    this.reviewForm.patchValue({ rating });
  }

  onSubmit(): void {
    if (this.reviewForm.invalid || !this.selectedRequest) {
      this.reviewForm.markAllAsTouched();
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
      driverId: this.selectedRequest.driverId,
      rating: this.reviewForm.value.rating,
      comment: this.reviewForm.value.comment.trim(),
    };

    this.reviewService
      .createReview(createDto)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.submitting = false;
          this.successMessage = 'Review submitted successfully! 🎉';

          setTimeout(() => {
            this.router.navigate(['/reviews']);
          }, 2000);
        },
        error: (error) => {
          console.error('Error submitting review:', error);
          this.submitting = false;
          this.error = error.error?.message || 'Failed to submit review. Please try again.';
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
