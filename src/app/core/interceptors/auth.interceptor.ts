
import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // For now, just pass requests through without auth
  // You can add common headers here if needed

  const clonedRequest = req.clone({
    setHeaders: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });

  return next(clonedRequest);
};
// with auth logic
/*import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  // Get token from localStorage (optional for now)
  const token = localStorage.getItem('access_token');

  // Clone request and add headers
  let clonedRequest = req.clone({
    setHeaders: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });

  // Add auth header only if token exists
  if (token) {
    clonedRequest = clonedRequest.clone({
      setHeaders: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  return next(clonedRequest).pipe(
    catchError((error) => {
      // Log error for debugging
      console.error('HTTP Error:', error);

      // Handle 401 Unauthorized (when you enable auth later)
      if (error.status === 401 && token) {
        localStorage.removeItem('access_token');
        router.navigate(['/login']);
      }

      return throwError(() => error);
    })
  );
};*/
