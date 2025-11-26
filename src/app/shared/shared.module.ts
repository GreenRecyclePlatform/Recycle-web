import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StarRatingComponent } from './components/star-rating/star-rating.component';
import { NotificationBellComponent } from './components/notification-bell/notification-bell.component';
import { NotificationDropdownComponent } from './components/notification-dropdown/notification-dropdown.component';
import { NotificationItemComponent } from './components/notification-item/notification-item.component';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, StarRatingComponent, NotificationBellComponent, NotificationDropdownComponent, NotificationItemComponent],
  exports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, StarRatingComponent, NotificationBellComponent, NotificationDropdownComponent, NotificationItemComponent],
})
export class SharedModule {}
