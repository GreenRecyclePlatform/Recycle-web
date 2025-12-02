/*import { Injectable } from '@angular/core';

interface JwtPayload {
  sub: string; // userId
  name: string;
  nameidentifier: string;
  email: string;
  role: string;
  jti: string;
}

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  // private accessToken: string | null = null;

  setToken(token: string): void {
    //this.accessToken = token;
    sessionStorage.setItem('accesstoken', token);
  }
  getToken(): string | null {
    // return this.accessToken;
    return sessionStorage.getItem('accesstoken');
  }
  clearToken(): void {
    //this.accessToken = null;
    sessionStorage.removeItem('accesstoken');
  }
}*/
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
