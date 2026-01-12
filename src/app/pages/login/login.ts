import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';
import { FormsModule } from '@angular/forms';
import { jwtDecode } from 'jwt-decode'; // Install this: npm install jwt-decode

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  router = inject(Router);
  authService = inject(Auth);

  loginData = { email: '', password: '' };

  handleLogin() {
    this.authService.login(this.loginData).subscribe({
      next: (res: any) => {
        // 1. Store the token from your successful backend test
        localStorage.setItem('token', res.token); 

        // 2. Decode the token to check the role
        const decoded: any = jwtDecode(res.token);
        const role = decoded['custom:role']; 

        alert(`Login Successful! Welcome, ${role}`);

        // 3. Redirect based on the specific ProjVerify role
        if (role === 'student') {
          this.router.navigate(['/new-proposal']);
        } else if (role === 'faculty') {
          this.router.navigate(['/proposal-history']);
        } else {
          this.router.navigate(['/']); // Fallback for admins or others
        }
      },
      error: (err) => {
        console.error(err);
        alert("Login failed: " + (err.error?.error || "Invalid credentials"));
      }
    });
  }

  registerPage() { 
    this.router.navigate(['/register']); 
  }
}