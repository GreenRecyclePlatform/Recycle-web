// src/app/core/guards/auth-guard.ts

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/authservice';
import { TokenService } from '../services/tokenservice';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const tokenService = inject(TokenService);
  const router = inject(Router);

  const token = tokenService.getToken();
  const isAuthenticated = authService.isAuthenticated;

  console.log('Auth Guard Check:', {
    hasToken: !!token,
    isAuthenticated,
    token: token ? token.substring(0, 20) + '...' : 'none'
  });

  if (isAuthenticated && token) {
    return true;
  } else {
    console.log('Redirecting to login, returnUrl:', state.url);
    router.navigate(['/login'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  }
};