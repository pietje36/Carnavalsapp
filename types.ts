
export type GameType = 'math' | 'language' | 'typing' | 'hangman' | 'quiz';

export interface Question {
  id: string;
  type: GameType;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface UserStats {
  score: number;
  level: number;
  questionsAnswered: number;
  rank: string;
}

export enum Rank {
  BEGINNER = 'Narretje',
  INTERMEDIATE = 'Raadslid',
  ADVANCED = 'Adjudant',
  EXPERT = 'Prins Carnaval'
}
