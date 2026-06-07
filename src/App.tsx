import React, { Component, useState, useEffect, useCallback, Suspense, lazy, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProgress } from './types';
import { 
  Sparkles, 
  Trophy, 
  BookOpen, 
  Calendar, 
  Clock, 
  Film, 
  ClipboardCheck, 
  MessageSquare, 
  Search, 
  ArrowRight, 
  CheckCircle, 
  ChevronRight, 
  User, 
  AlertCircle, 
  Settings, 
  Award, 
  Layers, 
  HelpCircle, 
  Code, 
  ListFilter, 
  PlayCircle, 
  ExternalLink, 
  Lightbulb, 
  TrendingUp, 
  RefreshCw,
  TrendingDown,
  ThumbsUp,
  Flame,
  Check,
  Plus,
  Book,
  Sliders,
  Filter,
  Volume2,
  Bookmark,
  FileText,
  Activity,
  Bell,
  MessageSquareCode,
  BrainCircuit,
  LayoutDashboard,
  PenTool,
  Rocket,
  LineChart,
  Wifi,
  WifiOff,
  Database,
  CloudLightning,
  AlertTriangle,
  RotateCcw,
  GitMerge,
  Target,
  Zap,
  Compass,
  FileSearch
} from 'lucide-react';
import { EXAM_SYLLABI, QUESTION_BANK, MOCK_TESTS, PREPARATION_CARDS_DETAIL } from './data/examData';
import { ExamType, Question, DifficultyLevel, QuestionType, ExamSyllabus, StudyPlanDay, MockTest } from './types';
import { PYQ_PAPERS, UNIVERSITY_PREDICTION_DATA } from './data/pyqData';
import { LECTURE_RESOURCES, INITIAL_REVIEWS, LectureResource, PlaylistReview } from './data/videoData';
import { getDetailedSubtopics, TOPIC_SUBTOPICS_DB, DetailedSubtopic, SubtopicQuestion } from './data/subtopicsData';

// Lazy loaded components for performance
const AIQuestionGenerator = lazy(() => import('./components/AIQuestionGenerator'));
const AdaptiveMockSystem = lazy(() => import('./components/AdaptiveMockSystem'));
const BooksAndResourceEngine = lazy(() => import('./components/BooksAndResourceEngine'));
const UniversitySyllabusHub = lazy(() => import('./components/UniversitySyllabusHub'));
const SpecializedTools = lazy(() => import('./components/SpecializedTools'));
const MistakeNotebook = lazy(() => import('./components/MistakeNotebook'));
const AICoachNavigator = lazy(() => import('./components/AICoachNavigator').then(m => ({ default: m.AICoachNavigator })));
const KnowledgeVault = lazy(() => import('./components/KnowledgeVault'));
const FocusRoom = lazy(() => import('./components/FocusRoom'));
const WarRoom = lazy(() => import('./components/WarRoom'));
const CollegeExplorer = lazy(() => import('./components/CollegeExplorer'));
const CareerRoadmaps = lazy(() => import('./components/CareerRoadmaps'));
const ConceptGraph = lazy(() => import('./components/ConceptGraph'));

// Error Boundary Component
class ErrorBoundary extends Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#050510] flex items-center justify-center p-6 text-center">
          <div className="max-w-md w-full p-8 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl">
            <AlertTriangle className="w-16 h-16 text-rose-500 mx-auto mb-6" />
            <h1 className="text-2xl font-black text-white mb-2">Something went wrong</h1>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed">
              We encountered an unexpected error while loading this section of the platform.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Restart Application</span>
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Module Loading Skeleton
const ModuleLoading = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center py-24 space-y-6">
    <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
    <div className="text-center">
      <h3 className="text-white font-bold text-lg">{title}</h3>
      <p className="text-slate-400 text-xs mt-1">Fetching latest data sets from secure logic hub...</p>
    </div>
  </div>
);

