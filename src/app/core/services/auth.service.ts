import { Injectable, signal } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { map } from 'rxjs/operators';
import { User, UserRole, AuthResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSignal = signal<User | null>(null);
  private tokenKey = 'recyclehub_token';

  currentUser = this.currentUserSignal.asReadonly();

  constructor() {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const token = localStorage.getItem(this.tokenKey);
    const userStr = localStorage.getItem('recyclehub_user');

    if (token && userStr) {
      try {
        const user: User = JSON.parse(userStr);
        this.currentUserSignal.set(user);
      } catch (error) {
        this.logout();
      }
    }
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return of({
      user: {
        id: '1',
        name: 'Admin User',
        email: email,
        role: email.includes('admin') ? UserRole.ADMIN : UserRole.USER,
        createdAt: new Date()
      },
      token: 'mock-jwt-token-' + Date.now()
    }).pipe(
      delay(1000),
      map(response => {
        this.currentUserSignal.set(response.user);
        localStorage.setItem(this.tokenKey, response.token);
        localStorage.setItem('recyclehub_user', JSON.stringify(response.user));
        return response;
      })
    );
  }

  register(userData: { name: string; email: string; password: string }): Observable<AuthResponse> {
    return this.login(userData.email, userData.password);
  }

  logout(): void {
    this.currentUserSignal.set(null);
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('recyclehub_user');
  }

  isAuthenticated(): boolean {
    return this.currentUserSignal() !== null;
  }

  hasRole(role: UserRole): boolean {
    return true;
  }

  isAdmin(): boolean {
    return true;
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
}
