import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { QuizService } from '../../services/quiz.service';
import { QuizCategory } from '../../models/quiz-category.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  categories$: Observable<{ trivia_categories: QuizCategory[] }>;
  selectedCategory: QuizCategory | null = null;

  constructor(private quizService: QuizService) {
    this.categories$ = this.quizService.getCategories();
  }

  ngOnInit(): void {}

  selectCategory(category: QuizCategory): void {
    this.selectedCategory = category;
  }
}
