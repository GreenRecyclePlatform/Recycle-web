// core/services/profile.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment.prod';

export interface AddressDto {
  id: string;
  street: string;
  city: string;
  governorate: string;
  postalCode: string;
}

// ✅ Updated - Removed impactScore
export interface ProfileStatsDto {
  totalRequests: number;
  completedPickups: number;
  totalEarnings: number;
  // ❌ Removed impactScore
}

export interface NotificationPreferencesDto {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pickupReminders: boolean;
  marketingEmails: boolean;
}

export interface UserProfileDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: Date;
  createdAt: Date;
  primaryAddress: AddressDto | null;
  stats: ProfileStatsDto;
  notificationPreferences: NotificationPreferencesDto;
}

export interface UpdateProfileDto {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth: Date;
}

export interface UpdateAddressDto {
  street: string;
  city: string;
  governorate: string;
  postalCode: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private apiUrl = `${environment.apiUrl}/Profile`;

  private profileSubject = new BehaviorSubject<UserProfileDto | null>(null);
  public profile$ = this.profileSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {}

  getProfile(): Observable<UserProfileDto> {
    this.loadingSubject.next(true);

    return this.http.get<UserProfileDto>(this.apiUrl).pipe(
      tap((profile) => {
        this.profileSubject.next(profile);
        this.loadingSubject.next(false);
        console.log('✅ Profile loaded:', profile);
      }),
      catchError((error) => {
        this.loadingSubject.next(false);
        console.error('❌ Error fetching profile:', error);
        return throwError(() => error);
      })
    );
  }

  updateProfile(dto: UpdateProfileDto): Observable<UserProfileDto> {
    this.loadingSubject.next(true);

    return this.http.put<UserProfileDto>(this.apiUrl, dto).pipe(
      tap((updatedProfile) => {
        this.profileSubject.next(updatedProfile);
        this.loadingSubject.next(false);
        console.log('✅ Profile updated:', updatedProfile);
      }),
      catchError((error) => {
        this.loadingSubject.next(false);
        console.error('❌ Error updating profile:', error);
        return throwError(() => error);
      })
    );
  }

  updateAddress(dto: UpdateAddressDto): Observable<AddressDto> {
    return this.http.put<AddressDto>(`${this.apiUrl}/address`, dto).pipe(
      tap((updatedAddress) => {
        const currentProfile = this.profileSubject.value;
        if (currentProfile) {
          this.profileSubject.next({
            ...currentProfile,
            primaryAddress: updatedAddress,
          });
        }
        console.log('✅ Address updated:', updatedAddress);
      }),
      catchError((error) => {
        console.error('❌ Error updating address:', error);
        return throwError(() => error);
      })
    );
  }

  updateNotificationPreferences(
    dto: NotificationPreferencesDto
  ): Observable<NotificationPreferencesDto> {
    return this.http.put<NotificationPreferencesDto>(`${this.apiUrl}/notifications`, dto).pipe(
      tap((updatedPreferences) => {
        const currentProfile = this.profileSubject.value;
        if (currentProfile) {
          this.profileSubject.next({
            ...currentProfile,
            notificationPreferences: updatedPreferences,
          });
        }
        console.log('✅ Notification preferences updated:', updatedPreferences);
      }),
      catchError((error) => {
        console.error('❌ Error updating notification preferences:', error);
        return throwError(() => error);
      })
    );
  }

  clearProfile(): void {
    this.profileSubject.next(null);
  }
}
