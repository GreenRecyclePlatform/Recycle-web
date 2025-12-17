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
import { BehaviorSubject, catchError, filter, Observable, switchMap, take, throwError } from 'rxjs';
import { Token } from '@angular/compiler';

let isRefreshing = false;
let refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const tokenService = inject(TokenService);
  const accessToken = tokenService.getToken();

  if (req.url.includes('/Users/Login') || req.url.includes('/Users/Register') || req.url.includes('/Users/Refresh')) {
    return next(req);
  }

  // if (accessToken) {
  //   const clonedRequest = addTokenToRequest(req, accessToken);
  //   return next(clonedRequest);
  // }

  const clonedRequest = accessToken? addTokenToRequest(req, accessToken):req;

  return next(clonedRequest).pipe(
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

  if(!isRefreshing){

  isRefreshing = true;
console.log('refreshtokendone');

  return authService.refresh().pipe(
    switchMap((loginResponse) => {
      isRefreshing = false;
      tokenService.setToken(loginResponse.accessToken);
      return next(addTokenToRequest(request, loginResponse.accessToken));
    }),
    catchError((error) => {
       isRefreshing = false;
      authService.logout();
      console.log(error);
      return throwError(() => error);
    })
  );
  }else{
    return refreshTokenSubject.pipe(
        filter(token => token !== null), // Wait until token is available
        take(1), // Take only the first emission
        switchMap(token => {
          // Retry request with new token
          return next(addTokenToRequest(request, token!));
        })
      );
  }

}
