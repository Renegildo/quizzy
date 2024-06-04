export interface Question {
  id: string;
  content: string;
  answers: string[];
  correct_answer: number;

  quizId: string;
  quiz: Quiz;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];

  creator_id: string;
  creator: { username: string, id: string };

  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  username: string;
  password: string;

  quizzes: Quiz[];

  created_at: string;
  updated_at: string;
}

