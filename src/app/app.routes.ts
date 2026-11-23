import { Routes } from '@angular/router';

const sessionShell = () => import('./shell/session-shell').then((m) => m.SessionShell);

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'part-1' },
  {
    path: 'part-1',
    title: 'Angular Signals · Part 1',
    loadComponent: sessionShell,
    resolve: { session: () => import('./sessions/part-1/part-1.session').then((m) => m.part1) },
  },
  {
    path: 'part-2',
    title: 'Angular Signals · Part 2 (draft)',
    loadComponent: sessionShell,
    resolve: { session: () => import('./sessions/part-2/part-2.session').then((m) => m.part2) },
  },
  {
    path: 'lab',
    title: 'Signals lab',
    loadComponent: () => import('./lab/lab').then((m) => m.Lab),
  },
  { path: '**', redirectTo: 'part-1' },
];
