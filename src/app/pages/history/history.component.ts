import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { SettingsService } from '../../services/settings.service';
import { QuizHistory } from '../../models/quiz-history.model';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './history.component.html',
})
export class HistoryComponent implements OnInit {
  history: QuizHistory[] = [];

  constructor(private settingsService: SettingsService) {}

  ngOnInit() {
    this.settingsService.history$.subscribe((history) => {
      this.history = history;
    });
  }

  clearHistory() {
    if (confirm('Are you sure you want to clear your quiz history?')) {
      this.settingsService.clearHistory();
      this.settingsService.showNotification('Quiz history has been cleared');
    }
  }

  getScoreIcon(score: number, total: number): string {
    const percentage = (score / total) * 100;
    if (percentage >= 90) return '🏆';
    if (percentage >= 70) return '🌟';
    if (percentage >= 50) return '💪';
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
}
