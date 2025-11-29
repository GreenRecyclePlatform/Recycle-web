<<<<<<< HEAD
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/authservice';
=======
// src/app/core/guards/auth-guard.ts
>>>>>>> ce94709efc85b0518af3bcdedc7e8db3ceee9471

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/authservice';
import { TokenService } from '../services/tokenservice';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const tokenService = inject(TokenService);
  const router = inject(Router);

<<<<<<< HEAD
  if (authService.isAuthenticated) {
    return true;
  }
=======
  const token = tokenService.getToken();
  const isAuthenticated = authService.isAuthenticated;
>>>>>>> ce94709efc85b0518af3bcdedc7e8db3ceee9471

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
