export interface User {
  username: string
  password: string
}

export interface Question {
  category: string
  type: 'multiple' | 'boolean'
  difficulty: string
  question: string
  correct_answer: string
  incorrect_answers: string[]
  all_answers?: string[]
}

export interface UserAnswer {
  questionIndex: number
  selectedAnswer: string
  correct: boolean
}

export interface QuizProgress {
  username: string
  questions: Question[]
  currentQuestionIndex: number
  answers: UserAnswer[]
  endTime: number
  quizSettings: QuizSettings
  createdAt: number
}

export interface QuizSettings {
  amount: number
  type: 'multiple' | 'boolean'
  category?: number
  difficulty?: 'easy' | 'medium' | 'hard'
  timeLimit: number
}

export interface QuizResult {
  totalQuestions: number
  answeredQuestions: number
  correctAnswers: number
  wrongAnswers: number
  scorePercentage: number
  timeSpent: number
}

export type QuizPage = 'login' | 'setup' | 'quiz' | 'results'