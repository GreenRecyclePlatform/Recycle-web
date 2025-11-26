import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.css'],
})
export class StarRatingComponent implements OnInit {
  @Input() rating: number = 0;
  @Input() readonly: boolean = false;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Output() ratingChange = new EventEmitter<number>();

  stars: number[] = [1, 2, 3, 4, 5];
  hoverRating: number = 0;

  ngOnInit(): void {
    this.rating = Math.max(0, Math.min(5, this.rating));
  }

  onStarClick(star: number): void {
    if (!this.readonly) {
      this.rating = star;
      this.ratingChange.emit(this.rating);
    }
  }

  onStarHover(star: number): void {
    if (!this.readonly) {
      this.hoverRating = star;
    }
  }

  onStarLeave(): void {
    this.hoverRating = 0;
  }

  isStarFilled(star: number): boolean {
    return star <= (this.hoverRating || this.rating);
  }
}
