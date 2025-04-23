import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { QuizComponent } from './pages/quiz/quiz.component';
import { HistoryComponent } from './pages/history/history.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'quiz/:id', component: QuizComponent },
  { path: 'history', component: HistoryComponent },
  { path: '**', redirectTo: '' },
];
