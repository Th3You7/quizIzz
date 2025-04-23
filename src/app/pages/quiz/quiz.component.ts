import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { QuizService, Question } from '../../services/quiz.service';
import { SettingsService } from '../../services/settings.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './quiz.component.html',
})
export class QuizComponent implements OnInit, OnDestroy {
  questions: Question[] = [];
  currentQuestionIndex = 0;
  timeLeft: number = 30;
  timerSubscription?: Subscription;
  isAnswered = false;
  selectedAnswer: string | null = null;
  score = 0;
  showResults = false;
  totalQuestions = 10;
  isLoading = true;
  error = '';
  categoryId: string | null = null;
  categoryName: string = '';
  private settingsSubscription?: Subscription;
  private startTime: number = 0;
  private currentDifficulty: string = 'medium';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private quizService: QuizService,
    private settingsService: SettingsService
  ) {}

  ngOnInit() {
    this.categoryId = this.route.snapshot.paramMap.get('id');
    this.categoryName = this.route.snapshot.paramMap.get('name') || '';
    if (this.categoryId) {
      this.loadQuestions(this.categoryId);
    }
    this.startTime = Date.now();

    this.settingsSubscription = this.settingsService.settings$.subscribe(
      (settings) => {
        if (this.questions.length > 0) {
          this.timeLeft = settings.timer;
          this.startTimer();
        }
        this.currentDifficulty = settings.difficulty;
      }
    );
  }

  ngOnDestroy() {
    this.timerSubscription?.unsubscribe();
    this.settingsSubscription?.unsubscribe();
  }

  retryLoading() {
    if (this.categoryId) {
      this.loadQuestions(this.categoryId);
    }
  }

  loadQuestions(categoryId: string) {
    this.isLoading = true;
    this.error = '';

    this.settingsService.settings$.subscribe((settings) => {
      this.quizService
        .getQuestions(categoryId, settings.difficulty, settings.questionCount)
        .subscribe({
          next: (questions) => {
            this.questions = questions;
            this.totalQuestions = questions.length;
            this.timeLeft = settings.timer;
            this.isLoading = false;
            this.startTimer();
          },
          error: (err) => {
            this.error = 'Failed to load questions. Please try again.';
            this.isLoading = false;
            console.error('Error loading questions:', err);
          },
        });
    });
  }

  startTimer() {
    this.settingsService.settings$.subscribe((settings) => {
      this.timeLeft = settings.timer;
      this.timerSubscription?.unsubscribe();
      this.timerSubscription = interval(1000).subscribe(() => {
        if (this.timeLeft > 0) {
          this.timeLeft--;
        } else {
          this.handleTimeUp();
        }
      });
    });
  }

  handleTimeUp() {
    if (!this.isAnswered) {
      this.isAnswered = true;
      this.timerSubscription?.unsubscribe();
      // Time's up - count as wrong answer
      if (this.currentQuestionIndex < this.questions.length - 1) {
        setTimeout(() => this.nextQuestion(), 1500);
      } else {
        setTimeout(() => this.endQuiz(), 1500);
      }
    }
  }

  selectAnswer(answer: string) {
    if (this.isAnswered) return;

    this.selectedAnswer = answer;
    this.isAnswered = true;
    this.timerSubscription?.unsubscribe();

    if (answer === this.questions[this.currentQuestionIndex].correct_answer) {
      this.score++;
    }
  }

  nextQuestion() {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      this.isAnswered = false;
      this.selectedAnswer = null;
      this.startTimer();
    } else {
      this.endQuiz();
    }
  }

  endQuiz() {
    this.timerSubscription?.unsubscribe();
    this.showResults = true;

    // Save to history
    const timeSpent = Math.floor((Date.now() - this.startTime) / 1000);
    this.settingsService.addToHistory({
      id: Date.now().toString(),
      date: new Date().toISOString(),
      category: this.categoryName,
      categoryId: Number(this.categoryId),
      score: this.score,
      totalQuestions: this.totalQuestions,
      difficulty: this.currentDifficulty,
      timeSpent: timeSpent,
    });
  }

  getScoreMessage(): string {
    const percentage = (this.score / this.totalQuestions) * 100;
    if (percentage >= 90) {
      return "Excellent! You're a quiz master! 🏆";
    } else if (percentage >= 70) {
      return 'Great job! You know your stuff! 🌟';
    } else if (percentage >= 50) {
      return 'Good effort! Keep practicing! 💪';
    } else {
      return "Keep learning! You'll do better next time! 📚";
    }
  }

  cancelQuiz() {
    if (confirm('Are you sure you want to cancel the quiz?')) {
      this.timerSubscription?.unsubscribe();
      this.router.navigate(['/']);
    }
  }

  restartQuiz() {
    this.router.navigate(['/']);
  }
}
