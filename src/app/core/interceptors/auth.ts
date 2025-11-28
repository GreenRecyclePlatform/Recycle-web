
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../services/tokenservice';
import { AuthService } from '../services/authservice';
import { catchError, Observable, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const tokenService = inject(TokenService);
  const accessToken = tokenService.getToken();

  // Don't add token to login/register requests
  if (req.url.includes('/Users/Login') || req.url.includes('/Users/Register')) {
    return next(req);
  }

  // Add token if it exists
  if (accessToken) {
    const clonedRequest = addTokenToRequest(req, accessToken);
    return next(clonedRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return handle401Error(req, next, tokenService, authService);
        }
        return throwError(() => error);
      })
    );
  }

  // No token, just continue
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        return handle401Error(req, next, tokenService, authService);
      }
      return throwError(() => error);
    })
  );
};

function addTokenToRequest(request: any, accessToken: string) {
  return request.clone({
    setHeaders: {
      Authorization: `Bearer ${accessToken}`,
    },
    withCredentials: true,
  });
}

function handle401Error(
  request: HttpRequest<any>,
  next: any,
  tokenService: TokenService,
  authService: AuthService
): Observable<any> {
  return authService.refresh().pipe(
    switchMap((loginResponse) => {
      tokenService.setToken(loginResponse.token); // ✅ Changed from accessToken to token
      return next(addTokenToRequest(request, loginResponse.token));
    }),
    catchError((error) => {
      authService.logout();
      return throwError(() => error);
    })
  );
}