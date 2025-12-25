import { Routes } from '@angular/router';
import { SystemLayout } from './system-layout/system-layout';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Feature } from './pages/feature/feature';
import { ProposalSubmission } from './pages/proposal-submission/proposal-submission';
import { History } from './pages/history/history';
import { ProposalResult } from './pages/proposal-result/proposal-result';

export const routes: Routes = [
  {
    path: '',
    component: SystemLayout,
    children: [
      { path: '', redirectTo: '', pathMatch: 'full' },
      { path: '', component: Home },
      { path: 'features', component: Feature },
      { path: 'login', component: Login },
      { path: 'register', component: Register },
    ],
  },
  { path: 'new-proposal', component: ProposalSubmission },
  { path: 'proposal-history', component: History },
  { path: 'proposal-result', component: ProposalResult },
];
