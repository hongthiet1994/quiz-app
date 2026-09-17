export interface Question {
  id: number;
  original_number: number;
  question: string;
  options: {
    [key: string]: string;
  };
  correct_answer: string;
  category: string;
}

export interface QuizData {
  total: number;
  questions: Question[];
}

export interface QuizConfig {
  username: string;
  numQuestions: number;
  categories: string[];
}

export interface QuizSession {
  username: string;
  answers: { [questionId: number]: string | null };
  currentIndex: number;
  selectedQuestions: Question[];
}

export interface QuizResult {
  username: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  answers: Array<{
    question: string;
    userAnswer: string | null;
    correctAnswer: string;
    isCorrect: boolean;
  }>;
}
