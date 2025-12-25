import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-home',
  imports: [MatIconModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  features = [
    {
      icons:"bar_chart",
      title: "AI-Powered Analysis",
      text: "Leverage cutting-edge vector embeddings and semantic search to detect conceptual similarities in project proposals.",
    },
    {
      icons:"check_circle_outline",
      title: "Instant Validation",
      text: "Get real-time similarity scores and matching excerpts within seconds of submission using serverless AWS infrastructure.",
    },
    {
      icons:"playlist_add_check",
      title: "Comprehensive Reports",
      text: "Receive detailed validation reports with similarity metrics, key findings, and recommendations for reviewers.",
    },
  ]

  router = inject(Router);

  featurePage() {
    this.router.navigate(['/feature']);
  }
}
