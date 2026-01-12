import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true, // Recommended for Angular 17+
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  router = inject(Router);
  authService = inject(Auth);

  page = 'step1';
  confirmationCode = ''; // For the 6-digit AWS code
  
  user = { 
    name: '', 
    email: '', 
    role: '', 
    department: '', 
    password: '', 
    confirm: '' 
  };

  changeTab(currentPage: string) {
    this.page = currentPage;
  }

  loginPage() {
    this.router.navigate(['/login']);
  }

  // Phase 1: Registration
  handleRegister() {
    if (this.user.password !== this.user.confirm) {
      return alert("Passwords do not match!");
    }

    this.authService.register(this.user).subscribe({
      next: (res: any) => {
        alert("Registration successful! Please check your email for the code.");
        this.page = 'step3'; // Move to confirmation step
      },
      error: (err) => alert("Registration failed: " + (err.error.error || "Unknown error"))
    });
  }

  // Phase 2: Confirming the 6-digit code
  handleConfirm() {
    if (!this.confirmationCode) return alert("Please enter the verification code.");

    const confirmData = {
      email: this.user.email,
      code: this.confirmationCode
    };

    // Assuming you added a confirm method to your Auth service
    this.authService.confirm(confirmData).subscribe({
      next: (res: any) => {
        alert("Account verified! You can now log in.");
        this.loginPage();
      },
      error: (err) => alert("Verification failed: " + (err.error.error || "Invalid code"))
    });
  }
}