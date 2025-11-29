import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/authservice';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated) {
    return true;
  }

  // If not authenticated, redirect to login
  if (!authService.isAuthenticated) {
    router.navigate(['/login']);
  } else {
    // If authenticated but not admin, redirect to home
    router.navigate(['/']);
  }

  return false;
};
