import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { SettingsService } from '../../services/settings.service';
import { QuizHistory } from '../../models/quiz-history.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './history.component.html',
})
export class HistoryComponent implements OnInit, OnDestroy {
  history: QuizHistory[] = [];
  private subscription?: Subscription;

  constructor(private settingsService: SettingsService) {}

  ngOnInit() {
    this.subscription = this.settingsService.history$.subscribe((history) => {
      this.history = history;
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  clearHistory() {
    if (confirm('Are you sure you want to clear your quiz history?')) {
      this.settingsService.clearHistory();
      this.settingsService.showNotification('Quiz history has been cleared');
    }
  }

  getScoreIcon(history: QuizHistory): string {
    if (history.percentage >= 90) return '🏆';
    if (history.percentage >= 70) return '🌟';
    if (history.percentage >= 50) return '💪';
    return '📚';
  }

  getDifficultyIcon(difficulty: string): string {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return '🟢';
      case 'medium':
        return '🟡';
      case 'hard':
        return '🔴';
      default:
        return '⚪';
    }
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleString();
  }

  getScoreColor(percentage: number): string {
    if (percentage >= 90) return 'text-green-400';
    if (percentage >= 70) return 'text-yellow-400';
    if (percentage >= 50) return 'text-blue-400';
    return 'text-red-400';
  }
}
