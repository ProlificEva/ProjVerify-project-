import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProposalService } from '../../services/proposal';

@Component({
  selector: 'app-proposal-submission',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './proposal-submission.html',
  styleUrl: './proposal-submission.css',
})
export class ProposalSubmission {
  private proposalService = inject(ProposalService);
  private router = inject(Router);

  projectTitle: string = '';
  abstract: string = '';
  selectedFile: File | null = null;
  fileName: string = 'No file chosen';
  isSubmitting: boolean = false;

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.fileName = file.name;
    }
  }

  onSubmit() {
    if (!this.selectedFile || !this.projectTitle || !this.abstract) {
      alert('Please fill in all fields.');
      return;
    }

    this.isSubmitting = true;
    const formData = new FormData();
    formData.append('title', this.projectTitle);
    formData.append('abstract', this.abstract);
    formData.append('document', this.selectedFile);

    // 1. Submit to Backend (Uploads to S3 & Stores in RDS)
    this.proposalService.submitProposal(formData).subscribe({
      next: (res) => {
        // 2. Trigger AI Validation for the report
        this.proposalService.getValidationReport(this.abstract).subscribe({
          next: (reportRes) => {
            this.router.navigate(['/proposal-result'], { 
              state: { 
                proposal: { title: this.projectTitle, abstract: this.abstract },
                report: reportRes.report 
              } 
            });
          },
          error: (err) => {
            alert('AI Validation failed!');
            this.isSubmitting = false;
          }
        });
      },
      error: (err) => {
        alert('Submission failed!');
        this.isSubmitting = false;
      }
    });
  }

  dashboard() {
    this.router.navigate(['./dashboard']);
  }
}