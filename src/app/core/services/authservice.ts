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
import { ForgotPasswordPage } from '../../features/auth/forgot-password/forgot-password';
import { ResetPassword } from '../../features/auth/reset-password/reset-password';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private tokenService: TokenService) {
    this.isAuthenticatedSubject.next(this.hasToken());
  }

  private readonly apiUrl = environment.apiUrl;

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  // private userRoleSubject = new BehaviorSubject<UserRole>('user');
  // private userSubject = new BehaviorSubject<User | null>(null);

  public isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();
  // public userRole$: Observable<UserRole> = this.userRoleSubject.asObservable();
  // public user$: Observable<User | null> = this.userSubject.asObservable();

  get isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }
  setAuthenticated(value: boolean): void {
    this.isAuthenticatedSubject.next(value);
  }

  hasToken(): boolean {
    return !!this.tokenService.getToken();
  }

  // get userRole(): UserRole {
  //   return this.userRoleSubject.value;
  // }

  // get user(): User | null {
  //   return this.userSubject.value;
  // }

  private handleAuthSuccess(authResponse: LoginResponse): void {
    // Handle successful authentication (e.g., store tokens, update state)
    this.tokenService.setToken(authResponse.token); //// ✅ abdo fix ==> Changed from accessToken to token
    this.setAuthenticated(true);
  }

  private handleAuthError(error: any): Observable<never> {
    // Handle authentication errors (e.g., log error, show notification)
    return throwError(() => error);
  }

  resetpassword(reset: ResetPasswordRequest): Observable<ResetPasswordResponse> {
    return this.http
      .post<ResetPasswordResponse>(`${this.apiUrl}${API_ENDPOINTS.AUTH.RESETPASSWORD}`, reset)
      .pipe(
        tap((response) => console.log(response.message)),
        catchError((error) => this.handleAuthError(error))
      );
  }

  forgotpassword(forgot: ForgotRequest): Observable<ForgotResponse> {
    return this.http
      .post<ForgotResponse>(`${this.apiUrl}${API_ENDPOINTS.AUTH.FORGOTPASSWORD}`, forgot)
      .pipe(
        tap((response) => console.log(response.message)),
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
        tap((response) => console.log('Registration successful:', response)),
        catchError((error) => this.handleAuthError(error))
      );
  }

  // src/app/core/services/authservice.ts

  refresh(): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(
        `${this.apiUrl}${API_ENDPOINTS.AUTH.REFRESH}`,  //abdo-fix ==>changed from auth.register to auth.refresh
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
          console.log('logout successful');
        },
        error: (error) => console.error('logout error', error),
      });
  }

  // setUserRole(role: UserRole): void {
  //   this.userRoleSubject.next(role);
  // }
}
