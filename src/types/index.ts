export type QuestionType = 'mcq' | 'true_false' | 'short_answer' | 'fill_in_blanks';
export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'mixed';

export interface Question {
  id: string;
  question: string;
  questionType: QuestionType;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  marks: number;
  timeLimit: number; // in seconds
}

export interface TestSettings {
  startDate?: string;
  endDate?: string;
  totalDuration?: number; // total test duration in minutes if per-question timer disabled
  useQuestionTimers: boolean; // if true, per-question timer is enabled
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  allowNavigation: boolean;
  allowReview: boolean;
  enableInstantResult: boolean;
  passingMarks: number; // percentage or points
  negativeMarking: number; // points deducted per wrong answer
  attemptsAllowed: number;
}

export interface Test {
  id: string;
  title: string;
  subject: string;
  topic: string;
  description: string;
  instructions: string;
  questions: Question[];
  settings: TestSettings;
  createdAt: string;
  status: 'draft' | 'published' | 'disabled';
  adminId: string;
  viewCount: number;
  uniqueLink: string;
}

export interface StudentAnswer {
  questionId: string;
  selectedAnswer: string;
  isCorrect?: boolean;
  timeTaken: number;
}

export interface StudentAttempt {
  id: string;
  testId: string;
  studentName: string;
  rollNumber: string;
  email?: string;
  status: 'joined' | 'attempting' | 'completed';
  currentQuestionIndex: number;
  answeredCount: number;
  remainingSeconds: number;
  score: number;
  totalMarks: number;
  percentage: number;
  passed?: boolean;
  startedAt: string;
  submittedAt?: string;
  answers: Record<string, StudentAnswer>; // key is questionId
  shuffledQuestionIds?: string[];
  shuffledOptionsMap?: Record<string, string[]>; // questionId -> shuffled options
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin';
}

export interface TestAnalytics {
  totalStudents: number;
  activeCount: number;
  completedCount: number;
  joinedCount: number;
  notStartedCount: number;
  highestScore: number;
  lowestScore: number;
  averageScore: number;
  passPercentage: number;
  scoreDistribution: { range: string; count: number }[];
  questionStats: {
    questionId: string;
    questionText: string;
    questionType: QuestionType;
    correctCount: number;
    wrongCount: number;
    unansweredCount: number;
    avgTimeSec: number;
    difficulty: string;
  }[];
}
