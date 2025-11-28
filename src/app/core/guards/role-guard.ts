import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/tokenservice';

export const roleGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  const requiredRoles = route.data['roles'] as string[];

  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  // Decode JWT to get user role
  const token = tokenService.getToken();
  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userRole = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || payload.role;

    if (userRole && requiredRoles.includes(userRole)) {
      return true;
    } else {
      router.navigate(['/unauthorized']);
      return false;
    }
  } catch (error) {
    router.navigate(['/login']);
    return false;
  }
};