
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  sub: string; // userId
  user_name: string;
  email: string;
  role: string;
  exp: number;
}

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  decodeToken() {
    const token = this.getToken();

    if (!token) {
      return;
    }

    try {
      return jwtDecode<JwtPayload>(token);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  getRole(): string | any {
    const decoded = this.decodeToken();
    return decoded?.role || null;
  }

  isTokenExpired(): boolean {
    const decoded = this.decodeToken();

    if (!decoded || !decoded.exp) return true;
    const expirationDate = new Date(decoded.exp * 1000);
    const now = new Date();

    return expirationDate <= now;
  }

  getUserName(): string | any {
    const decoded = this.decodeToken();
    return decoded?.user_name || null;
  }

  getUserId(): string | any {
    const decoded = this.decodeToken();
    return decoded?.sub || null;
  }

  UserEmail(): string | null {
    const decoded = this.decodeToken();
    return decoded?.email || null;
  }
  
  setToken(token: string): void {
    sessionStorage.setItem('accesstoken', token);
  }

  getToken(): string | null {
    return sessionStorage.getItem('accesstoken');
  }
  clearToken(): void {
    sessionStorage.removeItem('accesstoken');
  }
}
