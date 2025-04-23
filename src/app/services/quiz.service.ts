import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { QuizCategory } from '../models/quiz-category.model';

export interface Question {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  all_answers: string[];
}

export interface QuizResponse {
  response_code: number;
  results: {
    category: string;
    type: string;
    difficulty: string;
    question: string;
    correct_answer: string;
    incorrect_answers: string[];
  }[];
}

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  private apiUrl = 'https://opentdb.com/api.php';
  private categoryUrl = 'https://opentdb.com/api_category.php';

  constructor(private http: HttpClient) {}

  getCategories(): Observable<{ trivia_categories: QuizCategory[] }> {
    return this.http.get<{ trivia_categories: QuizCategory[] }>(
      this.categoryUrl
    );
  }

  getQuestions(
    categoryId: string,
    difficulty: string,
    amount: number
  ): Observable<Question[]> {
    const params = {
      amount: amount.toString(),
      category: categoryId,
      difficulty: difficulty.toLowerCase(),
      type: 'multiple',
    };

    return this.http.get<QuizResponse>(this.apiUrl, { params }).pipe(
      map((response) => {
        return response.results.map((q) => ({
          question: this.decodeHtml(q.question),
          correct_answer: this.decodeHtml(q.correct_answer),
          incorrect_answers: q.incorrect_answers.map((a) => this.decodeHtml(a)),
          all_answers: this.shuffleAnswers([
            this.decodeHtml(q.correct_answer),
            ...q.incorrect_answers.map((a) => this.decodeHtml(a)),
          ]),
        }));
      })
    );
  }

  private decodeHtml(html: string): string {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  }

  private shuffleAnswers(answers: string[]): string[] {
    for (let i = answers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [answers[i], answers[j]] = [answers[j], answers[i]];
    }
    return answers;
  }
}
