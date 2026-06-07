export type ExamType = 'NIMCET' | 'CUET PG MCA' | 'GATE CS' | 'TANCET MCA' | 'CAT' | 'Placements';

export type QuestionType = 'MCQ' | 'MSQ' | 'Numerical' | 'Coding';

export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';

export interface Question {
  id: string;
  exam: ExamType;
  subject: string;
  topic: string;
  difficulty: DifficultyLevel;
  type: QuestionType;
  question: string;
  options?: string[]; // for MCQ and MSQ
  answer: string | string[]; // Single answer string or array for MSQ
  explanation: string;
  shortcut?: string;
  commonMistakes?: string;
  codeSnippet?: string;
}

export interface UserProgress {
  userId: string;
  name: string;
  email: string;
  points: number; // Added for gamification
  targetExam: ExamType;
  targetRank: number;
  targetScore: number;
  graduationStream: string;
  streak: number;
  lastActiveDate: string | null;
  solvedCount: number;
  correctCount: number;
  dailyQuestionsSolved: number; // For roadmap tracking
  dailyMocksAttempted: number; // For roadmap tracking
  dailyRevisionCount: number; // For roadmap tracking
  practiceHistory: {
    questionId: string;
    selectedAnswer: string | string[];
    isCorrect: boolean;
    difficultySolved: DifficultyLevel;
    timestamp: string;
    timeSpentSeconds: number;
  }[];
  weakTopics: string[];
  strongTopics: string[];
  accuracy: number; // For leaderboard
}

export interface ExamSyllabus {
  id: string;
  examName: ExamType;
  conductingBody: string;
  examMode: string;
  duration: string;
  totalQuestions: number;
  negativeMarking: string;
  officialWebsite: string;
  officialPdfLink: string;
  lastUpdated: string;
  educationLevel: 'UG' | 'PG';
  course: string;
  examTypeCategory: 'National' | 'State' | 'University';
  stream: 'Computer Applications' | 'Engineering' | 'Management';
  sections: {
    title: string;
    weightage: string;
    topics: {
      name: string;
      subtopics: string[];
      importance: 'High' | 'Medium' | 'Low';
    }[];
  }[];
}

export interface StudyPlanDay {
  day: number;
  focus: string;
  tasks: {
    id: string;
    title: string;
    completed: boolean;
    category: 'Learn' | 'Practice' | 'Revision' | 'Mock';
    estimatedTime: string;
  }[];
}

export interface MockTest {
  id: string;
  title: string;
  exam: ExamType;
  durationMinutes: number;
  totalQuestions: number;
  questions: Question[];
  negativeMarking: number;
  positiveMarking: number;
}

export interface MockTestResult {
  testId: string;
  userId: string;
  title: string;
  timestamp: string;
  score: number;
  totalScore: number;
  totalQuestions: number;
  attempted: number;
  correct: number;
  incorrect: number;
  timeSpentSeconds: number;
  accuracy: number;
  sectionBreakdown: {
    section: string;
    correct: number;
    total: number;
  }[];
}

export interface VaultFile {
  id: string;
  name: string;
  type: 'PDF' | 'DOCX' | 'TXT' | 'RTF' | 'Image' | 'PPTX' | 'XLSX' | 'CSV' | 'ZIP';
  size: number;
  createdAt: string;
  folderId: string | null;
  tags: string[];
  isPinned: boolean;
  isFavorite: boolean;
  subject?: string;
  exam?: ExamType;
  aiInsights?: {
    summary?: string;
    formulas?: string[];
    flashcardsCount?: number;
    flashcards?: { question: string; answer: string }[];
    quizGenerated?: boolean;
    extractedText?: string;
    ocrText?: string;
  };
  base64Data?: string;
}

export interface VaultFolder {
  id: string;
  name: string;
  parentId: string | null;
  createdAt: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconName: string;
  unlockedAt?: string;
  progress?: number; 
  category: 'STREAK' | 'SOLVED' | 'MOCK' | 'TIME' | 'RANK';
}

export interface FocusSession {
  id: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  questionsSolved: number;
  accuracy: number;
  focusScore: number;
  topic?: string;
}

export interface CollegeDetail {
  id: string;
  name: string;
  location: string;
  fees: string;
  avgPackage: string;
  highestPackage: string;
  placementPercentage: string;
  cutoffs: {
    exam: ExamType;
    rank: number;
    year: string;
  }[];
  facilities: string[];
  officialWebsite: string;
  hostelFees: string;
  image?: string;
}
