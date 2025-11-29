import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

interface DecodedToken {
  sub?: string;
  nameid?: string;
  unique_name?: string;
  email?: string;
  role?: string;
  exp?: number;
  iat?: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthHelperService {
  constructor(private router: Router) {}

  /**
   * Decode JWT token without verification
   */
  decodeToken(token: string): DecodedToken | null {
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload);
      return JSON.parse(decoded);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  /**
   * Check if token is expired
   */
  isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) return true;

    const expirationDate = new Date(decoded.exp * 1000);
    return expirationDate < new Date();
  }

  /**
   * Get current user ID from token
   */
  getUserIdFromToken(): string | null {
    const token = localStorage.getItem('authToken');
    if (!token) return null;

    const decoded = this.decodeToken(token);
    return decoded?.nameid || decoded?.sub || null;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem('authToken');
    if (!token) return false;

    return !this.isTokenExpired(token);
  }

  /**
   * Get the current auth token
   */
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  /**
   * Validate token and redirect if invalid
   */
  // validateTokenOrRedirect(): boolean {
  //   if (!this.isAuthenticated()) {
  //     console.warn('Token is invalid or expired. Redirecting to login...');
  //     this.logout();
  //     return false;
  //   }
  //   return true;
  // }
}
