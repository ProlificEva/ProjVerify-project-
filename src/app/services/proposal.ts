import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProposalService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/proposals';

  /**
   * Generates headers with the current Bearer token from localStorage
   */
  private getAuthHeaders() {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  /**
   * GET: Fetches all proposals for the logged-in student
   */
  fetchUserProposals() {
    return this.http.get<any[]>(`${this.apiUrl}/my-submissions`, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * POST: Uploads a new proposal document and metadata
   */
  submitProposal(formData: FormData) {
    return this.http.post(`${this.apiUrl}/submit`, formData, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * POST: Triggers AI validation for a specific abstract
   */
  getValidationReport(abstract: string) {
    return this.http.post<any>(`${this.apiUrl}/validate`, { abstract }, {
      headers: this.getAuthHeaders()
    });
  }
}