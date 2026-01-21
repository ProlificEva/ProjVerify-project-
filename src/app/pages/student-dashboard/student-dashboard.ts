import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth } from '../../services/auth';
import { ProposalService } from '../../services/proposal';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-dashboard.html',
  styleUrl: './student-dashboard.css',
})
export class StudentDashboard implements OnInit {
  private proposalService = inject(ProposalService);
  private authService = inject(Auth);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef); // Added to force UI updates on refresh

  currentUser: any;
  proposals: any[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  ngOnInit() {
    this.loadUserInfo();
    this.initializeDashboard();
  }

  private initializeDashboard() {
    // If we have a token, fetch immediately. 
    // If not, wait briefly (handles browser storage lag on refresh)
    const token = localStorage.getItem('token');
    if (token) {
      this.fetchUserProposals();
    } else {
      setTimeout(() => {
        if (localStorage.getItem('token')) {
          this.fetchUserProposals();
        } else {
          this.router.navigate(['/login']);
        }
      }, 300);
    }
  }

  loadUserInfo() {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.currentUser = {
          userId: payload.sub,
          name: payload.name || payload['cognito:username'] || 'Student',
          email: payload.email,
          department: payload['custom:department'] || 'Computer Engineering'
        };
      } catch (error) {
        console.error('Token Parse Error:', error);
      }
    }
  }

  fetchUserProposals() {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.proposalService.fetchUserProposals().subscribe({
      next: (res) => {
        console.log('Data received:', res);
        this.proposals = res;
        this.isLoading = false;
        
        // This ensures the table renders even if the data 
        // arrives during a heavy browser refresh cycle
        this.cdr.detectChanges(); 
        
        if (!res || res.length === 0) {
          this.errorMessage = 'No submissions found.';
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Fetch Error:', err);
        this.errorMessage = err.status === 401 
          ? 'Session expired. Please login again.' 
          : 'Database connection error.';
        this.cdr.detectChanges();
      }
    });
  }

  viewReport(proposal: any) {
    this.router.navigate(['/proposal-result'], {
      state: {
        proposal: {
          title: proposal.title,
          abstract: proposal.abstract,
          fileUrl: proposal.file_url
        },
        report: proposal.report_data || { status: 'Processed' }
      }
    });
  }

  downloadFile(url: string) {
    if (url) window.open(url, '_blank');
  }

  logout() {
    if (confirm('Logout?')) this.authService.logout();
  }

  newProposal() {
    this.router.navigate(['/new-proposal']);
  }
}