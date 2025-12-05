import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/authservice';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { Token } from '@angular/compiler';
import { TokenService } from '../services/tokenservice';
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const tokenService = inject(TokenService);
  const accessToken = tokenService.getToken();

  if (req.url.includes('/Users/Login') || req.url.includes('/Users/Register')) {
    return next(req);
  }

  if (accessToken) {
    const clonedRequest = addTokenToRequest(req, accessToken);
    return next(clonedRequest);
  }

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
      tokenService.setToken(loginResponse.accessToken);
      return next(addTokenToRequest(request, loginResponse.accessToken));
    }),
    catchError((error) => {
      authService.logout();
      return throwError(() => error);
    })
  );
}
