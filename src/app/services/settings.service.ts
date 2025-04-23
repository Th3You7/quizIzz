import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { QuizHistory } from '../models/quiz-history.model';

export interface QuizSettings {
  difficulty: string;
  timer: number;
  questionCount: number;
}

const DEFAULT_SETTINGS: QuizSettings = {
  difficulty: 'medium',
  timer: 30,
  questionCount: 10,
};

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private settingsSubject = new BehaviorSubject<QuizSettings>(
    this.loadSettings()
  );
  private notificationSubject = new BehaviorSubject<string>('');
  private historySubject = new BehaviorSubject<QuizHistory[]>(
    this.loadHistory()
  );

  settings$ = this.settingsSubject.asObservable();
  notification$ = this.notificationSubject.asObservable();
  history$ = this.historySubject.asObservable();

  constructor() {}

  private loadSettings(): QuizSettings {
    const savedSettings = localStorage.getItem('quizSettings');
    return savedSettings ? JSON.parse(savedSettings) : DEFAULT_SETTINGS;
  }

  private loadHistory(): QuizHistory[] {
    const savedHistory = localStorage.getItem('quizHistory');
    return savedHistory ? JSON.parse(savedHistory) : [];
  }

  updateSettings(settings: Partial<QuizSettings>) {
    const currentSettings = this.settingsSubject.value;
    const newSettings = { ...currentSettings, ...settings };
    this.settingsSubject.next(newSettings);
    localStorage.setItem('quizSettings', JSON.stringify(newSettings));
  }

  resetSettings() {
    this.settingsSubject.next(DEFAULT_SETTINGS);
    localStorage.removeItem('quizSettings');
  }

  addToHistory(history: Omit<QuizHistory, 'percentage'>) {
    const currentHistory = this.historySubject.value;
    const percentage = (history.score / history.totalQuestions) * 100;
    const newHistory = [
      {
        ...history,
        percentage,
      },
      ...currentHistory,
    ];
    this.historySubject.next(newHistory);
    localStorage.setItem('quizHistory', JSON.stringify(newHistory));
  }

  clearHistory() {
    this.historySubject.next([]);
    localStorage.removeItem('quizHistory');
  }

  showNotification(message: string) {
    this.notificationSubject.next(message);
    setTimeout(() => this.notificationSubject.next(''), 3000);
  }
}
