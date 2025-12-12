import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  router = inject(Router);

  loginPage() {
    this.router.navigate(['/login']);
  }

  // login to change forms
  page = 'step1'
  changeTab(currentPage: string) {
    this.page = currentPage
  }
}
