import { SystemLayout } from './system-layout/system-layout';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Feature } from './pages/feature/feature';
import { ProposalSubmission } from './pages/proposal-submission/proposal-submission';
import { History } from './pages/history/history';
import { ProposalResult } from './pages/proposal-result/proposal-result';
import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';
import { StudentDashboard } from './pages/student-dashboard/student-dashboard';
export const routes: Routes = [
  {
    path: '',
    component: SystemLayout,
    children: [
      { path: '', component: Home },
      { path: 'features', component: Feature },
      { path: 'login', component: Login },
      { path: 'register', component: Register },
    ],
  },
  { 
    path: 'new-proposal', 
    component: ProposalSubmission, 
    canActivate: [authGuard, roleGuard],
    data: { roles: ['student', 'admin'] } // Only students/admin can submit
  },
  { 
    path: 'proposal-history', 
    component: History, 
    canActivate: [authGuard] // Any logged-in user can see history
  },
  { 
    path: 'dashboard', 
    component: StudentDashboard, 
    canActivate: [authGuard] // Any logged-in user can see history
  },
  { 
    path: 'proposal-result', 
    component: ProposalResult, 
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin', 'student'] } // Only admin can see results/grading
  },
];
