import { Injectable } from '@angular/core';

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
}
