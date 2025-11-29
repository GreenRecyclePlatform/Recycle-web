import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { User, UserRole } from '../models/usermodel';
import {
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  RegisterResponse,
  ForgotRequest,
  ForgotResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from '../models/auth-response';
import { HttpClient } from '@angular/common/http';
import { TokenService } from './tokenservice';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../constants/api-endpoints';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private tokenService: TokenService) {
    this.isAuthenticatedSubject.next(this.hasToken());
  }

  private readonly apiUrl = environment.apiUrl;

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  public isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();

  get isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  setAuthenticated(value: boolean): void {
    this.isAuthenticatedSubject.next(value);
  }

  hasToken(): boolean {
    return !!this.tokenService.getToken();
  }

  // ✅ ADD THIS METHOD - Expose getToken from TokenService
  getToken(): string | null {
    const token = this.tokenService.getToken();
    console.log('🔐 AuthService.getToken:', token ? 'EXISTS ✅' : 'MISSING ❌');
    return token;
  }

  // ✅ ADD THIS METHOD - Check if token is valid and not expired
  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000;
      const isValid = Date.now() < expiry;
      console.log('🔐 Token valid:', isValid);
      return isValid;
    } catch (error) {
      console.error('❌ Invalid token format:', error);
      return false;
    }
  }

  private handleAuthSuccess(authResponse: LoginResponse): void {
    // Handle successful authentication (e.g., store tokens, update state)
    this.tokenService.setToken(authResponse.accessToken); 
    this.setAuthenticated(true);
    console.log('✅ Auth success - Token stored');
  }

  private handleAuthError(error: any): Observable<never> {
    console.error('❌ Auth error:', error);
    return throwError(() => error);
  }

  resetpassword(reset: ResetPasswordRequest): Observable<ResetPasswordResponse> {
    return this.http
      .post<ResetPasswordResponse>(`${this.apiUrl}${API_ENDPOINTS.AUTH.RESETPASSWORD}`, reset)
      .pipe(
        tap((response) => console.log('✅ Password reset:', response.message)),
        catchError((error) => this.handleAuthError(error))
      );
  }

  forgotpassword(forgot: ForgotRequest): Observable<ForgotResponse> {
    return this.http
      .post<ForgotResponse>(`${this.apiUrl}${API_ENDPOINTS.AUTH.FORGOTPASSWORD}`, forgot)
      .pipe(
        tap((response) => console.log('✅ Forgot password:', response.message)),
        catchError((error) => this.handleAuthError(error))
      );
  }

  login(LoginRequest: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}${API_ENDPOINTS.AUTH.LOGIN}`, LoginRequest, {
        withCredentials: true,
      })
      .pipe(
        tap((authResponse) => this.handleAuthSuccess(authResponse)),
        catchError((error) => this.handleAuthError(error))
      );
  }

  register(RegisterRequest: RegisterRequest): Observable<RegisterResponse> {
    return this.http
      .post<RegisterResponse>(`${this.apiUrl}${API_ENDPOINTS.AUTH.REGISTER}`, RegisterRequest, {
        withCredentials: true,
      })
      .pipe(
        tap((response) => console.log('✅ Registration successful:', response)),
        catchError((error) => this.handleAuthError(error))
      );
  }

  // src/app/core/services/authservice.ts

  refresh(): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(
        `${this.apiUrl}${API_ENDPOINTS.AUTH.REFRESH}`, // ✅ Fixed from REGISTER to REFRESH
        {},
        {
          withCredentials: true,
        }
      )
      .pipe(
        tap((LoginResponse) => this.handleAuthSuccess(LoginResponse)),
        catchError((error) => this.handleAuthError(error))
      );
  }

  logout(): void {
    console.log('🚪 Logging out...');
    this.http
      .post(
        `${this.apiUrl}${API_ENDPOINTS.AUTH.LOGOUT}`,
        {},
        {
          withCredentials: true,
        }
      )
      .subscribe({
        next: () => {
          this.tokenService.clearToken();
          this.setAuthenticated(false);
          console.log('✅ Logout successful');
        },
        error: (error) => {
          console.error('❌ Logout error:', error);
          // Clear token anyway on error
          this.tokenService.clearToken();
          this.setAuthenticated(false);
        },
      });
  }
}
