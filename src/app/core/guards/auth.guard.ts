import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthHelperService } from '../services/auth-helper.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authHelper = inject(AuthHelperService);
  const router = inject(Router);

  if (authHelper.isAuthenticated()) {
    return true;
  }

  localStorage.setItem('redirectUrl', state.url);
  router.navigate(['/login']);
  return false;
};
