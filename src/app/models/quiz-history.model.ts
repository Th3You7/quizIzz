export interface QuizHistory {
  id: string;
  date: string;
  category: string;
  categoryId: number;
  score: number;
  totalQuestions: number;
  difficulty: string;
  timeSpent: number;
  percentage: number;
}
