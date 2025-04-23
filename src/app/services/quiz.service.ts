import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { QuizCategory } from '../models/quiz-category.model';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  private apiUrl = 'https://opentdb.com/api_category.php';

  constructor(private http: HttpClient) {}

  getCategories(): Observable<{ trivia_categories: QuizCategory[] }> {
    return this.http.get<{ trivia_categories: QuizCategory[] }>(this.apiUrl);
  }
}
