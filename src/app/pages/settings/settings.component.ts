import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { SettingsService, QuizSettings } from '../../services/settings.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './settings.component.html',
})
export class SettingsComponent implements OnInit, OnDestroy {
  difficultyLevels = ['easy', 'medium', 'hard'];
  timerOptions = [10, 15, 20, 25, 30, 35, 40];
  questionCountOptions = [7, 10, 12, 15];
  selectedDifficulty = 'medium';
  selectedTimer = 30;
  selectedQuestionCount = 10;
  notification = '';
  private settingsSubscription?: Subscription;
  private notificationSubscription?: Subscription;

  constructor(private settingsService: SettingsService) {}

  ngOnInit() {
    this.settingsSubscription = this.settingsService.settings$.subscribe(
      (settings) => {
        this.selectedDifficulty = settings.difficulty;
        this.selectedTimer = settings.timer;
        this.selectedQuestionCount = settings.questionCount;
      }
    );

    this.notificationSubscription =
      this.settingsService.notification$.subscribe(
        (message) => (this.notification = message)
      );
  }

  ngOnDestroy() {
    this.settingsSubscription?.unsubscribe();
    this.notificationSubscription?.unsubscribe();
  }

  resetHistory() {
    this.settingsService.resetSettings();
    this.settingsService.showNotification(
      'Settings have been reset to default values'
    );
  }

  saveSettings() {
    this.settingsService.updateSettings({
      difficulty: this.selectedDifficulty,
      timer: this.selectedTimer,
      questionCount: this.selectedQuestionCount,
    });
    this.settingsService.showNotification(
      'Settings have been saved successfully'
    );
  }
}
