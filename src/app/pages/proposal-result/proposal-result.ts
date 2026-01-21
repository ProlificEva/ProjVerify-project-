import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-proposal-result',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './proposal-result.html',
  styleUrl: './proposal-result.css',
})
export class ProposalResult implements OnInit {
  private router = inject(Router);
  private http = inject(HttpClient);
  
  proposalData: any;
  reportData: any;
  currentUser: any;
  isLoading: boolean = true;

  ngOnInit() {
    this.loadUserInfo();
    const state = window.history.state;
    
    if (state && state.report) {
      this.proposalData = state.proposal;
      this.reportData = state.report; 
      this.isLoading = false;
    } else {
      // Fallback: Fetch the most recent submission if user refreshes the page
      this.fetchLatestResult();
    }
  }

  loadUserInfo() {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.currentUser = {
          name: payload.name || payload['cognito:username'],
          email: payload.email,
          department: payload['custom:department'] || 'Not Specified'
        };
      } catch (e) {
        console.error('Error decoding token', e);
      }
    }
  }

  fetchLatestResult() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // Hits your /my-submissions endpoint and takes the first one
    this.http.get<any[]>('http://localhost:3000/api/proposals/my-submissions', { headers })
      .subscribe({
        next: (response: any[]) => {
          if (response.length > 0) {
            this.proposalData = response[0];
            this.reportData = response[0].report_data || { status: 'Pending', originalityScore: 'N/A' };
          }
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Failed to fetch', err);
          this.isLoading = false;
        }
      });
  }

  getGaugeRotation() {
    const scoreStr = this.reportData?.originalityScore || '0';
    const scoreValue = parseFloat(scoreStr); 
    // Converts 0-100% to a 0.5 turn semi-circle
    return `rotate(${(scoreValue / 100) * 0.5}turn)`;
  }

  getStatusColor() {
    const status = this.reportData?.status || '';
    if (status.includes('High')) return '#e74c3c'; // Red
    if (status.includes('Moderate')) return '#f1c40f'; // Yellow
    return '#27ae60'; // Green
  }

  dashboard() {
    this.router.navigate(['/student-dashboard']);
  }
}