// Global Layout Component
const GlobalLayout = ({ 
  children, 
  activeTab, 
  isSwitchingTab, 
  isOffline, 
  isSyncing, 
  lastSyncedAt, 
  handleGlobalSync, 
  showPerfMonitor, 
  setShowPerfMonitor, 
  perfMetrics, 
  viewportRef 
}: { 
  children: React.ReactNode;
  activeTab: string;
  isSwitchingTab: boolean;
  isOffline: boolean;
  isSyncing: boolean;
  lastSyncedAt: string;
  handleGlobalSync: () => void;
  showPerfMonitor: boolean;
  setShowPerfMonitor: (v: boolean) => void;
  perfMetrics: { loadTime: number; apiLatency: number };
  viewportRef: React.RefObject<HTMLDivElement | null>;
}) => (
  <ErrorBoundary>
    <div id="rankforge-app" className="min-h-screen bg-[#05060b] text-slate-100 flex flex-col overflow-hidden font-sans antialiased selection:bg-indigo-500/30 selection:text-white relative">
      
      {/* GLOBAL PERFORMANCE OVERLAY (Progress Bar) */}
      {isSwitchingTab && (
        <motion.div 
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 z-[100] shadow-[0_0_8px_rgba(99,102,241,0.5)]"
        />
      )}

      {/* TOP STATUS RIBBON */}
      <div className="h-10 bg-black/40 border-b border-white/5 flex items-center justify-between px-6 backdrop-blur-md z-50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${isOffline ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`} />
            <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-slate-400">
              {isOffline ? 'Offline Mode (Local Cache Active)' : 'System Live • AIR Sync Hub'}
            </span>
          </div>
          {isSyncing && (
            <div className="flex items-center gap-2 text-indigo-400 animate-fadeIn">
              <RefreshCw className="w-3 h-3 animate-spin" />
              <span className="text-[9px] font-bold uppercase tracking-wider">Syncing Resources...</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-4">
           {lastSyncedAt && (
              <span className="text-[9px] text-slate-500 font-mono hidden md:block">Last Sync: {lastSyncedAt}</span>
           )}
           <button 
              onClick={handleGlobalSync}
              disabled={isSyncing}
              className="text-slate-400 hover:text-white transition-colors"
              title="Sync Platform Data"
           >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
           </button>
           <button 
              onClick={() => setShowPerfMonitor(!showPerfMonitor)}
              className="text-slate-500 hover:text-indigo-400 transition-colors"
           >
              <Activity className="w-3.5 h-3.5" />
           </button>
        </div>
      </div>

      {/* PERF MONITOR (Hidden Admin Panel) */}
      <AnimatePresence>
        {showPerfMonitor && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-12 right-6 z-[60] bg-[#0a0a1a] border border-white/10 p-4 rounded-2xl shadow-2xl backdrop-blur-2xl w-64"
          >
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Perf Diagnostics</h4>
              <button onClick={() => setShowPerfMonitor(false)} className="text-slate-500">&times;</button>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                 <span className="text-slate-400">Initial Load:</span>
                 <span className="text-white font-mono font-bold">{perfMetrics.loadTime}ms</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                 <span className="text-slate-400">LCP Estimate:</span>
                 <span className="text-emerald-400 font-mono font-bold">Excellent</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                 <span className="text-slate-400">API Latency:</span>
                 <span className="text-amber-400 font-mono font-bold">{perfMetrics.apiLatency}ms</span>
              </div>
              <div className="pt-2 border-t border-white/5">
                 <p className="text-[9px] text-slate-500 italic">Tracking core telemetry for NIMCET/GATE prediction accuracy benchmarks.</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  </ErrorBoundary>
);

export default function App() {
  const [activeTutorFile, setActiveTutorFile] = useState<VaultFile | null>(null);

  // Authentication & session variables (persistent)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authRegName, setAuthRegName] = useState('');
  const [authRegEmail, setAuthRegEmail] = useState('');
  const [authRegPassword, setAuthRegPassword] = useState('');
  const [authRegExam, setAuthRegExam] = useState<ExamType>('NIMCET');
  const [authRegRank, setAuthRegRank] = useState<number>(30);
  const [authRegScore, setAuthRegScore] = useState<number>(710);

  // UX & Performance States
  const [isSwitchingTab, setIsSwitchingTab] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string>(new Date().toLocaleString());
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const scrollPositions = useRef<Record<string, number>>({});
  const viewportRef = useRef<HTMLDivElement>(null);

  // Performance Monitoring (Admin)
  const [perfMetrics, setPerfMetrics] = useState<{ loadTime: number; apiLatency: number }>({ loadTime: 0, apiLatency: 0 });
  const [showPerfMonitor, setShowPerfMonitor] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial load benchmark
    const loadTime = performance.now();
    window.addEventListener('load', () => {
      setPerfMetrics(prev => ({ ...prev, loadTime: Math.round(performance.now() - loadTime) }));
    });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Global Sync Logic
  const handleGlobalSync = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    
    // Simulate real database sync/cache update
    const start = performance.now();
    await new Promise(r => setTimeout(r, 1500));
    setPerfMetrics(prev => ({ ...prev, apiLatency: Math.round(performance.now() - start) }));
    
    setLastSyncedAt(new Date().toLocaleString());
    setIsSyncing(false);
    setRecentNotification('✓ Platform Resources Synced successfully');
  };

  // Current user configuration (persistent)
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      name: 'Aryan Sharma',
      email: 'aryan.sharma@entrance.com',
      targetExam: 'NIMCET' as ExamType,
      targetRank: 50,
      targetScore: 680,
      graduationStream: 'BCA (Final Year)',
      streak: 14,
      points: 420,
      accuracy: 82.4,
      masteryPercentage: 68
    };
  });

  // Save profile helper to trigger persistence
  useEffect(() => {
    localStorage.setItem('user_profile', JSON.stringify(user));
  }, [user]);

  // Navigation settings
  const [activeTab, setActiveTab] = useState<'dashboard' | 'coach' | 'syllabus' | 'practice' | 'mocks' | 'tutor' | 'planner' | 'videos' | 'leaderboard' | 'pyq' | 'analytics' | 'books' | 'vault' | 'focus' | 'warroom' | 'colleges' | 'roadmaps' | 'graph'>('dashboard');
  
  const handleTabChange = useCallback((tab: typeof activeTab) => {
    if (isSwitchingTab) return;
    
    // Save current scroll position
    if (viewportRef.current) {
      scrollPositions.current[activeTab] = viewportRef.current.scrollTop;
    }

    if (tab === activeTab) {
      // If clicking already active tab, scroll to top
      if (viewportRef.current) {
        viewportRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    setIsSwitchingTab(true);
    
    // Orchestrate state change with delay for UI feedback
    setTimeout(() => {
      setActiveTab(tab);
      setIsSwitchingTab(false);
      
      // Restore scroll position after a short delay for component mounting
      setTimeout(() => {
        if (viewportRef.current) {
          viewportRef.current.scrollTo({
            top: scrollPositions.current[tab] || 0,
            behavior: 'instant'
          });
        }
      }, 50);
    }, 450);
  }, [activeTab, isSwitchingTab]);

  const [activeCoachSubTab, setActiveCoachSubTab] = useState<'ask_mentor' | 'study_navigator' | 'retention_tracker' | 'topper_benchmarks' | 'placement_resume' | 'exam_updates' | 'admin_cms'>('ask_mentor');
  const [isTopperMode, setIsTopperMode] = useState(false);

  // Smart Bookmarks state (persistent)
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    const saved = localStorage.getItem('smart_bookmarks');
    return saved ? JSON.parse(saved) : ['n25-q1', 'n24-q1'];
  });

  const toggleBookmark = (qId: string) => {
    setBookmarks(prev => {
      const updated = prev.includes(qId) ? prev.filter(id => id !== qId) : [...prev, qId];
      localStorage.setItem('smart_bookmarks', JSON.stringify(updated));
      setRecentNotification(prev.includes(qId) ? 'Question removed from Smart Bookmarks shelf' : '⭐ Saved to High-Priority Bookmarks!');
      return updated;
    });
  };

  // PYQ filters & solve states
  const [pyqFilterExam, setPyqFilterExam] = useState<ExamType | 'ALL'>('ALL');
  const [pyqFilterYear, setPyqFilterYear] = useState<number | 'ALL'>('ALL');
  const [pyqFilterSubject, setPyqFilterSubject] = useState<string>('ALL');
  const [pyqFilterDifficulty, setPyqFilterDifficulty] = useState<DifficultyLevel | 'ALL'>('ALL');
  const [pyqSolvedAnswers, setPyqSolvedAnswers] = useState<Record<string, string>>({});
  const [pyqCheckedAnswers, setPyqCheckedAnswers] = useState<Record<string, boolean>>({});
  const [pyqSolutionExpanded, setPyqSolutionExpanded] = useState<Record<string, boolean>>({});

  // College Admission Predictor state
  const [predictExam, setPredictExam] = useState<ExamType>('NIMCET');
  const [predictRank, setPredictRank] = useState<number>(120);
  const [predictCategory, setPredictCategory] = useState<'General' | 'OBC' | 'SC' | 'ST'>('General');
  const [predictedColleges, setPredictedColleges] = useState<any[]>([]);

  // Spaced Revision Scheduler list
  const [spacedRevisionList, setSpacedRevisionList] = useState([
    { id: 'rev-1', topic: 'Conditional Bayes Theorem', intervalDays: 1, lastReviewed: '2026-06-05', status: 'Overdue (Review today)', difficulty: 'Hard', count: 3 },
    { id: 'rev-2', topic: '2s Complement Fixed representation', intervalDays: 3, lastReviewed: '2026-06-04', status: 'Safe', difficulty: 'Medium', count: 1 },
    { id: 'rev-3', topic: 'Planar Graphs Region Euler Formula', intervalDays: 7, lastReviewed: '2026-06-01', status: 'Mastered', difficulty: 'Easy', count: 4 }
  ]);

  // App statistics states (interactive)
  const [solvedCount, setSolvedCount] = useState(48);
  const [correctCount, setCorrectCount] = useState(40);
  const [streakCount, setStreakCount] = useState(14);
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);

  // Centralized User Progress (For AI Roadmap Auto-completion)
  const [userProgress, setUserProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('user_progress');
    if (saved) return JSON.parse(saved);
    return {
      points: 450,
      dailyQuestionsSolved: 0,
      dailyMocksAttempted: 0,
      dailyRevisionCount: 0,
      accuracy: 83.3,
      lastUpdated: new Date().toISOString()
    };
  });

  useEffect(() => {
    localStorage.setItem('user_progress', JSON.stringify(userProgress));
  }, [userProgress]);

  const updateProgress = (updates: Partial<UserProgress>) => {
    setUserProgress(prev => ({
      ...prev,
      ...updates,
      lastUpdated: new Date().toISOString()
    }));
  };

  // Sub-tabs configuration toggle hooks for the Ultimate AI OS
  const [practiceSubTab, setPracticeSubTab] = useState<'standard' | 'ai_generator' | 'mistakes'>('ai_generator');
  const [mocksSubTab, setMocksSubTab] = useState<'standard' | 'adaptive_mocks'>('adaptive_mocks');
  const [videosSubTab, setVideosSubTab] = useState<'standard' | 'custom_engine'>('custom_engine');
  const [syllabusSubTab, setSyllabusSubTab] = useState<'standard' | 'university_hubs'>('standard');
  const [tutorSubTab, setTutorSubTab] = useState<'chat' | 'tools'>('tools');

  // Today's custom roadmap tasks (can check them off)
  const [roadmapTasks, setRoadmapTasks] = useState([
    { id: 't1', title: 'Practice: Probability & Statistics', desc: 'Adaptive Hard Difficulty • 15/25 Qs Done', xp: 40, completed: true, category: 'Practice' },
    { id: 't2', title: 'AI Concept Drift: Linked Lists', desc: 'Aris recommends revision based on yesterday\'s errors', xp: 15, completed: false, category: 'Revision' },
    { id: 't3', title: 'Mock Analysis: Test #14', desc: 'Reviewing 4 incorrect Logical Reasoning Qs', xp: 30, completed: false, category: 'Mock' },
    { id: 't4', title: 'Daily Reasoning Challenge', desc: 'Syllogisms and Seating Arrangement practice', xp: 20, completed: false, category: 'Learn' }
  ]);

  // AI Planner dynamic roadmap input
  const [plannerExam, setPlannerExam] = useState<ExamType>('NIMCET');
  const [plannerRank, setPlannerRank] = useState<number>(30);
  const [plannerMonths, setPlannerMonths] = useState<number>(3);
  const [generatedPlan, setGeneratedPlan] = useState<{
    sprintTitle: string;
    weeks: { weekNum: number; focus: string; topics: string[]; revisionDay: string }[];
  } | null>(null);

  // Authentication/Profile Modal
  const [showProfileDrawer, setShowProfileDrawer] = useState(false);
  const [profileNameInput, setProfileNameInput] = useState(user.name);
  const [profileExamInput, setProfileExamInput] = useState<ExamType>(user.targetExam);
  const [profileRankInput, setProfileRankInput] = useState(user.targetRank);
  const [profileGpaInput, setProfileGpaInput] = useState('8.5');

  // Syllabus Hub Search & Filters
  const [syllabusSearch, setSyllabusSearch] = useState('');
  const [syllabusFilterEdu, setSyllabusFilterEdu] = useState<'ALL' | 'UG' | 'PG'>('ALL');
  const [syllabusFilterStream, setSyllabusFilterStream] = useState<'ALL' | 'Computer Applications' | 'Engineering' | 'Management'>('ALL');
  const [selectedSyllabusId, setSelectedSyllabusId] = useState<string>('nimcet');

  // AI Syllabus Analyzer outputs
  const [analyzingSyllabus, setAnalyzingSyllabus] = useState(false);
  const [analyzerResult, setAnalyzerResult] = useState<{
    totalTopics: number;
    easyCount: number;
    mediumCount: number;
    hardCount: number;
    recommendedHours: number;
    insights: string[];
  } | null>(null);

  // Interactive Practice Engine states
  const [practiceDifficulty, setPracticeDifficulty] = useState<DifficultyLevel>('Medium');
  const [adaptiveMode, setAdaptiveMode] = useState(true);
  const [practiceExam, setPracticeExam] = useState<ExamType>('NIMCET');
  const [currentPracticeIndex, setCurrentPracticeIndex] = useState(0);
  const [selectedPracticeOption, setSelectedPracticeOption] = useState<string>('');
  const [practiceAnswerChecked, setPracticeAnswerChecked] = useState(false);
  const [practiceFeedback, setPracticeFeedback] = useState<{ isCorrect: boolean; showExplanation: boolean } | null>(null);
  const [numericalInput, setNumericalInput] = useState('');
  const [userCodingAnswer, setUserCodingAnswer] = useState('// Type recursive or dynamic search code here\n');

  // Active question filter pool
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>(QUESTION_BANK);

  // Mock Test active simulation states
  const [selectedMock, setSelectedMock] = useState<MockTest | null>(null);
  const [mockActive, setMockActive] = useState(false);
  const [mockTimeRemaining, setMockTimeRemaining] = useState(120);
  const [mockUserAnswers, setMockUserAnswers] = useState<Record<string, string>>({});
  const [mockScoreBreakdown, setMockScoreBreakdown] = useState<any>(null);

  // AI Tutor "Aris" messaging panel
  const [aiApiKeyLoading, setAiApiKeyLoading] = useState(false);
  const [irisMessages, setIrisMessages] = useState<Array<{ sender: 'user' | 'aris'; text: string; time: string }>>([
    { sender: 'aris', text: 'Hello, Aryan! Your current mastery of Probability is at 52%, which is a critical weak zone for NIMCET. Let\'s conquer it. What computer science topic or mathematical concept can I break down for you today?', time: '08:22' }
  ]);
  const [irisInputPrompt, setIrisInputPrompt] = useState('');
  const [predictedRankRange, setPredictedRankRange] = useState('AIR 80 - 120');

  // Database-driven Lecture Finder & Study Paths state (persistent)
  const [videoLanguageFilter, setVideoLanguageFilter] = useState<'ALL' | 'English' | 'Hindi' | 'Tamil' | 'Telugu' | 'Mixed'>('ALL');
  const [videoLevelFilter, setVideoLevelFilter] = useState<'ALL' | 'Beginner' | 'Intermediate' | 'Advanced'>('ALL');
  const [videoExamFilter, setVideoExamFilter] = useState<ExamType | 'ALL'>('ALL');
  const [videoSubjectFilter, setVideoSubjectFilter] = useState<'ALL' | 'Database Systems' | 'Computer Science' | 'Mathematics' | 'Calculus' | 'Quantitative Aptitude'>('ALL');
  const [videoSearchQuery, setVideoSearchQuery] = useState('');

  // Loaded reviews and playlists
  const [lectureReviews, setLectureReviews] = useState<PlaylistReview[]>(() => {
    const saved = localStorage.getItem('lecture_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  useEffect(() => {
    localStorage.setItem('lecture_reviews', JSON.stringify(lectureReviews));
  }, [lectureReviews]);

  const [selectedPlaylistReviewsId, setSelectedPlaylistReviewsId] = useState<string | null>(null);
  const [newReviewRating, setNewReviewRating] = useState<number>(5);
  const [newReviewText, setNewReviewText] = useState<string>('');
  const [newReviewName, setNewReviewName] = useState<string>('');

  // Syllabus Interactive Topic Learning Paths
  const [selectedTopicPath, setSelectedTopicPath] = useState<{ name: string; importance: string; subtopics: string[]; subject?: string } | null>(null);
  const [activeTopicPathTab, setActiveTopicPathTab] = useState<'videos' | 'notes' | 'revision' | 'practice'>('videos');

  // AI Learning OS Extension States
  const [subtopicProgress, setSubtopicProgress] = useState<Record<string, { learn: boolean; quiz: boolean; revision: boolean; pyq: boolean; score?: number }>>(() => {
    const saved = localStorage.getItem('subtopic_progress');
    return saved ? JSON.parse(saved) : {
      'set-intro': { learn: true, quiz: true, revision: true, pyq: true, score: 80 },
      'set-types': { learn: true, quiz: true, revision: false, pyq: false, score: 100 },
      'set-ops': { learn: false, quiz: false, revision: false, pyq: false },
      'dbms-normal': { learn: true, quiz: false, revision: true, pyq: false }
    };
  });

  useEffect(() => {
    localStorage.setItem('subtopic_progress', JSON.stringify(subtopicProgress));
  }, [subtopicProgress]);

  const [subtopicBookmarks, setSubtopicBookmarks] = useState<string[]>(() => {
    const saved = localStorage.getItem('subtopic_bookmarks');
    return saved ? JSON.parse(saved) : ['set-intro'];
  });

  useEffect(() => {
    localStorage.setItem('subtopic_bookmarks', JSON.stringify(subtopicBookmarks));
  }, [subtopicBookmarks]);

  const toggleSubtopicBookmark = (subtopicId: string) => {
    setSubtopicBookmarks(prev => {
      const updated = prev.includes(subtopicId) ? prev.filter(id => id !== subtopicId) : [...prev, subtopicId];
      localStorage.setItem('subtopic_bookmarks', JSON.stringify(updated));
      setRecentNotification(prev.includes(subtopicId) ? 'Subtopic removed from bookmarks' : '⭐ Subtopic bookmarked for high-speed review!');
      return updated;
    });
  };

  const [selectedSubtopic, setSelectedSubtopic] = useState<DetailedSubtopic | null>(null);
  const [activeSubtopicTab, setActiveSubtopicTab] = useState<'theory' | 'notes' | 'quiz' | 'flashcards'>('theory');

  // Mini Quiz States
  const [quizCurrentIndex, setQuizCurrentIndex] = useState<number>(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizChecked, setQuizChecked] = useState<boolean>(false);
  const [quizResultScore, setQuizResultScore] = useState<number>(0);
  const [quizFeedbackMsg, setQuizFeedbackMsg] = useState<string>('');

  // AI Flashcards State
  const [flashcards, setFlashcards] = useState<Array<{ id: string; subtopicId: string; front: string; back: string; status: 'KNOW' | 'DONT_KNOW' | 'REVIEW' }>>([
    { id: 'fc-1', subtopicId: 'set-intro', front: 'What is a Set?', back: 'A well-defined collection of distinct objects.', status: 'KNOW' },
    { id: 'fc-2', subtopicId: 'set-intro', front: 'What is Roster form representation?', back: 'Listing elements in braces separated by commas, e.g., A = {1, 2, 3}.', status: 'REVIEW' },
    { id: 'fc-3', subtopicId: 'set-types', front: 'What is a Power Set?', back: 'The set of all subsets of a set, having cardinality 2ⁿ.', status: 'DONT_KNOW' },
    { id: 'fc-4', subtopicId: 'set-types', front: 'Difference between Equal and Equivalent sets.', back: 'Equal sets have exact identical elements. Equivalent sets have the same quantity of elements.', status: 'REVIEW' },
    { id: 'fc-5', subtopicId: 'set-ops', front: 'What is Symmetric Difference?', back: '(A - B) ∪ (B - A), elements in either set but NOT both.', status: 'DONT_KNOW' },
    { id: 'fc-6', subtopicId: 'dbms-normal', front: 'What is the key rule for BCNF?', back: 'For every functional dependency X ➔ Y, X must strictly be a Super Key.', status: 'KNOW' },
    { id: 'fc-7', subtopicId: 'dbms-normal', front: 'Define 1st Normal Form (1NF).', back: 'All attribute fields must have strictly atomic values (no repeating groups/arrays).', status: 'REVIEW' },
    { id: 'fc-8', subtopicId: 'prob-conditional', front: 'Formula for Conditional Probability P(A|B).', back: 'P(A ∩ B) / P(B), provided P(B) > 0.', status: 'DONT_KNOW' }
  ]);
  const [fcActiveId, setFcActiveId] = useState<string | null>(null);
  const [fcIsFlipped, setFcIsFlipped] = useState<boolean>(false);

  // College Explorer Filter states
  const [collegeFilterType, setCollegeFilterType] = useState<'ALL' | 'MCA' | 'MBA' | 'M.Tech'>('ALL');
  const [collegeSearchQuery, setCollegeSearchQuery] = useState('');
  const [collegeFilterState, setCollegeFilterState] = useState('ALL');
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);
  
  // Quick status updates
  const [recentNotification, setRecentNotification] = useState<string | null>(
    '🔥 Welcome to RankForge AI! Your study patterns point to solid DSA gains.'
  );
  const [lastSyncedTime, setLastSyncedTime] = useState<string>('06 Jun 2026 • 11:04 AM');
  const [showNotifications, setShowNotifications] = useState(false);

  const displayNotice = (msg: string) => {
    setRecentNotification(msg);
  };

  // Sync practice pool when filters alter
  useEffect(() => {
    const pooled = QUESTION_BANK.filter(q => {
      const matchExam = q.exam === practiceExam;
      const matchDiff = adaptiveMode ? true : q.difficulty === practiceDifficulty;
      return matchExam && matchDiff;
    });
    setFilteredQuestions(pooled.length > 0 ? pooled : QUESTION_BANK.filter(q => q.exam === practiceExam));
    setCurrentPracticeIndex(0);
    resetPracticeState();
  }, [practiceExam, practiceDifficulty, adaptiveMode]);

  // Interval timer for active mock test
  useEffect(() => {
    let interval: any;
    if (mockActive && mockTimeRemaining > 0) {
      interval = setInterval(() => {
        setMockTimeRemaining(prev => {
          if (prev <= 1) {
            setMockActive(false);
            submitMockTestEvaluation();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [mockActive, mockTimeRemaining]);

  const resetPracticeState = () => {
    setSelectedPracticeOption('');
    setNumericalInput('');
    setPracticeAnswerChecked(false);
    setPracticeFeedback(null);
  };

  const handleNextPracticeQuestion = () => {
    if (currentPracticeIndex < filteredQuestions.length - 1) {
      setCurrentPracticeIndex(prev => prev + 1);
    } else {
      setCurrentPracticeIndex(0); // wrap
    }
    resetPracticeState();
  };

  // Check practice answer and automatically shift adaptive difficulty!
  const handleCheckPracticeAnswer = () => {
    if (practiceAnswerChecked) return;
    const q = filteredQuestions[currentPracticeIndex];
    if (!q) return;

    let isCorrect = false;
    if (q.type === 'MCQ') {
      isCorrect = selectedPracticeOption === q.answer;
    } else if (q.type === 'Numerical') {
      isCorrect = numericalInput.trim().toLowerCase() === String(q.answer).toLowerCase();
    } else if (q.type === 'Coding') {
      isCorrect = userCodingAnswer.toLowerCase().includes('recursion') || userCodingAnswer.toLowerCase().includes('dp') || userCodingAnswer.toLowerCase().includes('path');
    }

    setSolvedCount(prev => prev + 1);
    updateProgress({ 
      dailyQuestionsSolved: (userProgress.dailyQuestionsSolved || 0) + 1,
      accuracy: Math.round(((correctCount + (isCorrect ? 1 : 0)) / (solvedCount + 1)) * 100)
    });

    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
      setUser(p => ({ ...p, points: p.points + 25 }));
      setRecentNotification('🎉 Correct answer! Difficulty adjusted upwards for your next steps.');
      
      // Adaptive Difficulty shifts upward!
      if (adaptiveMode) {
        if (practiceDifficulty === 'Easy') setPracticeDifficulty('Medium');
        else if (practiceDifficulty === 'Medium') setPracticeDifficulty('Hard');
      }
    } else {
      setRecentNotification('💡 Explanations loaded! Aris adjusted the difficulty to keep your basics solid.');
      // Adaptive Difficulty shifts downward!
      if (adaptiveMode) {
        if (practiceDifficulty === 'Hard') setPracticeDifficulty('Medium');
        else if (practiceDifficulty === 'Medium') setPracticeDifficulty('Easy');
      }
    }

    setPracticeFeedback({ isCorrect, showExplanation: true });
    setPracticeAnswerChecked(true);

    // Recalculate weak and strong topics based on mock interactions
    const newAccuracy = Math.round(((correctCount + (isCorrect ? 1 : 0)) / (solvedCount + 1)) * 1000) / 10;
    setUser(prev => ({
      ...prev,
      accuracy: newAccuracy
    }));
  };

  // AI OS Subtopic Mastery calculations and activity triggers
  const getSubtopicProgress = (subtopicId: string) => {
    const record = subtopicProgress[subtopicId];
    if (!record) return 0;
    let score = 0;
    if (record.learn) score += 20;
    if (record.quiz) score += 40;
    if (record.revision) score += 20;
    if (record.pyq) score += 20;
    return score;
  };

  const getTopicCompletionProgress = (topicName: string): number => {
    const subtopics = getDetailedSubtopics(topicName);
    if (!subtopics || subtopics.length === 0) return 0;
    const totalProgress = subtopics.reduce((acc, sub) => acc + getSubtopicProgress(sub.id), 0);
    return Math.round(totalProgress / subtopics.length);
  };

  const toggleSubtopicActivity = (subtopicId: string, activity: 'learn' | 'revision' | 'pyq') => {
    setSubtopicProgress(prev => {
      const current = prev[subtopicId] || { learn: false, quiz: false, revision: false, pyq: false };
      const nextVal = !current[activity];
      
      const updated = {
        ...prev,
        [subtopicId]: {
          ...current,
          [activity]: nextVal
        }
      };

      if (nextVal) {
        // Reward student points
        const pointsAdded = activity === 'learn' ? 15 : activity === 'revision' ? 15 : 20;
        setUser(u => ({ ...u, points: u.points + pointsAdded }));
        setRecentNotification(`🎉 Subtopic ${activity.toUpperCase()} recorded! +${pointsAdded} RankPoints`);
      }

      return updated;
    });
  };

  // AI Tutor automatic context triggering
  useEffect(() => {
    if (activeTab === 'tutor' && activeTutorFile) {
      console.log('Triggering AI Mentor analysis for:', activeTutorFile.name);
      
      // Delay slightly to ensure tab navigated AND component mounted
      const timer = setTimeout(() => {
        const contextPrompt = `Aris, I have a file named "${activeTutorFile.name}". Here are its AI insights: Summary: ${activeTutorFile.aiInsights?.summary || 'None'}, Formulas: ${activeTutorFile.aiInsights?.formulas?.join(', ') || 'None'}. Please explain these insights in the context of my exam prep.`;
        askArisMentor(contextPrompt);
        // Clear context file after triggering
        setActiveTutorFile(null);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [activeTab, activeTutorFile]);

  // Call Express API endpoint to route prompts to server-side Gemini
  const askArisMentor = async (customPrompt?: string) => {
    const promptToSend = customPrompt || irisInputPrompt;
    if (!promptToSend.trim()) return;

    // Append user message immediately
    const userMsg = { sender: 'user' as const, text: promptToSend, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setIrisMessages(prev => [...prev, userMsg]);
    setIrisInputPrompt('');
    setAiApiKeyLoading(true);

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: promptToSend,
          systemInstruction: `You are Aris, the stellar rank guide mentor for the RankForge AI system. The student's current profile is: Name: ${user.name}, Target Exam: ${user.targetExam}, Target Rank Goal: ${user.targetRank}, Accuracy: ${user.accuracy}%. Provide deep tactical exam advice, formulas, shortcuts, and direct concept summaries formatted beautifully with clear bullet points. Keep statements succinct, positive, encouraging, and rich with domain logic.`
        })
      });

      const data = await response.json();
      const arisMsg = {
        sender: 'aris' as const,
        text: data.text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setIrisMessages(prev => [...prev, arisMsg]);
    } catch (e) {
      console.error(e);
      // Fallback response
      const fallbackMsg = {
        sender: 'aris' as const,
        text: `Error connecting to AI service. [Local AI intelligence offline simulation]: Here is a quick breakdown to guide you:\n\n- **Core Rule**: Focus on sets and probability distributions, as they carry the maximum marks weightage. \n- **Shortcut**: 2^((n^2 - n)/2) holds for symmetric and reflexive relations. Avoid counting diagonals again.\n- **Action Required**: Solve 15 more medium difficulty questions in DBMS to reach high accuracy!`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setIrisMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setAiApiKeyLoading(false);
    }
  };

  // Preset quick mentor queries
  const handlePresetQuery = (topic: string) => {
    let text = `Explain DBMS normalization concepts and common structures.`;
    if (topic === 'prob') text = `How do I solve complex probability questions on without replacement draws quickly?`;
    if (topic === 'dsa') text = `Teach me recursion on binary tree pathways with simple coding samples.`;
    if (topic === 'gate') text = `What is a fast shortcut for calculating normal forms like 1NF, 2NF, 3NF, BCNF?`;
    askArisMentor(text);
  };

  // AI Syllabus Analyzer triggers custom mock parsing with specific stats
  const triggerSyllabusInsightAnalyzer = (syllabus: ExamSyllabus) => {
    setAnalyzingSyllabus(true);
    setTimeout(() => {
      let insightDetails: string[] = [];
      if (syllabus.examName === 'NIMCET') {
        insightDetails = [
          'Mathematics represents 60% of the entire rank weighted score. If you ace Math, you effortlessly clear AIR 200.',
          'Computer representation floating-point conversion is highly predictable. Master 2s complements.',
          'Syllogisms can be fully solved with Venn Diagram methods, minimizing typical speed errors.'
        ];
      } else if (syllabus.examName === 'CUET PG MCA') {
        insightDetails = [
          'NTA heavily tests DBMS query structures and concurrency locking transactions.',
          'Calculus limits carry crucial scoring components. Focus on L\'Hopital\'s rule applications.',
          'Recursion stack frames are frequently questioned in the computer section.'
        ];
      } else {
        insightDetails = [
          'Focus heavily on high-yield core modules representing substantial percentage totals.',
          'Consistency in previous year questions is the absolute differentiator for target rank.',
          'Time allocation should emphasize weak chapters before taking full-length mock simulations.'
        ];
      }

      setAnalyzerResult({
        totalTopics: syllabus.sections.reduce((acc, s) => acc + s.topics.length, 0),
        easyCount: 12 + Math.floor(Math.random() * 8),
        mediumCount: 16 + Math.floor(Math.random() * 8),
        hardCount: 8 + Math.floor(Math.random() * 5),
        recommendedHours: syllabus.examName === 'NIMCET' ? 420 : syllabus.examName === 'GATE CS' ? 650 : 320,
        insights: insightDetails
      });
      setAnalyzingSyllabus(false);
      setRecentNotification(`🤖 AI Analysis loaded successfully for ${syllabus.examName}.`);
    }, 1200);
  };

  // Premium Custom AI Roadmap generator
  const triggerAiPlannerRoadmap = (e: React.FormEvent) => {
    e.preventDefault();
    setRecentNotification('⚡ AI Planner is cooking up a high-precision sprint timeline...');
    setTimeout(() => {
      setGeneratedPlan({
        sprintTitle: `${plannerExam} High-Perf ${plannerMonths}-Month Roadmap (Aiming AIR ${plannerRank})`,
        weeks: [
          { weekNum: 1, focus: 'High Weightage Core & Diagnostics', topics: ['Set Theory foundations', 'Process Scheduling basics', 'Diagnostic mock test evaluation'], revisionDay: 'Saturday' },
          { weekNum: 2, focus: 'Mathematical Rigor & Binary Trees', topics: ['Linear Algebra systems', 'Binary search trees traversals', 'Speed and accuracy tests'], revisionDay: 'Sunday' },
          { weekNum: 3, focus: 'Database Normalization & Transactions', topics: ['1NF, 2NF, 3NF, BCNF rules', 'Functional Dependency sets', 'Concept drift review'], revisionDay: 'Saturday' },
          { weekNum: 4, focus: 'Probability, Combinatorics & Full Length Prep', topics: ['Baye\'s conditional probability draws', 'Graph traversals BFS/DFS', 'Full syllabus mock simulation'], revisionDay: 'Sunday' },
        ]
      });
      setRecentNotification('✅ Premium High-Rank roadmap generated based on your weak zones!');
    }, 800);
  };

  // Mock simulator triggers
  const startMockSimulation = (mock: MockTest) => {
    setSelectedMock(mock);
    setMockTimeRemaining(mock.durationMinutes * 60);
    setMockUserAnswers({});
    setMockActive(true);
    setMockScoreBreakdown(null);
    setRecentNotification(`📝 Live simulation initialized for ${mock.title}. Keep an eye on negative marking rules!`);
  };

  const submitMockTestEvaluation = () => {
    if (!selectedMock) return;
    setMockActive(false);

    let totalScore = selectedMock.totalQuestions * selectedMock.positiveMarking;
    let scored = 0;
    let correct = 0;
    let incorrect = 0;
    let unattempted = 0;

    selectedMock.questions.forEach((q) => {
      const userAns = mockUserAnswers[q.id];
      if (!userAns) {
        unattempted++;
      } else if (userAns === q.answer) {
        correct++;
        scored += selectedMock.positiveMarking;
      } else {
        incorrect++;
        scored -= selectedMock.negativeMarking; // apply exam-specific negative marks
      }
    });

    const accuracy = correct + incorrect > 0 ? Math.round((correct / (correct + incorrect)) * 100) : 0;
    
    setMockScoreBreakdown({
      title: selectedMock.title,
      exam: selectedMock.exam,
      score: scored,
      totalScore: totalScore,
      correct: correct,
      incorrect: incorrect,
      unattempted: unattempted,
      accuracy: accuracy,
      speedRate: Math.round(((selectedMock.durationMinutes * 60 - mockTimeRemaining) / (correct + incorrect || 1)) * 10) / 10
    });

    // Update real tracker points & predict rank
    setUser(prev => {
      const positiveMultiplier = scored > 0 ? scored : 10;
      let newRank = prev.targetRank;
      if (accuracy > 85) newRank = Math.max(10, Math.floor(prev.targetRank * 0.8));
      else if (accuracy < 60) newRank = Math.min(250, Math.floor(prev.targetRank * 1.2));
      return {
        ...prev,
        points: prev.points + 100 + positiveMultiplier,
        targetRank: newRank
      };
    });

    setSolvedCount(prev => prev + selectedMock.questions.length);
    updateProgress({ 
      dailyMocksAttempted: (userProgress.dailyMocksAttempted || 0) + 1
    });
    setCorrectCount(prev => prev + correct);
    setRecentNotification('📈 Mock analysis completed! Weak areas have been updated by Aris.');
  };

  const checkInStreakDay = () => {
    if (hasCheckedInToday) return;
    setHasCheckedInToday(true);
    setStreakCount(prev => prev + 1);
    setUser(prev => ({ ...prev, streak: prev.streak + 1, points: prev.points + 50 }));
    setRecentNotification('🔥 Multiplier activated! Daily streak successfully extended by 1 day.');
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setUser(prev => ({
      ...prev,
      name: profileNameInput,
      targetRank: profileRankInput,
      targetExam: profileExamInput
    }));
    setShowProfileDrawer(false);
    setRecentNotification('👤 Target profile successfully updated. AI Mentor recommendation model refreshed.');
  };

  // Curated playlists 
  const playlists = [
    { id: 'v1', title: 'Calculus & Integration Shortcuts', instructor: 'Prof. S. Sengupta', views: '24K', duration: '42 mins', category: 'Math', link: 'https://youtube.com/playlist?list=PL49C6D1F17FF5D99B' },
    { id: 'v2', title: 'DBMS Normalizations & Keys', instructor: 'Tech Prep Club', views: '45K', duration: '55 mins', category: 'DBMS/CS', link: 'https://youtube.com/playlist?list=PL52E8C047F4B0E8FA' },
    { id: 'v3', title: 'Permutations & Combinations for CAT', instructor: 'IIM Mastery', views: '89K', duration: '1 hr 12 mins', category: 'Math', link: 'https://youtube.com/playlist?list=PL2A3DFF7F4B0E8FC2' },
    { id: 'v4', title: 'OS CPU Scheduling Made Simple', instructor: 'NPTEL Gate Prep', views: '18K', duration: '38 mins', category: 'DBMS/CS', link: 'https://youtube.com/playlist?list=PL1A3DFF7F4B0E8FC1' },
    { id: 'v5', title: 'Analytical Puzzles and Visual Logic', instructor: 'Aptitude Hub', views: '32K', duration: '50 mins', category: 'Reasoning', link: 'https://youtube.com/playlist?list=PL3A3DFF7F4B0E8FC0' }
  ];

  // If user is not logged in, show the gorgeous immersive landing page and auth cards
  if (!isLoggedIn) {
    const handleGuestBypass = () => {
      localStorage.setItem('isLoggedIn', 'true');
      setIsLoggedIn(true);
      setRecentNotification('⚡ Logged in with Guest Sandbox pass! Enjoy all premium systems.');
    };

    const handleLoginSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      localStorage.setItem('isLoggedIn', 'true');
      setIsLoggedIn(true);
      setRecentNotification('👤 Welcome back! Your preparation cards are fully restored.');
    };

    const handleRegisterSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const newUser = {
        name: authRegName || 'Aryan Student',
        email: authRegEmail || 'student@rankforge.com',
        targetExam: authRegExam,
        targetRank: authRegRank,
        targetScore: authRegScore,
        graduationStream: 'BCA (Final Year)',
        streak: 1,
        points: 100,
        accuracy: 80.0,
        masteryPercentage: 45
      };
      setUser(newUser);
      localStorage.setItem('user_profile', JSON.stringify(newUser));
      localStorage.setItem('isLoggedIn', 'true');
      setIsLoggedIn(true);
      setRecentNotification('🚀 Welcome onboard! Your AI Rank Mentor is active.');
    };

    return (
      <div id="home-landing-page" className="min-h-screen bg-[#05060b] text-slate-100 flex flex-col font-sans antialiased relative selection:bg-indigo-500/30 selection:text-white">
        
        {/* FROSTED HEADER */}
        <header className="sticky top-0 bg-[#05060b]/80 backdrop-blur-xl border-b border-white/10 px-8 py-4 flex items-center justify-between z-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg">
              R
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                RankForge <span className="text-indigo-400 font-extrabold italic">AI</span>
              </span>
              <div className="text-[9px] text-indigo-300 font-bold uppercase tracking-wider">AI Entrance Copilot</div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
            <a href="#features" className="hover:text-white transition-colors" onClick={() => setShowAuthForm(false)}>Core Features</a>
            <a href="#stats" className="hover:text-white transition-colors" onClick={() => setShowAuthForm(false)}>Proven Metrics</a>
            <a href="#pricing" className="hover:text-white transition-colors" onClick={() => setShowAuthForm(false)}>Pricing</a>
          </nav>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                setAuthMode('login');
                setShowAuthForm(true);
              }}
              className="text-xs font-bold text-slate-300 hover:text-white px-3.5 py-1.5 transition-colors"
            >
              Sign In
            </button>
            <button 
              onClick={() => {
                setAuthMode('register');
                setShowAuthForm(true);
              }}
              className="text-xs font-bold bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-xl text-white shadow-lg shadow-indigo-500/20 transition-all"
            >
              Create Account
            </button>
          </div>
        </header>

        {/* NOTIFICATION STATUS RIBBON */}
        {recentNotification && (
          <div className="bg-indigo-600/25 border-b border-indigo-500/30 text-indigo-300 text-xs py-2 px-8 text-center font-semibold flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>{recentNotification}</span>
          </div>
        )}

        {/* AUTH FORM CARD CONTAINER */}
        {showAuthForm ? (
          <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-b from-[#05060b] via-[#0b0c16] to-[#05060b]">
            <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 w-full max-w-md shadow-2xl space-y-6">
              
              <div className="text-center">
                <span className="text-[10px] bg-indigo-500/15 text-indigo-300 px-2.5 py-1 rounded-full font-bold uppercase tracking-widest leading-none">
                  SECURE VERIFICATION SHIELD
                </span>
                <h2 className="text-2xl font-black text-white mt-3 tracking-tight">
                  {authMode === 'login' ? 'Welcome Back!' : 'Deploy AIR Carrier State'}
                </h2>
                <p className="text-xs text-slate-400 mt-1.5 font-medium">
                  {authMode === 'login' ? 'Please supply your login tokens to retrieve study boards' : 'Set your exam patterns so Aris can generate study roadmaps'}
                </p>
              </div>

              {/* Form select triggers */}
              <div className="grid grid-cols-2 p-1 bg-black/40 rounded-xl border border-white/5">
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className={`py-2 text-xs font-bold rounded-lg transition-colors ${authMode === 'login' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className={`py-2 text-xs font-bold rounded-lg transition-colors ${authMode === 'register' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                >
                  Create Account
                </button>
              </div>

              {authMode === 'login' ? (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[10px] text-slate-300 font-bold uppercase mb-1">Aspirant Email</label>
                    <input 
                      type="email"
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      placeholder="e.g. topper@entrance.com"
                      className="w-full bg-[#05060b] text-white border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-indigo-500 transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-300 font-bold uppercase mb-1">Pass-key Code</label>
                    <input 
                      type="password"
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#05060b] text-white border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-indigo-500 transition-colors"
                      required
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all"
                  >
                    Authenticate Account Security
                  </button>
                </form>
              ) : (
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] text-slate-300 font-bold uppercase mb-1">Aspirant Name</label>
                      <input 
                        type="text"
                        value={authRegName}
                        onChange={(e) => setAuthRegName(e.target.value)}
                        placeholder="Aryan Sharma"
                        className="w-full bg-[#05060b] text-white border border-white/10 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-indigo-500 transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-300 font-bold uppercase mb-1">Pass-key Code</label>
                      <input 
                        type="password"
                        value={authRegPassword}
                        onChange={(e) => setAuthRegPassword(e.target.value)}
                        placeholder="Min 6 chars"
                        className="w-full bg-[#05060b] text-white border border-white/10 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-indigo-500 transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-300 font-bold uppercase mb-1">Aspirant Email</label>
                    <input 
                      type="email"
                      value={authRegEmail}
                      onChange={(e) => setAuthRegEmail(e.target.value)}
                      placeholder="e.g. topper@entrance.com"
                      className="w-full bg-[#05060b] text-white border border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-indigo-500 transition-colors"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] text-slate-300 font-bold uppercase mb-1">Target Exam</label>
                      <select 
                        value={authRegExam}
                        onChange={(e) => setAuthRegExam(e.target.value as ExamType)}
                        className="w-full bg-[#0b0c16] text-white border border-white/10 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-indigo-500 transition-all"
                      >
                        <option value="NIMCET">NIMCET</option>
                        <option value="CUET PG MCA">CUET PG MCA</option>
                        <option value="GATE CS">GATE CS</option>
                        <option value="TANCET MCA">TANCET MCA</option>
                        <option value="CAT">CAT</option>
                        <option value="Placements">Placements</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-300 font-bold uppercase mb-1">Target Rank (AIR)</label>
                      <input 
                        type="number"
                        min="1"
                        max="10000"
                        value={authRegRank}
                        onChange={(e) => setAuthRegRank(Number(e.target.value))}
                        className="w-full bg-[#05060b] text-white border border-white/10 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-indigo-500 transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all"
                  >
                    Deploy Elite AIR Account
                  </button>
                </form>
              )}

              {/* Guest / Bypass CTA */}
              <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={handleGuestBypass}
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-indigo-600 hover:opacity-90 text-white text-xs font-extrabold rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                  <span>Interactive Sandbox Developer Bypassed Access</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowAuthForm(false)}
                  className="text-center text-[10px] text-slate-400 hover:text-white transition-colors underline"
                >
                  ← Go back to product explanation website
                </button>
              </div>

            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            
            {/* HERO HERO SECTION */}
            <section className="py-20 md:py-32 px-8 text-center bg-gradient-to-b from-[#05060b] via-[#0e111d] to-[#05060b] max-w-5xl mx-auto flex flex-col items-center gap-6 relative">
              <div className="absolute top-10 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
              
              <span className="px-3.5 py-1.5 bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-[10px] uppercase font-mono font-bold tracking-widest rounded-full leading-none flex items-center gap-2 animate-pulse">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>PREMIUM FULL-SUITE COGNITIVE STUDY COMPANION ACTIVE</span>
              </span>

              <h1 className="text-4xl md:text-6xl font-black text-white leading-none tracking-tight">
                Crack National Entrance Exams <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-teal-400">
                  With Adaptive AI Mentor Aris
                </span>
                </h1>

                <p className="text-sm md:text-base text-slate-400 leading-relaxed max-w-3xl pr-2">
                  Your high-capacity exam guide. Predicts your rank, generates custom 90-day sprints, solves 2022-2025 Previous Year Papers (PYQs), constructs real-time Weakness Heatmaps, and automates spaced revision routines for NIMCET, GATE CS, CUET PG, TANCET, CAT, and Placement Aptitude exams.
                </p>

                <div className="flex flex-wrap gap-4 justify-center pt-4 z-10">
                  <button
                    onClick={() => {
                      setAuthMode('register');
                      setShowAuthForm(true);
                    }}
                    className="px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold rounded-xl shadow-xl shadow-indigo-500/10 hover:scale-105 transition-all"
                  >
                    Start Your Sprint Journey (Free Account)
                  </button>
                  <button
                    onClick={handleGuestBypass}
                    className="px-6 py-3.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
                  >
                    <Sparkles className="w-4 h-4 text-indigo-400 animate-spin" />
                    <span>One-Click Guest Access Sandbox</span>
                  </button>
                </div>
              </section>

              {/* SYLLABI GRID PREVIEW */}
              <section className="py-12 bg-black/40 border-y border-white/5 px-8">
                <div className="max-w-7xl mx-auto space-y-6">
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-white">Officially Tracked Syllabi Coordinates</h3>
                    <p className="text-xs text-slate-400">Dynamic patterns adjusted directly for latest structural notification schedules</p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-center">
                    {[
                      { name: 'NIMCET', body: 'NIT Trichy PG' },
                      { name: 'CUET PG MCA', body: 'NTA Admissions' },
                      { name: 'GATE CS', body: 'IIT Joint Board' },
                      { name: 'TANCET MCA', body: 'Anna University' },
                      { name: 'CAT', body: 'IIM Admissions' },
                      { name: 'Placements', body: 'Campus Aptitude' }
                    ].map((e, idx) => (
                      <div key={idx} className="p-4 bg-white/5 border border-white/5 rounded-2xl flex flex-col justify-center">
                        <span className="block font-bold text-indigo-300 text-xs">{e.name}</span>
                        <span className="block text-[9px] text-slate-400 mt-1">{e.body}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* FEATURES GRID SECTION - BENTO STYLE */}
              <section id="features" className="py-20 px-8 max-w-7xl mx-auto space-y-12">
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-extrabold text-white">Full-Suite Features Mapped To Elite AIR Ranks</h2>
                  <p className="text-xs text-slate-400 max-w-xl mx-auto">We do not larp or supply dummy system lines. Every component integrates deep, responsive logic to elevate your scores.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  
                  <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md space-y-3.5">
                    <div className="w-9 h-9 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-indigo-400" />
                    </div>
                    <h4 className="font-bold text-white text-md">Official Previous Year Papers (PYQs) Library</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">Filter real exam papers from 2022 to 2025. Access comprehensive theoretical solutions, dynamic shortcut methods, structural pitfalls, and click to compile downloadable PDFs.</p>
                  </div>

                  <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md space-y-3.5">
                    <div className="w-9 h-9 bg-teal-500/10 rounded-xl border border-teal-500/20 text-teal-400 flex items-center justify-center">
                      <Activity className="w-5 h-5 text-teal-400" />
                    </div>
                    <h4 className="font-bold text-white text-md">Spaced Revision Intervals Scheduler</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">Aris tracks previous errors and prompts reviews at active 1, 3, 7, and 15-day intervals. Postpone tasks or check them off to extend your retention curve dynamically.</p>
                  </div>

                  <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md space-y-3.5">
                    <div className="w-9 h-9 bg-purple-500/10 rounded-xl border border-purple-500/20 text-purple-400 flex items-center justify-center">
                      <Award className="w-5 h-5 text-purple-400" />
                    </div>
                    <h4 className="font-bold text-white text-md">Relational College & Admission Predictor</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">Predict exactly which NITs, IITs, or Central Universities you fit based on target scores or mock rankings, categorized by General/OBC/SC/ST quotas.</p>
                  </div>

                  <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md space-y-3.5">
                    <div className="w-9 h-9 bg-rose-500/10 rounded-xl border border-rose-500/20 text-rose-400 flex items-center justify-center">
                      <Sliders className="w-5 h-5 text-rose-400" />
                    </div>
                    <h4 className="font-bold text-white text-md">AI Weakness Diagnostics Heatmap</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">Dynamic grid tracking your weakness bounds across probability, calculus limits, operating system processes, and logic representation algorithms.</p>
                  </div>

                  <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md space-y-3.5">
                    <div className="w-9 h-9 bg-yellow-500/10 rounded-xl border border-yellow-500/20 text-yellow-400 flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-yellow-500" />
                    </div>
                    <h4 className="font-bold text-white text-md">Gemini-Powered Aris AI Rank Mentor</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">Integrated core with prompt tuning to serve stepwise formula derivations, shortcut checks, and study plans directly, keeping you motivated daily.</p>
                  </div>

                  <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md space-y-3.5">
                    <div className="w-9 h-9 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <ClipboardCheck className="w-5 h-5 text-emerald-400" />
                    </div>
                    <h4 className="font-bold text-white text-md">Adaptive Practice marking multiplier</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">Choose MCQ, Numerical inputs, or Coding problems. Correct solutions dynamically elevate problem parameters while errors trigger simplified conceptual reviews.</p>
                  </div>

                </div>
              </section>

              {/* TESTIMONIALS SECTION */}
              <section className="py-20 bg-white/5 border-y border-white/10 px-8 text-center" id="stats">
                <div className="max-w-7xl mx-auto space-y-12">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-extrabold text-white">Proven Results Under Aris Core Supervision</h2>
                    <p className="text-xs text-slate-400">Read about real candidate experiences from NIMCET and GATE topper circles</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
                    <div className="p-6 rounded-3xl bg-black/40 border border-white/10 backdrop-blur space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-indigo-600/30 text-indigo-300 font-bold flex items-center justify-center text-xs">KC</div>
                        <div>
                          <h5 className="font-bold text-white text-xs">Keval Chandaria</h5>
                          <p className="text-[10px] text-indigo-400">NIMCET Target Rank Goal Achieve • AIR 12</p>
                        </div>
                      </div>
                      <p className="text-xs text-slate-300 italic leading-relaxed">
                        "The Spaced Revision intervals and bookmarked folders inside RankForge helped me retrieve key vector properties. Aris conditional probability shortcut formula method saved me 12 minutes in the actual exam! Phenomenal!"
                      </p>
                    </div>

                    <div className="p-6 rounded-3xl bg-black/40 border border-white/10 backdrop-blur space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-indigo-600/30 text-indigo-300 font-bold flex items-center justify-center text-xs">AV</div>
                        <div>
                          <h5 className="font-bold text-white text-xs">Anjali Verma</h5>
                          <p className="text-[10px] text-purple-400">GATE CS Target Rank Goal Achieve • AIR 42</p>
                        </div>
                      </div>
                      <p className="text-xs text-slate-300 italic leading-relaxed">
                        "I tracked my accuracy daily with the AI Weakness heatmap. When the DBMS normalization keys were red, the predictor guided me to revise transitive dependencies first, keeping me on track to clear top IIT qualifications!"
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* PRICING COMPARISON SECTION */}
              <section className="py-20 px-8 max-w-6xl mx-auto space-y-12" id="pricing">
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-extrabold text-white">Aspirant Tiers Fitted To Your Consistency</h2>
                  <p className="text-xs text-slate-400">Cancel or switch tiers anytime. Basic features are forever free.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                  <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur flex flex-col justify-between gap-6">
                    <div>
                      <span className="text-[9px] bg-white/15 px-2 py-0.5 rounded uppercase font-bold text-slate-400">Free Tier Standard</span>
                      <h4 className="text-2xl font-black text-white mt-2">Free Plan</h4>
                      <p className="text-xs text-slate-400 mt-1">Practice concepts on limited patterns</p>
                      <ul className="text-xs text-slate-300 space-y-2 mt-6">
                        <li>• 5 Adaptive study question sets/day</li>
                        <li>• Standard Syllabus Tracking views</li>
                        <li>• Standard Leaderboard ranking inclusion</li>
                      </ul>
                    </div>
                    <button 
                      onClick={handleGuestBypass}
                      className="w-full py-2.5 bg-white/10 hover:bg-white/15 rounded-xl text-xs font-bold text-white transition-all text-center"
                    >
                      Bypass with Guest Sandbox Access
                    </button>
                  </div>

                  <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-950/40 to-purple-950/20 border border-indigo-500/40 backdrop-blur flex flex-col justify-between gap-6 relative">
                    <span className="absolute top-4 right-4 bg-indigo-500 text-white text-[8px] px-2 py-0.5 rounded uppercase tracking-wider font-extrabold">BEST CHANCE</span>
                    <div>
                      <span className="text-[9px] bg-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded uppercase font-bold border border-indigo-500/25">Aspirant Rank Pro</span>
                      <h4 className="text-2xl font-black text-white mt-2">$15 / mo</h4>
                      <p className="text-xs text-slate-400 mt-1">Unlimited access to the ultimate AI prep engine</p>
                      <ul className="text-xs text-slate-300 space-y-2 mt-6">
                        <li>• <strong>Unlimited AI Explanations</strong> & Stepwise solutions</li>
                        <li>• Previous Year Papers Solvers (2022-2025)</li>
                        <li>• Dynamic College Predictor with Cutoffs & Placement logs</li>
                        <li>• AI Spaced Revision and Bookmarks Panel</li>
                        <li>• 24/7 Gemini-Powered Aris Chat Mentor</li>
                      </ul>
                    </div>
                    <button 
                      onClick={() => {
                        setAuthMode('register');
                        setShowAuthForm(true);
                      }}
                      className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl text-xs font-bold text-white shadow-lg transition-all text-center"
                    >
                      Register and Unlock Elite Access
                    </button>
                  </div>
                </div>
              </section>

              {/* FLOATING ROOT FOOTER */}
              <footer className="py-8 bg-black/60 border-t border-white/10 text-center text-[11px] text-slate-500">
                <p>© {new Date().getFullYear()} RankForge AI. Configured for NIMCET, GATE CS, CUET PG, TANCET, CAT, and Campus Placements.</p>
                <p className="mt-1">RankForge is an independent test-preparation copilot powered by server-side Gemini Core.</p>
              </footer>

            </div>
          )}

        </div>
      );
    }

  const currentSyllabus = EXAM_SYLLABI.find(s => s.id === selectedSyllabusId) || EXAM_SYLLABI[0];

  return (
    <GlobalLayout 
      activeTab={activeTab}
      isSwitchingTab={isSwitchingTab}
      isOffline={isOffline}
      isSyncing={isSyncing}
      lastSyncedAt={lastSyncedAt}
      handleGlobalSync={handleGlobalSync}
      showPerfMonitor={showPerfMonitor}
      setShowPerfMonitor={setShowPerfMonitor}
      perfMetrics={perfMetrics}
      viewportRef={viewportRef}
    >
      {/* Sidebar - Frosted Glass Glassmo style */}
      <aside id="sidebar-panel" className="hidden lg:flex w-[272px] flex-shrink-0 bg-white/5 border-r border-white/10 backdrop-blur-xl flex-col p-6 overflow-y-auto">
        <div className="flex items-center gap-3 mb-10 px-2 cursor-pointer" onClick={() => handleTabChange('dashboard')}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
            R
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              RankForge <span className="text-indigo-400 font-extrabold italic">AI</span>
            </span>
            <div className="text-[10px] text-indigo-300 font-medium tracking-widest uppercase">AIR Prep Engine</div>
          </div>
        </div>

        {/* Navigation panel */}
        <nav className="flex-1 space-y-6 pt-4" id="nav-list">
          
          <div>
            <button 
              id="nav-dashboard"
              disabled={isSwitchingTab}
              onClick={() => handleTabChange('dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all ${activeTab === 'dashboard' ? 'bg-white/10 text-white font-medium border-l-2 border-indigo-500' : 'text-slate-400 hover:bg-white/5 hover:text-white'} ${isSwitchingTab ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
            >
              <Layers className="w-4 h-4" />
              <span className="font-bold">Dashboard</span>
            </button>
          </div>

          <div className="space-y-1">
            <h3 className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Learn</h3>
            <button 
              disabled={isSwitchingTab}
              onClick={() => handleTabChange('syllabus')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all ${activeTab === 'syllabus' ? 'bg-white/10 text-white font-medium border-l-2 border-indigo-500' : 'text-slate-400 hover:bg-white/5 hover:text-white'} ${isSwitchingTab ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="text-sm font-medium">Syllabus</span>
            </button>
            <button 
              disabled={isSwitchingTab}
              onClick={() => handleTabChange('graph')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all ${activeTab === 'graph' ? 'bg-white/10 text-white font-medium border-l-2 border-indigo-500' : 'text-slate-400 hover:bg-white/5 hover:text-white'} ${isSwitchingTab ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
            >
              <GitMerge className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-sm font-medium">Concept Graph</span>
            </button>
            <button 
              disabled={isSwitchingTab}
              onClick={() => handleTabChange('books')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all ${activeTab === 'books' ? 'bg-white/10 text-white font-medium border-l-2 border-indigo-500' : 'text-slate-400 hover:bg-white/5 hover:text-white'} ${isSwitchingTab ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
            >
              <Book className="w-3.5 h-3.5" />
              <span className="text-sm font-medium">Books & Resources</span>
            </button>
            <button 
              disabled={isSwitchingTab}
              onClick={() => handleTabChange('videos')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all ${activeTab === 'videos' ? 'bg-white/10 text-white font-medium border-l-2 border-indigo-500' : 'text-slate-400 hover:bg-white/5 hover:text-white'} ${isSwitchingTab ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
            >
              <Film className="w-3.5 h-3.5" />
              <span className="text-sm font-medium">Lectures</span>
            </button>
          </div>

          <div className="space-y-1">
            <h3 className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Practice</h3>
            <button 
              disabled={isSwitchingTab}
              onClick={() => handleTabChange('practice')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all ${activeTab === 'practice' ? 'bg-white/10 text-white font-medium border-l-2 border-indigo-500' : 'text-slate-400 hover:bg-white/5 hover:text-white'} ${isSwitchingTab ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
            >
              <Code className="w-3.5 h-3.5" />
              <span className="text-sm font-medium">Practice Sets</span>
            </button>
            <button 
              disabled={isSwitchingTab}
              onClick={() => handleTabChange('pyq')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all ${activeTab === 'pyq' ? 'bg-white/10 text-white font-medium border-l-2 border-indigo-500' : 'text-slate-400 hover:bg-white/5 hover:text-white'} ${isSwitchingTab ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="text-sm font-medium">PYQ Library</span>
            </button>
            <button 
              disabled={isSwitchingTab}
              onClick={() => handleTabChange('mocks')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all ${activeTab === 'mocks' ? 'bg-white/10 text-white font-medium border-l-2 border-indigo-500' : 'text-slate-400 hover:bg-white/5 hover:text-white'} ${isSwitchingTab ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
            >
              <ClipboardCheck className="w-3.5 h-3.5" />
              <span className="text-sm font-medium">Mock Tests</span>
            </button>
            <button 
              disabled={isSwitchingTab}
              onClick={() => handleTabChange('analytics')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all ${activeTab === 'analytics' ? 'bg-white/10 text-white font-medium border-l-2 border-indigo-500' : 'text-slate-400 hover:bg-white/5 hover:text-white'} ${isSwitchingTab ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span className="text-sm font-medium">Revision Vault</span>
            </button>
          </div>

          <div className="space-y-1">
            <h3 className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">AI</h3>
            <button 
              id="nav-coach"
              onClick={() => {
                handleTabChange('coach');
                if (activeCoachSubTab === 'exam_updates') {
                  setActiveCoachSubTab('ask_mentor');
                }
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${activeTab === 'coach' && activeCoachSubTab !== 'exam_updates' ? 'bg-gradient-to-r from-indigo-500/15 to-purple-500/15 text-indigo-100 font-bold border-l-2 border-indigo-400' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
            >
              <BrainCircuit className="w-4 h-4 text-indigo-400" />
              <span className="font-bold text-sm">AI Rank Mentor</span>
            </button>
          </div>

          <div className="space-y-1">
            <h3 className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Smart Tools</h3>
            <button 
              id="nav-planner"
              onClick={() => handleTabChange('planner')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${activeTab === 'planner' ? 'bg-white/10 text-white font-medium border-l-2 border-indigo-500' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
            >
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-bold">Admissions & Planner</span>
            </button>

            <button 
              id="nav-news"
              onClick={() => {
                setActiveCoachSubTab('exam_updates');
                handleTabChange('coach');
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${activeTab === 'coach' && activeCoachSubTab === 'exam_updates' ? 'bg-white/10 text-white font-medium border-l-2 border-amber-500' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
            >
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-bold">News & Updates</span>
            </button>

            <button 
              id="nav-vault"
              onClick={() => handleTabChange('vault')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${activeTab === 'vault' ? 'bg-white/10 text-white font-medium border-l-2 border-indigo-500' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
            >
              <Database className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-bold">Knowledge Vault</span>
            </button>

            <button 
              id="nav-warroom"
              onClick={() => handleTabChange('warroom')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${activeTab === 'warroom' ? 'bg-white/10 text-white font-medium border-l-2 border-rose-500' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
            >
               <Target className="w-4 h-4 text-rose-500" />
               <span className="text-sm font-bold">AIR 50 War Room</span>
            </button>

            <button 
              id="nav-focus"
              onClick={() => handleTabChange('focus')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${activeTab === 'focus' ? 'bg-white/10 text-white font-medium border-l-2 border-emerald-500' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
            >
               <Zap className="w-4 h-4 text-emerald-400" />
               <span className="text-sm font-bold">Study Room</span>
            </button>

            <button 
              id="nav-roadmaps"
              onClick={() => handleTabChange('roadmaps')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${activeTab === 'roadmaps' ? 'bg-white/10 text-white font-medium border-l-2 border-purple-500' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
            >
               <Compass className="w-4 h-4 text-purple-400" />
               <span className="text-sm font-bold">Career Roadmaps</span>
            </button>
          </div>

        </nav>

        {/* Sidebar target display element */}
        <div className="mt-auto pt-6 border-t border-white/10 flex flex-col gap-3">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-700/30 to-purple-800/20 border border-indigo-500/20">
            <div className="flex justify-between items-start mb-1">
              <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider">Target Profile</span>
              <button 
                id="btn-edit-profile-trigger"
                onClick={() => {
                  setProfileNameInput(user.name);
                  setProfileExamInput(user.targetExam);
                  setProfileRankInput(user.targetRank);
                  setShowProfileDrawer(true);
                }}
                className="text-[10px] text-white hover:text-indigo-400 bg-white/10 px-1.5 py-0.5 rounded transition-all"
              >
                Change
              </button>
            </div>
            <p className="text-sm font-bold text-white tracking-tight">{user.targetExam}</p>
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>Goal Rank:</span>
              <span className="font-mono text-indigo-300 font-bold">AIR {user.targetRank}</span>
            </div>
            
            {/* Mastery mini progress */}
            <div className="w-full bg-black/40 h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" style={{ width: `${user.masteryPercentage}%` }}></div>
            </div>
            <p className="text-[10px] mt-1 text-slate-400">{user.masteryPercentage}% Syllabus Mastery</p>
          </div>

          {/* Points display */}
          <div className="flex justify-between items-center px-2 text-xs">
            <span className="text-slate-400">Preparation XP</span>
            <span className="text-indigo-300 font-bold font-mono">{user.points} XP</span>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#05060b]/95 backdrop-blur-xl border-t border-white/10 px-2 py-2 flex items-center justify-around safe-area-pb">
        {[
          { id: 'dashboard', icon: LayoutDashboard, label: 'Home' },
          { id: 'syllabus', icon: BookOpen, label: 'Learn' },
          { id: 'practice', icon: PenTool, label: 'Practice' },
          { id: 'vault', icon: Database, label: 'Vault' },
          { id: 'coach', icon: MessageSquareCode, label: 'AI Mentor' },
          { id: 'news', icon: AlertCircle, label: 'News' }
        ].map(item => (
          <button 
           key={item.id}
           onClick={() => {
             if (item.id === 'news') {
               setActiveCoachSubTab('exam_updates');
               handleTabChange('coach');
             } else {
               if (item.id === 'coach') {
                 setActiveCoachSubTab('ask_mentor');
               }
               handleTabChange(item.id as any);
             }
           }}
           className={`flex flex-col items-center p-2 rounded-xl text-[10px] font-bold transition-all ${activeTab === item.id || (item.id === 'news' && activeCoachSubTab === 'exam_updates') || (item.id === 'coach' && activeTab === 'coach' && activeCoachSubTab !== 'exam_updates') ? 'text-indigo-400 scale-105' : 'text-slate-400 hover:text-slate-300'}`}
          >
             <item.icon className={`w-5 h-5 mb-1 ${activeTab === item.id || (item.id === 'news' && activeCoachSubTab === 'exam_updates') || (item.id === 'coach' && activeTab === 'coach' && activeCoachSubTab !== 'exam_updates') ? 'stroke-2' : 'stroke-[1.5]'}`} />
             {item.label}
          </button>
        ))}
      </div>

      {/* Main Container */}
      <div id="main-viewport" ref={viewportRef} className="flex-1 flex flex-col min-w-0 overflow-y-auto pb-20 lg:pb-0 relative scroll-smooth">
        
        {/* ROUTE/TAB SWITCHING OVERLAY */}
        <AnimatePresence>
          {isSwitchingTab && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-40 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center space-y-4"
            >
              <div className="relative">
                 <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                 <Sparkles className="w-6 h-6 text-indigo-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
              </div>
              <div className="text-center">
                <h2 className="text-white font-black text-xl tracking-tight">Syncing Prep Engines...</h2>
                <p className="text-slate-400 text-xs mt-1 animate-pulse">Switching to {activeTab.toUpperCase()} workflow modules</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top Floating Notification and Global Header */}
        <header id="global-header" className="sticky top-0 bg-[#05060b]/80 backdrop-blur-lg border-b border-white/10 px-4 md:px-8 py-3 md:py-4 flex items-center justify-between z-30">
          <div className="flex items-center gap-2 md:gap-4">
            <div className="lg:hidden w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20 mr-2 flex-shrink-0">
              R
            </div>
            <h1 className="text-lg md:text-xl font-bold tracking-tight text-white flex items-center gap-2 truncate whitespace-nowrap">
              <span className="hidden sm:inline">Welcome, </span>{user.name.split(' ')[0]}
            </h1>
            
            {/* Live Streak indicator container */}
            <button 
              id="streak-indicator-btn"
              onClick={checkInStreakDay}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-all ${
                hasCheckedInToday 
                  ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' 
                  : 'bg-gradient-to-r from-orange-500 to-amber-500 text-white border-orange-400/50 hover:scale-105 shadow-md shadow-orange-500/10'
              }`}
              title={hasCheckedInToday ? "Checked in for today!" : "Click to claim daily bonus streak check-in!"}
            >
              <Flame className="w-3.5 h-3.5 animate-pulse text-orange-400" />
              <span>{streakCount} Day Streak</span>
              {!hasCheckedInToday && <span className="bg-white text-[#d97706] text-[8px] px-1 rounded ml-1 animate-bounce">Claim</span>}
            </button>

            {/* AIR Topper Mode Toggle */}
            <button
               onClick={() => {
                 setIsTopperMode(!isTopperMode);
                 displayNotice(isTopperMode ? 'AIR Topper Mode Disabled. Reverting to standard learning track.' : '🏆 AIR Topper Mode Activated! Switching to Top 100 targets.');
               }}
               className={`hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-all ${isTopperMode ? 'bg-gradient-to-r from-red-600 to-rose-500 text-white border-rose-400/50 shadow-md shadow-rose-900/30' : 'bg-slate-800/50 text-slate-400 border-slate-700/50 hover:bg-slate-800 hover:text-white'}`}
            >
               <Rocket className={`w-3.5 h-3.5 ${isTopperMode ? 'animate-pulse text-white' : ''}`} />
               <span>AIR Topper Mode</span>
            </button>
          </div>

          <div className="flex items-center gap-4">
            {/* Notification alert banner info */}
            {recentNotification && (
              <div className="hidden lg:flex items-center gap-2 text-xs bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 py-1.5 px-3.5 rounded-xl max-w-xs shrink truncate">
                <Sparkles className="w-3 h-3 text-indigo-400 shrink-0" />
                <span className="truncate">{recentNotification}</span>
              </div>
            )}

            <div className="flex items-center gap-1.5 md:gap-2.5">
              <button
                onClick={handleGlobalSync}
                disabled={isSyncing}
                className="group relative p-2 text-slate-400 hover:text-emerald-400 bg-white/5 hover:bg-emerald-500/10 border border-white/10 hover:border-emerald-500/20 rounded-xl transition-all cursor-pointer hidden sm:flex items-center gap-2"
                title="Refresh App Data"
              >
                <div className="flex items-center gap-1.5">
                  <span className={`${isSyncing ? 'animate-spin' : 'group-hover:animate-spin'}`}>
                    <RefreshCw className="w-4 h-4" />
                  </span>
                  <div className={`${isSyncing ? 'w-auto opacity-100' : 'opacity-0 w-0 group-hover:opacity-100 group-hover:w-auto'} overflow-hidden transition-all flex flex-col items-start whitespace-nowrap pl-1`}>
                    <span className="text-[10px] font-bold text-emerald-400">{isSyncing ? 'Syncing...' : 'Refresh Data'}</span>
                    <span className="text-[8px] font-mono text-slate-400 -mt-0.5">Last: {lastSyncedAt}</span>
                  </div>
                </div>
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`relative p-2 rounded-xl transition-all cursor-pointer ${showNotifications ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'text-slate-400 hover:text-amber-400 bg-white/5 hover:bg-amber-500/10 border border-white/10 hover:border-amber-500/20'}`}
                  title="Notifications & Updates"
                >
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex items-center justify-center rounded-full h-3 w-3 bg-amber-500 border border-black text-[7px] font-bold text-white">3</span>
                  </span>
                </button>

                {/* Universal Notification Center Dropdown */}
                {showNotifications && (
                  <div className="absolute top-full right-0 mt-3 w-80 bg-[#0e101a]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col z-50">
                    <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
                      <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                        <Bell className="w-4 h-4 text-indigo-400" />
                        Universal Notifications
                      </h3>
                      <button 
                        onClick={() => setShowNotifications(false)}
                        className="text-slate-400 hover:text-white"
                      >
                       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                      </button>
                    </div>
                    <div className="max-h-80 overflow-y-auto w-full p-2 space-y-1">
                      <div className="p-3 rounded-xl hover:bg-white/5 transition-all cursor-pointer group text-left">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20">News</span>
                          <span className="text-[10px] text-slate-500">12 min ago</span>
                        </div>
                        <h4 className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">NIMCET Counseling Round 2 Started</h4>
                        <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">Official notice out for verification process.</p>
                      </div>
                      
                      <div className="p-3 rounded-xl hover:bg-white/5 transition-all cursor-pointer group text-left">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase bg-red-500/10 text-red-400 border border-red-500/20">Deadline</span>
                          <span className="text-[10px] text-slate-500">3 hours ago</span>
                        </div>
                        <h4 className="text-xs font-bold text-white group-hover:text-red-400 transition-colors">CUET PG Registration Closing</h4>
                        <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">Only 3 Days left to finalize your preferences.</p>
                      </div>

                      <div className="p-3 rounded-xl hover:bg-white/5 transition-all cursor-pointer group text-left">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">AI Mentor</span>
                          <span className="text-[10px] text-slate-500">Just now</span>
                        </div>
                        <h4 className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">Study Streak Reached Day 4</h4>
                        <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">You just gained +85XP from Probability session.</p>
                      </div>
                    </div>
                    <div className="p-3 border-t border-white/5 bg-black/40 text-center">
                      <button 
                        onClick={() => {
                           setShowNotifications(false);
                           setActiveCoachSubTab('exam_updates');
                           handleTabChange('coach');
                        }}
                        className="text-xs font-bold text-indigo-400 hover:text-white transition-colors"
                      >
                        View All Exam Updates & News →
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  localStorage.removeItem('isLoggedIn');
                  setIsLoggedIn(false);
                  setRecentNotification('Successfully logged out of your RankForge mentor session.');
                }}
                className="hidden sm:block text-[11px] font-bold bg-white/5 hover:bg-red-500/20 text-slate-300 hover:text-red-400 border border-white/10 hover:border-red-500/30 px-3 py-1.5 rounded-xl transition-all ml-1"
                title="Logs out of current session"
              >
                Sign Out
              </button>

              <div className="w-8 h-8 md:w-9 md:h-9 rounded-full border border-indigo-500/40 bg-indigo-950/40 p-0.5 flex items-center justify-center text-xs font-bold text-indigo-300 cursor-help" title={`Active as ${user.email}`}>
                {user.name.split(' ').map(n=>n[0]).join('')}
              </div>
            </div>
          </div>
        </header>

        {/* Inner Content Body */}
        <Suspense fallback={<ModuleLoading title={`Initializing ${activeTab.toUpperCase()} workflow modules`} />}>
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="flex-1 flex flex-col"
            >
              {/* Contextual Sub-tab Header for Navigation Clarity */}
              {activeTab !== 'dashboard' && (
                <div className="px-8 py-6 bg-white/[0.02] border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[10px] text-indigo-400 font-mono font-black uppercase tracking-widest">
                      <CloudLightning className="w-3 h-3" />
                      <span>Prep Hub Navigation • {user.targetExam} Edition</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <h1 className="text-2xl font-black text-white tracking-tight">
                        {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Portfolio
                      </h1>
                      {isOffline && (
                        <div className="px-2 py-0.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[8px] font-black uppercase rounded flex items-center gap-1">
                          <WifiOff className="w-2.5 h-2.5" />
                          <span>Offline Cached</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleTabChange('dashboard')}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white text-xs font-bold transition-all flex items-center gap-2 w-fit"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>Return to Command Center</span>
                  </button>
                </div>
              )}

              <main className="p-4 md:p-8 flex-1" id="main-content-panel">

          {/* PROFILE CUSTOMIZER / DRAWER MODAL - IF OPENED */}
          {showProfileDrawer && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
              <div className="bg-[#0e101a] border border-white/20 rounded-3xl w-full max-w-md p-6 shadow-2xl relative">
                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                  <User className="w-5 h-5 text-indigo-400" />
                  <span>Customize Preparation Target</span>
                </h3>
                <p className="text-xs text-slate-400 mb-6 font-medium">Configure target goals so the AI Rank Mentor ("Aris") adapts the question levels and schedule rules.</p>
                
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Aspirant Name</label>
                    <input 
                      type="text" 
                      value={profileNameInput}
                      onChange={(e) => setProfileNameInput(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-indigo-500 transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Target Examination</label>
                    <select 
                      value={profileExamInput}
                      onChange={(e) => setProfileExamInput(e.target.value as ExamType)}
                      className="w-full bg-[#0e101a] border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-indigo-500 transition-all"
                    >
                      <option value="NIMCET">NIMCET (NITs MCA)</option>
                      <option value="CUET PG MCA">CUET PG MCA (DU, JNU, BHU)</option>
                      <option value="GATE CS">GATE CS (IITs, IISc)</option>
                      <option value="TANCET MCA">TANCET MCA (Anna University)</option>
                      <option value="CAT">CAT (IIMs MBA)</option>
                      <option value="Placements">Placements Coding Prep</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Target Rank AIR</label>
                      <input 
                        type="number"
                        min="1"
                        max="10000"
                        value={profileRankInput}
                        onChange={(e) => setProfileRankInput(Number(e.target.value))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-indigo-500 transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Current College GPA / CGPA</label>
                      <input 
                        type="text" 
                        value={profileGpaInput}
                        onChange={(e) => setProfileGpaInput(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-indigo-500 transition-all"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 pt-4">
                    <button 
                      type="button" 
                      onClick={() => setShowProfileDrawer(false)}
                      className="flex-1 py-2.5 rounded-xl border border-white/10 text-xs font-bold text-slate-300 hover:bg-white/5 transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold text-white shadow-lg transition-all"
                    >
                      Apply Target Update
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TAB 1: DASHBOARD VIEW */}
          {activeTab === 'dashboard' && (
            <div id="view-dashboard" className="space-y-6 md:space-y-8 animate-fadeIn">
              
              {/* Smart Resume Session Banner */}
              <div className="p-4 md:p-6 bg-gradient-to-r from-blue-900/40 via-indigo-900/20 to-black border border-blue-500/30 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden text-left shadow-lg shadow-blue-900/10 hover:border-blue-400/50 transition-all">
                 <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mt-32 -ml-32" />
                 <div className="relative z-10 flex items-center gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                     <PlayCircle className="w-6 h-6 text-blue-400" />
                   </div>
                   <div>
                     <h3 className="text-sm font-bold text-white tracking-tight">Welcome Back</h3>
                     <p className="text-xs text-slate-400 mt-1 font-medium">Last Activity: <span className="font-semibold text-slate-200">Probability → Bayes Theorem</span></p>
                   </div>
                 </div>
                 <button 
                   onClick={() => handleTabChange('practice')}
                   className="relative z-10 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-blue-900/40 border border-blue-400/30 cursor-pointer w-full md:w-auto text-center"
                 >
                   Continue Learning
                 </button>
              </div>

              {/* Exam Countdown Dashboard */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
                 <div className="p-5 bg-gradient-to-br from-indigo-900/20 to-[#0e101a] border border-white/5 hover:border-indigo-500/30 rounded-3xl transition-all shadow-lg group relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-500/10 blur-2xl rounded-full -mt-16 -mr-16 pointer-events-none transition-all group-hover:bg-indigo-500/20" />
                    <div className="flex items-center gap-2 mb-3 relative z-10">
                       <Calendar className="w-4 h-4 text-indigo-400" />
                       <span className="text-[10px] font-bold text-indigo-300 font-mono tracking-wider uppercase">NIMCET 2027</span>
                    </div>
                    <div className="text-3xl font-black text-white relative z-10">112 <span className="text-sm text-slate-500 font-medium tracking-normal">Days Left</span></div>
                 </div>
                 
                 <div className="p-5 bg-gradient-to-br from-amber-900/20 to-[#0e101a] border border-white/5 hover:border-amber-500/30 rounded-3xl transition-all shadow-lg group relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-32 h-32 bg-amber-500/10 blur-2xl rounded-full -mt-16 -mr-16 pointer-events-none transition-all group-hover:bg-amber-500/20" />
                    <div className="flex items-center gap-2 mb-3 relative z-10">
                       <Calendar className="w-4 h-4 text-amber-500" />
                       <span className="text-[10px] font-bold text-amber-400 font-mono tracking-wider uppercase">CUET PG MCA</span>
                    </div>
                    <div className="text-3xl font-black text-white relative z-10">86 <span className="text-sm text-slate-500 font-medium tracking-normal">Days Left</span></div>
                 </div>
                 
                 <div className="p-5 bg-gradient-to-br from-emerald-900/20 to-[#0e101a] border border-white/5 hover:border-emerald-500/30 rounded-3xl transition-all shadow-lg group relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-500/10 blur-2xl rounded-full -mt-16 -mr-16 pointer-events-none transition-all group-hover:bg-emerald-500/20" />
                    <div className="flex items-center gap-2 mb-3 relative z-10">
                       <Calendar className="w-4 h-4 text-emerald-400" />
                       <span className="text-[10px] font-bold text-emerald-300 font-mono tracking-wider uppercase">TANCET MCA</span>
                    </div>
                    <div className="text-3xl font-black text-white relative z-10">47 <span className="text-sm text-slate-500 font-medium tracking-normal">Days Left</span></div>
                 </div>
              </div>

              {/* Premium AI Study Companion Box */}
              <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-indigo-950/40 via-indigo-900/10 to-teal-950/10 border border-indigo-500/15 backdrop-blur-xl relative overflow-hidden text-left space-y-6">
                {/* Ambient gradient reflections */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-500/5 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
                      <span className="text-[10px] font-black tracking-widest text-indigo-400 font-mono uppercase">AI STUDY COMPANION ACTIVE</span>
                    </div>
                    <h2 className="text-2xl font-black text-white leading-tight">
                      {(() => {
                        const hr = new Date().getHours();
                        const greeting = hr < 12 ? 'Good Morning' : hr < 17 ? 'Good Afternoon' : 'Good Evening';
                        return `${greeting}, ${user.name || 'Topper'}!`;
                      })()}
                    </h2>
                    <p className="text-xs text-slate-400 font-medium">Your personalized daily targets are synced with NIMCET AI model predictors.</p>
                  </div>

                  <div className="flex items-center gap-3.5 bg-black/40 border border-white/5 p-2.5 rounded-2xl">
                    <div className="text-right px-1">
                      <span className="block text-[8px] font-mono text-slate-500 uppercase font-black">Daily XP</span>
                      <span className="text-xs font-black text-indigo-400 font-mono">+85 XP</span>
                    </div>
                    <div className="w-px h-8 bg-white/5" />
                    <button
                      onClick={() => {
                        handleTabChange('coach');
                        setRecentNotification('⚡ Launching Study Navigator AI co-pilot...');
                      }}
                      className="px-3.5 py-1.5 bg-indigo-600 hover:bg-slate-800 text-white font-bold text-[11px] rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-indigo-950/40 border border-indigo-500/20 active:scale-95"
                    >
                      <Sparkles className="w-3 h-3 text-amber-300" />
                      <span>Study Navigator</span>
                    </button>
                  </div>
                </div>

                {isTopperMode && (
                  <div className="bg-gradient-to-r from-rose-950/40 via-red-900/10 to-black border border-rose-500/20 p-5 rounded-2xl animate-fadeIn">
                     <div className="flex items-center gap-2 mb-3">
                        <Rocket className="w-4 h-4 text-rose-400" />
                        <span className="text-[10px] font-bold text-rose-400 font-mono tracking-wider uppercase">AIR 1–100 Target Track Active</span>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-3 bg-black/40 border border-white/5 rounded-xl">
                           <span className="block text-[10px] text-slate-500 font-mono mb-1">Speed Benchmark</span>
                           <span className="text-white text-xs font-bold leading-tight">Must solve MCQs within 45 seconds avg.</span>
                        </div>
                        <div className="p-3 bg-black/40 border border-white/5 rounded-xl">
                           <span className="block text-[10px] text-slate-500 font-mono mb-1">Daily Target</span>
                           <span className="text-white text-xs font-bold leading-tight">Additional 25 highly challenging PYQs unlocked.</span>
                        </div>
                        <div className="p-3 bg-black/40 border border-white/5 rounded-xl">
                           <span className="block text-[10px] text-slate-500 font-mono mb-1">High ROI Focus</span>
                           <span className="text-white text-xs font-bold leading-tight">Vector Calculus & CPU Scheduling.</span>
                        </div>
                     </div>
                  </div>
                )}

                {/* Active Goals Checklist */}
                <div className="space-y-3">
                  <span className="block text-[10px] font-mono text-slate-400 font-black tracking-wider uppercase">Today's Core Goals:</span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                    {[
                      { id: 'g1', title: 'Probability & Comb. Revision', category: 'Maths', desc: 'Read handbook chapter 12' },
                      { id: 'g2', title: 'Solve 15 OS & DBMS PYQs', category: 'CS Core', desc: 'Target 90%+ correctness ratio' },
                      { id: 'g3', title: 'Take Normalization Mock Test', category: 'Subject', desc: 'Complete under strict simulator' }
                    ].map((g) => {
                      return (
                        <div key={g.id} className="p-4 bg-black/40 border border-white/5 rounded-2xl flex items-start gap-3 hover:border-indigo-500/20 transition-all select-none">
                          <input 
                            type="checkbox" 
                            className="mt-0.5 w-4 h-4 rounded border-slate-500 text-indigo-600 focus:ring-indigo-500 bg-black cursor-pointer animate-none"
                            id={g.id}
                          />
                          <label htmlFor={g.id} className="cursor-pointer max-w-full">
                            <span className="block text-xs font-bold text-white leading-tight">{g.title}</span>
                            <span className="block text-[10px] text-slate-500 mt-0.5">{g.desc}</span>
                            <span className="inline-block text-[9px] text-indigo-400 font-mono font-bold uppercase mt-1 bg-indigo-500/10 px-1.5 py-0.5 rounded">
                              #{g.category}
                            </span>
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Motivation engine line */}
                <div className="p-3.5 bg-indigo-500/5 rounded-2xl border border-indigo-500/10 flex items-center gap-3 text-xs leading-relaxed text-indigo-200">
                  <span className="text-lg animate-bounce duration-1000">🔥</span>
                  <p>
                    <strong>Data-Driven Encouragement:</strong> You answered <strong className="text-white">{correctCount} correct questions</strong> over your prep cycle! Your active focus metrics indicate a high mastery of Probability, showing an accuracy surge of <strong className="text-emerald-400 font-extrabold font-mono">52% → 76%</strong>. Stay on target to hold an elite top 50 predicted rank!
                  </p>
                </div>
              </div>

              {/* Target Focus Banner & Key Metric Rings */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Metric 1: Predicted Rank */}
                <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
                      <span>Predicted AIR Zone</span>
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <h3 className="text-3xl font-extrabold text-white mt-2 tracking-tight">AIR {user.targetRank}</h3>
                    <p className="text-emerald-400 text-xs mt-2 font-medium">↑ Improved by 12 ranks based on accuracy models</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/10 flex justify-between text-[11px] text-slate-400">
                    <span>Target Goal: Top {user.targetRank}</span>
                    <span className="font-bold text-indigo-400">Level: Active</span>
                  </div>
                </div>

                {/* Metric 2: Platform Accuracy */}
                <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
                      <span>Dynamic Accuracy</span>
                      <Award className="w-3.5 h-3.5 text-indigo-400" />
                    </div>
                    <div className="flex items-baseline gap-2 mt-2">
                      <h3 className="text-3xl font-extrabold text-white tracking-tight">{user.accuracy}%</h3>
                      <span className="text-xs text-indigo-300 font-bold">Top 2%</span>
                    </div>
                    <p className="text-indigo-300 text-xs mt-2 font-medium">Calculated over {solvedCount} practice attempts</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/10 flex justify-between text-[11px] text-slate-400">
                    <span>{correctCount} Correct answers</span>
                    <span className="font-bold text-emerald-400">High efficiency</span>
                  </div>
                </div>

                {/* Metric 3: Target Exam Booster */}
                <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
                      <span>Syllabus Target</span>
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mt-3 truncate">{user.targetExam} 2026</h3>
                    <p className="text-amber-400 text-xs mt-2 font-medium">Negative marking applied automatically</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/10 flex justify-between text-[11px] text-slate-400">
                    <span>Exam Pattern loaded</span>
                    <button onClick={() => handleTabChange('syllabus')} className="text-indigo-400 hover:underline font-bold">Explore Plan</button>
                  </div>
                </div>
              </div>

              {/* Main Column layout: Daily Tasks vs AI Mentor suggestions */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* LEFT: Today's Tasks & Sprints Router */}
                <div className="lg:col-span-8 p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="text-lg font-bold text-white">Today's Daily AI Roadmap</h2>
                      <p className="text-xs text-slate-400">Action items aligned with your weak subjects & exams</p>
                    </div>
                    <span className="text-xs text-indigo-400 font-bold bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
                      {roadmapTasks.filter(t => !t.completed).length} Pending Steps
                    </span>
                  </div>

                  <div className="space-y-3.5 flex-1 select-none">
                    {roadmapTasks.map((task) => (
                      <div 
                        key={task.id} 
                        onClick={() => {
                          setRoadmapTasks(prev => prev.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t));
                          if (!task.completed) {
                            setUser(p => ({ ...p, points: p.points + task.xp }));
                            setRecentNotification(`⭐ Completed "${task.title}"! Earned +${task.xp} XP towards your rank build.`);
                          }
                        }}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 ${
                          task.completed 
                            ? 'bg-emerald-500/5 border-emerald-500/20 hover:bg-emerald-500/10 opacity-75' 
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all ${
                          task.completed 
                            ? 'bg-emerald-500 border-emerald-400 text-white' 
                            : 'border-white/20 hover:border-indigo-500'
                        }`}>
                          {task.completed && <Check className="w-4 h-4 text-white" />}
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm font-semibold transition-all ${task.completed ? 'text-slate-400 line-through' : 'text-white'}`}>
                            {task.title}
                          </p>
                          <p className="text-xs text-slate-400 font-medium">{task.desc}</p>
                        </div>
                        <div className="text-xs font-semibold text-indigo-400 bg-indigo-400/10 px-2 py-1 rounded">
                          +{task.xp} XP
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Dynamic Target Quick Action Buttons */}
                  <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button 
                      onClick={() => {
                        handleTabChange('coach');
                        setRecentNotification('🎯 Study Navigator is evaluating priority study plans...');
                      }} 
                      className="py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 text-white font-bold text-xs flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer shadow-lg"
                    >
                      <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-200" />
                      <span>Run Study Navigator</span>
                    </button>
                    <button 
                      onClick={() => handleTabChange('practice')} 
                      className="py-3 px-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-white/10 transition-all text-center cursor-pointer"
                    >
                      <Code className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Start Adaptive Study</span>
                    </button>
                    <button 
                      onClick={() => handleTabChange('mocks')} 
                      className="py-3 px-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs hover:bg-white/10 transition-all text-center cursor-pointer"
                    >
                      Take Live Mock Test
                    </button>
                  </div>
                </div>

                {/* RIGHT: Mentor Aris interactive widget */}
                <div id="mentor-summary-panel" className="lg:col-span-4 flex flex-col gap-6">
                  
                  <div className="p-6 rounded-3xl bg-gradient-to-b from-indigo-600/20 to-purple-800/10 border border-white/20 backdrop-blur-xl flex flex-col justify-between shadow-2xl relative overflow-hidden">
                    
                    {/* Glowing highlight sphere */}
                    <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/30 rounded-full blur-2xl pointer-events-none"></div>

                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-indigo-600 font-bold shadow-lg shadow-indigo-500/10">
                          <Sparkles className="w-5 h-5 text-indigo-600 animate-pulse" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-white leading-tight">Aris</h3>
                          <p className="text-[10px] text-indigo-300 font-semibold uppercase tracking-wider">Your Personal Rank Mentor</p>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 mb-4">
                        <p className="text-xs text-slate-300 leading-relaxed italic">
                          "Aryan, current probability scoring pattern represents your primary bottleneck. I have calculated that improving statistics accuracy to 75% will boost your projected rank by 35 indices. Click below to practice conditional logic immediately or ask a quick question!"
                        </p>
                      </div>

                      <div className="space-y-3">
                        <p className="text-[10px] text-white/50 uppercase font-bold tracking-widest">Weakness Diagnostics</p>
                        
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-300">Discrete Mathematics</span>
                            <span className="text-emerald-400">92% Match</span>
                          </div>
                          <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: '92%' }}></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-300">Probability & Variance</span>
                            <span className="text-red-400">52% Weak</span>
                          </div>
                          <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                            <div className="h-full bg-red-400 rounded-full" style={{ width: '52%' }}></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-300">Operating System Paging</span>
                            <span className="text-amber-400">74% Medium</span>
                          </div>
                          <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-400 rounded-full" style={{ width: '74%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleTabChange('tutor')} 
                      className="mt-6 w-full py-3.5 rounded-2xl bg-white text-indigo-600 font-bold text-xs shadow-xl shadow-indigo-950/20 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                      Ask Aris a Concept
                    </button>
                  </div>

                  {/* Quick stats mini ribbon for upcoming national live mock test */}
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-emerald-400 tracking-wider uppercase">Next Live National Mock</span>
                      <p className="text-sm font-bold text-white">Full Syllabus Trial #12</p>
                    </div>
                    <button 
                      onClick={() => {
                        const firstMock = MOCK_TESTS.find(m => m.exam === user.targetExam) || MOCK_TESTS[0];
                        handleTabChange('mocks');
                        startMockSimulation(firstMock);
                      }}
                      className="text-xs bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold px-3 py-1.5 rounded-lg transition-all"
                    >
                      Begin
                    </button>
                  </div>

                  {/* Upcoming National Entrance Deadlines Widget */}
                  <div className="p-5 rounded-3xl bg-white/5 border border-white/10 text-left space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black tracking-widest text-indigo-400 font-mono uppercase">⏰ TRACKING DEADLINES</span>
                      <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">Active</span>
                    </div>
                    <div className="space-y-2.5">
                      {[
                        { exam: 'NIMCET 2026', task: 'Admit Card Release Portal', days: '8 Days Left', date: 'June 14', priority: 'critical' },
                        { exam: 'CUET PG MCA 2026', task: 'Response Correction Window', days: '22 Days Left', date: 'June 28', priority: 'important' },
                        { exam: 'NSP Scholarship 2026', task: 'MHRD Fee Waiver Application', days: '29 Days Left', date: 'July 05', priority: 'standard' }
                      ].map((d, index) => {
                        const isCrit = d.priority === 'critical';
                        return (
                          <div key={index} className="p-3 bg-black/45 rounded-2xl border border-white/5 flex justify-between items-center transition-all hover:border-white/15">
                            <div className="space-y-0.5">
                              <span className="block text-[8px] font-mono text-slate-500 uppercase font-black">{d.exam}</span>
                              <span className="block text-xs font-bold text-white leading-tight">{d.task}</span>
                              <span className="block text-[10px] text-slate-400">Due Date: {d.date}</span>
                            </div>
                            <span className={`px-2 py-0.5 text-[9px] font-mono font-bold rounded ${
                              isCrit ? 'bg-red-500/10 text-red-400 animate-pulse' : d.priority === 'important' ? 'bg-orange-500/10 text-orange-400' : 'bg-emerald-500/10 text-emerald-400'
                            }`}>
                              {d.days}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    <button
                      onClick={() => {
                        setActiveCoachSubTab('exam_updates');
                        handleTabChange('coach');
                      }}
                      className="w-full text-center py-2.5 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 rounded-xl text-[10px] text-indigo-300 font-bold uppercase transition-all tracking-wide cursor-pointer active:scale-95"
                    >
                      Browse Entrance updates
                    </button>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* TAB 1.5: AI STUDY COACH & COMPANION HUB */}
          {activeTab === 'coach' && (
            <div id="view-coach" className="animate-fadeIn space-y-8">
              <AICoachNavigator 
                user={user}
                solvedCount={solvedCount}
                correctCount={correctCount}
                progress={userProgress}
                onUpdateProgress={updateProgress}
                initialSubTab={activeCoachSubTab}
                onNavigateToTab={(tab) => {
                  handleTabChange(tab);
                  // Clean subtabs if any
                  if (tab === 'syllabus') setSyllabusSubTab('standard');
                }}
                displayNotice={(msg) => setRecentNotification(msg)}
                onUpdateAdminConfig={(config) => {
                  setUser(prev => ({
                    ...prev,
                    targetScore: Math.round(config.cutoffBaselineScore || config.cutoffMark || prev.targetScore)
                  }));
                }}
              />
            </div>
          )}

          {/* TAB 2: SYLLABUS INTELLIGENCE & HUB */}
          {activeTab === 'syllabus' && (
            <div id="view-syllabus" className="space-y-8 animate-fadeIn">
              
              {/* Premium Syllabus Switcher */}
              <div className="flex gap-2 p-1.5 bg-black/40 border border-white/10 rounded-2xl w-fit">
                <button
                  id="btn-syllabus-standard"
                  onClick={() => setSyllabusSubTab('standard')}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    syllabusSubTab === 'standard'
                      ? 'bg-indigo-600 text-white font-extrabold shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  📊 Official National Syllabus Intelligence
                </button>
                <button
                  id="btn-syllabus-university"
                  onClick={() => setSyllabusSubTab('university_hubs')}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    syllabusSubTab === 'university_hubs'
                      ? 'bg-indigo-600 text-white font-extrabold shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🏫 University Entrance Portals (VIT, SRM, Anna Uni)
                </button>
              </div>

              {syllabusSubTab === 'university_hubs' ? (
                <UniversitySyllabusHub />
              ) : (
                <>
                  {/* Search & Selection Controls Panel */}
                  <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-white">Official Syllabus Intelligence Hub</h2>
                    <p className="text-xs text-slate-400">Check official subjects, track topics mastery, and boost target weights.</p>
                  </div>

                  {/* Filter tabs */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button 
                      onClick={() => setSyllabusFilterEdu(syllabusFilterEdu === 'ALL' ? 'PG' : syllabusFilterEdu === 'PG' ? 'UG' : 'ALL')}
                      className="text-xs bg-white/5 border border-white/10 hover:border-indigo-500 px-3 py-1.5 rounded-lg text-slate-300 font-medium transition-all"
                    >
                      Level: <span className="text-indigo-400 font-bold">{syllabusFilterEdu}</span>
                    </button>
                    <button 
                      onClick={() => setSyllabusFilterStream(
                        syllabusFilterStream === 'ALL' ? 'Computer Applications' : 
                        syllabusFilterStream === 'Computer Applications' ? 'Engineering' : 
                        syllabusFilterStream === 'Engineering' ? 'Management' : 'ALL'
                      )}
                      className="text-xs bg-white/5 border border-white/10 hover:border-indigo-500 px-3 py-1.5 rounded-lg text-slate-300 font-medium transition-all"
                    >
                      Stream: <span className="text-indigo-400 font-bold">{syllabusFilterStream.substring(0, 15)}</span>
                    </button>
                  </div>
                </div>

                {/* Exam select pills */}
                <div className="flex flex-wrap gap-2.5">
                  {EXAM_SYLLABI.filter(s => {
                    const matchEdu = syllabusFilterEdu === 'ALL' ? true : s.educationLevel === syllabusFilterEdu;
                    const matchStream = syllabusFilterStream === 'ALL' ? true : s.stream === syllabusFilterStream;
                    return matchEdu && matchStream;
                  }).map((examItem) => (
                    <button
                      key={examItem.id}
                      onClick={() => {
                        setSelectedSyllabusId(examItem.id);
                        setAnalyzerResult(null);
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all relative ${
                        selectedSyllabusId === examItem.id 
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg' 
                          : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/5'
                      }`}
                    >
                      {examItem.examName}
                      <span className="ml-1 text-[9px] opacity-75 font-normal">({examItem.course})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Syllabus Layout Details */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Side: Exam Specifications & Topic List */}
                <div className="lg:col-span-8 space-y-6">
                  
                  {/* General specs summary */}
                  <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
                    <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-2xl font-black text-white">{currentSyllabus.examName}</h2>
                          <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider border border-emerald-500/30">
                            ✓ Official Syllabus Verified
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">Conducting Body: <span className="text-slate-200 font-semibold">{currentSyllabus.conductingBody}</span></p>
                      </div>

                      <a 
                        href={currentSyllabus.officialWebsite} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-xs font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/25 px-3.5 py-2 rounded-xl flex items-center gap-1 transition-all"
                      >
                        <span>Official Portal</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    {/* Standard details row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/5">
                      <div className="p-2 bg-white/5 rounded-xl border border-white/5">
                        <span className="block text-[10px] text-slate-400 font-semibold uppercase">Exam Mode</span>
                        <p className="text-xs font-bold text-white">{currentSyllabus.examMode}</p>
                      </div>
                      <div className="p-2 bg-white/5 rounded-xl border border-white/5">
                        <span className="block text-[10px] text-slate-400 font-semibold uppercase">Duration</span>
                        <p className="text-xs font-bold text-white">{currentSyllabus.duration}</p>
                      </div>
                      <div className="p-2 bg-white/5 rounded-xl border border-white/5">
                        <span className="block text-[10px] text-slate-400 font-semibold uppercase">Total Questions</span>
                        <p className="text-xs font-bold text-white">{currentSyllabus.totalQuestions} Qs</p>
                      </div>
                      <div className="p-2 bg-white/5 rounded-xl border border-white/5">
                        <span className="block text-[10px] text-slate-400 font-semibold uppercase">Negative Value</span>
                        <p className="text-xs font-bold text-red-300 line-clamp-1">{currentSyllabus.negativeMarking}</p>
                      </div>
                    </div>
                  </div>

                  {/* Syllabus Modules details */}
                  <div className="space-y-4">
                    <h3 className="text-md font-bold text-slate-300 px-1">Subject & Topic Breakdown</h3>
                    
                    {currentSyllabus.sections.map((section, idx) => (
                      <div key={idx} className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
                        <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/5">
                          <h4 className="font-bold text-white text-sm">{section.title}</h4>
                          <span className="text-xs font-semibold text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded">
                            {section.weightage}
                          </span>
                        </div>

                        <div className="space-y-4">
                          {section.topics.map((topic, tcIdx) => {
                            const progressVal = getTopicCompletionProgress(topic.name);
                            const isExpanded = expandedTopic === topic.name;
                            const topicSubtopics = getDetailedSubtopics(topic.name);
                            
                            return (
                              <div key={tcIdx} className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden transition-all duration-300">
                                {/* Header Row */}
                                <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 hover:bg-white/[0.02] transition-all">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0 select-none"></span>
                                      <span className="font-bold text-white text-xs">{topic.name}</span>
                                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-black tracking-wider uppercase ${
                                        topic.importance === 'High' ? 'bg-red-500/15 text-red-400 border border-red-500/20' :
                                        topic.importance === 'Medium' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20' :
                                        'bg-slate-500/15 text-slate-300 border border-slate-500/20'
                                      }`}>
                                        {topic.importance} Weightage
                                      </span>
                                      
                                      {/* AI Topic ROI Meter */}
                                      <div className="ml-auto md:ml-2 flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded self-start md:self-auto">
                                         <BrainCircuit className="w-3 h-3 text-indigo-400" />
                                         <span className="text-[9px] font-bold text-slate-300">
                                            Return on Time: <span className={topic.importance === 'High' ? 'text-emerald-400 font-extrabold' : 'text-slate-200'}>{topic.importance === 'High' ? 'Extremely High' : 'Average'}</span>
                                         </span>
                                      </div>
                                    </div>
                                    <p className="text-slate-400 text-[10px] mt-1 pr-4 line-clamp-1">Syllabus: {topic.subtopics.join(', ')}</p>
                                    
                                    {/* Mastery Progress System */}
                                    <div className="mt-2.5 flex items-center gap-2.5 max-w-md">
                                      <div className="text-[10px] font-mono text-slate-400 select-none bg-black/30 px-1.5 py-0.5 rounded">
                                        {'█'.repeat(Math.round(progressVal / 10)) + '░'.repeat(10 - Math.round(progressVal / 10))}
                                      </div>
                                      <div className="flex-1 bg-white/10 h-1.5 rounded-full overflow-hidden">
                                        <div 
                                          className="bg-gradient-to-r from-emerald-500 to-indigo-500 h-full rounded-full transition-all duration-500" 
                                          style={{ width: `${progressVal}%` }}
                                        />
                                      </div>
                                      <span className="text-[10px] font-mono font-bold text-emerald-400 shrink-0">{progressVal}% Complete</span>
                                    </div>
                                  </div>

                                  {/* Actions buttons */}
                                  <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                                    <button
                                      onClick={() => {
                                        setSelectedTopicPath({
                                          name: topic.name,
                                          importance: topic.importance,
                                          subtopics: topic.subtopics,
                                          subject: (section.title.toLowerCase().includes('computer') || section.title.toLowerCase().includes('dbms') || section.title.toLowerCase().includes('os'))
                                            ? 'Computer Science' 
                                            : (section.title.toLowerCase().includes('math') || section.title.toLowerCase().includes('calculus'))
                                              ? 'Mathematics'
                                              : 'Quantitative Aptitude'
                                        });
                                        setActiveTopicPathTab('notes');
                                      }}
                                      className="py-1 px-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[10px] text-slate-300 font-bold transition-all"
                                    >
                                      Insight Path
                                    </button>
                                    <button 
                                      onClick={() => setExpandedTopic(isExpanded ? null : topic.name)}
                                      className={`py-1 px-3 border rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 ${
                                        isExpanded 
                                          ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/40 shadow-inner' 
                                          : 'bg-gradient-to-r from-indigo-500/25 to-purple-500/25 hover:from-indigo-500/35 hover:to-purple-500/35 text-white border-indigo-500/30'
                                      }`}
                                    >
                                      <span>{isExpanded ? 'Hide Subtopics Tree' : 'Explore Tree'}</span>
                                      <span className="text-[9px] opacity-75">({topicSubtopics.length})</span>
                                    </button>
                                  </div>
                                </div>

                                {/* Accordion Subtopics Tree view */}
                                {isExpanded && (
                                  <div className="p-4 bg-black/25 border-t border-white/5 space-y-3 font-sans relative">
                                    {/* Tree visual line guide */}
                                    <div className="absolute left-6 top-3 bottom-8 w-px bg-white/10 pointer-events-none select-none"></div>
                                    
                                    {topicSubtopics.map((sub, sIdx) => {
                                      const isLast = sIdx === topicSubtopics.length - 1;
                                      const subProgress = getSubtopicProgress(sub.id);
                                      const isSubBookmarked = subtopicBookmarks.includes(sub.id);
                                      
                                      // Status emoji/color indicator
                                      let statusIndicator = '⚪';
                                      let statusColorClass = 'text-slate-500';
                                      if (subProgress === 100) {
                                        statusIndicator = '✅';
                                        statusColorClass = 'text-emerald-400 font-extrabold';
                                      } else if (subProgress >= 60) {
                                        statusIndicator = '🟡';
                                        statusColorClass = 'text-amber-400 font-bold';
                                      } else if (subProgress > 0) {
                                        statusIndicator = '🔴';
                                        statusColorClass = 'text-rose-400 font-bold';
                                      }
                                      
                                      return (
                                        <div key={sub.id} className="flex gap-2 items-start relative pl-6 group">
                                          {/* Tree branch connector lines */}
                                          <span className="absolute left-0 text-slate-600 select-none text-xs -mt-0.5">
                                            {isLast ? '└──' : '├──'}
                                          </span>
                                          
                                          {/* Subtopic Main Info */}
                                          <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-3 p-2 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-all">
                                            <div className="flex items-center gap-2 flex-wrap">
                                              <span className="select-none text-sm">{statusIndicator}</span>
                                              <span className={`text-xs font-semibold ${statusColorClass}`}>{sub.name}</span>
                                              <span className="text-[10px] font-mono text-slate-500">({subProgress}% Complete)</span>
                                              {isSubBookmarked && <span className="text-[9px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded font-bold border border-indigo-500/30">Bookmark Included</span>}
                                            </div>
                                            
                                            {/* Subtopic Activity Actions Grid */}
                                            <div className="flex flex-wrap items-center gap-1.5 select-none self-end md:self-auto uppercase tracking-wider text-[8px] font-bold">
                                              <button 
                                                onClick={() => {
                                                  setSelectedSubtopic(sub);
                                                  setActiveSubtopicTab('theory');
                                                  setQuizCurrentIndex(0);
                                                  setQuizAnswers({});
                                                  setQuizChecked(false);
                                                }}
                                                className="px-2 py-1 rounded bg-white/5 border border-white/5 hover:border-emerald-500 hover:text-emerald-400 text-slate-300 transition-all flex items-center gap-1"
                                                title="Read deep study theory guide"
                                              >
                                                <span>📖 Learn</span>
                                              </button>
                                              
                                              <button 
                                                onClick={() => {
                                                  setSelectedSubtopic(sub);
                                                  setActiveSubtopicTab('notes');
                                                }}
                                                className="px-2 py-1 rounded bg-white/5 border border-white/5 hover:border-teal-500 hover:text-teal-400 text-slate-300 transition-all flex items-center gap-1"
                                                title="View 3-minute quick revision notes"
                                              >
                                                <span>📝 Notes</span>
                                              </button>
                                              
                                              <button 
                                                onClick={() => {
                                                  setSelectedSubtopic(sub);
                                                  setActiveSubtopicTab('quiz');
                                                  setQuizCurrentIndex(0);
                                                  setQuizAnswers({});
                                                  setQuizChecked(false);
                                                  setQuizFeedbackMsg('');
                                                }}
                                                className="px-2 py-1 rounded bg-white/5 border border-white/5 hover:border-indigo-500 hover:text-indigo-400 text-slate-300 transition-all flex items-center gap-1"
                                                title="Take 5-question micro quiz assessment"
                                              >
                                                <span>🎯 Quiz</span>
                                              </button>
                                              
                                              <button 
                                                onClick={() => {
                                                  setSelectedSubtopic(sub);
                                                  setActiveSubtopicTab('flashcards');
                                                  setFcActiveId(null);
                                                  setFcIsFlipped(false);
                                                }}
                                                className="px-2 py-1 rounded bg-white/5 border border-white/5 hover:border-fuchsia-500 hover:text-fuchsia-400 text-slate-300 transition-all flex items-center gap-1"
                                                title="Review AI active recall flashcards"
                                              >
                                                <span>🎴 Flashcards</span>
                                              </button>

                                              <button 
                                                onClick={() => {
                                                  handleTabChange('tutor');
                                                  setIrisInputPrompt(`Aris, explain the specific concepts, real-life applications, and step-by-step methods for solving problems in "${sub.name}". Provide concise, exam-focused tricks!`);
                                                  setRecentNotification(`🤖 Formulated Ask Aris prompt for ${sub.name}!`);
                                                }}
                                                className="px-2 py-1 rounded bg-white/5 border border-white/5 hover:border-amber-500 hover:text-amber-400 text-slate-400 transition-all flex items-center gap-1"
                                              >
                                                <span>🤖 Ask</span>
                                              </button>

                                              <button 
                                                onClick={() => toggleSubtopicBookmark(sub.id)}
                                                className={`p-1 rounded border transition-all ${
                                                  isSubBookmarked 
                                                    ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' 
                                                    : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
                                                }`}
                                              >
                                                <span>⭐</span>
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                </div>

                {/* Right Side: AI Analytical Assistant */}
                <div className="lg:col-span-4 space-y-6">
                  
                  {/* AI Syllabus Analyzer widget */}
                  <div className="p-6 rounded-3xl bg-indigo-950/20 border border-indigo-500/30 backdrop-blur-md flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
                      <h4 className="font-bold text-white text-sm">AI Syllabus Analyzer</h4>
                    </div>
                    <p className="text-xs text-slate-400">Get custom difficulty maps, target study hours, and top-rank bottlenecks calculated programmatically.</p>
                    
                    {!analyzerResult ? (
                      <button 
                        onClick={() => triggerSyllabusInsightAnalyzer(currentSyllabus)}
                        disabled={analyzingSyllabus}
                        className="py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                      >
                        {analyzingSyllabus ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Crunching Data...</span>
                          </>
                        ) : (
                          <>
                            <Sliders className="w-4 h-4" />
                            <span>Analyze Syllabus Topic Weights</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <div className="space-y-4 pt-2 border-t border-white/10 animate-fadeIn">
                        
                        {/* Target difficulty counts */}
                        <div className="grid grid-cols-3 gap-2 text-center text-xs">
                          <div className="p-2 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                            <span className="block text-emerald-400 font-bold">{analyzerResult.easyCount}</span>
                            <span className="text-[9px] text-slate-400">Easy Chapters</span>
                          </div>
                          <div className="p-2 bg-amber-500/5 rounded-xl border border-amber-500/10">
                            <span className="block text-amber-400 font-bold">{analyzerResult.mediumCount}</span>
                            <span className="text-[9px] text-slate-400">Medium</span>
                          </div>
                          <div className="p-2 bg-red-500/5 rounded-xl border border-red-500/10">
                            <span className="block text-red-400 font-bold">{analyzerResult.hardCount}</span>
                            <span className="text-[9px] text-slate-400">Hard</span>
                          </div>
                        </div>

                        {/* Estimated Study hours display */}
                        <div className="p-3 bg-white/5 rounded-xl text-center border border-white/5">
                          <span className="block text-[10px] text-slate-400 uppercase font-semibold">Recommended Total Study Time</span>
                          <span className="text-xl font-black text-indigo-300">{analyzerResult.recommendedHours} Study Hours</span>
                        </div>

                        <div className="space-y-2">
                          <p className="text-[10px] text-white/50 uppercase font-bold tracking-widest">AI Bottleneck Insights</p>
                          {analyzerResult.insights.map((ins, insIdx) => (
                            <div key={insIdx} className="p-2.5 rounded-xl bg-black/30 border border-white/5 text-[11px] text-slate-300 leading-relaxed flex gap-1.5">
                              <span className="text-indigo-400 select-none">•</span>
                              <span>{ins}</span>
                            </div>
                          ))}
                        </div>

                        <button 
                          onClick={() => setAnalyzerResult(null)}
                          className="w-full text-center text-[10px] font-bold text-slate-400 hover:text-white transition-all underline"
                        >
                          Clear Analysis
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Cutoff specifications & prep strategies */}
                  <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md space-y-4">
                    <h4 className="font-bold text-white text-xs uppercase tracking-wider text-slate-300">Previous Cutoffs & Advice</h4>
                    
                    {/* Retrieve historical prepped lists */}
                    {(() => {
                      const details = PREPARATION_CARDS_DETAIL[currentSyllabus.examName] || { cutoff: 'No data', strategy: 'Regular solve', books: [] };
                      return (
                        <div className="space-y-4 text-xs">
                          <div>
                            <span className="font-bold text-amber-400 block mb-1">Target Score & Cutoff</span>
                            <p className="text-slate-300 leading-relaxed">{details.cutoff}</p>
                          </div>
                          
                          <div>
                            <span className="font-bold text-indigo-300 block mb-1">Expert Preparation Strategy</span>
                            <p className="text-slate-300 leading-relaxed italic pr-1">"{details.strategy}"</p>
                          </div>

                          <div>
                            <span className="font-bold text-slate-300 block mb-1">Recommended Literature</span>
                            <ul className="space-y-1 text-[11px] list-disc list-inside text-slate-400">
                              {details.books.map((book, bIdx) => (
                                <li key={bIdx} className="truncate">{book}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                </div>

              </div>

              </>)}
            </div>
          )}

          {/* TAB 3: ADAPTIVE PRACTICE ENGINE */}
          {activeTab === 'practice' && (
            <div id="view-practice" className="space-y-8 animate-fadeIn">
              
              {/* Premium Practice Switcher */}
              <div className="flex flex-wrap gap-2 p-1.5 bg-black/40 border border-white/10 rounded-2xl w-fit">
                <button
                  id="btn-practice-ai"
                  onClick={() => setPracticeSubTab('ai_generator')}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    practiceSubTab === 'ai_generator'
                      ? 'bg-indigo-600 text-white font-extrabold shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🤖 RankForge AI Core Question Generator & AIR Training
                </button>
                <button
                  id="btn-practice-standard"
                  onClick={() => setPracticeSubTab('standard')}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    practiceSubTab === 'standard'
                      ? 'bg-indigo-600 text-white font-extrabold shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  📋 Standard Practice Board
                </button>
                <button
                  id="btn-practice-mistakes"
                  onClick={() => setPracticeSubTab('mistakes')}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    practiceSubTab === 'mistakes'
                      ? 'bg-indigo-600 text-white font-extrabold shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  📓 My Mistakes Notebook (Auto-Saved)
                </button>
              </div>

              {practiceSubTab === 'mistakes' ? (
                <MistakeNotebook setRecentNotification={setRecentNotification} />
              ) : practiceSubTab === 'ai_generator' ? (
                <AIQuestionGenerator
                  user={user}
                  setUser={setUser}
                  addPoints={(p) => setUser((u: any) => ({ ...u, points: u.points + p }))}
                  setRecentNotification={setRecentNotification}
                />
              ) : (
                <>
                  {/* Controls panel: Select Exam target & difficulty configurations */}
                  <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-wrap gap-4 items-center justify-between">
                <div className="flex items-center gap-4 flex-wrap">
                  <div>
                    <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Active Exam</label>
                    <select 
                      value={practiceExam} 
                      onChange={(e) => setPracticeExam(e.target.value as ExamType)}
                      className="bg-[#05060b] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white uppercase font-bold tracking-tight focus:outline-none"
                    >
                      <option value="NIMCET">NIMCET</option>
                      <option value="CUET PG MCA">CUET PG MCA</option>
                      <option value="GATE CS">GATE CS</option>
                      <option value="TANCET MCA">TANCET MCA</option>
                      <option value="CAT">CAT</option>
                      <option value="Placements">Placements</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Adaptive Mode</label>
                    <button 
                      onClick={() => setAdaptiveMode(!adaptiveMode)}
                      className={`text-xs px-3 py-1.5 rounded-xl font-bold border transition-all ${
                        adaptiveMode 
                          ? 'bg-indigo-600/20 text-indigo-400 border-indigo-500/30' 
                          : 'bg-white/5 text-slate-400 border-white/10'
                      }`}
                    >
                      {adaptiveMode ? '✓ Adaptive Auto-Level ON' : 'Adaptive OFF (Lock Level)'}
                    </button>
                  </div>

                  {!adaptiveMode && (
                    <div>
                      <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Locked Difficulty</label>
                      <div className="flex gap-1.5">
                        {(['Easy', 'Medium', 'Hard'] as DifficultyLevel[]).map(level => (
                          <button
                            key={level}
                            onClick={() => setPracticeDifficulty(level)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                              practiceDifficulty === level 
                                ? 'bg-indigo-600 text-white border-indigo-500' 
                                : 'bg-white/5 text-slate-300 border-white/10'
                            }`}
                          >
                            {level}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="text-right">
                  <span className="block text-[10px] text-slate-400 font-bold uppercase">Topic accuracy</span>
                  <span className="text-xs font-mono text-emerald-400 font-bold">{user.accuracy}%</span>
                </div>
              </div>

              {/* Practice execution space */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Side: Question workspace */}
                <div className="lg:col-span-8 p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col justify-between space-y-6">
                  {filteredQuestions.length === 0 ? (
                    <div className="text-center py-12">
                      <HelpCircle className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                      <p className="text-slate-400 text-sm">No specific {practiceDifficulty} questions loaded in bank currently.</p>
                      <button onClick={() => setAdaptiveMode(true)} className="mt-4 text-xs font-bold text-indigo-400 underline">Enable Adaptive Mode</button>
                    </div>
                  ) : (
                    (() => {
                      const q: Question = filteredQuestions[currentPracticeIndex];
                      if (!q) return null;
                      
                      return (
                        <>
                          {/* Header specifications of active question */}
                          <div className="flex justify-between items-center pb-4 border-b border-white/5">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                                Q {currentPracticeIndex + 1}
                              </span>
                              <span className="text-[10px] font-semibold text-slate-400 uppercase">
                                {q.subject} • {q.topic}
                              </span>
                            </div>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                              q.difficulty === 'Easy' ? 'bg-emerald-500/20 text-emerald-400' :
                              q.difficulty === 'Medium' ? 'bg-amber-500/20 text-amber-500' :
                              'bg-red-500/20 text-red-500'
                            }`}>
                              {q.difficulty} Level
                            </span>
                          </div>

                          {/* Mathematical / Problem Statement context */}
                          <div className="py-4">
                            <p className="text-base text-white leading-relaxed font-medium md:text-lg">
                              {q.question}
                            </p>
                          </div>

                          {/* Work inputs aligned by correct formats (MCQ options vs Numerical vs Coding) */}
                          <div className="py-4">
                            
                            {/* MULTIPLE CHOICE GRID */}
                            {q.type === 'MCQ' && q.options && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                                {q.options.map((option, optIdx) => {
                                  const letter = String.fromCharCode(65 + optIdx);
                                  const isSelected = selectedPracticeOption === option;
                                  return (
                                    <button
                                      key={optIdx}
                                      onClick={() => {
                                        if (practiceAnswerChecked) return;
                                        setSelectedPracticeOption(option);
                                      }}
                                      disabled={practiceAnswerChecked}
                                      className={`p-4 rounded-2xl border text-left text-xs transition-all flex items-center justify-between ${
                                        practiceAnswerChecked
                                          ? option === q.answer
                                            ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                                            : isSelected
                                              ? 'bg-red-500/10 border-red-500/40 text-red-400'
                                              : 'bg-white/5 border-white/5 text-slate-400'
                                          : isSelected
                                            ? 'bg-indigo-600/20 border-indigo-500 text-white font-semibold'
                                            : 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-300'
                                      }`}
                                    >
                                      <span>
                                        <span className="font-bold mr-2 text-indigo-400">{letter}.</span>
                                        {option}
                                      </span>
                                      
                                      {practiceAnswerChecked && option === q.answer && (
                                        <Check className="w-4 h-4 text-emerald-400" />
                                      )}
                                    </button>
                                  );
                                })}
                              </div>
                            )}

                            {/* NUMERICAL RESPONSE */}
                            {q.type === 'Numerical' && (
                              <div className="space-y-3 max-w-sm">
                                <label className="block text-xs text-slate-400 font-semibold uppercase">Enter your final numerical answer:</label>
                                <div className="flex gap-2">
                                  <input 
                                    type="text"
                                    value={numericalInput}
                                    placeholder="Type calculated integer"
                                    onChange={(e) => setNumericalInput(e.target.value)}
                                    disabled={practiceAnswerChecked}
                                    className="bg-white/5 border border-white/10 px-4 py-2 text-sm rounded-xl focus:border-indigo-500 focus:outline-none flex-1 text-white"
                                  />
                                </div>
                              </div>
                            )}

                            {/* CODING IDE WINDOW */}
                            {q.type === 'Coding' && (
                              <div className="space-y-3">
                                <div className="p-3 bg-black/60 rounded-xl border border-white/5 font-mono text-xs text-emerald-400 bg-black">
                                  <span>{q.codeSnippet}</span>
                                </div>
                                <textarea
                                  value={userCodingAnswer}
                                  placeholder="Write recursive / dynamic programmatic strategy..."
                                  onChange={(e) => setUserCodingAnswer(e.target.value)}
                                  disabled={practiceAnswerChecked}
                                  className="w-full h-36 bg-black/40 border border-white/10 rounded-xl p-4 font-mono text-xs text-[#6366f1] focus:outline-none focus:border-indigo-500"
                                />
                              </div>
                            )}

                          </div>

                          {/* Feedback banner */}
                          {practiceFeedback && (
                            <div className={`p-4 rounded-xl border ${practiceFeedback.isCorrect ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'} text-xs font-semibold`}>
                              {practiceFeedback.isCorrect ? (
                                <span>🎉 Excellent logic! Correct answer verified. Ready to master the next step?</span>
                              ) : (
                                <span>💡 Incorrect formulation. Correct Answer: <strong className="underline">{Array.isArray(q.answer) ? q.answer.join(', ') : q.answer}</strong>. Read our AI explanations on common mistakes below.</span>
                              )}
                            </div>
                          )}

                          {/* Actions: submit & next */}
                          <div className="flex items-center gap-3 pt-6 border-t border-white/5">
                            {!practiceAnswerChecked ? (
                              <button
                                onClick={handleCheckPracticeAnswer}
                                className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
                              >
                                Submit & Verify Logic
                              </button>
                            ) : (
                              <button
                                onClick={handleNextPracticeQuestion}
                                className="flex-1 py-1 px-3 bg-white hover:bg-slate-100 text-[#05060b] font-extrabold text-xs rounded-xl shadow-lg transition-all"
                              >
                                Try Next Question
                              </button>
                            )}

                            <button 
                              onClick={() => {
                                setIrisInputPrompt(`Explain the solution and step-by-step logic for this target question statement: "${q.question}"`);
                                handleTabChange('tutor');
                              }}
                              className="px-4 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>Explain with AI</span>
                            </button>
                          </div>
                        </>
                      );
                    })()
                  )}
                </div>

                {/* Right Side: Step-by-Step AI Explanation Sheet */}
                <div className="lg:col-span-4 space-y-6">
                  
                  {practiceAnswerChecked && filteredQuestions[currentPracticeIndex] && (
                    <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md space-y-4 animate-slideIn">
                      <div className="flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-indigo-400" />
                        <h4 className="font-bold text-white text-xs uppercase tracking-wider text-slate-300">Step-by-Step Explanations</h4>
                      </div>

                      <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
                        
                        <div>
                          <span className="font-semibold text-emerald-400 block mb-1">Theoretical Concept</span>
                          <p className="bg-black/20 p-2.5 rounded-xl border border-white/5 text-[11px]">
                            {filteredQuestions[currentPracticeIndex].explanation}
                          </p>
                        </div>

                        {filteredQuestions[currentPracticeIndex].shortcut && (
                          <div>
                            <span className="font-semibold text-amber-400 block mb-1">Shortcut Formula Method</span>
                            <p className="bg-black/20 p-2.5 rounded-xl border border-white/5 text-[11px] font-mono text-amber-300">
                              {filteredQuestions[currentPracticeIndex].shortcut}
                            </p>
                          </div>
                        )}

                        {filteredQuestions[currentPracticeIndex].commonMistakes && (
                          <div className="p-3 rounded-xl bg-red-500/5 border border-red-500/10">
                            <span className="font-semibold text-red-400 block mb-1">Common Pitfall Mistakes</span>
                            <p className="text-[11px] text-slate-400">
                              {filteredQuestions[currentPracticeIndex].commonMistakes}
                            </p>
                          </div>
                        )}

                      </div>
                    </div>
                  )}

                  {/* Syllabus Adaptive Booster display widget */}
                  <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md space-y-4 text-xs">
                    <div className="flex items-center gap-1.5 justify-between">
                      <h4 className="font-bold text-white">Adaptive Difficulty Matrix</h4>
                      <span className="bg-indigo-500/20 text-indigo-400 text-[9px] px-1.5 rounded font-bold uppercase tracking-widest border border-indigo-500/20">Active</span>
                    </div>
                    <p className="text-slate-400 leading-relaxed text-[11px]">
                      Your response streams continuously update the rank prediction module. Correct submissions elevate content difficulty, whereas errors safely route you back towards conceptual foundations.
                    </p>
                    <div className="p-3 rounded-2xl bg-black/40 border border-white/5 text-[11px] space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Streak Points Multiplier:</span>
                        <span className="font-bold text-white font-mono">1.2x</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Avg response speed:</span>
                        <span className="font-bold text-emerald-400 font-mono">24s / Q</span>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

              </>)}
            </div>
          )}

          {/* TAB: PYQ LIBRARY */}
          {activeTab === 'pyq' && (
            <div id="view-pyqs" className="space-y-8 animate-fadeIn">
              
              {/* Header Box */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-8 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-xl">
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight">Verified Previous Year Papers (PYQs) Library</h2>
                  <p className="text-xs text-slate-400 mt-1 max-w-xl">
                    Deploy real questions from NIMCET, GATE CS, CUET PG, and CAT exams ranging from 2022 to 2025. Solve on-screen to calculate real logic benchmarks instantly.
                  </p>
                </div>
                
                <div className="flex items-center gap-2.5 bg-indigo-500/10 border border-indigo-500/20 p-3.5 rounded-2xl">
                  <FileText className="w-5 h-5 text-indigo-400" />
                  <div className="text-left text-xs">
                    <span className="block font-bold text-white font-mono">100% Authentic Bank</span>
                    <span className="text-slate-400 text-[10px]">Verified with official keys</span>
                  </div>
                </div>
              </div>

              {/* Filters Block */}
              <div className="p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-lg space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                   <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs uppercase tracking-wider">
                     <Sliders className="w-4 h-4" />
                     <span>Curate Targeted PYQ Sets</span>
                   </div>
                   <button
                     onClick={() => displayNotice('📈 PYQ Trend Analyzer Activated: Visualizing highest frequency topic weights over the last 3 years.')}
                     className="px-4 py-2 bg-indigo-600/20 hover:bg-indigo-600 border border-indigo-500/30 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 w-fit"
                   >
                     <LineChart className="w-3.5 h-3.5 text-amber-300" />
                     <span>AI PYQ Trend Analyzer</span>
                   </button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Exam selection */}
                  <div>
                    <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1.5">Exam Series</label>
                    <select
                      value={pyqFilterExam}
                      onChange={(e) => setPyqFilterExam(e.target.value as ExamType | 'ALL')}
                      className="w-full bg-[#0b0c16] text-white border border-white/10 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-indigo-500"
                    >
                      <option value="ALL">All Exams</option>
                      <option value="NIMCET">NIMCET</option>
                      <option value="CUET PG MCA">CUET PG MCA</option>
                      <option value="GATE CS">GATE CS</option>
                      <option value="TANCET MCA">TANCET MCA</option>
                      <option value="CAT">CAT</option>
                      <option value="Placements">Placements</option>
                    </select>
                  </div>

                  {/* Year selection */}
                  <div>
                    <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1.5">Year</label>
                    <select
                      value={pyqFilterYear}
                      onChange={(e) => setPyqFilterYear(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
                      className="w-full bg-[#0b0c16] text-white border border-white/10 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-indigo-500"
                    >
                      <option value="ALL">All Years</option>
                      <option value="2025">2025</option>
                      <option value="2024">2024</option>
                      <option value="2023">2023</option>
                      <option value="2022">2022</option>
                    </select>
                  </div>

                  {/* Subject keyword input search */}
                  <div>
                    <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1.5">Subject Domain</label>
                    <select
                      value={pyqFilterSubject}
                      onChange={(e) => setPyqFilterSubject(e.target.value)}
                      className="w-full bg-[#0b0c16] text-white border border-white/10 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-indigo-500"
                    >
                      <option value="ALL">All Subjects</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="Computer Science">Computer Science</option>
                      <option value="Quantitative Aptitude">Quantitative Aptitude</option>
                      <option value="Database Systems">Database Systems</option>
                      <option value="Calculus">Calculus</option>
                    </select>
                  </div>

                  {/* Difficulty selector */}
                  <div>
                    <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1.5">Aspirant Level</label>
                    <select
                      value={pyqFilterDifficulty}
                      onChange={(e) => setPyqFilterDifficulty(e.target.value as DifficultyLevel | 'ALL')}
                      className="w-full bg-[#0b0c16] text-white border border-white/10 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-indigo-500"
                    >
                      <option value="ALL">All Difficulty</option>
                      <option value="Easy">Easy Level</option>
                      <option value="Medium">Medium Level</option>
                      <option value="Hard">Hard Level</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* PYQ Questions List */}
              <div className="space-y-6">
                {(() => {
                  const pyqQuestions = PYQ_PAPERS.flatMap(p => 
                    p.questions.map(q => ({
                      ...q,
                      exam: p.exam,
                      year: p.year
                    }))
                  );

                  const filtered = pyqQuestions.filter(p => {
                    const matchExam = pyqFilterExam === 'ALL' || p.exam === pyqFilterExam;
                    const matchYear = pyqFilterYear === 'ALL' || p.year === pyqFilterYear;
                    const matchSubject = pyqFilterSubject === 'ALL' || p.subject === pyqFilterSubject;
                    const matchDiff = pyqFilterDifficulty === 'ALL' || p.difficulty === pyqFilterDifficulty;
                    return matchExam && matchYear && matchSubject && matchDiff;
                  });

                  if (filtered.length === 0) {
                    return (
                      <div className="p-12 text-center rounded-3xl bg-white/5 border border-white/5 space-y-3">
                        <AlertCircle className="w-8 h-8 text-slate-500 mx-auto" />
                        <h4 className="font-bold text-white text-xs uppercase tracking-wider">No matching PYQ records located</h4>
                        <p className="text-xs text-slate-400 max-w-sm mx-auto">Try resetting your subject patterns or exam years selection.</p>
                        <button 
                          onClick={() => {
                            setPyqFilterExam('ALL');
                            setPyqFilterYear('ALL');
                            setPyqFilterSubject('ALL');
                            setPyqFilterDifficulty('ALL');
                          }}
                          className="px-4 py-2 bg-indigo-600/30 text-indigo-300 font-bold uppercase rounded-xl border border-indigo-500/20 text-[10px]"
                        >
                          Reset Filters List
                        </button>
                      </div>
                    );
                  }

                  return filtered.map((item) => {
                    // Download PYQ PDF Helper function
                    const triggerPdfExport = (item: any) => {
                      const textData = `RANKFORGE AI PYQ RESOURCE EXPORT\n===============================\nExam: ${item.exam} (${item.year})\nQuestion: ${item.question}\nOptions:\n  A. ${item.options[0]}\n  B. ${item.options[1]}\n  C. ${item.options[2]}\n  D. ${item.options[3]}\n\nOfficial Solution & Exploded Derivation:\n----------------------------------------\n${item.explanation}\n\nElite Mentorship Tips & Tricks:\n-------------------------------\nShortcut Method: ${item.shortcut}\nCommon Fallback Pinpoints: ${item.commonMistakes}\n\n© RankForge Entrance Mentors. Shared securely via AI Workspace.`;
                      const blob = new Blob([textData], { type: 'text/markdown;charset=utf-8;' });
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.setAttribute('download', `${item.exam.replace(' ', '_')}_${item.year}_Question_${item.id}.md`);
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      setRecentNotification(`📂 Compiled printable PDF folder for ${item.exam} (${item.year}) question!`);
                    };

                    return (
                      <div key={item.id} className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md space-y-4 hover:border-white/15 transition-all">
                        
                        {/* Tags block */}
                        <div className="flex flex-wrap justify-between items-center gap-2 pb-2 border-b border-white/5">
                          <div className="flex items-center gap-2.5">
                            <span className="text-xs font-bold font-mono text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded border border-indigo-500/10 uppercase">
                              {item.exam} • {item.year} PAPER
                            </span>
                            <span className="text-[10px] text-slate-400 uppercase font-semibold">
                              {item.subject} • {item.topic}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                              item.difficulty === 'Easy' ? 'bg-emerald-500/20 text-emerald-400' :
                              item.difficulty === 'Medium' ? 'bg-amber-500/20 text-amber-400' :
                              'bg-rose-500/20 text-rose-400'
                            }`}>
                              {item.difficulty}
                            </span>
                            
                            {/* Bookmark icon toggle */}
                            <button
                              onClick={() => toggleBookmark(item.id)}
                              className={`p-1 rounded transition-colors ${bookmarks.includes(item.id) ? 'text-amber-400 hover:text-amber-500' : 'text-slate-500 hover:text-white'}`}
                              title={bookmarks.includes(item.id) ? 'Bookmarked' : 'Add to Bookmarks'}
                            >
                              <Bookmark className="w-4 h-4 fill-current" />
                            </button>
                          </div>
                        </div>

                        {/* Statement */}
                        <h4 className="text-sm font-semibold text-white leading-relaxed">{item.question}</h4>

                        {/* Options list selection */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {item.options.map((opt, oIdx) => {
                            const letter = String.fromCharCode(65 + oIdx);
                            const isSelected = pyqSolvedAnswers[item.id] === opt;
                            const isChecked = pyqCheckedAnswers[item.id];
                            const isCorrect = opt === item.answer;

                            let btnStyle = "bg-white/5 border-white/10 hover:bg-white/10 text-slate-300";
                            if (isSelected) {
                              if (!isChecked) {
                                btnStyle = "bg-indigo-600/30 border-indigo-500 text-white font-bold";
                              } else {
                                btnStyle = isCorrect 
                                  ? "bg-emerald-500/20 border-emerald-500 text-emerald-400 font-bold"
                                  : "bg-red-500/20 border-red-500 text-red-400 font-bold";
                              }
                            } else if (isChecked && isCorrect) {
                              btnStyle = "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-bold";
                            }

                            return (
                              <button
                                key={oIdx}
                                disabled={isChecked}
                                onClick={() => {
                                  setPyqSolvedAnswers(prev => ({ ...prev, [item.id]: opt }));
                                  setRecentNotification(`Choice locked. Trigger "Submit & Mark" to evaluate live.`);
                                }}
                                className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${btnStyle}`}
                              >
                                <div>
                                  <span className="font-bold font-mono mr-2 text-indigo-300">{letter}.</span>
                                  <span>{opt}</span>
                                </div>
                                {isChecked && isCorrect && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-2" />}
                              </button>
                            );
                          })}
                        </div>

                        {/* Action Toolbar */}
                        <div className="pt-3 border-t border-white/5 flex flex-wrap gap-2.5 justify-between items-center text-xs">
                          <div className="flex gap-2">
                            {!pyqCheckedAnswers[item.id] ? (
                              <button
                                onClick={() => {
                                  if (!pyqSolvedAnswers[item.id]) {
                                    alert("Please select your option first before marking!");
                                    return;
                                  }
                                  setPyqCheckedAnswers(prev => ({ ...prev, [item.id]: true }));
                                  const isCorrect = pyqSolvedAnswers[item.id] === item.answer;
                                  if (isCorrect) {
                                    setSolvedCount(c => c + 1);
                                    setUser(p => ({ ...p, points: p.points + 25 }));
                                  }
                                }}
                                className="py-2 px-4 bg-indigo-600 hover:bg-indigo-500 font-bold rounded-xl text-white shadow-md transition-all text-[11px]"
                              >
                                Submit & Mark Logic
                              </button>
                            ) : (
                              <span className={`py-2 px-3.5 font-bold rounded-xl text-[11px] uppercase ${
                                pyqSolvedAnswers[item.id] === item.answer ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"
                              }`}>
                                {pyqSolvedAnswers[item.id] === item.answer ? "✓ 25 Points Scored" : "✗ Solved Incorrectly"}
                              </span>
                            )}

                            <button
                              onClick={() => triggerPdfExport(item)}
                              className="py-2 px-3 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-slate-300 transition-all flex items-center gap-1.5 text-[11px]"
                              title="Generates physical paper markdown download"
                            >
                              <ExternalLink className="w-3 h-3 text-indigo-400" />
                              <span>Download PDF</span>
                            </button>
                          </div>

                          <div className="flex gap-2">
                            {/* Expand Solutions button */}
                            <button
                              onClick={() => setPyqSolutionExpanded(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                              className="py-2 px-3 bg-[#0b0c16] hover:bg-[#121424] rounded-xl text-slate-300 font-bold transition-all border border-white/5 text-[11px]"
                            >
                              {pyqSolutionExpanded[item.id] ? "Collapse Solutions Sheet" : "View Step Solutions"}
                            </button>

                            {/* Ask mentor shortcut */}
                            <button
                              onClick={() => {
                                setIrisInputPrompt(`Explain the official PYQ question from ${item.exam} (${item.year}) about "${item.question}". What is the shortcut logic approach for this?`);
                                handleTabChange('tutor');
                              }}
                              className="py-2 px-3 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-xl text-indigo-300 font-bold transition-all border border-indigo-500/10 flex items-center gap-1.5 text-[11px]"
                            >
                              <Sparkles className="w-3 h-3 text-indigo-400" />
                              <span>AI Explanation</span>
                            </button>
                          </div>
                        </div>

                        {/* Expanded solutions drawer */}
                        {pyqSolutionExpanded[item.id] && (
                          <div className="p-4 bg-black/40 rounded-2xl border border-white/5 space-y-3 mt-3 text-xs text-slate-300 animate-slideIn">
                            
                            <div>
                              <span className="font-bold text-emerald-400 block mb-1 text-[11px]">Theoretical Concept Proof</span>
                              <p className="bg-black/20 p-2.5 rounded-xl text-[11px] leading-relaxed">
                                {item.explanation}
                              </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                              <div>
                                <span className="font-bold text-amber-400 block mb-1 text-[11px]">Shortcut Formula Technique</span>
                                <div className="bg-amber-500/5 p-2.5 rounded-xl border border-amber-500/10 font-mono text-amber-300 text-[10px]">
                                  {item.shortcut}
                                </div>
                              </div>
                              
                              <div>
                                <span className="font-bold text-rose-400 block mb-1 text-[11px]">Common Student Pitfalls</span>
                                <div className="bg-rose-500/5 p-2.5 rounded-xl border border-rose-500/10 text-rose-300 text-[10.5px]">
                                  {item.commonMistakes}
                                </div>
                              </div>
                            </div>

                          </div>
                        )}

                      </div>
                    );
                  });
                })()}
              </div>

            </div>
          )}

          {/* TAB: WEAKNESS & REVISION HUB */}
          {activeTab === 'analytics' && (
            <div id="view-analytics" className="space-y-8 animate-fadeIn">
              
              {/* Top Summary Banner */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-2">
                
                {/* Score Widget */}
                <div className="md:col-span-4 bg-gradient-to-br from-indigo-950/40 via-purple-950/20 to-[#05060b] p-6 rounded-3xl border border-indigo-500/30 backdrop-blur-xl flex flex-col items-center justify-center text-center">
                  <h4 className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest mb-4">Exam Readiness Index</h4>
                  
                  <div className="relative w-28 h-28 flex items-center justify-center mb-3">
                    <svg className="absolute w-full h-full transform -rotate-90">
                      <circle cx="56" cy="56" r="46" className="text-white/5" strokeWidth="6" fill="transparent" />
                      <circle cx="56" cy="56" r="46" className="text-indigo-400" strokeWidth="6" fill="transparent"
                        strokeDasharray="289" strokeDashoffset={289 - (289 * (user.accuracy || 78.4)) / 100} strokeLinecap="round" />
                    </svg>
                    <div className="text-center">
                      <span className="text-2xl font-black text-white font-mono">{user.accuracy || 78.4}%</span>
                      <span className="block text-[9px] text-slate-400 font-semibold uppercase mt-0.5">Rank Score</span>
                    </div>
                  </div>

                  <p className="text-[10.5px] text-slate-300 leading-relaxed max-w-xs">
                    Curated weights from <strong>Syllabus Progress {user.masteryPercentage}%</strong> and <strong>Streak {user.streak}d</strong>. Under-50 ranking probability is active.
                  </p>
                </div>

                {/* AI Weakness heatmap description */}
                <div className="md:col-span-8 p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur flex flex-col justify-between">
                  <div className="space-y-4">
                     <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div>
                           <h3 className="font-extrabold text-white text-lg tracking-tight">Personalized Weakness Heatmap Analysis</h3>
                           <p className="text-xs text-slate-400 mt-1">
                             Aris continually audits your checked options in official exams and sets to flags weak subjects. Green signals mastery, Amber means volatile, Red alerts critical focus.
                           </p>
                        </div>
                        <button
                          onClick={() => {
                            displayNotice('🔍 AI Pattern Scanner Active: Simulating hidden conceptual logic errors across recent mock tests...');
                            setTimeout(() => setIrisInputPrompt('Analyze my last 3 mock tests. What is my recurring error pattern in Quantitative Aptitude? Specifically highlight careless reading errors vs formula knowledge gaps.'), 1000);
                            setTimeout(() => handleTabChange('tutor'), 1100);
                          }}
                          className="px-4 py-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2"
                        >
                          <BrainCircuit className="w-4 h-4" />
                          <span>AI Error Pattern Analyzer</span>
                        </button>
                     </div>
                  </div>

                  {/* Heatmap Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5 my-3">
                    {[
                      { topic: "Probability Bounds", status: "Critical Red", color: "border-red-500/40 bg-red-500/5 text-red-400", score: "42%" },
                      { topic: "DBMS Normalization", status: "Mastered Green", color: "border-emerald-500/40 bg-emerald-500/5 text-emerald-400", score: "91%" },
                      { topic: "Calculus Integrals", status: "Volatile Amber", color: "border-amber-500/40 bg-amber-500/5 text-amber-400", score: "64%" },
                      { topic: "Greedy Space Bounds", status: "Volatile Amber", color: "border-amber-500/40 bg-amber-500/5 text-amber-400", score: "58%" }
                    ].map((h, idx) => (
                      <div key={idx} className={`p-3.5 rounded-xl border flex flex-col justify-between gap-2 text-left ${h.color}`}>
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] uppercase font-bold text-slate-400">{h.status}</span>
                          <span className="font-mono text-xs font-bold">{h.score} Acc</span>
                        </div>
                        <h5 className="font-bold text-xs text-slate-200">{h.topic}</h5>
                        <button
                          onClick={() => {
                            setIrisInputPrompt(`Explain theory proofs and solve questions about "${h.topic}" topic showing step solution logic, shortcut formulas, and common pitfalls. My accuracy is currently ${h.score}. Goal ranking AIR Under 50.`);
                            handleTabChange('tutor');
                          }}
                          className="text-[9px] text-white/80 hover:text-white underline text-left cursor-pointer"
                        >
                          Optimize logic with AI →
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Revision Planner & Spaced Reminders */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                
                {/* Left wing - Spaced Revision Cards */}
                <div className="md:col-span-7 bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4.5 h-4.5 text-teal-400 animate-pulse" />
                      <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">AI Spaced Revision Deck</h4>
                    </div>
                    <span className="bg-teal-500/20 text-teal-400 border border-teal-500/30 text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase">SUPERVISED BY ARIS</span>
                  </div>

                  <p className="text-xs text-slate-400">
                    Spaced repetition triggers topics at logarithmic optimal times. Reviewed items postpone warning levels automatically.
                  </p>

                  <div className="space-y-3">
                    {spacedRevisionList.map((item) => (
                      <div key={item.id} className="p-4 rounded-2xl bg-black/20 border border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded ${
                              item.status.includes('Overdue') ? 'bg-red-500/20 text-red-400' :
                              item.status.includes('Safe') ? 'bg-amber-500/20 text-amber-400' :
                              'bg-emerald-500/20 text-emerald-400'
                            }`}>
                              {item.status}
                            </span>
                            <span className="text-[10px] text-slate-400">Reviewed {item.count} times</span>
                          </div>
                          <h5 className="font-bold text-white text-xs mt-1.5">{item.topic}</h5>
                        </div>

                        <div className="flex gap-2 shrink-0">
                          <button
                            onClick={() => {
                              setSpacedRevisionList(prev => prev.map(s => {
                                if (s.id === item.id) {
                                  return { ...s, count: s.count + 1, status: 'Mastered (Rescheduled to 15 Days)', lastReviewed: 'Today' };
                                }
                                return s;
                              }));
                              setRecentNotification(`✅ Topic list pushed forward on Spaced Revision index!`);
                            }}
                            className="bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-400 px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all"
                          >
                            Completed Review
                          </button>
                          
                          <button
                            onClick={() => {
                              setSpacedRevisionList(prev => prev.map(s => {
                                if (s.id === item.id) {
                                  return { ...s, status: 'Rescheduled (+24 Hours)' };
                                }
                                return s;
                              }));
                              setRecentNotification(`Shifted review window for 24 hours.`);
                            }}
                            className="bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 px-2.5 py-1.5 rounded-xl text-[10px] transition-all"
                          >
                            Postpone 24h
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right wing - Relational College Admissions Predictor with placements info */}
                <div className="md:col-span-5 bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-white/5">
                    <Award className="w-4.5 h-4.5 text-amber-400" />
                    <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">Quota Admission Predictor 2.0</h4>
                  </div>

                  <p className="text-xs text-slate-400">
                    Input your target national test profile parameters, rank tier, and quota bucket to map against authentic cutoff histories.
                  </p>

                  <div className="p-4 rounded-2xl bg-black/30 border border-white/5 space-y-3.5">
                    
                    {/* Exam select */}
                    <div>
                      <label className="block text-[9px] text-slate-400 font-bold uppercase mb-1">Entrance exam</label>
                      <select
                        value={predictExam}
                        onChange={(e) => setPredictExam(e.target.value as ExamType)}
                        className="w-full bg-[#05060b] text-white border border-white/10 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500"
                      >
                        <option value="NIMCET">NIMCET (NIT Admissions)</option>
                        <option value="CUET PG MCA">CUET PG MCA (Central Univ)</option>
                        <option value="GATE CS">GATE CS (IIT / NIT PG)</option>
                        <option value="CAT">CAT (IIM Management)</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {/* Rank Input */}
                      <div>
                        <label className="block text-[9px] text-slate-400 font-bold uppercase mb-1">Mock / Target Rank</label>
                        <input
                          type="number"
                          id="predictor-rank-input"
                          value={predictRank}
                          onChange={(e) => setPredictRank(Number(e.target.value))}
                          className="w-full bg-[#05060b] text-white border border-white/10 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500"
                          placeholder="e.g. 150"
                        />
                      </div>

                      {/* Category select */}
                      <div>
                        <label className="block text-[9px] text-slate-400 font-bold uppercase mb-1">Quota Pool</label>
                        <select
                          value={predictCategory}
                          onChange={(e) => setPredictCategory(e.target.value as any)}
                          className="w-full bg-[#05060b] text-white border border-white/10 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500"
                        >
                          <option value="General">General (OP)</option>
                          <option value="OBC">OBC-NCL</option>
                          <option value="SC">SC Quota</option>
                          <option value="ST">ST Quota</option>
                        </select>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        // Prediction filters
                        const rawColleges = (UNIVERSITY_PREDICTION_DATA[predictExam as keyof typeof UNIVERSITY_PREDICTION_DATA] || []) as any[];
                        const mapped = rawColleges.map(u => {
                          const baseCutoff = u.cutoffGeneral;
                          const factor = predictCategory === 'OBC' ? 1.3 : predictCategory === 'SC' ? 2.2 : predictCategory === 'ST' ? 3.5 : 1.0;
                          const cutoffVal = Math.round(baseCutoff * factor);

                          const chance = predictRank <= cutoffVal 
                            ? "High Chance of Selection"
                            : predictRank <= (cutoffVal * 1.35) 
                              ? "Medium (Likely Spot Round)"
                              : "Vulnerable (Out of bounds)";
                          
                          // Compute dynamic average salary based on prestige
                          let avgSalary = "8.5 LPA";
                          if (u.name.includes('Trichy') || u.name.includes('Bombay')) {
                            avgSalary = "18.2 LPA";
                          } else if (u.name.includes('IISc') || u.name.includes('Delhi') || u.name.includes('Surathkal')) {
                            avgSalary = "16.5 LPA";
                          } else if (u.name.includes('Jawaharlal') || u.name.includes('Allahabad') || u.name.includes('Madras')) {
                            avgSalary = "14.0 LPA";
                          } else if (u.name.includes('Bhopal') || u.name.includes('Jamshedpur') || u.name.includes('Kharagpur')) {
                            avgSalary = "12.5 LPA";
                          }

                          return {
                            college: u.name,
                            cutoff: cutoffVal,
                            chanceTxt: chance,
                            avgSalary: avgSalary,
                            color: chance.includes('High') 
                              ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' 
                              : chance.includes('Medium')
                                ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                                : 'text-red-400 bg-red-500/10 border-red-500/20'
                          };
                        });
                        setPredictedColleges(mapped);
                        setRecentNotification(`Mapped admissions prospects dynamically.`);
                      }}
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs shadow transition-all"
                    >
                      Predict Admissions Prospect
                    </button>

                  </div>

                  {/* Prediction Output lists */}
                  {predictedColleges.length > 0 && (
                    <div className="space-y-3.5 pt-1">
                      <span className="block text-[10px] text-slate-400 font-bold uppercase">Dynamic Placements & Cutoff Forecasts</span>
                      
                      <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                        {predictedColleges.map((col, idx) => (
                          <div key={idx} className="p-3 bg-[#0b0c16] rounded-xl border border-white/5 space-y-1.5 text-xs">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-white">{col.college}</span>
                              <span className={`text-[9px] px-2 py-0.5 rounded font-semibold border ${col.color}`}>
                                {col.chanceTxt}
                              </span>
                            </div>
                            <div className="flex justify-between text-[10px] text-slate-400">
                              <span>Cutoff for {predictCategory}: <strong>AIR #{col.cutoff}</strong></span>
                              <span>Avg Salary: <strong className="text-emerald-300 font-mono">{col.avgSalary}</strong></span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>

              </div>
              
              {/* Active Smart Bookmarks Shelf */}
              <div className="p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-[#ffffff10]">
                  <Bookmark className="w-4.5 h-4.5 text-indigo-400" />
                  <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">Aspirants Priority Bookmark Board ({bookmarks.length})</h4>
                </div>
                
                {bookmarks.length === 0 ? (
                  <p className="text-xs text-slate-400">No questions bookmarked yet. Set star flags while solving exam previous papers to track challenging coordinates here.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(() => {
                      // Map bookmarked IDs with items from PYQ_PAPERS or QUESTION_BANK
                      const pyqQuestionsList = PYQ_PAPERS.flatMap(p => 
                        p.questions.map(q => ({
                          ...q,
                          exam: p.exam,
                          year: p.year
                        }))
                      );
                      const allMergedQuestions = [...pyqQuestionsList, ...QUESTION_BANK];
                      const matched = allMergedQuestions.filter(x => bookmarks.includes(x.id));
                      
                      if (matched.length === 0) {
                        return <p className="text-xs text-slate-400">No matched bookmark questions available in index reference.</p>;
                      }

                      return matched.map((mQ, mIdx) => (
                        <div key={mIdx} className="p-4 rounded-2xl bg-black/30 border border-white/5 flex flex-col justify-between gap-3 text-xs">
                          <div>
                            <div className="flex justify-between">
                              <span className="text-[9px] uppercase font-bold text-indigo-400">{mQ.subject} • {mQ.topic}</span>
                              <button 
                                onClick={() => toggleBookmark(mQ.id)}
                                className="text-red-400 hover:text-red-500 underline text-[10px]"
                              >
                                Remove Flag
                              </button>
                            </div>
                            <h5 className="font-semibold text-white mt-1 leading-relaxed line-clamp-2">{mQ.question}</h5>
                          </div>

                          <div className="flex justify-between items-center pt-2 border-t border-white/5 text-[10px]">
                            <span className="text-slate-400">Correct Answer: <strong className="text-emerald-400">{mQ.answer}</strong></span>
                            
                            <button
                              onClick={() => {
                                setIrisInputPrompt(`Please derive step-by-step concepts, shortcuts, and pitfall warnings for my bookmark question statement: "${mQ.question}"`);
                                handleTabChange('tutor');
                              }}
                              className="text-indigo-400 hover:text-white transition-colors underline font-bold"
                            >
                              Consult Mentor Aris →
                            </button>
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 4: MOCK TEST ENGINE */}
          {activeTab === 'mocks' && (
            <div id="view-mocks" className="space-y-8 animate-fadeIn">
              
              {/* Premium Mocks Switcher */}
              <div className="flex gap-2 p-1.5 bg-black/40 border border-white/10 rounded-2xl w-fit">
                <button
                  id="btn-mocks-adaptive"
                  onClick={() => setMocksSubTab('adaptive_mocks')}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    mocksSubTab === 'adaptive_mocks'
                      ? 'bg-indigo-600 text-white font-extrabold shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  ⚡ RankForge Premium Adaptive Mocks & AIR Predictor
                </button>
                <button
                  id="btn-mocks-standard"
                  onClick={() => setMocksSubTab('standard')}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    mocksSubTab === 'standard'
                      ? 'bg-indigo-600 text-white font-extrabold shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  📋 Standard Mock Test Sets
                </button>
              </div>

              {mocksSubTab === 'adaptive_mocks' ? (
                <AdaptiveMockSystem
                  user={user}
                  addPoints={(p) => setUser((u: any) => ({ ...u, points: u.points + p }))}
                  setRecentNotification={setRecentNotification}
                />
              ) : (
                <>
                  {/* If active in simulation */}
                  {mockActive && selectedMock ? (
                <div className="p-8 rounded-3xl bg-white/5 border border-white/12 backdrop-blur-xl space-y-6">
                  
                  {/* Active Simulation header with running timer */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
                    <div>
                      <h3 className="text-xl font-bold text-white tracking-tight">{selectedMock.title}</h3>
                      <p className="text-xs text-slate-400 uppercase font-semibold">{selectedMock.exam} Core Evaluation</p>
                    </div>

                    <div className="flex items-center gap-3.5 bg-red-400/10 border border-red-400/20 px-4 py-2.5 rounded-2xl text-red-400 shrink-0 select-none">
                      <Clock className="w-5 h-5 text-red-400 animate-spin" />
                      <div className="text-right">
                        <span className="block text-[8px] uppercase tracking-wider font-bold">Remaining Countdown</span>
                        <span className="font-mono text-lg font-black font-extrabold tracking-widest">
                          {Math.floor(mockTimeRemaining / 60)}:{(mockTimeRemaining % 60).toString().padStart(2, '0')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Simulator Questions space */}
                  <div className="space-y-8 py-4">
                    {selectedMock.questions.map((q, idx) => (
                      <div key={q.id} className="p-6 rounded-2xl bg-black/40 border border-white/5 space-y-4">
                        <div className="flex items-center justify-between text-xs pb-2 border-b border-white/5">
                          <span className="font-bold text-indigo-400 font-mono">Question {idx + 1} of {selectedMock.questions.length}</span>
                          <span className="text-slate-400 uppercase">{q.subject} • {q.topic}</span>
                        </div>

                        <p className="text-sm font-semibold text-white leading-relaxed">{q.question}</p>

                        {/* Multiple options select rules */}
                        {q.options && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                            {q.options.map((option, optIdx) => {
                              const letter = String.fromCharCode(65 + optIdx);
                              const isChecked = mockUserAnswers[q.id] === option;
                              return (
                                <button
                                  key={optIdx}
                                  onClick={() => setMockUserAnswers({
                                    ...mockUserAnswers,
                                    [q.id]: option
                                  })}
                                  className={`p-3.5 rounded-xl border text-left text-xs transition-all ${
                                    isChecked 
                                      ? 'bg-indigo-600 border-indigo-400 text-white font-semibold' 
                                      : 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-300'
                                  }`}
                                >
                                  <span className="font-bold mr-2 text-indigo-300">{letter}.</span>
                                  <span>{option}</span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Termination Controls */}
                  <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                    <button 
                      onClick={() => {
                        if(confirm("Are you sure you want to exit without submission? Progress will not carry.")) {
                          setMockActive(false);
                        }
                      }}
                      className="py-3 px-6 rounded-xl border border-white/10 text-xs font-bold text-slate-300 hover:bg-white/5 transition-all"
                    >
                      Exit Simulation
                    </button>
                    <button 
                      onClick={submitMockTestEvaluation}
                      className="flex-1 py-1 px-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-500/10 transition-all text-center"
                    >
                      Submit Exam Sheet for Evaluation (Apply Negative Marking)
                    </button>
                  </div>

                </div>
              ) : (
                <div className="space-y-8">
                  
                  {/* Real Score breakdown panel if submitted recently */}
                  {mockScoreBreakdown && (
                    <div className="p-6 rounded-3xl bg-indigo-950/20 border border-indigo-500/40 backdrop-blur-lg grid grid-cols-1 md:grid-cols-12 gap-6 animate-fadeIn">
                      <div className="md:col-span-4 flex flex-col justify-center text-center p-4 bg-white/5 rounded-2xl border border-white/5 md:items-center">
                        <Award className="w-12 h-12 text-indigo-400 mb-2" />
                        <h4 className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Evaluation Completed</h4>
                        <span className="text-3xl font-black text-white mt-1 leading-none">{mockScoreBreakdown.score} / {mockScoreBreakdown.totalScore}</span>
                        <p className="text-xs text-indigo-300 font-bold mt-2">Accuracy: {mockScoreBreakdown.accuracy}%</p>
                      </div>

                      <div className="md:col-span-8 flex flex-col justify-between space-y-4">
                        <div>
                          <h3 className="font-bold text-white text-md tracking-tight">AI Feedback: Normalization is clear, Probability needs practice.</h3>
                          <p className="text-xs text-slate-400 mt-1">Simulated performance indicates highly structured analytical reasoning but vulnerable sets. Review shortcuts in Practice tab ASAP.</p>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2.5 text-center text-[11px]">
                          <div className="p-2 bg-emerald-500/10 rounded-xl">
                            <span className="block font-bold text-emerald-400">{mockScoreBreakdown.correct} Correct</span>
                          </div>
                          <div className="p-2 bg-red-500/10 rounded-xl">
                            <span className="block font-bold text-red-400">{mockScoreBreakdown.incorrect} Wrong</span>
                          </div>
                          <div className="p-2 bg-slate-500/10 rounded-xl">
                            <span className="block text-slate-300">{mockScoreBreakdown.unattempted} Omitted</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <button 
                            onClick={() => setMockScoreBreakdown(null)}
                            className="text-white hover:text-indigo-400 text-xs font-bold underline transition-all"
                          >
                            Hide Results Detail
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* List grid of exam simulation models */}
                  <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
                    <h3 className="text-lg font-bold text-white mb-2">Available National Mock Models</h3>
                    <p className="text-xs text-slate-400 mb-6">Select a simulation panel mapped with accurate marking scales matching latest syllabus updates.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {MOCK_TESTS.map((mock) => (
                        <div key={mock.id} className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-indigo-500/40 flex flex-col justify-between gap-5 transition-all">
                          <div>
                            <span className="bg-indigo-500/10 text-indigo-400 text-[9px] px-2 py-0.5 rounded font-extrabold uppercase tracking-widest leading-none">
                              {mock.exam} PREPARATION
                            </span>
                            <h4 className="font-bold text-white text-sm mt-2 tracking-tight pr-2">{mock.title}</h4>
                            
                            <div className="flex items-center gap-3.5 text-xs text-slate-400 mt-4">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                {mock.durationMinutes} Mins
                              </span>
                              <span className="flex items-center gap-1">
                                <Book className="w-3.5 h-3.5 text-slate-400" />
                                {mock.totalQuestions} Questions
                              </span>
                            </div>
                          </div>

                          <button 
                            onClick={() => startMockSimulation(mock)}
                            className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-[1.01] active:scale-95 text-white font-bold text-xs rounded-xl shadow-md transition-all text-center"
                          >
                            Begin Timed Test Series
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Exam instructions note board */}
                  <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md space-y-3.5">
                    <h4 className="font-bold text-white text-xs uppercase tracking-wider text-slate-300">Rules & Scoring Precision</h4>
                    <div className="text-xs text-slate-400 space-y-2 leading-relaxed">
                      <div className="flex gap-2">
                        <span className="text-indigo-400 font-bold">•</span>
                        <span>**NIMCET**: Correct allocation is +4 Marks, Wrong choice triggers a strict -1 point penalty. Weighted marks multiplier is applied.</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-indigo-400 font-bold">•</span>
                        <span>**CUET PG**: Section structure applies dynamic weights. Correct provides +4, incorrect marks subtract 1 point.</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-indigo-400 font-bold">•</span>
                        <span>**GATE CS**: Double penalty evaluation algorithm applies for MCQs (1/3rd point reduction). MSQs and Numerical tests exclude negative scores.</span>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              </>)}
            </div>
          )}

          {/* TAB 5: AI TUTOR PANEL */}
          {activeTab === 'tutor' && (
            <div id="view-tutor" className="space-y-8 animate-fadeIn">
              
              {/* Premium Tutor Tools Switcher */}
              <div className="flex gap-2 p-1.5 bg-black/40 border border-white/10 rounded-2xl w-fit">
                <button
                  id="btn-tutor-tools"
                  onClick={() => setTutorSubTab('tools')}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    tutorSubTab === 'tools'
                      ? 'bg-indigo-600 text-white font-extrabold shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  ⚡ AI SmarTools (Doubt Solver, Formulas, Predictor, Placement Hub)
                </button>
                <button
                  id="btn-tutor-chat"
                  onClick={() => setTutorSubTab('chat')}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    tutorSubTab === 'chat'
                      ? 'bg-indigo-600 text-white font-extrabold shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  💬 Chat Arena with Aris Mentor
                </button>
              </div>

              {tutorSubTab === 'tools' ? (
                <SpecializedTools setRecentNotification={setRecentNotification} />
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Chat message arena */}
                <div className="lg:col-span-8 p-6 rounded-3xl bg-slate-950/40 border border-white/10 backdrop-blur-md flex flex-col justify-between h-[600px]">
                  
                  {/* Assistant header indicator */}
                  <div className="flex justify-between items-center pb-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold animate-pulse">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-xs">Aris Mentor Session</h3>
                        <p className="text-[9px] text-emerald-400 font-semibold tracking-wider uppercase flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block animate-ping"></span>
                          <span>Connected to Gemini Core</span>
                        </p>
                      </div>
                    </div>

                    <button 
                      onClick={() => setIrisMessages([{ sender: 'aris', text: 'Conversational memory reset! How can I improve your concept clarity or formulate shortcuts today?', time: 'Just now' }])}
                      className="text-xs text-slate-400 hover:text-white transition-all underline"
                    >
                      Clear Memory
                    </button>
                  </div>

                  {/* Messages body scrolling */}
                  <div className="flex-1 overflow-y-auto space-y-4 py-6 pr-2">
                    {irisMessages.map((msg, mIdx) => (
                      <div key={mIdx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-slideIn`}>
                        <div className={`p-4 rounded-2xl max-w-lg text-xs leading-relaxed ${
                          msg.sender === 'user' 
                            ? 'bg-indigo-600 text-white rounded-br-none' 
                            : 'bg-white/5 border border-white/5 text-slate-100 rounded-bl-none font-medium'
                        }`}>
                          <p className="whitespace-pre-line">{msg.text}</p>
                          <span className="block text-[8px] text-right opacity-60 mt-1 select-none font-mono">
                            {msg.time}
                          </span>
                        </div>
                      </div>
                    ))}

                    {aiApiKeyLoading && (
                      <div className="flex justify-start animate-pulse">
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 max-w-xs text-xs text-slate-400 italic">
                          <span className="inline-block animate-bounce mr-1">•</span>
                          <span className="inline-block animate-bounce [animation-delay:0.2s] mr-1">•</span>
                          <span className="inline-block animate-bounce [animation-delay:0.4s]">•</span>
                          Aris is thinking, adjusting rank multipliers...
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Input form */}
                  <div className="pt-4 border-t border-white/10 flex items-center gap-2">
                    <input 
                      type="text" 
                      value={irisInputPrompt}
                      placeholder="Ask Aris: Explain Recursion / Probability shortcuts, write formulas..."
                      onChange={(e) => setIrisInputPrompt(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && askArisMentor()}
                      className="bg-white/5 border border-white/10 focus:border-indigo-500 text-xs text-white rounded-xl py-3 px-4 flex-1 focus:outline-none"
                    />
                    <button 
                      onClick={() => askArisMentor()}
                      className="py-1 px-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold text-white transition-all"
                    >
                      Ask
                    </button>
                  </div>

                </div>

                {/* Right Side: Topic boosters and preset questions */}
                <div className="lg:col-span-4 space-y-6">
                  
                  {/* Preset triggers */}
                  <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md space-y-4">
                    <h4 className="font-bold text-white text-xs uppercase tracking-wider text-slate-300">Quick Mentor Prompts</h4>
                    <p className="text-slate-400 text-[11px] leading-relaxed">Choose a topic prompt below to have Aris break down complex formulation, algorithms, or shortcuts instantly.</p>
                    
                    <div className="space-y-2.5">
                      <button 
                        onClick={() => handlePresetQuery('norm')}
                        className="w-full text-left p-3 rounded-xl bg-white/5 border border-white/5 hover:border-indigo-500/40 hover:bg-white/10 text-[11px] text-slate-300 transition-all font-medium"
                      >
                        Explain DBMS Normalizations
                      </button>
                      <button 
                        onClick={() => handlePresetQuery('prob')}
                        className="w-full text-left p-3 rounded-xl bg-white/5 border border-white/5 hover:border-indigo-500/40 hover:bg-white/10 text-[11px] text-slate-300 transition-all font-medium"
                      >
                        Probability without replacement tips
                      </button>
                      <button 
                        onClick={() => handlePresetQuery('dsa')}
                        className="w-full text-left p-3 rounded-xl bg-white/5 border border-white/5 hover:border-indigo-500/40 hover:bg-white/10 text-[11px] text-slate-300 transition-all font-medium"
                      >
                        Recursion on Binary Trees DSA
                      </button>
                    </div>
                  </div>

                  {/* Rank Prediction details */}
                  <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md space-y-3.5">
                    <h4 className="font-bold text-white text-xs uppercase tracking-wider text-slate-300">Consistent Motivation Ticker</h4>
                    <p className="text-slate-400 text-[11px] leading-relaxed">Aris tracks speed vs error rates daily to predict final national ranks in entrance systems.</p>
                    
                    <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 text-[11px] space-y-2.5">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Predicted Zone:</span>
                        <span className="font-bold text-white tracking-tight">{predictedRankRange}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Total Solved Qs:</span>
                        <span className="text-slate-200 font-bold">{solvedCount}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Leaderboard Place:</span>
                        <span className="text-emerald-400 font-bold">#42 Nationwide</span>
                      </div>
                    </div>
                  </div>

                  {/* Elite Achievements Section */}
                  <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white text-xs uppercase tracking-wider text-slate-300">Elite Achievements</h4>
                      <Trophy className="w-4 h-4 text-amber-500" />
                    </div>
                    
                    <div className="space-y-3">
                      {[
                        { title: '7 Day Streak', icon: Flame, color: 'text-orange-500' },
                        { title: 'Probability Master', icon: Target, color: 'text-rose-500' },
                        { title: 'Mock Marathon', icon: Rocket, color: 'text-indigo-400' }
                      ].map((ach, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-black/40 border border-white/5 rounded-2xl group hover:border-indigo-500/30 transition-all cursor-default">
                          <div className={`p-2 bg-white/5 rounded-xl ${ach.color}`}>
                            <ach.icon className="w-4 h-4" />
                          </div>
                          <span className="text-[11px] font-bold text-white group-hover:text-indigo-400 transition-colors">{ach.title}</span>
                          <div className="ml-auto flex items-center gap-1.5">
                             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                          </div>
                        </div>
                      ))}
                    </div>
                    <button className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest transition-all">View All 24 Medals</button>
                  </div>

                </div>

              </div>)}

            </div>
          )}

          {/* TAB 6: STUDY PLANNER */}
          {activeTab === 'planner' && (
            <div id="view-planner" className="space-y-8 animate-fadeIn">
              
              {/* Entrance input parameter form */}
              <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
                <h3 className="text-lg font-bold text-white mb-2">90-Day Sprint AI Planner</h3>
                <p className="text-xs text-slate-400 mb-6">Choose target parameters and generated personalized roadmap tracks aligned with cutoffs automatically!</p>

                <form onSubmit={triggerAiPlannerRoadmap} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div>
                    <label className="block text-[10px] text-slate-300 font-bold uppercase mb-1">Target Exam Selection</label>
                    <select 
                      value={plannerExam}
                      onChange={(e) => setPlannerExam(e.target.value as ExamType)}
                      className="w-full bg-[#05060b] text-white border border-white/10 rounded-xl px-3.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500"
                    >
                      <option value="NIMCET">NIMCET</option>
                      <option value="CUET PG MCA">CUET PG MCA</option>
                      <option value="GATE CS">GATE CS</option>
                      <option value="TANCET MCA">TANCET MCA</option>
                      <option value="CAT">CAT</option>
                      <option value="Placements">Placements</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-300 font-bold uppercase mb-1">Target rank AIR</label>
                    <input 
                      type="number"
                      min="1"
                      value={plannerRank}
                      onChange={(e) => setPlannerRank(Number(e.target.value))}
                      className="w-full bg-white/5 text-white border border-white/10 rounded-xl px-3.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-300 font-bold uppercase mb-1">Sprints Range (Months)</label>
                    <select 
                      value={plannerMonths}
                      onChange={(e) => setPlannerMonths(Number(e.target.value))}
                      className="w-full bg-[#05060b] text-white border border-white/10 rounded-xl px-3.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500"
                    >
                      <option value="3">3 Months (Sprint)</option>
                      <option value="6">6 Months (Comprehensive)</option>
                      <option value="12">12 Months (Pacing)</option>
                    </select>
                  </div>
                  <button 
                    type="submit"
                    className="w-full py-1.5 bg-indigo-600 hover:bg-indogo-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all text-center"
                  >
                    Generate Study Roadmap Block
                  </button>
                </form>
              </div>

              {/* Dynamic generated plan timeline */}
              {generatedPlan ? (
                <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md space-y-6 animate-slideIn">
                  <div className="pb-4 border-b border-white/10 flex justify-between items-center">
                    <div>
                      <h4 className="font-extrabold text-white text-md tracking-tight">{generatedPlan.sprintTitle}</h4>
                      <p className="text-[10px] text-indigo-400 font-mono">Generated June 2026</p>
                    </div>
                    <span className="bg-emerald-500/20 text-emerald-400 text-[9px] px-2 py-0.5 rounded-full font-bold border border-emerald-500/30">Mastery plan: Ready</span>
                  </div>

                  <div className="space-y-4">
                    {generatedPlan.weeks.map((week) => (
                      <div key={week.weekNum} className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-indigo-500/40 transition-all flex flex-col md:flex-row items-start justify-between gap-4">
                        <div className="flex gap-4">
                          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 flex flex-col items-center justify-center font-bold shrink-0">
                            <span className="text-[10px] uppercase leading-none font-medium">WEEK</span>
                            <span className="text-sm font-black font-extrabold leading-none">{week.weekNum}</span>
                          </div>
                          <div>
                            <span className="text-white font-bold text-xs">{week.focus}</span>
                            <ul className="mt-1 flex flex-wrap gap-1">
                              {week.topics.map((t, tIndex) => (
                                <li key={tIndex} className="text-[10px] text-slate-400 bg-black/40 px-2 py-0.5 rounded-lg border border-white/5">{t}</li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="block text-[8px] uppercase tracking-wider text-slate-400">Weekly evaluation day</span>
                          <span className="text-xs font-bold text-indigo-300 font-mono">{week.revisionDay}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center bg-white/5 border border-white/10 rounded-3xl">
                  <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400 text-xs">No active dynamic roadmap generated yet. Complete the form above to deploy study sidetracks.</p>
                </div>
              )}

            </div>
          )}

          {/* TAB 7: LECTURE FINDER VIDEO CORNER */}
          {activeTab === 'videos' && (
            <div id="view-videos" className="space-y-8 animate-fadeIn">
              
              {/* Premium Resources Switcher */}
              <div className="flex gap-2 p-1.5 bg-black/40 border border-white/10 rounded-2xl w-fit">
                <button
                  id="btn-videos-custom"
                  onClick={() => setVideosSubTab('custom_engine')}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    videosSubTab === 'custom_engine'
                      ? 'bg-indigo-600 text-white font-extrabold shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  📚 Ivy League / NPTEL & Textbooks Engine
                </button>
                <button
                  id="btn-videos-standard"
                  onClick={() => setVideosSubTab('standard')}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    videosSubTab === 'standard'
                      ? 'bg-indigo-600 text-white font-extrabold shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🎥 Standard YouTube Playlist Shelf
                </button>
              </div>

              {videosSubTab === 'custom_engine' ? (
                <BooksAndResourceEngine />
              ) : (
                <>
                  {/* Header Banner */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-xl">
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight">Verified Academic Lecture Finder</h2>
                  <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                    Search and screen premium, verified classroom course playlists on YouTube (such as Gate Smashers, Neso Academy, and Amit Khurana) fully aligned with national syllabus requirements. No more dead links.
                  </p>
                </div>
                
                <div className="flex items-center gap-2.5 bg-emerald-500/10 border border-emerald-500/20 p-3.5 rounded-2xl shrink-0">
                  <PlayCircle className="w-5 h-5 text-emerald-400" />
                  <div className="text-left text-xs">
                    <span className="block font-bold text-white font-mono">100% Free Access</span>
                    <span className="text-slate-400 text-[10px]">Curated by Senior Educators</span>
                  </div>
                </div>
              </div>

              {/* AI Recommendation Box */}
              <div className="p-5 rounded-3xl bg-gradient-to-r from-indigo-950/40 via-indigo-900/10 to-transparent border border-indigo-500/20 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex gap-3.5 items-start">
                  <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-indigo-400 shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold uppercase text-indigo-300 tracking-wider font-mono">AI Recommendation Engine</span>
                    <h4 className="text-xs font-bold text-white mt-0.5">Recommended Course for Your Active Profile ({user.targetExam})</h4>
                    <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                      {user.targetExam === 'NIMCET' ? (
                        <span>Based on your NIMCET target, we advise focusing on <strong>Dr. Gajendra Purohit (Calculus & Integration)</strong> or <strong>Gate Smashers (DBMS)</strong> to safeguard your AIR #50 target. Probability bounds under Neso Academy are also highly vital today.</span>
                      ) : user.targetExam === 'GATE CS' ? (
                        <span>Based on your GATE CS timeline, we recommend studying <strong>Amit Khurana (Advanced Normalization)</strong> on high priority. This course provides rigorous mathematical proofs of lossless join decomposition.</span>
                      ) : (
                        <span>We highly recommend studying <strong>Neso Academy (Programming & Data Structures)</strong> to solidify your basics and score maximum points on computer core questions.</span>
                      )}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    setVideoSubjectFilter('Database Systems');
                    setRecentNotification("Active recommended filters applied.");
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition-colors whitespace-nowrap shrink-0 border border-indigo-500"
                >
                  Apply Recommendation Filter
                </button>
              </div>

              {/* Advanced Query & Search Filters */}
              <div className="p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md space-y-5">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
                    <Sliders className="w-4 h-4" />
                    <span>Academic Screening Filters</span>
                  </div>
                  <button 
                    onClick={() => {
                      setVideoSearchQuery('');
                      setVideoLanguageFilter('ALL');
                      setVideoLevelFilter('ALL');
                      setVideoExamFilter('ALL');
                      setVideoSubjectFilter('ALL');
                      setRecentNotification("Lecture filters cleared successfully.");
                    }}
                    className="text-[10px] text-slate-400 hover:text-white"
                  >
                    Reset All Filters
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {/* Search query search box */}
                  <div className="md:col-span-2 relative">
                    <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1.5">Search Keywords</label>
                    <div className="relative">
                      <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-500" />
                      <input 
                        type="text"
                        value={videoSearchQuery}
                        onChange={(e) => setVideoSearchQuery(e.target.value)}
                        placeholder="Search channel, title, or topic..."
                        className="w-full bg-[#05060b] text-white border border-white/10 rounded-xl pl-10 pr-3.5 py-2 text-xs focus:outline-none focus:border-indigo-500 placeholder:text-slate-500"
                      />
                    </div>
                  </div>

                  {/* Exam selection */}
                  <div>
                    <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1.5">Exam Series</label>
                    <select
                      value={videoExamFilter}
                      onChange={(e) => setVideoExamFilter(e.target.value as any)}
                      className="w-full bg-[#05060b] text-white border border-white/10 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-indigo-500"
                    >
                      <option value="ALL">All Exams</option>
                      <option value="NIMCET">NIMCET</option>
                      <option value="CUET PG MCA">CUET PG MCA</option>
                      <option value="GATE CS">GATE CS</option>
                      <option value="TANCET MCA">TANCET MCA</option>
                      <option value="CAT">CAT</option>
                      <option value="Placements">Placements</option>
                    </select>
                  </div>

                  {/* Language Selection */}
                  <div>
                    <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1.5">Language</label>
                    <select
                      value={videoLanguageFilter}
                      onChange={(e) => setVideoLanguageFilter(e.target.value as any)}
                      className="w-full bg-[#05060b] text-white border border-white/10 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-indigo-500"
                    >
                      <option value="ALL">All Languages</option>
                      <option value="English">English</option>
                      <option value="Hindi">Hindi</option>
                      <option value="Tamil">Tamil</option>
                      <option value="Telugu">Telugu</option>
                      <option value="Mixed">Mixed (Bilingual)</option>
                    </select>
                  </div>

                  {/* Difficulty level selection */}
                  <div>
                    <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1.5">Aspirant Level</label>
                    <select
                      value={videoLevelFilter}
                      onChange={(e) => setVideoLevelFilter(e.target.value as any)}
                      className="w-full bg-[#05060b] text-white border border-white/10 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-indigo-500"
                    >
                      <option value="ALL">All Levels</option>
                      <option value="Beginner">Beginner (Basic Theory)</option>
                      <option value="Intermediate">Intermediate (GATE Level)</option>
                      <option value="Advanced">Advanced (Elite Level)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Classroom Playlists Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {(() => {
                  const filtered = LECTURE_RESOURCES.filter(l => {
                    const matchQuery = videoSearchQuery === '' || 
                      l.title.toLowerCase().includes(videoSearchQuery.toLowerCase()) ||
                      l.channel.toLowerCase().includes(videoSearchQuery.toLowerCase()) ||
                      l.subject.toLowerCase().includes(videoSearchQuery.toLowerCase());
                    const matchExam = videoExamFilter === 'ALL' || l.exam === videoExamFilter || l.bestFor.some(b => b.toLowerCase().includes(videoExamFilter.toLowerCase()));
                    const matchLang = videoLanguageFilter === 'ALL' || l.language === videoLanguageFilter;
                    const matchLevel = videoLevelFilter === 'ALL' || l.level === videoLevelFilter;
                    
                    return matchQuery && matchExam && matchLang && matchLevel;
                  });

                  if (filtered.length === 0) {
                    return (
                      <div className="lg:col-span-2 p-12 text-center rounded-3xl bg-white/5 border border-white/5 space-y-3">
                        <AlertCircle className="w-8 h-8 text-slate-500 mx-auto" />
                        <h4 className="font-bold text-white text-xs uppercase tracking-wider">No matching academic courses available</h4>
                        <p className="text-xs text-slate-400 max-w-sm mx-auto">Try broadening your search query tags or choosing English + Hindi bilingual options.</p>
                      </div>
                    );
                  }

                  return filtered.map((resource) => {
                    // Compute average rating derived live from customized reviews state
                    const specReviews = lectureReviews.filter(r => r.playlistId === resource.id);
                    const avgRatingCalc = specReviews.length > 0 
                      ? Number((specReviews.reduce((sum, r) => sum + r.rating, 0) / specReviews.length).toFixed(1))
                      : resource.rating;
                    
                    const calculatedReviewsCount = resource.reviewsCount + specReviews.length;

                    return (
                      <div key={resource.id} className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col justify-between gap-5 hover:border-white/15 transition-all">
                        
                        <div>
                          {/* Card tags header section */}
                          <div className="flex justify-between items-start gap-4 pb-2.5 border-b border-white/5">
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-emerald-400 font-bold text-[10px] tracking-wide font-mono uppercase bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/10 flex items-center gap-1">
                                  {resource.channel}
                                  {resource.verified && <span className="text-[8px] bg-emerald-400 text-[#0b0c16] rounded-full px-1">✓</span>}
                                </span>
                                <span className="bg-white/5 text-slate-300 text-[9px] px-2 py-0.5 rounded uppercase font-semibold">
                                  {resource.subject}
                                </span>
                              </div>
                              <h4 className="font-extrabold text-white text-sm mt-2 leading-snug tracking-tight">
                                {resource.title}
                              </h4>
                            </div>

                            <div className="text-right shrink-0">
                              <div className="flex items-center gap-1 text-xs justify-end text-amber-400 font-mono font-bold">
                                <span>★</span>
                                <span>{avgRatingCalc}</span>
                              </div>
                              <span className="text-[9px] text-slate-400 block font-mono">
                                ({calculatedReviewsCount} Reviews)
                              </span>
                            </div>
                          </div>

                          {/* Specific target badges & language identifiers */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 py-4 text-xs font-mono">
                            <div className="bg-black/30 p-2 rounded-xl text-center border border-white/5">
                              <span className="block text-[8px] text-slate-500 uppercase font-black">Level</span>
                              <span className="text-white font-bold text-[10px]">{resource.level}</span>
                            </div>

                            <div className="bg-black/30 p-2 rounded-xl text-center border border-white/5">
                              <span className="block text-[8px] text-slate-500 uppercase font-black">Medium</span>
                              <span className="text-white font-bold text-[10px]">{resource.language}</span>
                            </div>

                            <div className="bg-black/30 p-2 rounded-xl text-center border border-white/5">
                              <span className="block text-[8px] text-slate-500 uppercase font-black">Duration</span>
                              <span className="text-white font-bold text-[10px]">{resource.duration}</span>
                            </div>

                            <div className="bg-black/30 p-2 rounded-xl text-center border border-white/5">
                              <span className="block text-[8px] text-slate-500 uppercase font-black">Exam Focus</span>
                              <span className="text-indigo-300 font-bold text-[10px]">{resource.exam}</span>
                            </div>
                          </div>

                          {/* Syllabus alignment list */}
                          <div className="mt-1">
                            <span className="text-[9px] text-slate-400 uppercase font-bold block mb-1">Aligned Syllabi Compatibility</span>
                            <div className="flex flex-wrap gap-1.5">
                              {resource.bestFor.map((best, bIdx) => (
                                <span key={bIdx} className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[9px] px-2 py-0.5 rounded-md font-mono">
                                  ✔ {best}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Interactive Toolbar */}
                        <div className="flex flex-col gap-4 border-t border-white/5 pt-4">
                          <div className="flex justify-between items-center transition-all">
                            {/* Watch Link */}
                            <a 
                              href={resource.youtubeUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs text-white font-bold transition-all flex items-center gap-1.5 shadow-md border border-indigo-500"
                            >
                              <PlayCircle className="w-4 h-4 shrink-0 text-emerald-300" />
                              <span>Watch Course on YouTube</span>
                            </a>

                            {/* View Reviews toggle */}
                            <button
                              onClick={() => {
                                setSelectedPlaylistReviewsId(
                                  selectedPlaylistReviewsId === resource.id ? null : resource.id
                                );
                              }}
                              className="py-2 px-3.5 bg-white/5 border border-white/10 hover:bg-white/10 text-xs text-slate-200 font-bold rounded-xl transition-all"
                            >
                              {selectedPlaylistReviewsId === resource.id ? "Minimize Reviews" : `Reviews & Feedback (${specReviews.length + 2})`}
                            </button>
                          </div>

                          {/* Nested Reviews Panel */}
                          {selectedPlaylistReviewsId === resource.id && (
                            <div className="p-4 bg-black/40 rounded-2xl border border-white/5 space-y-4 animate-slideIn mt-2">
                              {/* Display Reviews Title */}
                              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                <span className="font-extrabold text-white text-xs uppercase tracking-wider">Aspirants Written Feedback ({specReviews.length})</span>
                                <span className="text-[10px] text-amber-400 font-mono">★ {avgRatingCalc} Avg</span>
                              </div>

                              {/* Student reviews scrollbox */}
                              <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                                {specReviews.map((rev) => (
                                  <div key={rev.id} className="p-3 bg-[#0b0c16] rounded-xl border border-white/5 space-y-1">
                                    <div className="flex justify-between items-center text-[10px]">
                                      <span className="font-bold text-slate-300">{rev.userName}</span>
                                      <div className="flex items-center gap-1 font-mono text-amber-500 font-bold">
                                        <span>{'★'.repeat(rev.rating)}</span>
                                        <span>{rev.rating}/5</span>
                                      </div>
                                    </div>
                                    <p className="text-xs text-slate-400 leading-relaxed italic">{rev.reviewText}</p>
                                    <span className="text-[8px] text-slate-500 block font-mono">{rev.date}</span>
                                  </div>
                                ))}

                                {specReviews.length === 0 && (
                                  <p className="text-xs text-slate-500 text-center py-2">No written feedback logged yet. Be the first to share your learning experience!</p>
                                )}
                              </div>

                              {/* Add review form */}
                              <div className="border-t border-white/5 pt-3.5 space-y-3">
                                <span className="block text-[10px] text-slate-400 font-bold uppercase">Log Your Platform Review</span>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
                                  <div className="sm:col-span-8">
                                    <input 
                                      type="text"
                                      placeholder="Your student name..."
                                      id={`revname-input-${resource.id}`}
                                      className="placeholder:text-slate-600 bg-black/30 text-white border border-white/10 rounded-xl px-3 py-1.5 text-xs w-full focus:outline-none focus:border-indigo-500"
                                    />
                                  </div>
                                  <div className="sm:col-span-4">
                                    <select 
                                      id={`revstar-select-${resource.id}`}
                                      className="bg-black/30 text-white border border-white/10 rounded-xl px-3 py-1.5 text-xs w-full focus:outline-none focus:border-indigo-500"
                                    >
                                      <option value="5">★★★★★ (5 Stars)</option>
                                      <option value="4">★★★★☆ (4 Stars)</option>
                                      <option value="3">★★★☆☆ (3 Stars)</option>
                                      <option value="2">★★☆☆☆ (2 Stars)</option>
                                      <option value="1">★☆☆☆☆ (1 Star)</option>
                                    </select>
                                  </div>
                                </div>

                                <textarea 
                                  placeholder="What conceptually makes this playlist good? (e.g. Normalization simplified, high-speed shortcuts...)"
                                  id={`revtext-textarea-${resource.id}`}
                                  rows={2}
                                  className="placeholder:text-slate-600 bg-black/30 text-white border border-white/10 rounded-xl p-3 text-xs w-full focus:outline-none focus:border-indigo-500 resize-none"
                                />

                                <button
                                  onClick={() => {
                                    const rName = (document.getElementById(`revname-input-${resource.id}`) as HTMLInputElement)?.value || user.name;
                                    const rRating = Number((document.getElementById(`revstar-select-${resource.id}`) as HTMLSelectElement)?.value || 5);
                                    const rText = (document.getElementById(`revtext-textarea-${resource.id}`) as HTMLTextAreaElement)?.value || '';

                                    if (rText.trim().length === 0) {
                                      alert("Please supply review feedback or written notes first.");
                                      return;
                                    }

                                    const newRevObj: PlaylistReview = {
                                      id: `custom-rev-${Date.now()}`,
                                      playlistId: resource.id,
                                      userName: rName,
                                      rating: rRating,
                                      reviewText: rText,
                                      date: new Date().toISOString().split('T')[0]
                                    };

                                    setLectureReviews(prev => [newRevObj, ...prev]);
                                    setRecentNotification("⭐ Playlist review shared and synced with general database!");
                                    
                                    // Clear form
                                    const textElem = document.getElementById(`revtext-textarea-${resource.id}`) as HTMLTextAreaElement;
                                    if (textElem) textElem.value = '';
                                  }}
                                  className="py-1.5 px-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-[10px] transition-colors whitespace-nowrap inline-block"
                                >
                                  Submit Review Feedback
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                      </div>
                    );
                  });
                })()}
              </div>

              </>)}
            </div>
          )}

          {/* TAB: BOOKS & RESOURCES HUB */}
          {activeTab === 'books' && (
            <div id="view-books" className="space-y-8 animate-fadeIn">
              <BooksAndResourceEngine />
            </div>
          )}

          {/* TAB 8: GAMIFIED LEADERBOARD */}
          {activeTab === 'leaderboard' && (
            <div id="view-leaderboard" className="space-y-8 animate-fadeIn">
              
              {/* Champion banners */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-4">
                  <Trophy className="w-10 h-10 text-amber-400 shrink-0" />
                  <div>
                    <span className="block text-[8px] uppercase tracking-wider text-amber-400 font-bold">1st Place Champion</span>
                    <span className="font-extrabold text-white text-md tracking-tight">Keval Chandaria</span>
                    <span className="block text-[10px] text-slate-400 mt-1">1,980 Points • NIMCET topper target</span>
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-slate-300/10 border border-slate-300/20 flex items-center gap-4">
                  <Award className="w-10 h-10 text-slate-300 shrink-0" />
                  <div>
                    <span className="block text-[8px] uppercase tracking-wider text-slate-300 font-bold">Weekly Streak Champion</span>
                    <span className="font-extrabold text-white text-md tracking-tight">Anjali Verma</span>
                    <span className="block text-[10px] text-slate-400 mt-1">45 Day Streak check-in streak</span>
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-[#0e101a] border border-white/10 flex items-center gap-4 relative">
                  <div className="w-10 h-10 rounded-full bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 flex items-center justify-center font-bold text-sm shrink-0">
                    #42
                  </div>
                  <div>
                    <span className="block text-[8px] uppercase tracking-wider text-indigo-400 font-bold">Your Rank Position</span>
                    <span className="font-extrabold text-white text-md tracking-tight">{user.name}</span>
                    <span className="block text-[10px] text-indigo-300 mt-1">{user.points} Points • {user.streak} days active</span>
                  </div>
                </div>
              </div>

              {/* Comprehensive Leaderboard table */}
              <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
                <h3 className="text-lg font-bold text-white mb-4">Aspirant rankings leaderboard</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-white/10 text-slate-400 text-[10px] font-bold uppercase">
                        <th className="py-3 px-2">Rank</th>
                        <th className="py-3">Aspirant</th>
                        <th className="py-3">Target Entrance</th>
                        <th className="py-3">Dynamic Accuracy</th>
                        <th className="py-3">Total Solved</th>
                        <th className="py-3 text-right">Points</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-300">
                      <tr>
                        <td className="py-3.5 px-2 font-mono font-bold text-amber-400">#1</td>
                        <td className="py-3.5 text-white">Keval Chandaria</td>
                        <td className="py-3.5">GATE CS</td>
                        <td className="py-3.5 text-emerald-400 font-bold">95.4%</td>
                        <td className="py-3.5">520 Qs</td>
                        <td className="py-3.5 text-right text-indigo-300 font-bold">1,980</td>
                      </tr>
                      <tr>
                        <td className="py-3.5 px-2 font-mono font-bold text-slate-300">#2</td>
                        <td className="py-3.5 text-white">Anjali Verma</td>
                        <td className="py-3.5">NIMCET</td>
                        <td className="py-3.5 text-emerald-400 font-bold">91.8%</td>
                        <td className="py-3.5 text-slate-400 text-xs">380 Qs</td>
                        <td className="py-3.5 text-right text-indigo-300 font-bold">1,620</td>
                      </tr>
                      <tr>
                        <td className="py-3.5 px-2 font-mono font-bold text-amber-600">#3</td>
                        <td className="py-3.5 text-white">Rishi Shah</td>
                        <td className="py-3.5">CAT Entrance</td>
                        <td className="py-3.5 text-emerald-400 font-bold">88.5%</td>
                        <td className="py-3.5 text-slate-400 text-xs">240 Qs</td>
                        <td className="py-3.5 text-right text-indigo-300 font-bold">1,400</td>
                      </tr>
                      <tr className="bg-indigo-600/10 text-white border-y border-indigo-500/20">
                        <td className="py-3.5 px-2 font-mono font-bold">#42</td>
                        <td className="py-3.5 font-bold flex items-center gap-1.5">
                          {user.name}
                          <span className="text-[8px] bg-indigo-500 text-white px-1 py-0.5 rounded leading-none uppercase">You</span>
                        </td>
                        <td className="py-3.5">{user.targetExam}</td>
                        <td className="py-3.5 text-emerald-400 font-bold">{user.accuracy}%</td>
                        <td className="py-3.5">{solvedCount} Qs</td>
                        <td className="py-3.5 text-right font-black text-indigo-300">{user.points}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {activeTab === 'vault' && (
            <Suspense fallback={<ModuleLoading title="Orchestrating Vault Logic..." />}>
              <ErrorBoundary>
                <KnowledgeVault 
                  userExam={user.targetExam} 
                  onNavigateToTutor={(prompt, file) => {
                    setIrisInputPrompt(prompt);
                    setActiveTutorFile(file || null);
                    handleTabChange('tutor');
                  }}
                />
              </ErrorBoundary>
            </Suspense>
          )}

          {activeTab === 'focus' && (
            <Suspense fallback={<ModuleLoading title="Calibrating Focus Room..." />}>
              <ErrorBoundary>
                <FocusRoom 
                  onClose={() => handleTabChange('dashboard')}
                  onSessionComplete={(session) => {
                    displayNotice(`Focus Session Complete! Score: ${session.focusScore}%`);
                    handleTabChange('analytics');
                  }}
                />
              </ErrorBoundary>
            </Suspense>
          )}

          {activeTab === 'warroom' && (
            <Suspense fallback={<ModuleLoading title="Activating Mission Control..." />}>
              <ErrorBoundary>
                <WarRoom 
                  user={user} 
                  exam={user.targetExam} 
                  onNavigateToTutor={(prompt) => {
                    setIrisInputPrompt(prompt);
                    handleTabChange('tutor');
                  }}
                />
              </ErrorBoundary>
            </Suspense>
          )}

          {activeTab === 'graph' && (
            <Suspense fallback={<ModuleLoading title="Generating Neural Map..." />}>
              <ErrorBoundary>
                <ConceptGraph exam={user.targetExam} />
              </ErrorBoundary>
            </Suspense>
          )}

          {activeTab === 'roadmaps' && (
            <Suspense fallback={<ModuleLoading title="Tracing Career Paths..." />}>
              <ErrorBoundary>
                <CareerRoadmaps />
              </ErrorBoundary>
            </Suspense>
          )}

          {activeTab === 'planner' && (
            <Suspense fallback={<ModuleLoading title="Loading College Explorer & Planner..." />}>
              <ErrorBoundary>
                <CollegeExplorer userExam={user.targetExam} />
              </ErrorBoundary>
            </Suspense>
          )}

              </main>
            </motion.div>
          </AnimatePresence>
        </Suspense>
      </div>

      {/* DYNAMIC COMPREHENSIVE STUDY PATHWAY MODAL */}
      {selectedTopicPath && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
          <div className="w-full max-w-4xl bg-[#090b14] rounded-3xl border border-white/10 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-slideUp">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-white/5 flex justify-between items-start bg-white/[0.02]">
              <div className="space-y-1 text-left">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] bg-indigo-500/10 text-indigo-300 font-mono font-bold px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                    {selectedTopicPath.subject || "Course Core"} Topic Pathway
                  </span>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                    selectedTopicPath.importance === 'High' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-slate-500/10 text-slate-400'
                  }`}>
                    {selectedTopicPath.importance} Weight Topic
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-white tracking-tight">{selectedTopicPath.name}</h3>
                <p className="text-xs text-slate-400">Syllabus Scope: <span className="text-slate-300 italic">{selectedTopicPath.subtopics.join(', ')}</span></p>
              </div>
              <button 
                onClick={() => setSelectedTopicPath(null)}
                className="p-1.5 px-3 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg text-xs transition-all"
              >
                ✕ Close
              </button>
            </div>

            {/* Pathway Tabs Row */}
            <div className="flex bg-[#05060a] border-b border-white/5 px-4 overflow-x-auto text-xs shrink-0">
              {[
                { id: 'videos', label: '📺 Recommended Video Playlists', desc: 'Verified Courses' },
                { id: 'notes', label: '📝 AI Comprehensive Notes', desc: 'Theory & Proofs' },
                { id: 'revision', label: '⚡ Quick Revision Sheet', desc: 'Shortcuts & Pitfalls' },
                { id: 'practice', label: '🎯 Topic practice sets', desc: 'MCQs & PYQs' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTopicPathTab(tab.id as any)}
                  className={`py-3 px-4 font-bold border-b-2 transition-all text-left flex flex-col gap-0.5 whitespace-nowrap ${
                    activeTopicPathTab === tab.id 
                      ? 'border-emerald-500 text-white bg-white/5' 
                      : 'border-transparent text-slate-400 hover:text-white hover:bg-white/[0.01]'
                  }`}
                >
                  <span className="block leading-none">{tab.label}</span>
                  <span className="text-[9px] text-slate-500 block font-normal font-mono">{tab.desc}</span>
                </button>
              ))}
            </div>

            {/* Dynamic Content Body (scrollable) */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6 text-left">
              
              {/* VIDEOS TAB */}
              {activeTopicPathTab === 'videos' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl gap-3">
                    <div className="flex items-center gap-3">
                      <PlayCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                      <div className="text-xs">
                        <span className="block font-bold text-white">Database-driven Classroom integration</span>
                        <span className="text-slate-400">All playlists undergo automatic link monitoring to prevent deleted/invalid URLs.</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        setSelectedTopicPath(null);
                        handleTabChange('videos');
                        setVideoSearchQuery(selectedTopicPath.name);
                      }}
                      className="text-[10px] font-bold text-[#090b14] bg-emerald-400 hover:bg-emerald-300 px-3 py-1.5 rounded-lg transition-colors shrink-0"
                    >
                      Go to Full Finder Hub
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(() => {
                      // Find resources matching this subject or topic name
                      const matches = LECTURE_RESOURCES.filter(r => 
                        r.subject.toLowerCase().includes(selectedTopicPath.name.toLowerCase()) || 
                        selectedTopicPath.name.toLowerCase().includes(r.subject.toLowerCase()) ||
                        r.title.toLowerCase().includes(selectedTopicPath.name.toLowerCase()) ||
                        (selectedTopicPath.subject && r.subject.toLowerCase().includes(selectedTopicPath.subject.toLowerCase()))
                      );

                      const finalToRender = matches.length > 0 ? matches : LECTURE_RESOURCES.slice(0, 4);

                      return finalToRender.map(res => {
                        const specReviews = lectureReviews.filter(r => r.playlistId === res.id);
                        const avgRating = specReviews.length > 0 
                          ? (specReviews.reduce((sum, r) => sum + r.rating, 0) / specReviews.length).toFixed(1)
                          : res.rating;

                        return (
                          <div key={res.id} className="p-4 bg-white/5 border border-white/5 rounded-2xl flex flex-col justify-between gap-4 text-xs font-mono">
                            <div>
                              <div className="flex justify-between items-start text-[10px] border-b border-white/5 pb-2">
                                <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded uppercase">
                                  {res.channel}
                                </span>
                                <span className="text-amber-400 font-bold flex items-center gap-0.5">★ {avgRating}</span>
                              </div>
                              <h4 className="font-bold text-sm text-white mt-2 leading-snug font-sans">{res.title}</h4>
                              <div className="flex gap-2.5 text-[10px] text-slate-400 mt-2 flex-wrap">
                                <span>⏱ {res.duration}</span>
                                <span>🌐 {res.language}</span>
                                <span>🎯 {res.level}</span>
                              </div>
                            </div>
                            <div className="flex justify-between items-center border-t border-white/5 pt-2 text-[10px]">
                              <span>Best: {res.exam}</span>
                              <a 
                                href={res.youtubeUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold tracking-tight inline-flex items-center gap-1 font-sans"
                              >
                                <PlayCircle className="w-3 h-3 text-emerald-300" />
                                <span>Watch on YouTube</span>
                              </a>
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>
              )}

              {/* NOTES TAB */}
              {activeTopicPathTab === 'notes' && (
                <div className="space-y-4">
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-300 font-mono px-2 py-1 rounded font-bold uppercase tracking-wider">AI Generated Subject Cheat Notes</span>
                  
                  <div className="p-6 bg-black/40 rounded-3xl border border-white/5 space-y-4 text-slate-300 text-xs leading-relaxed max-w-none">
                    {selectedTopicPath.name.toLowerCase().includes('database') || selectedTopicPath.name.toLowerCase().includes('dbms') ? (
                      <>
                        <h4 className="text-sm font-extrabold text-white">Understanding Database Normalization (1NF, 2NF, 3NF, BCNF)</h4>
                        <p>Database normalization is the fundamental mathematical technique of restructuring relational tables to minimize data redundancy and completely eliminate update, deletion, and insertion anomalies.</p>
                        
                        <div className="p-3.5 bg-white/5 rounded-2xl border border-white/5 font-mono text-[11px] text-indigo-300 space-y-1">
                          <span className="block font-bold text-white uppercase text-[9px] text-slate-400">Core Rules Checklist:</span>
                          <div>• <strong>1NF</strong>: All attributes must be atomic values. No repeating groups or nested arrays allowed inside variables.</div>
                          <div>• <strong>2NF</strong>: Must be in 1NF, AND no <i>Partial Dependencies</i> on any candidate keys (i.e. every non-prime attribute must depend on the whole primary candidate key, not just a subset).</div>
                          <div>• <strong>3NF</strong>: Must be in 2NF, AND no <i>Transitive Dependencies</i> (i.e., for any functional dependency A ➔ B, either A is a super key or B is a prime attribute).</div>
                          <div>• <strong>BCNF</strong>: Must be in 3NF, AND for any dependency A ➔ B, the left side (A) MUST be an absolute Super Key.</div>
                        </div>

                        <p><strong>Common Pitfall:</strong> Many students confuse 3NF and BCNF. A relation can be in 3NF but fail BCNF if there are overlapping candidate keys. In BCNF, we strictly require that the determinant (left-hand side of FD) always be a superkey, regardless of whether the right-hand attribute is prime.</p>
                      </>
                    ) : selectedTopicPath.name.toLowerCase().includes('probability') || selectedTopicPath.name.toLowerCase().includes('statistics') ? (
                      <>
                        <h4 className="text-sm font-extrabold text-white">Core Axioms of Conditional Probability & Bayes Theorem</h4>
                        <p>Bayes Theorem allows us to update our belief/probability of a hypothesis (A) given new empirical evidence (B). This is a pillar of both NIMCET mathematics and Machine Learning algorithms.</p>
                        
                        <div className="p-3.5 bg-white/5 bg-gradient-to-r from-emerald-950/10 to-transparent rounded-2xl border border-white/5 font-mono text-[11px] text-emerald-300 space-y-1 text-center">
                          <span className="block font-bold text-slate-400 uppercase text-[9px] text-left">The Famous Bayes Formulation:</span>
                          <div className="text-sm font-bold my-1 text-white">P(A | B) = [ P(B | A) * P(A) ] / P(B)</div>
                          <div className="text-[10px] text-slate-400 text-left">Where P(B) = P(B | A)*P(A) + P(B | A&apos;)*P(A&apos;) is computed via the Total Probability Theorem.</div>
                        </div>

                        <p><strong>Dr. Gajendra’s Shortcuts:</strong> For direct box and balls problems (e.g., three urns containing varied white and black balls): write a probability tree, find the branches that terminate with the specified outcome, divide the target branch probability by the sum of all valid branches to skip long mechanical derivations.</p>
                      </>
                    ) : selectedTopicPath.name.toLowerCase().includes('operating') || selectedTopicPath.name.toLowerCase().includes('scheduler') || selectedTopicPath.name.toLowerCase().includes('os') ? (
                      <>
                        <h4 className="text-sm font-extrabold text-white">Operating Systems: CPU Scheduling Algorithms & Threading Locks</h4>
                        <p>Operating legacy code requires coordinating active threads. The scheduler decides which thread is loaded onto the processor core based on set algorithms.</p>
                        
                        <div className="p-3.5 bg-white/5 rounded-2xl border border-white/5 font-mono text-[11px] text-indigo-300 space-y-1">
                          <span className="block font-bold text-white uppercase text-[9px] text-slate-400">Scheduling Profiles:</span>
                          <div>• <strong>FCFS</strong>: Non-preemptive, simple FIFO queue. Suffers from Convoy Effect if a large process hogs the execution.</div>
                          <div>• <strong>SJF/SRTF</strong>: Shortest Job First / Preemptive version. Provably optimal to minimize average waiting time, but can trigger starvation.</div>
                          <div>• <strong>Round Robin (RR)</strong>: Preemptive using regular time slices (Quantum). Best response times for general interactive systems.</div>
                        </div>

                        <p><strong>Examiner’s Favorite Trick:</strong> If processes arrive at different times, always draw a Gantt Chart step-by-step from time = 0. Do not skip steps, as preemptive SRTF scheduling requires constant comparison at every singular integer arrival tick.</p>
                      </>
                    ) : (
                      <>
                        <h4 className="text-sm font-extrabold text-white">Full Classroom Guide: Analytical Foundations of {selectedTopicPath.name}</h4>
                        <p>This syllabus topic encompasses high-scoring core items for competitive exams like {user.targetExam}. Perfecting this subject requires active formula retrieval, shortcut practice, and continuous error logs tracking.</p>
                        
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-2">
                          <span className="block font-bold text-white uppercase text-[9px] text-slate-400 font-mono">Suggested Learning Route:</span>
                          <ol className="list-decimal pl-4 space-y-1 font-mono text-[10px] text-slate-300">
                            <li>Watch the recommended YouTube Lectures to clarify the basic definitions and concepts.</li>
                            <li>Review the Quick Formula Cheat sheet inside this container.</li>
                            <li>Solve the curated PYQs from {user.targetExam} to see how exam setters frame these questions.</li>
                            <li>Execute practice drill questions to push accuracy targets over 90%.</li>
                          </ol>
                        </div>
                      </>
                    )}
                    
                    {/* Ask Aris CTA */}
                    <div className="p-4 bg-indigo-950/20 rounded-2xl border border-indigo-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="flex gap-2 items-center">
                        <span className="p-1.5 bg-indigo-500/15 rounded-xl text-indigo-400 shrink-0">🤖</span>
                        <span className="font-bold text-white font-sans">Need deep mathematical proof? Ask AI Mentor Aris!</span>
                      </div>
                      <button
                        onClick={() => {
                          setIrisInputPrompt(`Aris, can you break down the mathematical proving and common exam formulas for ${selectedTopicPath.name}? Provide direct examples.`);
                          setSelectedTopicPath(null);
                          handleTabChange('tutor');
                        }}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white font-extrabold tracking-tight transition-all text-[10px] font-sans"
                      >
                        Load query in AI Tutor Chat
                      </button>
                    </div>

                  </div>
                </div>
              )}

              {/* REVISION SHEET TAB */}
              {activeTopicPathTab === 'revision' && (
                <div className="space-y-4">
                  <span className="text-[10px] bg-amber-500/15 text-amber-400 font-mono px-2 py-1 rounded font-bold uppercase tracking-wider">Aspirants Revision Sheet & Formula Tracker</span>

                  <div className="p-5 rounded-2xl bg-white/5 border border-white/5 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-black/40 rounded-xl border border-white/5 space-y-2">
                      <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded uppercase font-mono">High-Speed Short Cuts</span>
                      <p className="text-xs text-white font-semibold flex items-center gap-1">
                        <Lightbulb className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Formula shortcuts for calculations:</span>
                      </p>
                      <div className="text-[11px] text-slate-400 font-mono space-y-1 pl-1">
                        {selectedTopicPath.name.toLowerCase().includes('dbms') ? (
                          <>
                            <div>• Attribute Closure rule: X⁺ finding takes O(N) where N is number of FDs. Always use it to test for keys.</div>
                            <div>• Decomposition: To check lossless join, check if R₁ ∩ R₂ ➔ R₁ or R₁ ∩ R₂ ➔ R₂.</div>
                          </>
                        ) : selectedTopicPath.name.toLowerCase().includes('prob') ? (
                          <>
                            <div>• Poisson Mean/Variance is λ. Total probability tree must always sum to exactly 1.0.</div>
                            <div>• Standard Bayes Odds ratio: Odds(A|B) = Odds(A) * Likelihood ratio.</div>
                          </>
                        ) : (
                          <>
                            <div>• Matrix Trace equals sum of all eigenvalues. Determinant equals product of all eigenvalues.</div>
                            <div>• SRTF Starvation: If smaller jobs continuously arrive, long runtime jobs will starve. Remedy: Aging!</div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="p-4 bg-black/40 rounded-xl border border-white/5 space-y-2">
                      <span className="text-[9px] font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded uppercase font-mono">Silly Mistakes Warn Area</span>
                      <p className="text-xs text-white font-semibold">Common Examiner Pitfalls:</p>
                      <div className="text-[11px] text-slate-400 font-mono space-y-1 pl-1">
                        <div>• <strong>Incorrect Boundary:</strong> Check if variables represent signed or unsigned formats first.</div>
                        <div>• <strong>Strict Inequality:</strong> Don&apos;t mistake &quot;is in 3NF&quot; to automatically mean &quot;is in BCNF&quot; - BCNF is stricter!</div>
                        <div>• <strong>Total Probability base:</strong> Verify that your denominators incorporate ALL conditioning possibilities.</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* PRACTICE TAB */}
              {activeTopicPathTab === 'practice' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-2xl">
                    <div>
                      <span className="font-extrabold text-white text-xs block">Topic-Specific MCQ Pool</span>
                      <p className="text-[10px] text-slate-400">Directly aligned with {selectedTopicPath.name} and current target {user.targetExam}.</p>
                    </div>
                    <button 
                      onClick={() => {
                        setPracticeExam(user.targetExam);
                        setSelectedTopicPath(null);
                        handleTabChange('practice');
                        setRecentNotification(`Practice system configured for ${selectedTopicPath.name}.`);
                      }}
                      className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-[10px]"
                    >
                      Launch Main Sandbox
                    </button>
                  </div>

                  {/* Display list of sample questions matching this topic */}
                  <div className="space-y-3 font-mono">
                    {(() => {
                      const matches = QUESTION_BANK.filter(q => 
                        q.topic.toLowerCase().includes(selectedTopicPath.name.toLowerCase()) ||
                        q.subject.toLowerCase().includes(selectedTopicPath.name.toLowerCase()) ||
                        q.question.toLowerCase().includes(selectedTopicPath.name.toLowerCase())
                      ).slice(0, 3);

                      if (matches.length === 0) {
                        return (
                          <div className="p-6 text-center bg-white/5 rounded-2xl border border-white/5">
                            <p className="text-xs text-slate-500">No singular exact matches in practice database. Click the &quot;Launch Main Sandbox&quot; button to drill through related subjects.</p>
                          </div>
                        );
                      }

                      return matches.map((q) => (
                        <div key={q.id} className="p-4 bg-[#0a0b16] rounded-xl border border-white/5 space-y-2.5">
                          <div className="flex justify-between items-center text-[9px]">
                            <span className="text-slate-400">Question ID: {q.id}</span>
                            <span className="bg-white/10 text-white px-2 py-0.5 rounded">{q.difficulty}</span>
                          </div>
                          <p className="text-xs text-slate-200 mt-1 font-semibold">{q.question}</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                            {q.options?.map((opt, oIdx) => (
                              <div key={oIdx} className="p-2 bg-white/5 rounded-lg border border-white/5 text-[11px] text-slate-300">
                                {opt}
                              </div>
                            ))}
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              )}

            </div>

            {/* Footer controls */}
            <div className="p-6 border-t border-white/5 flex justify-between items-center bg-white/[0.01] shrink-0 font-sans">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <span>🎯 Completion Rewards:</span>
                <span className="font-bold text-emerald-400 font-mono">+50 RankPoints</span>
              </div>
              <button
                onClick={() => {
                  setUser(prev => ({ ...prev, points: prev.points + 50 }));
                  setRecentNotification(`🏆 +50 RankPoints added for conquering ${selectedTopicPath.name} study modules!`);
                  setSelectedTopicPath(null);
                }}
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-[#090b14] font-black rounded-xl text-xs transition-opacity hover:opacity-90 flex items-center gap-1 shadow-md"
              >
                <span>Mark Topic Completed</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* TAB 2.5: INTERACTIVE SUBTOPIC LEARNING OVERLAY */}
      {selectedSubtopic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-4xl bg-[#090b14] border border-white/10 rounded-3xl opacity-100 flex flex-col max-h-[90vh] shadow-2xl overflow-hidden transition-all duration-300">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-white/5 bg-white/[0.01] flex items-center justify-between gap-4 shrink-0">
              <div className="text-left">
                <span className="text-[9px] font-black text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-md uppercase tracking-wider border border-indigo-500/20">
                  AI Learning Operating System Core
                </span>
                <h3 className="text-lg font-black text-white mt-1.5">{selectedSubtopic.name}</h3>
              </div>
              <button 
                onClick={() => {
                  setSelectedSubtopic(null);
                  setQuizCurrentIndex(0);
                  setQuizAnswers({});
                  setQuizChecked(false);
                  setQuizFeedbackMsg('');
                }}
                className="p-1 px-3 bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/20 rounded-xl text-slate-300 text-xs font-bold transition-all"
              >
                Close Engine ✕
              </button>
            </div>

            {/* Inner Dashboard Tabs select */}
            <div className="flex bg-black/40 border-b border-white/5 shrink-0 px-4">
              {[
                { id: 'theory', label: '📖 Learn Study Guide', color: 'hover:text-emerald-400' },
                { id: 'notes', label: '📝 Revision Notes', color: 'hover:text-teal-400' },
                { id: 'quiz', label: '🎯 Mini Quiz Drill', color: 'hover:text-indigo-400' },
                { id: 'flashcards', label: '🎴 Active Recall Cards', color: 'hover:text-fuchsia-400' }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveSubtopicTab(t.id as any)}
                  className={`px-4 py-3 text-xs font-bold transition-all border-b-2 ${
                    activeSubtopicTab === t.id 
                      ? 'text-white border-indigo-500 bg-white/[0.02]' 
                      : `text-slate-400 border-transparent ${t.color}`
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Modal Content Body */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6 text-left text-slate-300 scrollbar-thin">
              
              {/* SECTION A: STUDY GUIDE */}
              {activeSubtopicTab === 'theory' && (
                <div className="space-y-6 animate-fadeIn">
                  
                  {/* Real Academic Theory */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-extrabold text-white uppercase tracking-wider text-slate-400 font-mono">1. Theoretical Construct</h4>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-xs leading-relaxed text-slate-300 font-sans">
                      {selectedSubtopic.theory}
                    </div>
                  </div>

                  {/* Visual Example Schema */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-extrabold text-white uppercase tracking-wider text-slate-400 font-mono">2. Analytical Concept Diagram</h4>
                    <div className="p-4 bg-black/40 rounded-2xl border border-white/5 font-mono text-[11px] text-emerald-400 leading-normal overflow-x-auto">
                      <div className="border border-emerald-500/20 bg-emerald-950/10 p-3 rounded-lg inline-block min-w-full">
                        <span className="block text-[9px] text-slate-500 uppercase font-bold mb-2">Visual Simulation View:</span>
                        {selectedSubtopic.id === 'set-intro' ? (
                          <pre className="whitespace-pre">
{`   ┌─────────────────────────────────────────────────────────────┐
   │ Universal Set (U)                                           │
   │                                                             │
   │   Set A                                                     │
   │   ┌───────────────┐                                         │
   │   │  vowels (A)   │  Elements in set:                       │
   │   │  { a, e, i, o, u }                                      │
   │   │               │  Tabular: A = {a, e, i, o, u}           │
   │   └───────────────┘  Builder: A = {x | x is an English vowel}│
   │                                                             │
   └─────────────────────────────────────────────────────────────┘`}
                          </pre>
                        ) : selectedSubtopic.id === 'set-types' ? (
                          <pre className="whitespace-pre">
{`   ┌───────────────────────────┐    ┌───────────────────────────┐
   │ Equal Sets (identical)    │    │ Equivalent Sets (equal |S|│
   │                           │    │                           │
   │   A = {1, 2, 3}           │    │   A = {1, 2, 3}  (N=3)    │
   │   B = {3, 2, 1}           │    │   B = {x, y, z}  (N=3)    │
   │                           │    │                           │
   │   A = B                   │    │   A is equivalent to B    │
   └───────────────────────────┘    └───────────────────────────┘`}
                          </pre>
                        ) : selectedSubtopic.id === 'set-ops' ? (
                          <pre className="whitespace-pre">
{`               ┌───────────────┐   ┌───────────────┐
               │ Set A Only    │   │ Set B Only    │
               │   { 1, 2 }    │   │   { 4, 5 }    │
               │           ┌───┴───┴───┐           │
               │           │Intersection           │
               │           │   { 3 }   │           │
               │           └───┬───┬───┘           │
               │               │   │               │
               └───────────────┘   └───────────────┘
            Union (A u B)         = { 1, 2, 3, 4, 5 }
            Intersection (A n B)  = { 3 }
            Difference (A - B)    = { 1, 2 }
            Sym. Diff. (A △ B)    = { 1, 2, 4, 5 }`}
                          </pre>
                        ) : selectedSubtopic.id === 'set-venn' ? (
                          <pre className="whitespace-pre">
{`   ┌────────────────────────────────────────────────────────┐
   │ Universal Set U                                        │
   │        ┌───────────────┐      ┌───────────────┐        │
   │        │     Set A     │      │     Set B     │        │
   │        │   (Maths)     │      │     (CS)      │        │
   │        │         ┌─────┼──────┼─────┐         │        │
   │        │  40     │ 10  │ Both │  25 │  Physics│        │
   │        │  Passed │Only │      │Only │  Only   │        │
   │        │         └─────┼──────┼─────┘         │        │
   │        └───────────────┘      └───────────────┘        │
   │                                                        │
   │    Outside: 5 Passed Neither (A u B)'                  │
   └────────────────────────────────────────────────────────┘`}
                          </pre>
                        ) : selectedSubtopic.id === 'set-demorgan' ? (
                          <pre className="whitespace-pre">
{`   ┌──────────────────────────────────────────────┐
   │ De Morgan Dual Equivalence                   │
   │                                              │
   │   (A ∪ B)'   <===========>   A' ∩ B'         │
   │   [Comp. of Union]          [Inter. of Comps]│
   │                                              │
   │   (A ∩ B)'   <===========>   A' ∪ B'         │
   │   [Comp. of Inter]          [Union of Comps] │
   └──────────────────────────────────────────────┘`}
                          </pre>
                        ) : selectedSubtopic.id === 'set-powers' ? (
                          <pre className="whitespace-pre">
{`   ┌──────────────────────────────────────────────────────┐
   │ Power Set Subset Combination Expansion               │
   │ S = { 1, 2, 3 }  (N = 3)                             │
   │                                                      │
   │ P(S) = {                                             │
   │   ∅,                  <-- Empty Set (N=0 subset)     │
   │   {1}, {2}, {3},      <-- Singletons (N=1 subsets)   │
   │   {1,2}, {2,3}, {1,3},<-- Pairs (N=2 subsets)        │
   │   {1, 2, 3}           <-- Set itself                 │
   │ }                     ===> Total Cardinality = 2³ = 8│
   └──────────────────────────────────────────────────────┘`}
                          </pre>
                        ) : selectedSubtopic.id === 'prob-conditional' ? (
                          <pre className="whitespace-pre">
{`                   ┌─────────────────────────────┐
                   │ Sample Space Shrunk to B    │
                   │                             │
                   │               ┌─────────┐   │
                   │               │ B       │   │
                   │               │   ┌─────┼─┐ │
                   │               │   │A n B│ │ │
                   │               │   └─────┼─┘ │
                   │               └─────────┘   │
                   └─────────────────────────────┘
         P(A|B) = Area of Intersection (A n B) / Area of B`}
                          </pre>
                        ) : selectedSubtopic.id === 'prob-bayes' ? (
                          <pre className="whitespace-pre">
{`                         /── Machine X [0.60] ──> Defect P[0.02]
                        /
         Prior choices ─── 
                        \\
                         \\── Machine Y [0.40] ──> Defect P[0.04]
            Total Defect = (0.6*0.02) + (0.4*0.04) = 0.028
            Posterior P(Y|Defect) = (0.4 * 0.04) / 0.028 = 4/7`}
                          </pre>
                        ) : selectedSubtopic.id === 'dbms-normal' ? (
                          <pre className="whitespace-pre">
{`       [1NF: Atomic Cells] ──> [2NF: No Partial Dependencies]  
                                          │
                                          ▼
       [BCNF: Determinant SuperKey] <── [3NF: No Transitive Dependencies]`}
                          </pre>
                        ) : (
                          <pre className="whitespace-pre">
{`   ┌─────────────────────────────────────────────────────────────┐
   │ Academic Study Domain Models: ${selectedSubtopic.name}      │
   │                                                             │
   │   - Active recall of logical properties                     │
   │   - Error mitigation loops and logging                      │
   │   - Visual boundary validation                              │
   │                                                             │
   └─────────────────────────────────────────────────────────────┘`}
                          </pre>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Key Formulae */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-extrabold text-white uppercase tracking-wider text-slate-400 font-mono">3. Mathematical Postulates & Formulas</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedSubtopic.formulae.map((f, fIdx) => (
                        <div key={fIdx} className="p-3 bg-white/5 rounded-xl border border-white/5 font-mono text-[11px] text-white flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Common Mistakes */}
                  <div className="p-4 bg-red-950/10 border border-red-500/20 rounded-2xl space-y-1.5">
                    <h5 className="text-xs font-black text-red-400 uppercase tracking-wider font-mono">⚠️ Syllabus Examiner Traps & Common Mistakes</h5>
                    <p className="text-xs text-slate-300 font-sans leading-relaxed">
                      {selectedSubtopic.commonMistakes}
                    </p>
                  </div>

                  {/* Deep Learning Resources */}
                  <div className="space-y-3 pt-4 border-t border-white/5">
                    <h4 className="text-sm font-extrabold text-white uppercase tracking-wider text-slate-400 font-mono">4. Global Premium Study Resources</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { name: 'MIT OpenCourseWare', url: 'https://ocw.mit.edu/', desc: 'Syllabus depth' },
                        { name: 'NPTEL lectures', url: 'https://nptel.ac.in/', desc: 'IIT-level proof' },
                        { name: 'Khan Academy', url: 'https://www.khanacademy.org/', desc: 'Conceptual base' },
                        { name: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/', desc: 'Competitive practice' }
                      ].map((resource, rIdx) => (
                        <a 
                          key={rIdx} 
                          href={`${resource.url}?utm_source=rankforge_ai`}
                          target="_blank" 
                          rel="noreferrer"
                          className="p-3 bg-white/5 border border-white/5 hover:border-indigo-500 hover:bg-white/10 rounded-xl transition-all text-left text-xs block"
                        >
                          <span className="block font-bold text-white text-[11px] font-sans leading-tight">{resource.name}</span>
                          <span className="text-[10px] text-indigo-400 mt-1 block">Visit Library ➔</span>
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Manual Mark study read checkbox */}
                  <div className="p-4 bg-emerald-950/25 border border-emerald-500/25 rounded-2xl flex items-center justify-between gap-4 font-sans shrink-0">
                    <div>
                      <span className="font-extrabold text-[#fff] text-xs block">Confirm Study Completion</span>
                      <p className="text-[10px] text-slate-400">Award +15 RankPoints and log "Study Material Read" progress.</p>
                    </div>
                    <button
                      onClick={() => toggleSubtopicActivity(selectedSubtopic.id, 'learn')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        (subtopicProgress[selectedSubtopic.id] || {}).learn 
                          ? 'bg-emerald-500 text-black font-extrabold shadow-inner' 
                          : 'bg-white/5 hover:bg-white/10 border border-white/15 text-slate-300'
                      }`}
                    >
                      {(subtopicProgress[selectedSubtopic.id] || {}).learn ? '✓ Read Registered' : 'Mark as Read'}
                    </button>
                  </div>

                </div>
              )}

              {/* SECTION B: REVISION NOTES */}
              {activeSubtopicTab === 'notes' && (
                <div className="space-y-6 animate-fadeIn">
                  
                  {/* Revision cards */}
                  <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-white text-sm">3-Minute High-Recall Cheat Card</h4>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">Quick reference mapping core parameters.</p>
                      </div>
                      <button 
                        onClick={() => {
                          const noteString = `--- RANKFORGE REVISION CHEAT CARD: ${selectedSubtopic.name} ---\n\n` + 
                            selectedSubtopic.summaryNotes.map(n => `• ${n}`).join('\n') + `\n\n` +
                            `Common Pitfalls: ${selectedSubtopic.commonMistakes}\n\nGenerated via RankForge Learning Operating System.`;
                          navigator.clipboard.writeText(noteString);
                          setRecentNotification('📋 Notes exported and copied to clipboard as Markdown!');
                        }}
                        className="py-1 px-3 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/20 rounded-lg text-[10px] text-teal-400 font-bold transition-all"
                      >
                        Export Markdown
                      </button>
                    </div>

                    <div className="space-y-3 pt-2 font-mono text-[11px] text-slate-300">
                      {selectedSubtopic.summaryNotes.map((n, idx) => (
                        <div key={idx} className="p-3 bg-black/40 rounded-xl border border-white/5 flex gap-2">
                          <span className="text-teal-400 select-none">✓</span>
                          <span>{n}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Past Exam Question focus segment */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-extrabold text-white uppercase tracking-wider text-slate-400 font-mono">National PYQ Mapped Segment</h4>
                    
                    {selectedSubtopic.pyqs.map((pq, idx) => (
                      <div key={idx} className="p-5 bg-indigo-950/10 border border-indigo-500/20 rounded-2xl space-y-3">
                        <div className="flex justify-between items-center text-[10px] border-b border-white/5 pb-2">
                          <span className="font-mono bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2.5 py-0.5 rounded font-black">
                            {pq.exam} {pq.year} Mapped
                          </span>
                          <span className="text-slate-500">Official Exam Question</span>
                        </div>
                        <p className="text-xs text-white font-semibold font-mono">{pq.question}</p>
                        <div className="p-3 bg-black/35 rounded-xl border border-white/5 text-[11px] text-slate-300 font-mono">
                          <span className="block text-[9px] text-[#22c55e] font-bold uppercase mb-1">Step-by-Step Proof Solution:</span>
                          <p>{pq.solution}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Action Bar */}
                  <div className="p-4 bg-teal-950/25 border border-teal-500/25 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 font-sans">
                    <div className="text-left font-sans">
                      <span className="font-extrabold text-white text-xs block">Confirm Revision Completion</span>
                      <p className="text-[10px] text-slate-400">Award +15 RankPoints and record "Revision Done" in tree.</p>
                    </div>
                    <button
                      onClick={() => toggleSubtopicActivity(selectedSubtopic.id, 'revision')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                        (subtopicProgress[selectedSubtopic.id] || {}).revision 
                          ? 'bg-teal-500 text-black font-extrabold shadow-inner' 
                          : 'bg-white/5 hover:bg-white/10 border border-white/15 text-slate-300'
                      }`}
                    >
                      {(subtopicProgress[selectedSubtopic.id] || {}).revision ? '✓ Revision Registered' : 'Mark Revision Done'}
                    </button>
                  </div>

                </div>
              )}

              {/* SECTION C: MINI QUIZ DRILL */}
              {activeSubtopicTab === 'quiz' && (
                <div className="space-y-6 animate-fadeIn font-mono">
                  
                  {/* Stats info */}
                  <div className="flex items-center justify-between p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-[10px]">
                    <span>🎯 Active Drill: <strong>5 Conceptual MCQs</strong></span>
                    <span className="text-emerald-400">70% Required to Unlock Next Subtopic</span>
                  </div>

                  {/* Quiz Engine view */}
                  {!quizChecked ? (
                    <div className="space-y-4">
                      {/* Progress bar */}
                      <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                        <span>Question {quizCurrentIndex + 1} of {selectedSubtopic.quizQuestions.length}</span>
                        <span className="text-[10px] text-indigo-400 font-mono uppercase bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded">
                          {selectedSubtopic.quizQuestions[quizCurrentIndex].difficulty}
                        </span>
                      </div>
                      
                      <div className="bg-white/5 p-4 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-indigo-500 h-full rounded-2xl transition-all duration-300" 
                          style={{ width: `${((quizCurrentIndex + 1) / selectedSubtopic.quizQuestions.length) * 100}%` }}
                        />
                      </div>

                      {/* Active Question Box */}
                      <div className="p-5 bg-white/5 border border-white/10 rounded-2xl space-y-4">
                        <p className="text-xs text-white leading-relaxed font-semibold font-sans">{selectedSubtopic.quizQuestions[quizCurrentIndex].question}</p>
                        
                        <div className="grid grid-cols-1 gap-2.5">
                          {selectedSubtopic.quizQuestions[quizCurrentIndex].options.map((opt, optIdx) => {
                            const subId = selectedSubtopic.quizQuestions[quizCurrentIndex].id;
                            const isSelected = quizAnswers[subId] === opt;
                            
                            return (
                              <button
                                key={optIdx}
                                onClick={() => {
                                  setQuizAnswers(prev => ({
                                    ...prev,
                                    [subId]: opt
                                  }));
                                }}
                                className={`w-full text-left p-3.5 rounded-xl border text-xs font-sans transition-all flex items-start gap-3 ${
                                  isSelected 
                                    ? 'bg-indigo-600/25 border-indigo-500 text-white shadow-inner font-semibold' 
                                    : 'bg-white/5 border-white/5 hover:border-white/20 text-slate-300'
                                }`}
                              >
                                <span className={`w-4 h-4 rounded-full border text-[9px] flex items-center justify-center shrink-0 ${
                                  isSelected ? 'border-indigo-400 text-indigo-400 bg-indigo-500/10' : 'border-slate-500'
                                }`}>
                                  {String.fromCharCode(65 + optIdx)}
                                </span>
                                <span>{opt}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Nav bar for questions */}
                      <div className="flex justify-between items-center gap-3 pt-3">
                        <button
                          disabled={quizCurrentIndex === 0}
                          onClick={() => setQuizCurrentIndex(prev => prev - 1)}
                          className="py-2 px-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-xs disabled:opacity-50"
                        >
                          Previous
                        </button>
                        
                        {quizCurrentIndex === selectedSubtopic.quizQuestions.length - 1 ? (
                          <button
                            onClick={() => {
                              // Perform evaluation
                              let correct = 0;
                              selectedSubtopic.quizQuestions.forEach(q => {
                                if (quizAnswers[q.id] === q.answer) {
                                  correct++;
                                }
                              });
                              setQuizResultScore(correct);
                              setQuizChecked(true);
                              
                              const passRatio = (correct / selectedSubtopic.quizQuestions.length) * 100;
                              const passed = passRatio >= 70;
                              
                              if (passed) {
                                // Save to progress
                                setSubtopicProgress(prev => ({
                                  ...prev,
                                  [selectedSubtopic.id]: {
                                    ...(prev[selectedSubtopic.id] || { learn: false, quiz: false, revision: false, pyq: false }),
                                    quiz: true
                                  }
                                }));
                                setUser(u => ({ ...u, points: u.points + 50 }));
                                setQuizFeedbackMsg(`🏆 Congratulations! You scored ${correct}/5 (${passRatio}%). You met the pass criteria (70%), unlocking the next subtopic tree node and earning +50 RankPoints!`);
                              } else {
                                setQuizFeedbackMsg(`💡 Drill complete. You scored ${correct}/5 (${passRatio}%). Unfortunately, you need at least 70% to pass and unlock the next subtopic. Let's study the Theory section or Ask Aris first, then try again!`);
                              }
                            }}
                            className="py-2.5 px-5 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-extrabold rounded-xl text-xs shadow-md"
                          >
                            Submit Assessment
                          </button>
                        ) : (
                          <button
                            disabled={!quizAnswers[selectedSubtopic.quizQuestions[quizCurrentIndex].id]}
                            onClick={() => setQuizCurrentIndex(prev => prev + 1)}
                            className="py-2 px-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold disabled:opacity-50"
                          >
                            Next Question
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    // Quiz Results Review Panel
                    <div className="space-y-6">
                      <div className={`p-5 rounded-2xl text-xs border ${
                        quizResultScore >= 4 
                          ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300' 
                          : 'bg-rose-950/20 border-rose-500/30 text-rose-300'
                      }`}>
                        <h4 className="text-sm font-black uppercase tracking-wider font-mono mb-2">
                          {quizResultScore >= 4 ? '🎉 Assessment Passed!' : '💡 Revision Required'}
                        </h4>
                        <p className="leading-relaxed font-sans">{quizFeedbackMsg}</p>
                      </div>

                      {/* Detailed Question Review */}
                      <div className="space-y-4">
                        <h5 className="text-xs font-extrabold text-white uppercase tracking-wider text-slate-400 font-mono">Detailed Answers review</h5>
                        
                        {selectedSubtopic.quizQuestions.map((q, idx) => {
                          const isCorrect = quizAnswers[q.id] === q.answer;
                          
                          return (
                            <div key={q.id} className={`p-4 rounded-xl border text-[11px] font-mono space-y-2.5 ${
                              isCorrect ? 'bg-emerald-950/10 border-emerald-500/20' : 'bg-red-950/10 border-red-500/20'
                            }`}>
                              <p className="font-semibold text-white text-xs font-sans">
                                {idx + 1}. {q.question}
                              </p>
                              <div className="grid grid-cols-2 gap-2 text-[10px]">
                                <div className="p-2 bg-black/30 rounded border border-white/5">
                                  <span className="text-slate-400 block mb-1">Your Selection:</span>
                                  <span className={isCorrect ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                                    {quizAnswers[q.id] || 'Not attempted'}
                                  </span>
                                </div>
                                <div className="p-2 bg-black/30 rounded border border-white/5">
                                  <span className="text-slate-400 block mb-1">Correct Answer:</span>
                                  <span className="text-emerald-400 font-bold">{q.answer}</span>
                                </div>
                              </div>
                              <div className="p-3 bg-black/40 rounded-lg text-[10px] text-slate-400 flex flex-col gap-0.5 font-sans leading-normal">
                                <strong className="text-slate-200">Aris Concept Guidance:</strong>
                                <p>{q.explanation}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-3 justify-end pt-2">
                        <button
                          onClick={() => {
                            setQuizCurrentIndex(0);
                            setQuizAnswers({});
                            setQuizChecked(false);
                            setQuizFeedbackMsg('');
                          }}
                          className="py-2.5 px-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold"
                        >
                          Retry Quiz Drill
                        </button>
                        <button
                          onClick={() => {
                            setSelectedSubtopic(null);
                          }}
                          className="py-2.5 px-5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs shadow-md"
                        >
                          Conclude Unit
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* SECTION D: ACTIVE RECALL FLASHCARDS */}
              {activeSubtopicTab === 'flashcards' && (
                <div className="space-y-6 animate-fadeIn font-mono">
                  
                  {/* Description stats */}
                  <div className="p-3 bg-white/5 rounded-xl text-[10px] flex justify-between items-center flex-wrap gap-2">
                    <span>💡 Tap any card to FLIP it and test your memory boundaries.</span>
                    <div className="flex gap-2 text-white font-bold font-mono">
                      <span className="text-emerald-400">✅ {flashcards.filter(f => f.subtopicId === selectedSubtopic.id && f.status === 'KNOW').length} Know</span>
                      <span className="text-red-400">❌ {flashcards.filter(f => f.subtopicId === selectedSubtopic.id && f.status === 'DONT_KNOW').length} Don't</span>
                      <span className="text-amber-400">🟡 {flashcards.filter(f => f.subtopicId === selectedSubtopic.id && f.status === 'REVIEW').length} Review</span>
                    </div>
                  </div>

                  {/* Flashcard container */}
                  {(() => {
                    const subcards = flashcards.filter(f => f.subtopicId === selectedSubtopic.id);
                    if (subcards.length === 0) {
                      return (
                        <div className="p-10 text-center bg-white/5 rounded-3xl border border-white/5 space-y-4">
                          <p className="text-xs text-slate-500">No active flashcards pre-loaded for this subtopic.</p>
                          <button 
                            onClick={() => {
                              const newFc = {
                                id: `fc-dyn-${Date.now()}`,
                                subtopicId: selectedSubtopic.id,
                                front: `State standard primary theorem for "${selectedSubtopic.name}".`,
                                back: `Verify candidate parameters, formulas: ${selectedSubtopic.formulae[0] || 'No pre-loaded formulas'}.`,
                                status: 'REVIEW' as const
                              };
                              setFlashcards(prev => [...prev, newFc]);
                              setRecentNotification('🎴 Dynamic Flashcard generated based on study theory!');
                            }}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"
                          >
                            Auto-Generate AI Flashcards
                          </button>
                        </div>
                      );
                    }

                    const activeIndex = subcards.findIndex(f => fcActiveId === null ? true : f.id === fcActiveId);
                    const currentFc = activeIndex !== -1 ? subcards[activeIndex] : subcards[0];
                    
                    return (
                      <div className="space-y-6">
                        {/* Selector card indicators */}
                        <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                          <span>Recall Card {activeIndex === -1 ? 1 : activeIndex + 1} of {subcards.length}</span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded ${
                            currentFc.status === 'KNOW' ? 'bg-emerald-500/10 text-emerald-400' :
                            currentFc.status === 'DONT_KNOW' ? 'bg-red-500/10 text-red-100' : 'bg-amber-500/10 text-amber-400'
                          }`}>
                            Box: {currentFc.status}
                          </span>
                        </div>

                        {/* Large flippable design */}
                        <div 
                          onClick={() => setFcIsFlipped(prev => !prev)}
                          className="h-48 w-full bg-white/5 hover:bg-white/[0.07] border border-white/10 rounded-3xl p-6 flex flex-col justify-between items-center text-center cursor-pointer select-none transition-all relative overflow-hidden group shadow-lg"
                        >
                          <div className="absolute right-3 top-3 text-[9px] text-indigo-400 bg-white/5 border border-white/5 px-2 py-0.5 rounded font-bold uppercase tracking-wider font-sans opacity-60 group-hover:opacity-100 transition-opacity">
                            {fcIsFlipped ? '✦ Answer Back side' : '✦ Query Front side'}
                          </div>

                          <div className="my-auto max-w-lg space-y-2">
                            {fcIsFlipped ? (
                              <>
                                <span className="block text-[8px] text-emerald-400 uppercase tracking-widest font-bold">Answer:</span>
                                <p className="text-sm font-sans text-white leading-relaxed font-bold">{currentFc.back}</p>
                              </>
                            ) : (
                              <>
                                <span className="block text-[8px] text-indigo-300 uppercase tracking-widest font-bold">Question:</span>
                                <p className="text-sm font-sans text-white leading-relaxed font-semibold">{currentFc.front}</p>
                              </>
                            )}
                          </div>

                          <span className="text-[10px] text-slate-500 font-sans italic">Click anywhere inside card to FLIP</span>
                        </div>

                        {/* Recall confirmation controls */}
                        <div className="flex flex-wrap justify-center items-center gap-2 pt-2">
                          <button
                            onClick={() => {
                              setFlashcards(prev => prev.map(f => f.id === currentFc.id ? { ...f, status: 'KNOW' } : f));
                              setRecentNotification('✅ Logged card as KNOW. Active Recall strengthened!');
                              setFcIsFlipped(false);
                            }}
                            className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs font-bold transition-all"
                          >
                            Know ✅
                          </button>
                          <button
                            onClick={() => {
                              setFlashcards(prev => prev.map(f => f.id === currentFc.id ? { ...f, status: 'DONT_KNOW' } : f));
                              setRecentNotification('❌ Logged card as DONT KNOW. Scheduled for high-frequency repetition!');
                              setFcIsFlipped(false);
                            }}
                            className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 rounded-xl text-xs font-bold transition-all"
                          >
                            Don't Know ❌
                          </button>
                          <button
                            onClick={() => {
                              setFlashcards(prev => prev.map(f => f.id === currentFc.id ? { ...f, status: 'REVIEW' } : f));
                              setRecentNotification('🟡 Logged card as REVIEW. Injected into weekly buffer.');
                              setFcIsFlipped(false);
                            }}
                            className="px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 rounded-xl text-xs font-bold transition-all"
                          >
                            Review Later 🟡
                          </button>
                        </div>

                        {/* Next / Previous card trigger */}
                        <div className="flex justify-between items-center border-t border-white/5 pt-4">
                          <button
                            disabled={activeIndex <= 0}
                            onClick={() => {
                              setFcActiveId(subcards[activeIndex - 1].id);
                              setFcIsFlipped(false);
                            }}
                            className="px-4 py-2 bg-white/5 hover:bg-white/15 rounded-xl border border-white/5 text-xs font-bold disabled:opacity-40"
                          >
                            ← Previous Flashcard
                          </button>

                          <button
                            disabled={activeIndex === -1 || activeIndex === subcards.length - 1}
                            onClick={() => {
                              setFcActiveId(subcards[activeIndex + 1].id);
                              setFcIsFlipped(false);
                            }}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold disabled:opacity-40"
                          >
                            Next Flashcard →
                          </button>
                        </div>

                      </div>
                    );
                  })()}

                </div>
              )}

            </div>

            {/* Bottom complete status banner */}
            <div className="p-4 bg-white/[0.01] border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0 font-sans">
              <div className="text-left">
                <span className="block text-[9px] text-slate-400 uppercase font-bold">Subtopic Mastery Meter</span>
                <span className="text-xs font-bold text-emerald-400">Unit Complete score: {getSubtopicProgress(selectedSubtopic.id)}%</span>
              </div>
              <button
                onClick={() => {
                  setSelectedSubtopic(null);
                  setRecentNotification(`Unit ${selectedSubtopic.name} saved for review.`);
                }}
                className="py-2 px-5 bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-extrabold rounded-xl text-xs shadow-md transition-opacity hover:opacity-90 shrink-0"
              >
                Conclude Study Session
              </button>
            </div>

          </div>
        </div>
      )}

    </GlobalLayout>
  );
}
