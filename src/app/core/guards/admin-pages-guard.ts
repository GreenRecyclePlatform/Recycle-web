// src/app/core/guards/admin-pages-guard.ts

import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/authservice';
import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * Admin Pages Guard
 * Protects Admin Dashboard and Manage Materials pages
 * Requires both authentication AND admin role
 * Shows appropriate error messages for different user roles
 */
export const adminPagesGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);

  const token = authService.getToken();
  const isAuthenticated = authService.isAuthenticated;
  const isAdmin = authService.isAdmin();
  const userId = authService.getUserIdFromToken();
  const userRole = authService.getUserRole(); // Get user's current role

  console.log('🔐 Admin Pages Guard Check:', {
    hasToken: !!token,
    isAuthenticated,
    isAdmin,
    userId,
    userRole,
    requestedUrl: state.url
  });

  // Check 1: User must be authenticated
  if (!token || !isAuthenticated) {
    console.warn('⚠️ No token or not authenticated - redirecting to login');

    snackBar.open('Please login to access this page', 'Close', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });

    router.navigate(['/login'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  }

  // Check 2: User must have Admin role
  if (!isAdmin) {
    console.warn('⚠️ User is not an admin - access denied');

    // Get role name for display
    const roleDisplayName = getRoleDisplayName(userRole);

    // Show detailed error message based on user's current role
    snackBar.open(
      `Access Denied: You are logged in as ${roleDisplayName}. Only Admin users can access this page.`,
      'Close',
      {
        duration: 7000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['error-snackbar']
      }
    );

    // Redirect to appropriate dashboard based on role
    const redirectPath = getRedirectPathByRole(userRole);
    router.navigate([redirectPath]);

    return false;
  }

  console.log('✅ Admin access granted for:', state.url);
  return true;
};

/**
 * Get user-friendly role display name
 */
function getRoleDisplayName(role: string | null): string {
  if (!role) return 'Unknown User';

  const roleMap: { [key: string]: string } = {
    'Admin': 'Admin',
    'Supplier': 'Supplier',
    'Driver': 'Driver',
    'Individual': 'Individual User',
    'User': 'User'
  };

  return roleMap[role] || role;
}

/**
 * Get redirect path based on user role
 */
function getRedirectPathByRole(role: string | null): string {
  if (!role) return '/';

  const redirectMap: { [key: string]: string } = {
    'Supplier': '/supplier/dashboard',
    'Driver': '/driver/DashBoardDrivers',
    'Individual': '/',
    'User': '/'
  };

  return redirectMap[role] || '/';
}
