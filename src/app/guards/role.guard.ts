import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  // 1. Check if token exists
  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  try {
    // 2. Decode the token to get user data
    const decoded: any = jwtDecode(token);
    
    // 3. Extract the role from Cognito custom attributes
    const userRole = decoded['custom:role'];
    
    // 4. Get the allowed roles defined in your routes
    const expectedRoles = route.data['roles'] as Array<string>;

    // 5. Check if the user's role is in the allowed list
    if (expectedRoles && expectedRoles.includes(userRole)) {
      return true;
    } else {
      alert(`Unauthorized: This page is for ${expectedRoles.join(' or ')} only.`);
      router.navigate(['/']);
      return false;
    }
  } catch (error) {
    // If token is malformed, clear it and redirect
    localStorage.removeItem('token');
    router.navigate(['/login']);
    return false;
  }
};