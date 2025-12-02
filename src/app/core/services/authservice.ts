
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
    // ✅ تحميل الـ role من الـ token عند البداية
    const role = this.tokenService.getRole();
    if (role) {
      this.userRoleSubject.next(role);
    }
  }

  private readonly apiUrl = environment.apiUrl;

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private userRoleSubject = new BehaviorSubject<string | null>(null);

  public isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();
  public userRole$: Observable<string | null> = this.userRoleSubject.asObservable();

  get userRole(): string | null {
    return this.userRoleSubject.value;
  }

  setUserRole(role: string | any): void {
    this.userRoleSubject.next(role);
  }

  get isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  setAuthenticated(value: boolean): void {
    this.isAuthenticatedSubject.next(value);
  }

  hasToken(): boolean {
    return !!this.tokenService.getToken();
  }

  getUserName(): string | null {
    return this.tokenService.getUserName();
  }

  getUserId(): string | null {
    return this.tokenService.getUserId();
  }

  getToken(): string | null {
    const token = this.tokenService.getToken();
    console.log('🔐 AuthService.getToken:', token ? 'EXISTS ✅' : 'MISSING ❌');
    return token;
  }

  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;
    return !this.tokenService.isTokenExpired();
  }

  // ✅ NEW METHODS للـ Roles والـ User Info
  
  getUserRole(): string | null {
    return this.tokenService.getRole();
  }

  getUserIdFromToken(): string | null {
    return this.tokenService.getUserId();
  }

  getUserEmail(): string | null {
    const decoded = this.tokenService.decodeToken();
    return decoded?.email || null;
  }

  hasRole(role: string): boolean {
    const userRole = this.getUserRole();
    if (!userRole) return false;
    return userRole.toLowerCase() === role.toLowerCase();
  }

  isAdmin(): boolean {
    return this.hasRole('Admin');
  }

  isDriver(): boolean {
    return this.hasRole('Driver');
  }

  isUser(): boolean {
    return this.hasRole('User');
  }

  private handleAuthSuccess(authResponse: LoginResponse): void {
    this.tokenService.setToken(authResponse.accessToken);
    const role = this.tokenService.getRole();

    this.setAuthenticated(true);
    this.setUserRole(role);

    console.log('✅ Auth success - Token stored');
    console.log('✅ User Role:', role);
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

  refresh(): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(
        `${this.apiUrl}${API_ENDPOINTS.AUTH.REFRESH}`,
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
          this.setUserRole(null);
          console.log('✅ Logout successful');
        },
        error: (error) => {
          console.error('❌ Logout error:', error);
          this.tokenService.clearToken();
          this.setUserRole(null);
          this.setAuthenticated(false);
        },
      });
  }
}