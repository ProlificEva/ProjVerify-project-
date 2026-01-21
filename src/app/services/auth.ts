import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private router = inject(Router);
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/auth';

  register(userData: any) {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  login(credentials: any) {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  } 

  confirm(confirmData: { email: string, code: string }) {
    return this.http.post(`${this.apiUrl}/confirm`, confirmData);
  }

  // Helper methods for your Guards and UI

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    
    // 2. Clear any other session-specific data
    sessionStorage.clear();

    // 3. Redirect to login page
    this.router.navigate(['/login']);
  }
}