import { Component } from '@angular/core';

@Component({
  selector: 'app-feature',
  imports: [],
  templateUrl: './feature.html',
  styleUrl: './feature.css',
})
export class Feature {
  features = [
    {
      icons:"🤖",
      title: "AI-Powered Analysis",
      text: "Leverage cutting-edge vector embeddings and semantic search to detect conceptual similarities in project proposals.",
    },
    {
      icons:"⚡",
      title: "Instant Validation",
      text: "Get real-time similarity scores and matching excerpts within seconds of submission using serverless AWS infrastructure.",
    },
    {
      icons:"📊",
      title: "Comprehensive Reports",
      text: "Receive detailed validation reports with similarity metrics, key findings, and recommendations for reviewers.",
    },
    {
      icons:"🔒",
      title: "Secure & Scalable",
      text: "Built on AWS with enterprise-grade security, ensuring your academic data remains protected and accessible.",
    },
    {
      icons:"🎯",
      title: "Originality Detection",
      text: "Automatically compare against thousands of historical projects to ensure genuine innovation and novelty.",
    },
    {
      icons:"💡",
      title: "Smart Recommendations",
      text: "Get intelligent suggestions for improving project uniqueness and avoiding redundancy with existing work.",
    },
  ]
}
