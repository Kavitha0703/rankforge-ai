import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Clock, 
  Target, 
  LineChart, 
  BookOpen, 
  Award, 
  TrendingUp, 
  RefreshCw, 
  Sliders, 
  AlertTriangle, 
  CheckCircle, 
  Calendar, 
  ArrowRight, 
  GraduationCap, 
  FileText, 
  Search, 
  Database,
  Briefcase,
  Share2,
  Lock,
  ChevronRight,
  Info,
  Smile,
  AlertCircle,
  HelpCircle,
  Check,
  ExternalLink,
  Flame,
  BrainCircuit,
  MessageSquareCode,
  Bell,
  PenTool
} from 'lucide-react';
import { PremiumTutorChat } from './PremiumTutorChat';
import SpecializedTools from './SpecializedTools';
import DailyExecutionEngine from './DailyExecutionEngine';
import { UserProgress } from '../types';

interface AICoachNavigatorProps {
  user: {
    name: string;
    targetRank: number;
    targetScore: number;
    targetExam: string;
    accuracy: number;
  };
  solvedCount: number;
  correctCount: number;
  progress: UserProgress;
  onUpdateProgress: (updates: Partial<UserProgress>) => void;
  onNavigateToTab: (tab: 'dashboard' | 'syllabus' | 'practice' | 'mocks' | 'tutor' | 'planner' | 'videos' | 'leaderboard' | 'pyq' | 'analytics' | 'books') => void;
  displayNotice: (msg: string) => void;
  onUpdateAdminConfig?: (config: any) => void;
  initialSubTab?: 'ask_mentor' | 'premium_tutor' | 'study_navigator' | 'retention_tracker' | 'topper_benchmarks' | 'placement_resume' | 'exam_updates' | 'admin_cms' | 'tools';
}

// Spaced Repetition Initial Data
const INITIAL_RETENTION_TRACKER = [
  { id: 'ret-1', topic: 'Probability & Bayes Theorem', subject: 'Mathematics', lastLearnedDaysAgo: 1, initialScore: 92, decayFactor: 0.05 },
  { id: 'ret-2', topic: 'DBMS Functional Dependencies & Normalization', subject: 'Computer Science', lastLearnedDaysAgo: 7, initialScore: 88, decayFactor: 0.04 },
  { id: 'ret-3', topic: 'Operating System Semaphores & Deadlock', subject: 'Computer Science', lastLearnedDaysAgo: 14, initialScore: 84, decayFactor: 0.03 },
  { id: 'ret-4', topic: 'Discrete Math: Graph Theory & Trees', subject: 'Mathematics', lastLearnedDaysAgo: 22, initialScore: 90, decayFactor: 0.04 },
  { id: 'ret-5', topic: 'Data Structures: Tree & Binary Search Tree BST', subject: 'Computer Science', lastLearnedDaysAgo: 30, initialScore: 89, decayFactor: 0.05 },
  { id: 'ret-6', topic: 'Quantitative Aptitude: Time and Work / Velocity', subject: 'Quantitative Aptitude', lastLearnedDaysAgo: 3, initialScore: 95, decayFactor: 0.06 },
];

// Official exam milestones database
const EXAM_PATTERN_NOTIFICATIONS = [
  { id: 'exam-n1', exam: 'NIMCET 2026', authority: 'NIT Agartala / NIT Jamshedpur', date: 'June 07, 2026', update: 'Changes to weightages loaded. Mathematics remains 600 Marks. CS ratio upgraded to 200 Marks.', link: 'https://www.nimcet.in' },
  { id: 'exam-n2', exam: 'CUET PG MCA 2026', authority: 'National Testing Agency (NTA)', date: 'Registration Ongoing', update: 'Strict PG-level general CS aptitude elements introduced. Exam duration revised to 105 mins.', link: 'https://cuet.nta.nic.in' },
  { id: 'exam-n3', exam: 'GATE CS 2026', authority: 'IIT Guwahati', date: 'February 2026', update: 'Added new multiple-select (MSQ) concepts across OS and Relational Algebra branches. General Aptitude carries 15 marks.', link: 'https://gate.iitg.ac.in' },
  { id: 'exam-n4', exam: 'TANCET MCA 2026', authority: 'Anna University', date: 'March 2026', update: 'State quota reservation matrices updated. Non-TANCET students eligible for specific self-financing clusters.', link: 'https://tancet.annauniv.edu' },
  { id: 'exam-n5', exam: 'VITMEE (VIT MCA) 2026', authority: 'Vellore Institute of Technology', date: 'April / June 2026', update: 'Vellore and Chennai campuses introduce unified computer concept testing matrices.', link: 'https://vit.ac.in' },
  { id: 'exam-n6', exam: 'SRMJEEE PG (SRM MCA) 2026', authority: 'SRM Institute of Science & Tech', date: 'Continuous cycles', update: 'No negative marking scheme retained. Syllabus maps perfectly to standard computer applications core.', link: 'https://srmist.edu.in' }
];

export function AICoachNavigator({ 
  user, 
  solvedCount, 
  correctCount, 
  progress,
  onUpdateProgress,
  onNavigateToTab, 
  displayNotice,
  onUpdateAdminConfig,
  initialSubTab = 'ask_mentor'
}: AICoachNavigatorProps) {
  
  const [activeSubTab, setActiveSubTab] = useState<'ask_mentor' | 'premium_tutor' | 'study_navigator' | 'retention_tracker' | 'topper_benchmarks' | 'placement_resume' | 'exam_updates' | 'admin_cms' | 'tools'>(initialSubTab);

  useEffect(() => {
    setActiveSubTab(initialSubTab);
  }, [initialSubTab]);

  const accuracy = solvedCount > 0 ? Math.round((correctCount / solvedCount) * 100) : (user.accuracy || 74);
  
  // Custom Rank Mentor state variables & Personality tracking
  const [mentorPersonality, setMentorPersonality] = useState<'supportive' | 'strict' | 'friendly' | 'topper'>('supportive');
  const [selectedMentorQuestion, setSelectedMentorQuestion] = useState<string>('q1');
  const [customMentorQuery, setCustomMentorQuery] = useState<string>('');
  const [customReplyResponse, setCustomReplyResponse] = useState<string | null>(null);
  const [mentorSandboxProfile, setMentorSandboxProfile] = useState<'A' | 'B'>('A'); // A = AIR 300, B = AIR 50
  
  // Burnout detector simulator states
  const [burnoutStreak, setBurnoutStreak] = useState<number>(11);
  const [accuracyDropFactor, setAccuracyDropFactor] = useState<number>(4); // drop simulation
  
  // Topic ROI database
  const [topicROIList, setTopicROIList] = useState([
    { id: 'roi-1', topic: 'Probability & Bayes Theorem', prepTime: '4 Hours', expectedMarks: '+16 Marks', rankMultiplier: 'High (4.2x)', roiCategory: 'High ROI' },
    { id: 'roi-2', topic: 'Sets, relations & Functions', prepTime: '3 Hours', expectedMarks: '+8 Marks', rankMultiplier: 'High (3.8x)', roiCategory: 'High ROI' },
    { id: 'roi-3', topic: 'DBMS Functional Dependencies & Normalization', prepTime: '6 Hours', expectedMarks: '+12 Marks', rankMultiplier: 'Medium (2.8x)', roiCategory: 'High ROI' },
    { id: 'roi-4', topic: 'Compiler Design: LL(1) Parsing Table', prepTime: '12 Hours', expectedMarks: '+4 Marks', rankMultiplier: 'Low (0.8x)', roiCategory: 'Low ROI' },
    { id: 'roi-5', topic: 'Operating System Semaphores & Deadlock', prepTime: '5 Hours', expectedMarks: '+8 Marks', rankMultiplier: 'Medium (2.4x)', roiCategory: 'Medium ROI' },
    { id: 'roi-6', topic: 'Aptitude: Time, Speed and Distance', prepTime: '2 Hours', expectedMarks: '+12 Marks', rankMultiplier: 'High (4.0x)', roiCategory: 'High ROI' },
  ]);

  // Exam News Category Filters states
  const [examNewsSearch, setExamNewsSearch] = useState<string>('');
  const [examNewsCategory, setExamNewsCategory] = useState<string>('ALL'); // ALL, LIVE, RECENT, EXAM, COLLEGE, SCHOLARSHIP, SCHEDULE
  const [examNewsTargetFilter, setExamNewsTargetFilter] = useState<string>('ALL'); // ALL, NIMCET, CUET PG, GATE, TANCET

  // Study Partner Quiz Interactive Simulator
  const [partnerQuizActive, setPartnerQuizActive] = useState<boolean>(false);
  const [partnerQuizScore, setPartnerQuizScore] = useState<number>(0);
  const [partnerQuizSubmitted, setPartnerQuizSubmitted] = useState<boolean>(false);
  const [partnerQuizAns, setPartnerQuizAns] = useState<string>('');


  // Study Partner Quiz states & calculations
  const getMentorAdvice = (qId: string) => {
    const p = mentorPersonality;
    const name = user.name || 'Kalen';
    const exam = user.targetExam || 'NIMCET';
    const accuracy = user.accuracy || 74;

    if (qId === 'q1') { // What should I study next?
      if (p === 'supportive') return {
        title: "Start with Sets, Relations & Functions first",
        text: `Hey ${name}, I highly recommend picking up Sets and Relations first. Probability and Permutation depends heavily on them. Don't stress too much about the final score right now; building this block is your absolute best path. You've already solved ${solvedCount} questions successfully, you can do this!`,
        bullets: [
          "Master Sets foundations (Union, Intersection, Venn Diagrams)",
          "Understand Relations & Functions (Symmetrics, Cartesian pairs)",
          "Then move to Bayes' Theorem & Conditional Probability with low-stress, simple questions first."
        ],
        roi: "High ROI (3.8x)", priority: "Critical First Step", sentimentBg: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
      };
      if (p === 'strict') return {
        title: "Lock down Mathematics Fundamentals immediately!",
        text: `Listen ${name}. There are only 45 days left. Every week of ad-hoc study is costing you critical ranks. To make it to AIR 100 you must prioritize high rank multipliers. Start Sets today, and do not sleep until you solve 40 PYQs. Zero excuses for inconsistent preparation.`,
        bullets: [
          "Practice 45 sets of Venn diagram problems under strict timer constraints",
          "Solve at least 25 PYQs of Relations & Functions from recent examinations",
          "Complete one subject mock test to verify accuracy stays strictly above 75%"
        ],
        roi: "High ROI (3.8x)", priority: "Strict Priority", sentimentBg: "bg-rose-500/10 border-rose-500/20 text-rose-400"
      };
      if (p === 'friendly') return {
        title: "Next stop: Sets & Relations express! 🚂 😄",
        text: `Hey ${name}! Since Probability gets super lonely without its companion Sets, let's master Venn diagrams first! It's super fun, neat, and highly rewarding on actual exams. Plus, your CS concepts are already looking awesome 😄. Let's finish 5 easy problems right now!`,
        bullets: [
          "Doodle 5 Venn diagrams quiz items",
          "Pair relation values and verify transitive concepts",
          "Grab a hot chocolate and complete 10 questions on combinations!"
        ],
        roi: "High (3.8x)", priority: "Fun Track", sentimentBg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
      };
      // topper
      return {
        title: "Sequential Syllabi Path: Sets -> Probability Boost",
        text: `Analyzing current metrics: Mathematics carries a dominant 600-mark weight. We must mathematically optimize your hours. Starting with Sets & Functions secures 24% of the math syllabus and raises Probability efficiency by 1.8x. Proceed strictly in this order to minimize preparation friction.`,
        bullets: [
          "Devote 3 hours to core Cartesian mappings and functions",
          "Filter and solve 35 PYQs of NIMCET sets from 2018-2025",
          "Target conditional probability with an execution cutoff of 80% accuracy"
        ],
        roi: "High (3.5x Topper Spec)", priority: "Strategic Core", sentimentBg: "bg-amber-500/10 border-amber-500/20 text-amber-400"
      };
    }

    if (qId === 'q2') { // Can I skip Statistics / DBMS Normalization?
      if (p === 'supportive') return {
        title: "You can skip Statistics, but let's make it easy instead!",
        text: `It is tempting to skip it, ${name}. But statistics contributes approximately 5%-8% of recent ${exam} papers. Skipping it means you'd need to find those 12-16 marks in much harder calculus topics. Let's not skip it. We will together study only the easiest parts first!`,
        bullets: [
          "Learn basic Mean, Median, and Mode definitions (takes only 1 hour)",
          "Study Variance & Standard Deviation visually",
          "Skip the crazy complex proofs and just solve 10 formula-direct questions"
        ],
        roi: "Medium (2.4x)", priority: "Recommended Study", sentimentBg: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
      };
      if (p === 'strict') return {
        title: "Absolutely NO topic skipping allowed for Elite Targets",
        text: `Skipping core topics like Statistics is a shortcut to rejection. An elite AIR seat leaves absolutely no margin for comfort. Statistics translates to 24-32 potential marks. While you slack off, other aspirants are solving 15 statistics formulas. Get to work!`,
        bullets: [
          "Memorize standard deviation proofs & formula tables",
          "Solve 30 previous year questions of coefficient of correlation",
          "Re-run failed statistics questions twice to lock memory"
        ],
        roi: "High (4.0x)", priority: "Non-Negotiable", sentimentBg: "bg-rose-500/10 border-rose-500/20 text-rose-400"
      };
      if (p === 'friendly') return {
        title: "Skipping Statistics is like skipping cheese on pizza! 🍕",
        text: `No way, ${name}! Statistics is super nice once you look past those giant formula symbols. It carries an easy 5-8% paper weight! Why leave potential points on the table? Let's spend just 15 minutes playing with standard deviations together 😄.`,
        bullets: [
          "Mean, median, mode review with sweet examples",
          "Visual charts check-ups",
          "Celebrate with a cookie after 15 quick equations!"
        ],
        roi: "Medium Heat", priority: "Easy Mark Grabbing", sentimentBg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
      };
      // topper
      return {
        title: "High ROI Analysis: Statistics vs Compiler Design",
        text: `Let's look at the ROI numbers. Statistics requires ~4 hours of basic concept learning for an expected +16 marks (High ROI). Compiler Design takes ~12 hours of complex study for a measly +4 marks (Low ROI). Skipping Statistics is a highly inefficient trade-off. Spend effort here first.`,
        bullets: [
          "Study Standard dev & Variance relations",
          "Calculate regression coefficients directly on recent mock logs",
          "Target 5 years of central university statistics questions"
        ],
        roi: "Maximum ROI Block (4.2x)", priority: "Effort Optimization", sentimentBg: "bg-amber-500/10 border-amber-500/20 text-amber-400"
      };
    }

    if (qId === 'q3') { // Why am I stuck at 70% accuracy / not improving?
      if (p === 'supportive') return {
        title: "70% accuracy is an amazing springboard, don't feel stagnant!",
        text: `It's super common to hit a plateau, ${name}. 70% means you know the basics perfectly. Moving from 70% to 85% is not about studying more chapters—it is about analyzing which specific errors you make under pressure (like silly calculation slips). Let's review your error logs gently!`,
        bullets: [
          "Separate 'clueless errors' from 'silly calculation mistakes'",
          "Spend 15 minutes checking why questions were answered wrongly",
          "Retake only those incorrect questions after 4 days"
        ],
        roi: "Very High (4.5x)", priority: "Precision Review", sentimentBg: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
      };
      if (p === 'strict') return {
        title: "Plateaus are caused by lazy error revision. Let's fix it.",
        text: `You are stuck because you love solving what you already know. You are avoiding your mistakes. To break past 70% accuracy, you must create a spreadsheet of your errors. Analyze your time-per-question limits. Discipline beats comfort.`,
        bullets: [
          "Transcribe every false answer into an active error workbook",
          "Solve 30 questions from subjects you find 'annoying' or 'borring'",
          "Limit your guess ratio in mock exams to strictly 0%"
        ],
        roi: "Elite Boost (4.8x)", priority: "Hardcore Pivot", sentimentBg: "bg-rose-500/10 border-rose-500/20 text-rose-400"
      };
      if (p === 'friendly') return {
        title: "75% is awesome! 🎉 Let's unlock the last boss!",
        text: `Woohoo! You are answering 7 out of 10 questions correctly, ${name}! That is a fantastic base! To get those extra 2 questions, your brain just needs slightly quicker reflexes. Let's play a high-speed game to crush silly calc slip-ups! No sweat! 😄`,
        bullets: [
          "10 rapid calculations drills",
          "Give your brain a high-five for 70%!",
          "Pick 5 errors and tickle them out of your system"
        ],
        roi: "High Playfulness", priority: "Reflex Calibration", sentimentBg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
      };
      // topper
      return {
        title: "Statistical Error Modeling: Quantifying the 15% Gap",
        text: `Stagnancy at 70% usually signifies a systematic conceptual leak. Reviewing your profile data, 62% of your wrong answers are attributable to 'Speed Fatigue' in the last 20% of mock durations. Optimize your exam strategy: solve CS first (high marks speed), then dedicate uninterrupted math focus blocks.`,
        bullets: [
          "Reallocate time: 15 mins CS core, 90 mins Math section, 15 mins Reasoning",
          "Force high-accuracy checks on first 30 math attempts",
          "Log error coefficients in your analytics page weekly"
        ],
        roi: "Critical Rank Pivot", priority: "Surgical Allocation", sentimentBg: "bg-amber-500/10 border-amber-500/20 text-amber-400"
      };
    }

    if (qId === 'q4') { // Am I on track for AIR 100?
      if (p === 'supportive') return {
        title: "You absolutely have the raw potential for AIR 100!",
        text: `Yes, ${name}. Your platform accuracy parameters stand at ${accuracy}%. A recent review shows that with consistent small step tasks over the next 6-8 weeks, you can bridge the score gap. Let's concentrate on daily consistency rather than stressing over the absolute ranking!`,
        bullets: [
          "Keep consistency streak above 70%",
          "Increase mock counts slowly, 1 at a time",
          "Strengthen your weak subjects block of Bayes probability calculations"
        ],
        roi: "Aspiration Match", priority: "Consistency Focus", sentimentBg: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
      };
      if (p === 'strict') return {
        title: "Real talk: Target AIR 50 requires much stricter consistency",
        text: `Current statistics display a mock average of 72. Recent AIR 100 cutoffs require an equivalent score of 88-92. You have an active gap of 18 marks. Currently, your consistency ratio dropped 3 times this month. You must increase study hours and treat every mock like the real national exam.`,
        bullets: [
          "Boost your consistency metric to >90%",
          "Solve 20 additional hard matrix & probability questions every evening",
          "Take 2 subject tests weekly and maintain scoring logs"
        ],
        roi: "Topper Zone Gap", priority: "Accountability Drive", sentimentBg: "bg-rose-500/10 border-rose-500/20 text-rose-400"
      };
      if (p === 'friendly') return {
        title: "On track? Let's check the rocket booster! 🚀",
        text: `You have an elite speed rating, ${name}! Your accuracy is already hovering at an awesome ${accuracy}%. To lock in that AIR 100 seat, we just need to fine-tune your math gears! Let's conquer the ranks with a big smile and high spirits! 😄`,
        bullets: [
          "Complete daily study goal cards",
          "Do a quick 5-min revision ritual with your study buddy",
          "Rocket launch your confidence index!"
        ],
        roi: "High Energy", priority: "Boost Up", sentimentBg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
      };
      // topper
      return {
        title: "Calculated Probability of Achieving Sub-100 National Rank",
        text: `Let's crunch the numerical variables. Your current mock mean is 72. Recent AIR 100 equivalent baseline is 88. The gap is 16 marks. Strongest areas are DBMS and OS, but Probability constitutes an 8-mark drag. If you eliminate 4 silly errors in probability, your projected mock scores rise to 84, placing your admission probability at 91.2%.`,
        bullets: [
          "Maintain subject-wise accuracy checks: Maths >75%, CS >85%, Reasoning >80%",
          "Target 35 mock papers under strict exam-duration simulators",
          "Closely monitor elite toppers benchmarks on your analytics board"
        ],
        roi: "Numerical Trend Model", priority: "Statistical Prep", sentimentBg: "bg-amber-500/10 border-amber-500/20 text-amber-400"
      };
    }

    if (qId === 'q5') { // How many mocks should I take?
      if (p === 'supportive') return {
        title: "Quality is better than quantity. Target 20-30 mocks.",
        text: `Don't rush to take 50 mocks, ${name}. Taking 25 high-quality mocks and thoroughly reviewing every single question you answered wrong is 10 times more valuable than taking 60 mocks without analysis. Let's do 1 mock test per weekend first.`,
        bullets: [
          "Take 1 full mock every Sunday morning of NIMCET structure",
          "Spend all Sunday afternoon analyzing wrong selections",
          "Re-solve mock failures calmly during the weekdays"
        ],
        roi: "High ROI (3.6x)", priority: "Gentle Pacing", sentimentBg: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
      };
      if (p === 'strict') return {
        title: "A minimum of 35 mocks is your baseline path",
        text: `Toppers average 38 mocks before D-day. You have only taken a handful. Your brain hasn't built the stamina to stay 100% focused for 2 full hours. Take at least two full-length simulated mock tests every single week under strict exam hours.`,
        bullets: [
          "Start a weekly schedule of Wednesday and Saturday full mock tests",
          "Zero-tolerance for checking phone during test durations",
          "Review wrong concepts immediately after hitting submission"
        ],
        roi: "High ROI (4.2x)", priority: "Heavy Stamina Lift", sentimentBg: "bg-rose-500/10 border-rose-500/20 text-rose-400"
      };
      if (p === 'friendly') return {
        title: "Let's treat mock tests as gamified levels! 🎮 😄",
        text: `Try aiming for around 30 test levels, ${name}! Think of each mock as a boss fight where you learn the boss's moves. If you get hit, you just memorize their attack pattern and win next time! Let's power level your brain with one fun test 😄.`,
        bullets: [
          "Attempt 1 NIMCET mock level",
          "Map out boss strategies (which sections we crack first)",
          "Unlock new rank titles like 'Venn Diagram Champion'!"
        ],
        roi: "Gamified Loop", priority: "Adventures Track", sentimentBg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
      };
      // topper
      return {
        title: "Mathematical Optimization of Mock Volume",
        text: `Data analytics show mock returns diminish after 45 iterations, whereas confidence levels drop if volume is under 20. The optimal volume curve peaks at 35 simulated papers. We recommend completing 35 tests, with a strict 1.5x time allocation for diagnostic error mapping.`,
        bullets: [
          "Target exactly 35 full-syllabus papers",
          "Allocate 120 minutes for exams and exactly 180 minutes for error diagnostics",
          "Compare weekly scores against our topper database baseline metrics"
        ],
        roi: "Optimal Performance (3.8x)", priority: "Efficiency Peak", sentimentBg: "bg-amber-500/10 border-amber-500/20 text-amber-400"
      };
    }

    if (qId === 'q6') { // Which topic gives maximum marks?
      if (p === 'supportive') return {
        title: "Focus on Probability and DBMS Normalization first!",
        text: `If you want maximum return on investment (ROI), allocate your hours to subjects which have heavy marks and straightforward question types. Probability (with Bayes) and DBMS functional dependencies are incredible score multipliers.`,
        bullets: [
          "Probability & Bayes theorem: expected marks are +16 Marks for only 4 hours study",
          "DBMS Functional dependencies: expected +12 marks for 6 hours study",
          "Quantitative Aptitude: speed distance equations are high reward"
        ],
        roi: "Maximize Gains", priority: "Strategic Core", sentimentBg: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
      };
      if (p === 'strict') return {
        title: "Spend your hours strictly according to mark return ratios",
        text: `Are you wasting 15 block hours studying Compiler design or complex Turing machines for a petty +4 marks? That is stupid preparation. Pivot to high ROI targets: Probability and Quantitative speed calculations. Work smart, not just mechanical.`,
        bullets: [
          "Cut down time spent on low-ROI, low-probability theoretical branches",
          "Invest 5 continuous hours in Operating System paging and semaphore scenarios",
          "Master Sets & Venn relations which underpin 3 math questions"
        ],
        roi: "Maximum Marks Focus", priority: "Efficiency Lock", sentimentBg: "bg-rose-500/10 border-rose-500/20 text-rose-400"
      };
      if (p === 'friendly') return {
        title: "Let's find the sweet gold mines of marking! 💰 😄",
        text: `Let's go treasure hunting, ${name}! 🗺️ Some topics are so generous—they give massive marks for just a little reading! Topics like Probability & Bayes and Quantitative Aptitude give massive boosts for minimal study hours. High marks, low sweat! 😄`,
        bullets: [
          "Bayes theorem gold mine review",
          "DBMS functional dependencies booster",
          "Time, Speed and Distance short rules"
        ],
        roi: "High Gold Index", priority: "Treasure Hunt", sentimentBg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
      };
      // topper
      return {
        title: "Syllabi ROI Audits: Quantitative Marks Allocation Matrix",
        text: `Let's audit the syllabus. Mathematical modeling reveals Probability (Bayes) sits at a massive 4.2x Rank Multiplier index, offering up to +16 marks for only 4 hours of dedicated review. In comparison, advanced Theory of Computation holds an index of 0.8x. Adjust your daily calendar strictly to prioritize high-coefficient blocks.`,
        bullets: [
          "View our Topic ROI calculator table directly inside the dashboard",
          "Shift 8 hours from low yield theory sections into core Probability matrices",
          "Test your speed limits on numerical data relations"
        ],
        roi: "Analytical Optimization (4.2x)", priority: "Syllabus Reallocation", sentimentBg: "bg-amber-500/10 border-amber-500/20 text-amber-400"
      };
    }

    // Default discourages
    if (qId === 'discouraged') {
      if (p === 'supportive') return {
        title: "One mock score does not determine your final destiny!",
        text: `Hey, I know that 42/100 hurts, ${name}. But please breathe! Plateaus and dips are a necessary part of cracking competitive exams. Look at your real trajectory: in your last 5 test runs, your average accuracy rose from 54% to 63%. Your strongest areas like DBMS and OS remain bulletproof. If you spend this evening revising Probability, you will win back those 5-8 marks easily. Let's focus on progress!`,
        bullets: [
          "Take a 20-minute break to refresh your energy",
          "Find the 3 easiest calculation errors in today's mock",
          "Give yourself grace. You solved 380+ problems already!"
        ],
        roi: "Empathy Drive", priority: "Calm Recovery", sentimentBg: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
      };
      if (p === 'strict') return {
        title: "An Air seat requires strict objective review. No panic.",
        text: `A score of 42 is a warning that you are making too many silly guesses. Stop feeling bad and look at the data: you lost 24 marks directly due to negative marking on guess attempts! You skipped your last 3 revision goals this week. The path to AIR 50 is paved with raw accountability, not comfort. Get your notebook and solve those mistakes!`,
        bullets: [
          "Immediately ban guess selections in all mocks",
          "Audit your study logs for missed revision sessions this week",
          "Re-solve every mock error without referring to answers"
        ],
        roi: "Discipline Calibration", priority: "Surgical Review", sentimentBg: "bg-rose-500/10 border-rose-500/20 text-rose-400"
      };
      if (p === 'friendly') return {
        title: "Ouch! Mock test threw a banana peel 🍌, but let's stand up!",
        text: `42/100 is just a number, ${name}, not your brain's value! Think of it like a videogame level where you hit some traps. Your OS scores are super strong. Probability is just teasing us right now. Let's look at 3 easy errors, laugh them off, and grab a delicious snack! You've got this, champion! 😄`,
        bullets: [
          "Treat calculation slips as silly bugs to debug",
          "Clear 5 easy Bayes probability flashcards",
          "Stand up, stretch, and load high-energy vibes!"
        ],
        roi: "Positive Vibes", priority: "Energy Lift", sentimentBg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
      };
      // topper
      return {
        title: "Tactical Error Auditing: Demolishing Mock Negative Marks",
        text: `Let's analyze the 42/100 distribution surgically. You attempted 60 questions, answered 32 correctly, but suffered 28 wrong answers. 28 negative marks completely destroyed your net score! If we strictly enforce an 'Absolute Accuracy Rule' (attempting only 40 items but holding 95% correctness), your score immediately leaps to 76 marks. Strategy over quantity.`,
        bullets: [
          "Enforce strict trial: attempt only 40 questions next mock",
          "Focus exclusively on DBMS and OS which hold 85% correctness ratios",
          "Drive negative marks down to <5% to unlock instant score gains"
        ],
        roi: "Strict Margin Gains (3.9x)", priority: "Accuracy Rules", sentimentBg: "bg-amber-500/10 border-amber-500/20 text-amber-400"
      };
    }

    // Default give up
    if (qId === 'giveup') {
      if (p === 'supportive') return {
        title: "You are closer to your goals than you think. Don't quit!",
        text: `I understand how overwhelming this preparation journey is, ${name}, and it's totally okay to feel exhausted. But please look at what you have built: over ${solvedCount} questions completed successfully, 14 mocks taken, and a solid consistency rating. You have already survived the hardest initial climb. Let's just focus on one beautiful, tiny study goal today. I believe in you!`,
        bullets: [
          "Reduce schedule today: do Revision-Only tasks (no hard exams)",
          "Spend 5 minutes tracking your progress in previous month logs",
          "Remember why you started this journey: and we are in this together."
        ],
        roi: "Heartbeat Support", priority: "Durable Drive", sentimentBg: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
      };
      if (p === 'strict') return {
        title: "Giving up is the only statistical way to guarantee failure.",
        text: `Everyone gets tired, ${name}. But toppers don't look for motivational speeches when they are fatigued; they rely on system discipline. Over 30 days, your accuracy rose from 58% to 72%. Why let temporary exhaustion flush weeks of hard work down the drain? Switch to a 10-minute revision tracker, rest early, and return tomorrow.`,
        bullets: [
          "Shut down theory books for next 12 hours for visual memory rest",
          "Review your streak charts to see your actual hard work",
          "Set a strict sleep cycle. Exhaustion mimics lack of talent."
        ],
        roi: "Raw Accountability", priority: "System Reboot", sentimentBg: "bg-rose-500/10 border-rose-500/20 text-rose-400"
      };
      if (p === 'friendly') return {
        title: "Whoa, halt! 🛑 Hug your brain, it worked so hard! 😄",
        text: `Quitting? No way, ${name}! Your brain is already packed with so many beautiful computer formulas and math rules! You've solved ${solvedCount} questions! How about we make a pact: shut down the scary formulas for today, eat some pizza, play a quick game, and tomorrow we'll tackle just 1 Venn diagram together? Deal? 😄`,
        bullets: [
          "Brain rest for 15 minutes",
          "Do a minor 5-min friendly match quiz with study partner model",
          "Give yourself a high-five for how far you've come!"
        ],
        roi: "High Smiles", priority: "Brain Hug", sentimentBg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
      };
      // topper
      return {
        title: "Sunk Cost & Statistical Analysis of giving up",
        text: `Let's look at the sunk costs. You have completed the foundation of your syllabus. Reviewing historical curves, aspirants who stop at this phase lose an estimated 94.5% of cumulative focus benefits, requiring 3x the effort to re-learn. Your consistency index is 72%—putting you in the top 15% of active candidates. Focus strictly on modular micro-sprints to bypass mental plateaus.`,
        bullets: [
          "Convert complex multi-hour study sessions to 25-minute Pomodoro sprints",
          "Pause full mocks for 4 days; do rapid, high-accuracy 10-item quizzes instead",
          "Focus exclusively on closing specific gaps in your weakest topics"
        ],
        roi: "Sunk Cost Protection", priority: "Strategic Focus Shift", sentimentBg: "bg-amber-500/10 border-amber-500/20 text-amber-400"
      };
    }

    return {
      title: "Active Preparation Directive",
      text: "Keep up the great study consistency. Focus on your high margin targets to make further progression.",
      bullets: ["Re-verify mock mistakes immediately", "Do 10 revision questions daily"],
      roi: "Medium", priority: "Standard Focus", sentimentBg: "bg-slate-500/10 border-slate-500/20 text-slate-400"
    };
  };

  // Custom text query submit handler
  const handleCustomQuerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customMentorQuery.trim()) return;

    const query = customMentorQuery.toLowerCase();
    
    // Simulating deep semantic categorization
    if (query.includes('mock') || query.includes('score') || query.includes('42') || query.includes('percent')) {
      setSelectedMentorQuestion('discouraged');
    } else if (query.includes('give up') || query.includes('quit') || query.includes('giveup') || query.includes('tired') || query.includes('exhausted')) {
      setSelectedMentorQuestion('giveup');
    } else if (query.includes('skip') || query.includes('statistics') || query.includes('stat')) {
      setSelectedMentorQuestion('q2');
    } else if (query.includes('plateau') || query.includes('accuracy') || query.includes('stuck') || query.includes('not improving')) {
      setSelectedMentorQuestion('q3');
    } else if (query.includes('air') || query.includes('rank') || query.includes('track') || query.includes('100') || query.includes('goal')) {
      setSelectedMentorQuestion('q4');
    } else if (query.includes('how many' ) || query.includes('mock volume') || query.includes('mocks')) {
      setSelectedMentorQuestion('q5');
    } else if (query.includes('marks') || query.includes('maximum') || query.includes('roi') || query.includes('weight')) {
      setSelectedMentorQuestion('q6');
    } else {
      // General fallbacks
      setSelectedMentorQuestion('q1');
    }
    
    displayNotice(`🔮 AI Mentor parsed: "${customMentorQuery}" under selected ${mentorPersonality} persona!`);
  };

  // Study Navigator AI states
  const [navigatorAnalyzing, setNavigatorAnalyzing] = useState(false);
  const [isCoachTriggered, setIsCoachTriggered] = useState(true);
  const [navigatorOutput, setNavigatorOutput] = useState<{
    rankProjected: number;
    gapScore: number;
    totalTasks: { text: string; gain: number; targetTab: 'practice' | 'mocks' | 'syllabus' | 'pyq' | 'books'; subject: string; difficulty: string }[];
  }>({
    rankProjected: 180,
    gapScore: 23,
    totalTasks: [
      { text: 'Complete Bayes Conditional Probability practice sets', gain: 4, targetTab: 'practice', subject: 'Mathematics', difficulty: 'Hard' },
      { text: 'Solve 15 Advanced DBMS Normalization PYQs (BCNF & 4NF)', gain: 3, targetTab: 'pyq', subject: 'Computer Science', difficulty: 'Medium' },
      { text: 'Attempt Subject Mock Test #14 (Operating System Semaphores)', gain: 2, targetTab: 'mocks', subject: 'Computer Science', difficulty: 'Medium' },
      { text: 'Review Space Complexity notes in the recommended OSTEP reference book', gain: 2, targetTab: 'books', subject: 'Computer Science', difficulty: 'Easy' }
    ]
  });

  // Memory Retention Tracker states
  const [retentionItems, setRetentionItems] = useState(INITIAL_RETENTION_TRACKER);
  
  // Custom Topper Benchmark Sliders state
  const [sliderMocks, setSliderMocks] = useState(14);
  const [sliderPYQs, setSliderPYQs] = useState(240);
  const [sliderConsistency, setSliderConsistency] = useState(73);

  // Resume evaluation states
  const [resumeText, setResumeText] = useState('');
  const [evaluatingResume, setEvaluatingResume] = useState(false);
  const [resumeReviewResult, setResumeReviewResult] = useState<{
    score: number;
    evaluationTime: string;
    missingSkills: string[];
    placementTier: string;
    atsFeedback: string;
    suggestions: string[];
    optimizedParagraph: string;
  } | null>(null);

  // Admin CMS panel state simulation
  const [syllabusWeightMath, setSyllabusWeightMath] = useState(600);
  const [syllabusWeightCS, setSyllabusWeightCS] = useState(200);
  const [scholarshipMaxIncome, setScholarshipMaxIncome] = useState(600000);
  const [cutoffBaselineScore, setCutoffBaselineScore] = useState(450);
  const [cmsModified, setCmsModified] = useState(false);
  
  const handleTriggerCoach = () => {
    setNavigatorAnalyzing(true);
    setTimeout(() => {
      // Dynamic shift based on player performance metrics
      const currentRankDelta = Math.max(12, Math.floor(user.targetRank * 0.95 - (correctCount / 4)));
      const customTasks = [
        { text: 'Target 18 Advanced Bayes Theory matrices calculations', gain: 5, targetTab: 'practice' as const, subject: 'Mathematics', difficulty: 'Hard' },
        { text: 'Resolve 20 GATE & NIMCET previous year Operating Systems CPU Scheduling questions', gain: 4, targetTab: 'pyq' as const, subject: 'Computer Science', difficulty: 'Medium' },
        { text: 'Execute Mock Test Trial #12 (Operating System & DBMS combined)', gain: 3, targetTab: 'mocks' as const, subject: 'Computer Science', difficulty: 'Hard' },
        { text: 'Confirm Silberschatz textbook reference mapping for Multithreading issues', gain: 2, targetTab: 'books' as const, subject: 'Computer Science', difficulty: 'Easy' }
      ];

      setNavigatorOutput({
        rankProjected: currentRankDelta,
        gapScore: Math.max(8, 30 - Math.ceil(correctCount / 10)),
        totalTasks: customTasks
      });
      setNavigatorAnalyzing(false);
      setIsCoachTriggered(true);
      displayNotice('🎯 Success Coach parsed active performance metrics successfully!');
    }, 1200);
  };

  // Retention formula: retention = initialScore * e ^ (-decayFactor * days)
  const calculateRetention = (item: typeof INITIAL_RETENTION_TRACKER[0]) => {
    const decay = Math.exp(-item.decayFactor * item.lastLearnedDaysAgo);
    return Math.max(20, Math.round(item.initialScore * decay));
  };

  const handleReviseItem = (id: string, name: string) => {
    setRetentionItems(prev => prev.map(item => {
      if (item.id === id) {
        displayNotice(`✨ Reset retention of "${name}" to 100%! Points awarded.`);
        onUpdateProgress({
          dailyRevisionCount: (progress.dailyRevisionCount || 0) + 1
        });
        return { ...item, lastLearnedDaysAgo: 0 };
      }
      return item;
    }));
  };

  // Simulated AI Resume reviewer
  const handleAnalyzeResume = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeText.trim()) {
      displayNotice('❌ Please write or paste your resume content for assessment first.');
      return;
    }
    setEvaluatingResume(true);
    setTimeout(() => {
      const charCount = resumeText.length;
      let score = 55;
      let missingSkills: string[] = ['System Design Basics', 'Direct Github Repository Links'];
      let placementTier = 'Super Dream Company Tier (12-25 LPA)';
      let atsFeedback = 'Resume structure has excellent foundational parameters but lacks deep numeric impact metrics.';

      if (charCount > 300) score += 12;
      if (resumeText.toLowerCase().includes('github')) score += 8;
      if (resumeText.toLowerCase().includes('react') || resumeText.toLowerCase().includes('typescript')) score += 7;
      if (resumeText.toLowerCase().includes('projects')) score += 5;
      
      if (score < 65) {
        missingSkills = ['Docker & CI/CD deployment logic', 'Production deployment url references', 'Database Indexing techniques'];
        placementTier = 'Mass Recruiter Tier (4-6 LPA) / Needs Optimization';
        atsFeedback = 'Requires clear quantification of outcomes. Add data ratios to validate achievements.';
      } else if (score < 80) {
        missingSkills = ['Scalability architecture validation', 'System APIs specification descriptions'];
        placementTier = 'Dream Company Tier (8-12 LPA)';
        atsFeedback = 'Solid engineering candidate foundation. Add technical pointers regarding database optimization.';
      }

      setResumeReviewResult({
        score: Math.min(98, score),
        evaluationTime: new Date().toLocaleTimeString(),
        missingSkills,
        placementTier,
        atsFeedback,
        suggestions: [
          'Replace generic job descriptors with bold action phrases (e.g., "Led team of 4" -> "Spearheaded low-latency microservices pipeline boosting API response speed by 35%").',
          'Include a clear hyperlink block referencing your GitHub repositories focusing on NIMCET Mock practice systems.',
          'Quantify every single software engineering accomplishment with an active metric denominator.'
        ],
        optimizedParagraph: 'Spearheaded full-stack React prep portal engine backend (Express/ESM Node), improving test-simulation load speeds by 42% and implementing real-time analytical timers comparing 50+ topper checkpoints.'
      });

      setEvaluatingResume(false);
      displayNotice('📝 Automated AI Resume valuation metrics fully generated.');
    }, 1500);
  };

  const handleUpdateAdminCMS = () => {
    setCmsModified(true);
    if (onUpdateAdminConfig) {
      onUpdateAdminConfig({
        mathsWeight: syllabusWeightMath,
        csWeight: syllabusWeightCS,
        annualIncomeLimit: scholarshipMaxIncome,
        cutoffMark: cutoffBaselineScore
      });
    }
    displayNotice('⚡ Saved custom Admin System weights! Dynamic database values loaded across all active client views.');
    setTimeout(() => setCmsModified(false), 2000);
  };

  // Live dynamic projection rank logic based on sliders
  const calculateDynamicRankProjection = () => {
    // base user starting point: say, 320th rank
    // each mock counts as -4 rank units
    // each PYQ counts as -0.25 rank units
    // consistency counts as -3 rank units per 1% above 50%
    const mocksFactor = (sliderMocks - 5) * 4;
    const pyqsFactor = (sliderPYQs - 50) * 0.22;
    const consistencyFactor = (sliderConsistency - 50) * 2.8;
    
    const calculated = Math.max(12, Math.round(520 - mocksFactor - pyqsFactor - consistencyFactor));
    return calculated;
  };

  return (
    <div id="ai-coach-navigator-container" className="space-y-6 text-left">
      
      {activeSubTab !== 'exam_updates' && (
        <>
          {/* Visual Hub Title & Ribbon with modern negative space layouts */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white/[0.02] border border-white/5 p-5 md:p-6 rounded-3xl gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400 animate-spin" />
                <span className="text-[10px] uppercase font-bold text-indigo-400 font-mono tracking-wider">RANKFORGE AI ENGINE</span>
              </div>
              <h1 className="text-xl font-extrabold text-white font-sans mt-1">AI Mentor & Success Coach</h1>
              <p className="text-xs text-slate-400 mt-1 max-w-xl">
                Your personal AI guide for doubt clearing, study planning, progress analysis, and placement roadmaps.
              </p>
            </div>

            {/* Dynamic active status pill */}
            <div className="flex items-center gap-3 bg-black/40 border border-indigo-500/20 px-3.5 py-2 rounded-2xl shrink-0">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <div className="text-xs font-mono">
                <span className="block text-slate-400 text-[9px] uppercase font-black">Core AI State</span>
                <span className="text-white font-bold text-[11px]">Real-Time Sync Active</span>
              </div>
            </div>
          </div>

          {/* Internal Navigation Subtabs */}
          <div className="flex flex-wrap border-b border-white/10 gap-1 select-none overflow-x-auto no-scrollbar">
            {[
              { id: 'ask_mentor', label: '💬 Chat', icon: BrainCircuit },
              { id: 'premium_tutor', label: '🎓 Tutor', icon: MessageSquareCode },
              { id: 'study_navigator', label: '📊 Study Navigator', icon: Target },
              { id: 'retention_tracker', label: '🧠 Memory & Revision', icon: Clock },
              { id: 'topper_benchmarks', label: '🏆 Rank Predictor', icon: LineChart },
              { id: 'placement_resume', label: '💼 Career & Admissions', icon: Briefcase },
              { id: 'tools', label: '🛠 Smart Tools', icon: PenTool },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id as any)}
                  className={`pb-3.5 pt-1.5 px-4 font-sans text-[11px] sm:text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                    isActive 
                      ? 'border-indigo-500 text-white font-black' 
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </>
      )}

      {activeSubTab === 'exam_updates' && (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white/[0.02] border border-white/5 p-5 md:p-6 rounded-3xl gap-4">
          <div>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              <span className="text-[10px] uppercase font-bold text-amber-500 font-mono tracking-wider">LIVE DATA FEED</span>
            </div>
            <h1 className="text-xl font-extrabold text-white font-sans mt-1">News & Updates</h1>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Verified official notifications, deadlines, and scholarships for MCA admissions.
            </p>
          </div>
        </div>
      )}

      {/* SUBTAB 0: AI RANK MENTOR & SUCCESS COACH */}
      {activeSubTab === 'ask_mentor' && (
        <div id="subtab-ask-mentor" className="space-y-6 animate-fadeIn">
          
          {/* Header Banner */}
          <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-indigo-950/50 via-indigo-900/10 to-teal-950/25 border border-indigo-500/15 text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none -mt-40 -mr-40" />
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-black tracking-widest text-indigo-400 font-mono uppercase">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Strategic Success Partner</span>
                </div>
                <h2 className="text-2xl font-black text-white tracking-tight">AI Rank Mentor (Aris)</h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Aris is not a standard question-answer tutor. Aris analyzes your study schedules, mock scores, and retention metrics to help you make key academic decisions, schedule revisions, prevent cognitive burnout, and secure your target AIR.
                </p>
              </div>

              {/* Quick Profile Segment */}
              <div className="p-4 bg-black/40 border border-white/5 rounded-2xl flex items-center gap-4 text-left">
                <div className="w-12 h-12 rounded-full bg-indigo-600/10 border border-indigo-500/30 flex items-center justify-center">
                  <Target className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <span className="block text-[10px] font-mono text-slate-500 uppercase font-black">Active Profile</span>
                  <span className="text-sm font-bold text-white block">{user.name || 'Kalen'}</span>
                  <span className="text-[11px] text-emerald-400 font-medium">Predicted Rank: AIR {user.targetRank}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Core Mentor Interface Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT Panel: Control Board & Strategic Advice output (8 columns) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Step 1: select personality */}
              <div className="p-6 rounded-3xl bg-white/5 border border-white/10 text-left space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-indigo-400" />
                    <span>1. Configure Mentor Personality</span>
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider">Select counseling voice</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { id: 'supportive', name: 'Supportive Coach', motto: 'Empathy & progress', color: 'border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/5', bgActive: 'bg-indigo-500/15 border-indigo-500 text-white shadow-lg' },
                    { id: 'strict', name: 'Strict Mentor', motto: 'Hard facts & accountability', color: 'border-rose-500/30 text-rose-400 hover:bg-rose-500/5', bgActive: 'bg-rose-500/15 border-rose-500 text-white shadow-lg shadow-rose-950/20' },
                    { id: 'friendly', name: 'Friendly Buddy', motto: 'Fun & positive vibes', color: 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/5', bgActive: 'bg-emerald-500/15 border-emerald-500 text-white shadow-lg shadow-emerald-950/20' },
                    { id: 'topper', name: 'Topper Strategist', motto: 'Mathematical ROI focus', color: 'border-amber-500/30 text-amber-400 hover:bg-amber-500/5', bgActive: 'bg-amber-500/15 border-amber-500 text-white shadow-lg shadow-amber-950/20' }
                  ].map((p) => {
                    const isSelected = mentorPersonality === p.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => {
                          setMentorPersonality(p.id as any);
                          displayNotice(`👤 AI Mentor changed communication tone to [${p.name}] Mode!`);
                        }}
                        className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
                          isSelected ? p.bgActive : `bg-black/20 ${p.color}`
                        }`}
                      >
                        <span className="block text-xs font-extrabold leading-tight">{p.name}</span>
                        <span className="block text-[9px] text-slate-400 mt-1">{p.motto}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: select prep doubt or write query */}
              <div className="p-6 rounded-3xl bg-white/5 border border-white/10 text-left space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-emerald-400" />
                  <span>2. Pick a Strategic Query or Ask Anything</span>
                </h3>

                {/* Preformatted strategic questions chips */}
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'q1', text: '📖 What should I study next?' },
                    { id: 'q2', text: '🛑 Can I skip Statistics?' },
                    { id: 'q3', text: '📈 Stuck at 70% accuracy?' },
                    { id: 'q4', text: '🎯 Am I on track for AIR 100?' },
                    { id: 'q5', text: '📝 How many mocks to take?' },
                    { id: 'q6', text: '💰 Which topic has highest ROI?' },
                  ].map((chip) => {
                    const isSelected = selectedMentorQuestion === chip.id;
                    return (
                      <button
                        key={chip.id}
                        onClick={() => {
                          setSelectedMentorQuestion(chip.id);
                          setCustomMentorQuery('');
                        }}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                          isSelected 
                            ? 'bg-emerald-500/10 border-emerald-500 text-white' 
                            : 'bg-black/20 border-white/5 text-slate-400 hover:text-white hover:border-white/10'
                        }`}
                      >
                        {chip.text}
                      </button>
                    );
                  })}
                </div>

                {/* Custom query input form */}
                <form onSubmit={handleCustomQuerySubmit} className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={customMentorQuery}
                      onChange={(e) => setCustomMentorQuery(e.target.value)}
                      placeholder="Type a preparation doubt (e.g., 'Statistics feels tough' or 'I feel so tired')..."
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-xl flex items-center gap-2 transition-all cursor-pointer select-none active:scale-95"
                  >
                    <span>Consult Aris</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>

              {/* Step 3: Mentor Advice Board */}
              {(() => {
                const advice = getMentorAdvice(selectedMentorQuestion);
                return (
                  <div className="p-6 md:p-8 rounded-3xl bg-black/50 border border-white/10 text-left space-y-6 relative overflow-hidden animate-fadeIn">
                    {/* Visual tone badge */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none -mt-20 -mr-20" />
                    
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
                      <div>
                        <span className="text-[10px] font-mono text-indigo-400 uppercase font-black tracking-wider block">CONSULTATION BRIEF</span>
                        <h4 className="text-lg font-black text-white mt-1">{advice.title}</h4>
                      </div>
                      <div className="flex gap-2">
                        <span className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase border ${advice.sentimentBg}`}>
                          {mentorPersonality} mood
                        </span>
                        <span className="px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase bg-white/5 border border-white/10 text-slate-300">
                          Priority: {advice.priority}
                        </span>
                      </div>
                    </div>

                    {/* Speech Text */}
                    <div className="space-y-4">
                      <p className="text-xs text-slate-300 leading-relaxed font-medium italic">
                        "{advice.text}"
                      </p>

                      {/* Action bullets */}
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-3">
                        <span className="block text-[10px] font-mono text-slate-400 font-extrabold tracking-widest uppercase">TACTICAL ACTION PLAN:</span>
                        <div className="space-y-2.5">
                          {advice.bullets.map((b, idx) => (
                            <div key={idx} className="flex gap-2.5 items-start text-xs text-slate-300 leading-normal">
                              <span className="text-emerald-400 font-bold font-mono mt-0.5">#{idx + 1}</span>
                              <p className="font-medium">{b}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Stats & routing buttons */}
                    <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                      <div className="flex items-center gap-4">
                        <div>
                          <span className="block text-[8px] font-mono text-slate-500 uppercase font-bold">ESTIMATED GAINS</span>
                          <span className="text-xs font-black text-emerald-400">+12 to +16 Marks</span>
                        </div>
                        <div className="w-px h-8 bg-white/10" />
                        <div>
                          <span className="block text-[8px] font-mono text-slate-500 uppercase font-bold">TOPIC ROI INDEX</span>
                          <span className="text-xs font-black text-indigo-400">{advice.roi}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          // Route dynamically
                          if (selectedMentorQuestion === 'q2' || selectedMentorQuestion === 'q6') {
                            onNavigateToTab('syllabus');
                            displayNotice("⚡ Navigating to Syllabus structures, tracing recommended books...");
                          } else if (selectedMentorQuestion === 'q3' || selectedMentorQuestion === 'q1') {
                            onNavigateToTab('practice');
                            displayNotice("⚡ Starting adaptive problem-solving on high ROI maths segments!");
                          } else {
                            onNavigateToTab('mocks');
                            displayNotice("⚡ Launching national full syllabus trials under live limits.");
                          }
                        }}
                        className="px-4 py-2 bg-white text-indigo-600 font-black text-xs rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                      >
                        <span>Execute Strategy Now</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                );
              })()}

              {/* Topic ROI Evaluation Board */}
              <div className="p-6 rounded-3xl bg-white/5 border border-white/10 text-left space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Database className="w-4 h-4 text-indigo-400" />
                      <span>Topic ROI & Marks Calculator</span>
                    </h3>
                    <p className="text-[10px] text-slate-400">Optimize how much time you allocate vs marks returned</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                    Syllabus Audit
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {topicROIList.map((t) => {
                    const isHigh = t.roiCategory === 'High ROI';
                    return (
                      <div key={t.id} className="p-3.5 bg-black/40 border border-white/5 rounded-2xl flex items-center justify-between transition-all hover:border-white/10">
                        <div className="space-y-1 max-w-[70%]">
                          <span className="block text-xs font-extrabold text-white leading-tight truncate">{t.topic}</span>
                          <span className="block text-[10px] text-slate-400">Est. study time: <strong className="text-slate-300 font-semibold">{t.prepTime}</strong></span>
                        </div>
                        <div className="text-right">
                          <span className="block text-[10px] font-mono text-emerald-400 font-bold whitespace-nowrap">{t.expectedMarks}</span>
                          <span className={`inline-block text-[8px] font-mono font-black uppercase mt-1 px-1.5 py-0.5 rounded ${
                            isHigh ? 'bg-indigo-500/10 text-indigo-300' : 'bg-slate-500/15 text-slate-400'
                          }`}>
                            ROI: {t.rankMultiplier}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* RIGHT Panel: Burnout, Quiz & Benchmarking Companion (4 columns) */}
            <div className="lg:col-span-4 space-y-6">

              {/* AI Burnout Fatigue Detector Widget */}
              <div className="p-6 rounded-3xl bg-gradient-to-b from-orange-950/20 to-red-950/30 border border-red-500/20 text-left space-y-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-2xl pointer-events-none" />
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-400/10 border border-red-500/30 text-[9px] font-extrabold font-mono uppercase text-red-400">
                    <Flame className="w-3.5 h-3.5 text-orange-400 animate-bounce" />
                    <span>Burnout Scanner</span>
                  </span>
                  <span className="text-[10px] font-mono font-semibold text-slate-400">Live Status</span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xl font-black text-white font-mono">{burnoutStreak} Days</span>
                    <span className="text-xs text-slate-400 font-semibold">Continuous Streak</span>
                  </div>
                  <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
                    <div 
                      className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full transition-all duration-500" 
                      style={{ width: `${Math.min((burnoutStreak / 15) * 100, 100)}%` }} 
                    />
                  </div>
                </div>

                {burnoutStreak >= 8 ? (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-2xl text-xs leading-relaxed text-red-200">
                    <p className="font-semibold">⚠️ FATIGUE DETECTED! (Cognitive Leak ~{accuracyDropFactor}%)</p>
                    <p className="text-[10px] text-slate-300 mt-1">Your 11-day active streak is inducing fatigue blocks, causing an expected {accuracyDropFactor}% reduction in mock accuracy. Take rest before testing!</p>
                  </div>
                ) : (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-xs leading-relaxed text-emerald-200">
                    <p className="font-semibold">✅ SYSTEM STABILIZED! (Focus Reserves High)</p>
                    <p className="text-[10px] text-slate-300 mt-1">Excellent balance! Active focus levels stand at 100%. Re-solve errors with maximum clarity indices.</p>
                  </div>
                )}

                <button
                  onClick={() => {
                    setBurnoutStreak(0);
                    setAccuracyDropFactor(0);
                    displayNotice("🔋 Recovery Schedule Activated! Streak reset to 0. Focus reserves recharged back to 100%!");
                  }}
                  className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold text-xs transition-all active:scale-95"
                >
                  Activate 1-Day Recovery Schedule
                </button>
              </div>

              {/* Confidence Predictor Gauge */}
              <div className="p-6 rounded-3xl bg-white/5 border border-white/10 text-left space-y-4">
                <span className="text-[10px] font-mono text-indigo-400 uppercase font-black tracking-wider uppercase block">PRESET READINESS SCHEMES</span>
                <div className="flex items-center gap-5">
                  <div className="w-20 h-20 rounded-full border-4 border-indigo-500 border-r-transparent flex flex-col items-center justify-center relative animate-none">
                    <span className="text-lg font-black text-white font-mono leading-none">91%</span>
                    <span className="text-[8px] text-slate-400 mt-0.5 leading-none font-bold uppercase">CONFIDENCE</span>
                  </div>
                  <div className="flex-1 space-y-1">
                    <h4 className="text-sm font-bold text-white leading-tight">High Readiness Zone</h4>
                    <p className="text-[10px] text-slate-400 leading-normal">
                      Based on {solvedCount} practice matches, your mathematical consistency index places you in NIMCET Sub-100 bracket.
                    </p>
                  </div>
                </div>
              </div>

              {/* AI Study Partner Mode (Flashcard Quiz) */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-950/40 via-indigo-900/10 to-teal-950/10 border border-indigo-500/15 text-left space-y-4 relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-[10px] font-mono text-slate-400 font-black tracking-wider uppercase">STUDY PARTNER SPARK</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-black uppercase bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    +50 XP Nudge
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs font-black text-white leading-tight">Bayes Retention Nudge</h4>
                  <p className="text-[10px] text-slate-400 leading-normal">
                    You haven't revised Bayes probability calculations for 8 days. Memory decay estimated at 63%. Solve this flashcard to restore 100%!
                  </p>
                </div>

                {!partnerQuizActive ? (
                  <button
                    onClick={() => setPartnerQuizActive(true)}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-slate-800 border border-indigo-500/20 text-white font-extrabold text-[11px] rounded-xl transition-all cursor-pointer"
                  >
                    Accept Revision Quiz
                  </button>
                ) : (
                  <div className="p-3 bg-black/40 border border-white/5 rounded-2xl text-xs space-y-3 animate-fadeIn">
                    <p className="font-semibold text-slate-200 text-[11px]">
                      Q: Roll two dice. What is the probability that the sum is 7, given that the first die rolled a 3?
                    </p>
                    
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { key: 'A', text: '1 / 12' },
                        { key: 'B', text: '1 / 6 (Correct)' },
                        { key: 'C', text: '1 / 36' },
                        { key: 'D', text: '1 / 2' }
                      ].map((o) => {
                        const isChosen = partnerQuizAns === o.key;
                        return (
                          <button
                            key={o.key}
                            disabled={partnerQuizSubmitted}
                            onClick={() => {
                              setPartnerQuizAns(o.key);
                              setPartnerQuizSubmitted(true);
                              if (o.key === 'B') {
                                setPartnerQuizScore(50);
                                displayNotice("🎉 Awesome Bayes calculation! Spaced retrieval retention successfully restored to 100%!");
                              } else {
                                displayNotice("❌ Oops! Wrong ratio, but excellent feedback model compiled.");
                              }
                            }}
                            className={`p-2 rounded text-[10px] border transition-all text-left ${
                              isChosen 
                                ? o.key === 'B' 
                                  ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300 font-bold' 
                                  : 'bg-red-500/15 border-red-500 text-red-300 font-bold'
                                : 'bg-black/30 border-white/5 text-slate-400 hover:border-white/10'
                            }`}
                          >
                            <span>{o.key}. {o.text}</span>
                          </button>
                        );
                      })}
                    </div>

                    {partnerQuizSubmitted && (
                      <div className="pt-2 text-[10px] text-slate-400 leading-normal border-t border-white/5 flex justify-between items-center">
                        <span>{partnerQuizAns === 'B' ? '🎉 +50 XP Restored!' : 'Answer check: Option B.'}</span>
                        <button
                          onClick={() => {
                            setPartnerQuizActive(false);
                            setPartnerQuizSubmitted(false);
                            setPartnerQuizAns('');
                          }}
                          className="text-indigo-400 hover:underline"
                        >
                          Close Quiz
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Students Like You Comparison Segment */}
              <div className="p-6 rounded-3xl bg-white/5 border border-white/10 text-left space-y-4">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-black tracking-widest uppercase block">STUDENTS LIKE YOU</span>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Comparing your current statistics against historical data points of aspirants who secured sub-100 ranks.
                </p>

                <div className="space-y-3 font-mono text-[11px]">
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-slate-400">Accuracy Index:</span>
                    <span className="text-white font-semibold">{accuracy}% <span className="text-indigo-400">(AIR 100: &gt;85%)</span></span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-slate-400">Simulated Mocks:</span>
                    <span className="text-white font-semibold">14 <span className="text-indigo-400">(AIR 100: &gt;35)</span></span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Solved Solos:</span>
                    <span className="text-white font-semibold">{solvedCount} <span className="text-indigo-400">(AIR 100: &gt;650)</span></span>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* SUBTAB 1: STUDY NAVIGATOR & SUCCESS COACH */}
      {activeSubTab === 'study_navigator' && (
        <div id="subtab-study-navigator" className="animate-fadeIn">
          <DailyExecutionEngine progress={progress} onUpdateProgress={onUpdateProgress} />
        </div>
      )}

      {/* SUBTAB 2: SPACED REPETITION & RETENTION TIMELINE */}
      {activeSubTab === 'retention_tracker' && (
        <div id="subtab-retention-tracker" className="space-y-6">
          
          <div className="p-5 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span>Daily Revision Queue (Ebbinghaus Model)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Topics drift in memory over time. Clear your daily queue to lock in concepts before they decay into the critical danger zone.
                </p>
              </div>

              <button
                onClick={() => {
                  setRetentionItems(prev => prev.map(i => ({ ...i, lastLearnedDaysAgo: Math.min(30, i.lastLearnedDaysAgo + 2) })));
                  displayNotice('⏳ Simulated 2 days passing by... Check retention decay rates!');
                }}
                className="px-3 py-1.5 bg-white/5 border border-white/10 text-white rounded-lg text-xs font-mono font-bold hover:bg-white/10 transition-all cursor-pointer"
              >
                Simulate +2 Days Retention Decay
              </button>
            </div>

            {/* List of space repetition items */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {retentionItems.map((item) => {
                const currentRet = calculateRetention(item);
                const isCritical = currentRet < 75;
                
                return (
                  <div 
                    key={item.id} 
                    className={`p-4 rounded-2xl border transition-all ${
                      isCritical 
                        ? 'bg-rose-950/10 border-rose-500/20' 
                        : 'bg-black/30 border-white/5'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-indigo-400 uppercase font-black tracking-wider block">
                          {item.subject}
                        </span>
                        <h4 className="text-xs font-bold text-white leading-tight min-h-[32px]">{item.topic}</h4>
                      </div>

                      <div className="text-right">
                        <span className="block text-[9px] text-slate-500 font-mono font-bold uppercase">Estimated Retention</span>
                        <span className={`text-xl font-black font-mono ${
                          isCritical ? 'text-red-400' : currentRet < 85 ? 'text-amber-400' : 'text-emerald-400'
                        }`}>
                          {currentRet}%
                        </span>
                      </div>
                    </div>

                    {/* Progress representation */}
                    <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden mt-3 p-0.5 border border-white/5">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${
                          isCritical 
                            ? 'bg-gradient-to-r from-red-600 to-amber-500' 
                            : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                        }`}
                        style={{ width: `${currentRet}%` }}
                      />
                    </div>

                    <div className="mt-3.5 pt-3 border-t border-white/5 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 font-mono">
                        Last Read: <strong className="text-slate-300">{item.lastLearnedDaysAgo} days ago</strong>
                      </span>

                      <button
                        onClick={() => handleReviseItem(item.id, item.topic)}
                        className={`px-3 py-1 bg-indigo-600/10 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/20 rounded-xl font-mono text-[10px] font-bold transition-all cursor-pointer ${
                          isCritical ? 'bg-red-500/10 hover:bg-indigo-600/20 text-red-300 border-red-500/30' : ''
                        }`}
                      >
                        {isCritical ? '🚨 Quick Revision Checklist' : '✓ Mark as Revised'}
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>

        </div>
      )}

      {/* SUBTAB 3: TOPPER ADVANCED BENCHMARKS */}
      {activeSubTab === 'topper_benchmarks' && (
        <div id="subtab-topper-benchmarks" className="space-y-6 text-left animate-fadeIn">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gradient-to-br from-indigo-950/40 to-slate-900/50 border border-white/5 p-6 rounded-3xl gap-4 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-3xl rounded-full -mt-20 -mr-20 pointer-events-none" />
             <div className="relative z-10 w-full">
                <div className="flex items-center gap-2 mb-2">
                   <Target className="w-5 h-5 text-emerald-400" />
                   <h3 className="text-xl text-white font-black tracking-tight">AI Rank Improvement Simulator</h3>
                </div>
                <p className="text-xs text-slate-400 max-w-2xl">
                   Instead of just predicting your rank, RankForge AI simulates exactly what changes will push your score into the elite target bracket. Review your action-to-rank ratio below.
                </p>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
             
             {/* Left side actions analysis */}
             <div className="lg:col-span-7 space-y-4">
                <h4 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest pl-2">Step-by-Step AI Model Projections</h4>
                
                <div className="space-y-3">
                   {/* Base projection */}
                   <div className="p-5 bg-slate-900/50 border border-white/5 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-mono font-bold text-slate-400 text-xs shrink-0">1</div>
                         <div>
                            <span className="block text-slate-400 font-bold text-xs uppercase tracking-wider mb-0.5">Current Rank Estimate</span>
                            <span className="text-white text-sm">Baseline test accuracy (62%)</span>
                         </div>
                      </div>
                      <div className="text-right shrink-0">
                         <span className="text-xl font-black text-rose-400 font-mono block">AIR 850</span>
                      </div>
                   </div>

                   {/* Stage 1: Accuracy */}
                   <div className="relative">
                      <div className="absolute left-[39px] -top-3 w-px h-6 bg-indigo-500/30" />
                      <div className="p-5 bg-indigo-950/20 border border-indigo-500/20 rounded-2xl flex items-center justify-between shadow-lg">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-mono font-bold text-white text-xs shrink-0">2</div>
                            <div>
                               <span className="block text-indigo-400 font-bold text-xs uppercase tracking-wider mb-0.5">If Accuracy Improves</span>
                               <span className="text-white text-sm flex gap-2 items-center">62% <ArrowRight className="w-3 h-3 text-slate-500" /> 75% focus</span>
                            </div>
                         </div>
                         <div className="text-right shrink-0">
                            <span className="text-xl font-black text-amber-400 font-mono block">AIR 450</span>
                            <span className="text-[9px] text-emerald-400 font-bold block">+400 Rank gain</span>
                         </div>
                      </div>
                   </div>

                   {/* Stage 2: Accuracy + Speed */}
                   <div className="relative">
                      <div className="absolute left-[39px] -top-3 w-px h-6 bg-indigo-500/30" />
                      <div className="p-5 bg-indigo-900/30 border border-indigo-400/30 rounded-2xl flex items-center justify-between shadow-lg">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center font-mono font-bold text-white text-xs shrink-0">3</div>
                            <div>
                               <span className="block text-indigo-300 font-bold text-xs uppercase tracking-wider mb-0.5">If Accuracy + Speed Improve</span>
                               <span className="text-white text-sm flex gap-2 items-center">75% Focus <span className="text-indigo-400 font-bold">+ 15% Faster Solving</span></span>
                            </div>
                         </div>
                         <div className="text-right shrink-0">
                            <span className="text-2xl font-black text-emerald-400 font-mono block">AIR 180</span>
                            <span className="text-[9px] text-emerald-400 font-bold block">+270 Rank gain</span>
                         </div>
                      </div>
                   </div>

                   {/* Stage 3: Elite Target */}
                   <div className="relative">
                      <div className="absolute left-[39px] -top-3 w-px h-6 bg-emerald-500/50" />
                      <div className="p-5 bg-gradient-to-r from-emerald-950/40 to-teal-900/20 border border-emerald-500/40 rounded-2xl flex items-center justify-between shadow-lg">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center font-mono font-black text-black text-xs shrink-0">
                               <Sparkles className="w-4 h-4" />
                            </div>
                            <div>
                               <span className="block text-emerald-400 font-bold text-xs uppercase tracking-wider mb-0.5">Absolute Elite Target</span>
                               <span className="text-white font-bold text-sm">Accuracy + Speed + Targeted PYQs</span>
                            </div>
                         </div>
                         <div className="text-right shrink-0">
                            <span className="text-3xl font-black text-white font-mono block drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]">AIR 70–120</span>
                         </div>
                      </div>
                   </div>

                </div>
             </div>

             {/* Right side live simulation display */}
             <div className="lg:col-span-5 space-y-4">
                <div className="p-6 bg-[#0a0a14] border border-white/5 rounded-3xl space-y-6 shrink-0 relative overflow-hidden">
                   <div className="absolute bottom-0 right-0 w-32 h-32 bg-amber-500/10 blur-3xl pointer-events-none rounded-full" />
                   
                   <div>
                     <div className="flex items-center gap-2 mb-1">
                        <AlertCircle className="w-4 h-4 text-amber-500" />
                        <span className="text-[10px] uppercase font-bold text-amber-500 tracking-wider font-mono">Your Highest Leverage Steps</span>
                     </div>
                     <p className="text-xs text-slate-400 font-medium">To reach the top projection (AIR 70-120), prioritize these exact interventions:</p>
                   </div>

                   <ul className="space-y-3 font-sans">
                      <li className="flex items-start gap-3">
                         <span className="text-emerald-500 font-black mt-0.5 shrink-0 text-sm">1.</span>
                         <div>
                            <span className="text-white text-xs font-bold block line-clamp-1">Fix CS Conceptual Gaps</span>
                            <span className="text-[10px] text-slate-400">Your core CS mistakes cost you -14 marks per mock test. Learn CPU scheduling inside out.</span>
                         </div>
                      </li>
                      <li className="flex items-start gap-3">
                         <span className="text-emerald-500 font-black mt-0.5 shrink-0 text-sm">2.</span>
                         <div>
                            <span className="text-white text-xs font-bold block line-clamp-1">Speed up Quantitative Problem Solving</span>
                            <span className="text-[10px] text-slate-400">Aim for max 50 seconds per Vector Math problem. Practice 25 timed PYQs.</span>
                         </div>
                      </li>
                      <li className="flex items-start gap-3">
                         <span className="text-emerald-500 font-black mt-0.5 shrink-0 text-sm">3.</span>
                         <div>
                            <span className="text-white text-xs font-bold block line-clamp-1">Daily Revision Cycles</span>
                            <span className="text-[10px] text-slate-400">Execute spaced repetition for standard limit formulas to fix formula-forgetting errors.</span>
                         </div>
                      </li>
                   </ul>

                   <button
                     onClick={() => {
                        displayNotice('Configuring AI Planner with top leverage steps...');
                        setTimeout(() => setActiveSubTab('study_navigator'), 800);
                     }}
                     className="w-full mt-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white font-bold text-xs"
                   >
                     Add to Execution Engine
                   </button>
                </div>
             </div>

          </div>

        </div>
      )}

      {/* SUBTAB 4: PLACEMENT ROADMAP & RESUME ADVISOR */}
      {activeSubTab === 'placement_resume' && (
        <div id="subtab-placement-resume" className="space-y-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left AI resume review */}
            <div className="lg:col-span-8 p-6 bg-white/[0.02] border border-white/10 rounded-3xl space-y-6">
              
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <FileText className="w-4.5 h-4.5 text-indigo-400" />
                  <span>Resume Reviewer & ATS Compliance Parser</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Once you enter NITs/MCAs, your placement prep starts immediately. Analyze your resume details.
                </p>
              </div>

              <form onSubmit={handleAnalyzeResume} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300 font-mono text-left">
                    Paste Resume Content (Markdown, Raw Text, or Project Descriptions):
                  </label>
                  <textarea
                    rows={6}
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder="Aryan / Kalen — NIT MCA student&#10;Focus: DS Algorithm, React application builder, operating system semaphores tracker code.&#10;Skills: TypeScript, Python, REST APIs, DBMS SQL models.&#10;Projects: RankForge AI Prep platform with interactive Mock test system built with Vite and Tailwind."
                    className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-xs font-sans text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50"
                  />
                </div>

                <div className="flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => {
                      setResumeText(
                        `Aryan / Kalen - Senior MCA Student\n` +
                        `Technical Skills: React, Node, Express, SQLite, PostgreSQL, Java Core, C++ Data Structures\n` +
                        `Core Projects:\n` +
                        `- Designed RankForge AI Prep Portal system tracking student mock speed durations against 50 rankers.\n` +
                        `- Built Syllabus mapping tool parsing GATE and NIMCET examination chapters.\n` +
                        `Experience: Self-taught Web development frameworks, solved 300+ DSA problems.`
                      );
                      displayNotice('📋 Loaded pre-filled topper demo resume template!');
                    }}
                    className="text-xs text-indigo-400 hover:underline cursor-pointer"
                  >
                    Load Sample Topper Resume
                  </button>

                  <button
                    type="submit"
                    disabled={evaluatingResume}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-lg hover:scale-[1.02]"
                  >
                    {evaluatingResume ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Scanning Resume Elements...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Assess Resume Core</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Assessment Outcomes rendering */}
              {resumeReviewResult && (
                <div className="p-5 bg-black/35 rounded-2xl border border-white/5 space-y-4 animate-fadeIn text-xs">
                  
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-white/5 pb-4">
                    <div>
                      <span className="text-[10px] font-mono text-slate-500 font-bold uppercase">Resume Quality score</span>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-3xl font-black text-indigo-400 font-mono">{resumeReviewResult.score}</span>
                        <span className="text-slate-400">/ 100 Marks</span>
                      </div>
                    </div>

                    <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-right font-mono">
                      <span className="block text-[9px] text-slate-400 uppercase">Estimated ATS Bracket</span>
                      <span className="text-emerald-400 font-bold">{resumeReviewResult.placementTier}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    
                    <div className="text-left font-sans">
                      <span className="block text-[10px] font-bold text-amber-400 font-mono uppercase tracking-wider">⚠️ ATS WEAKNESS CRITIQUE:</span>
                      <p className="text-slate-300 mt-1 leading-relaxed">
                        {resumeReviewResult.atsFeedback}
                      </p>
                    </div>

                    <div className="text-left font-sans">
                      <span className="block text-[10px] font-bold text-indigo-400 font-mono uppercase tracking-wider">🛠️ MISSING INDUSTRY TECH STACK:</span>
                      <div className="flex flex-wrap gap-2 mt-1.5">
                        {resumeReviewResult.missingSkills.map((sk, si) => (
                          <span key={si} className="bg-red-500/10 text-red-300 px-2.5 py-1 rounded border border-red-500/20 text-[10px] font-mono">
                            + {sk}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* AI optimized bullet point rewriter showcase */}
                    <div className="p-3.5 bg-slate-900 border border-white/5 rounded-2xl space-y-1.5">
                      <span className="text-[9px] text-emerald-400 font-bold font-mono uppercase block">✨ AI REWRITTEN HIGH-IMPACT IMPACT PHRASE:</span>
                      <p className="text-slate-300 font-mono text-[10.5px] leading-relaxed italic">
                        "{resumeReviewResult.optimizedParagraph}"
                      </p>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(resumeReviewResult.optimizedParagraph);
                          displayNotice('📋 Copied optimized bullet points to clipboard!');
                        }}
                        className="text-[9.5px] text-indigo-400 font-bold uppercase tracking-wider hover:underline block"
                      >
                        Copy Optimized Phrase to clipboard
                      </button>
                    </div>

                    <div className="space-y-2 text-left pt-1">
                      <span className="text-[10px] font-bold text-indigo-400 font-mono uppercase block">🎯 NEXT RESTRUCTURINGS PROPOSED:</span>
                      <ul className="list-disc pl-4 space-y-1 text-slate-400 text-[11px] leading-tight">
                        {resumeReviewResult.suggestions.map((su, sIdx) => (
                          <li key={sIdx}>{su}</li>
                        ))}
                      </ul>
                    </div>

                  </div>

                </div>
              )}

            </div>

            {/* Right side Placement milestones */}
            <div className="lg:col-span-4 p-5 bg-white/[0.02] border border-white/10 rounded-3xl space-y-4">
              <span className="block text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">🎓 NIT MCA PLACEMENT TIMELINE</span>
              
              <div className="space-y-4 text-xs font-sans">
                
                <div className="p-3 bg-indigo-500/5 rounded-xl border border-indigo-500/10 space-y-1">
                  <span className="text-[10px] font-mono text-indigo-400 font-bold">SEMESTER 1 & 2: FOUNDATIONAL</span>
                  <p className="text-slate-300 leading-normal text-[11px]">
                    Master active C++ or Java Data Structures and Algorithms questions. Solve at least 300 problems on standard models.
                  </p>
                </div>

                <div className="p-3 bg-indigo-500/5 rounded-xl border border-indigo-500/10 space-y-1">
                  <span className="text-[10px] font-mono text-indigo-400 font-bold">SEMESTER 3: CORE CSE REVIEW</span>
                  <p className="text-slate-300 leading-normal text-[11px]">
                    Revise major Operating Systems (Processes, Paging), DBMS (Normalization, Transactions) and Code Version Networks.
                  </p>
                </div>

                <div className="p-3 bg-indigo-500/5 rounded-xl border border-indigo-500/10 space-y-1">
                  <span className="text-[10px] font-mono text-indigo-400 font-bold">SEMESTER 4: INTERNSHIP HIRINGS</span>
                  <p className="text-slate-300 leading-normal text-[11px]">
                    Campus hiring drives boot up. Apply with customized project portfolios like RankForge AI mock engines.
                  </p>
                </div>

              </div>
            </div>

          </div>

        </div>
      )}

      {/* SUBTAB 5: ENTRANCE EXAM NEWS & UPDATES HUB */}
      {activeSubTab === 'exam_updates' && (
        <div id="subtab-exam-updates" className="space-y-6 animate-fadeIn text-left">
          
          {/* Header */}
          <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-amber-950/40 via-indigo-950/20 to-black border border-amber-500/10 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl pointer-events-none -mt-32 -mr-32" />
            <div className="relative z-10 max-w-2xl space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[10px] font-black tracking-widest text-amber-400 font-mono uppercase">
                <Clock className="w-3.5 h-3.5" />
                <span>Sync Active: Live official feeds</span>
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">Exam News & Updates Hub</h2>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                Verify application closing dates, revised marking weightages, reservation rules, and Central University counseling timelines. Filter by exam authority or search specific topics with official verified portal references.
              </p>
            </div>
            
            <div className="relative z-10 flex-shrink-0">
              <button 
                onClick={() => displayNotice('Notifications Center Opened: 3 New Updates')}
                className="flex items-center gap-3 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all cursor-pointer group"
              >
                <div className="relative">
                  <Bell className="w-6 h-6 text-slate-300 group-hover:text-white transition-colors" />
                  <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex items-center justify-center rounded-full h-3.5 w-3.5 bg-red-500 border border-black text-[8px] font-bold text-white leading-none">3</span>
                  </span>
                </div>
                <div className="text-left hidden sm:block">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Alerts</span>
                  <span className="block text-xs font-medium text-white">3 New Updates</span>
                </div>
              </button>
            </div>
          </div>

          {/* Active Countdown Deadlines Widget Widget */}
          <div className="space-y-3.5">
            <span className="block text-[10px] font-mono text-slate-400 font-black tracking-widest uppercase">⏰ UPCOMING KEY APPLICATION DEADLINES:</span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'NIMCET Application Correction', date: 'June 14, 2026', days: 8, status: 'critical', statusText: '8 Days Left', ringColor: 'border-red-500/40 text-red-400 bg-red-500/5' },
                { label: 'CUET PG Counseling Submission', date: 'June 28, 2026', days: 22, status: 'important', statusText: '22 Days Left', ringColor: 'border-orange-500/40 text-orange-400 bg-orange-500/5' },
                { label: 'NSP Scholarship Waiver Registration', date: 'July 05, 2026', days: 29, status: 'info', statusText: '29 Days Left', ringColor: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/5' }
              ].map((dl, idx) => (
                <div key={idx} className={`p-4 rounded-2xl border ${dl.ringColor} flex items-center justify-between font-sans shadow-lg`}>
                  <div className="space-y-1">
                    <span className="block text-[9px] font-mono text-slate-400 uppercase font-black">Target Milestone</span>
                    <h4 className="text-xs font-extrabold text-white leading-tight">{dl.label}</h4>
                    <span className="block text-[10px] text-slate-400 font-medium">Closing date: {dl.date}</span>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-2.5 py-1 rounded text-[10px] font-mono font-black uppercase text-center ${
                      dl.status === 'critical' ? 'bg-red-500/20 text-red-300 animate-pulse' : dl.status === 'important' ? 'bg-orange-500/20 text-orange-300' : 'bg-emerald-500/20 text-emerald-300'
                    }`}>
                      {dl.statusText}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Search Board & Target Filtering Control panel */}
          <div className="p-5 rounded-3xl bg-white/5 border border-white/10 space-y-4">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              
              {/* Search input bar */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={examNewsSearch}
                  onChange={(e) => setExamNewsSearch(e.target.value)}
                  placeholder="Search syllabus changes, admit cards, or verification criteria..."
                  className="w-full bg-black/40 border border-white/5 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all font-medium"
                />
              </div>

              {/* Target Selector Buttons */}
              <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
                <span className="text-[10px] text-slate-500 font-bold uppercase mr-1 whitespace-nowrap">Target Exam:</span>
                {['ALL', 'NIMCET', 'CUET PG', 'GATE', 'TANCET'].map((e) => {
                  const isAct = examNewsTargetFilter === e;
                  return (
                    <button
                      key={e}
                      onClick={() => setExamNewsTargetFilter(e)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border cursor-pointer whitespace-nowrap transition-all ${
                        isAct 
                          ? 'bg-amber-500/10 border-amber-500 text-amber-400 font-extrabold' 
                          : 'bg-black/20 border-white/5 hover:border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      {e}
                    </button>
                  );
                })}
              </div>

            </div>

            {/* Category selection tabs strip */}
            <div className="flex items-center gap-2 border-t border-white/5 pt-4 overflow-x-auto pb-1 md:pb-0">
              <span className="text-[10px] text-slate-500 font-bold uppercase mr-1 whitespace-nowrap">Categories:</span>
              {[
                { id: 'ALL', text: 'All Updates' },
                { id: 'live', text: '🔥 LIVE (Last 24 Hours)' },
                { id: 'recent', text: '🆕 RECENT (Last 7 Days)' },
                { id: 'important', text: '⚠ IMPORTANT DEADLINES' },
                { id: 'college', text: '🎓 COLLEGE ADMISSIONS' },
                { id: 'scholarship', text: '💰 SCHOLARSHIPS' },
                { id: 'exam', text: '📚 EXAM NOTIFICATIONS' },
                { id: 'trending', text: '📈 TRENDING' },
                { id: 'archive', text: '📦 ARCHIVE' }
              ].map((c) => {
                const isAct = examNewsCategory === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setExamNewsCategory(c.id)}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-sans font-bold border cursor-pointer whitespace-nowrap transition-all ${
                      isAct 
                        ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400 font-extrabold' 
                        : 'bg-black/30 border-white/5 hover:border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    {c.text}
                  </button>
                );
              })}
            </div>

          </div>

          {/* Results News Grid */}
          {(() => {
            // News items seed database
            const NEWS_DATA = [
              { id: 'n1', exam: 'NIMCET 2026', authority: 'NIT Jamshedpur Office', title: 'Admit Card Direct Release Link Active', update: 'Admit Card links are officially online. Log in with your candidate app token to verify exam venue and reporting timings immediately.', type: 'live', priority: 'critical', verifiedLabel: 'NIT Centralverified ✓', redirectUrl: 'https://nimcet.admissions.nic.in/?utm_source=chatgpt.com', timestamp: '06 Jun 2026 • 2:14 PM', freshness: 'LIVE', tags: ['trending', 'live'] },
              { id: 'n2', exam: 'CUET PG MCA 2026', authority: 'National Testing Agency (NTA)', title: 'Combined Master Answer Key appraisal', update: 'NTA appraising 12 disputed computer awareness answers challenged by candidates. Master correction keys release scheduled shortly.', type: 'live', priority: 'important', verifiedLabel: 'NTA Portalverified ✓', redirectUrl: 'https://nta.ac.in/?utm_source=chatgpt.com', timestamp: '06 Jun 2026 • 11:30 AM', freshness: 'LIVE', tags: ['live', 'exam'] },
              { id: 'n3', exam: 'NIMCET 2026', authority: 'NIT Jamshedpur Secretariat', title: 'Mathematics Section Weighting Enforced', update: 'Verified official syllabus models specify Mathematics retains 600 total Marks. CS weightage stands calibrated perfectly at 200 Marks.', type: 'exam', priority: 'important', verifiedLabel: 'Official Prospectus verified ✓', redirectUrl: 'https://nimcet.admissions.nic.in/?utm_source=chatgpt.com', timestamp: '04 Jun 2026 • 5:45 PM', freshness: 'RECENT', tags: ['recent', 'exam', 'trending'] },
              { id: 'n4', exam: 'GATE CS 2026', authority: 'IIT Guwahati Secretariat', title: 'Multiple Select (MSQ) Practice Modules active', update: 'Official MSQ practice simulators for DBMS joins and OS Semaphores are deployed to test multi-selection accuracy boundaries.', type: 'exam', priority: 'informational', verifiedLabel: 'IIT Guwahati Portal verified ✓', redirectUrl: 'https://gate.iitg.ac.in', timestamp: '01 Jun 2026 • 9:00 AM', freshness: 'NEW', tags: ['exam'] },
              { id: 'n5', exam: 'TANCET MCA 2026', authority: 'Anna University', title: 'Tamil Nadu State Counseling Matrix released', update: 'Direct state web registrations for college allocations begin. Reservation percentages verified under government schemes.', type: 'college', priority: 'important', verifiedLabel: 'Anna University verified ✓', redirectUrl: 'https://www.annauniv.edu/?utm_source=chatgpt.com', timestamp: '05 Jun 2026 • 4:20 PM', freshness: 'NEW', tags: ['college', 'recent'] },
              { id: 'n6', exam: 'NSP Scholarship 2026', authority: 'Ministry of HRD Bureau', title: 'Pragati Girls & Student Fee Waivers Extended', update: 'Central scholarships register active for general MCA and engineering groups of backward clusters. Covers full tuition semester support.', type: 'scholarship', priority: 'informational', verifiedLabel: 'Gov Portal verified ✓', redirectUrl: 'https://scholarships.gov.in/?utm_source=chatgpt.com', timestamp: '03 Jun 2026 • 10:15 AM', freshness: 'RECENT', tags: ['scholarship', 'recent', 'trending'] },
              { id: 'n7', exam: 'CUET PG 2026', authority: 'Delhi University / AMU / JNU Board', title: 'DU and JNU Counselling Calendar online', update: 'Combined post-grad counseling portfolios trigger direct enrollment registrations. Merit list parameters are based purely on NTA scores.', type: 'college', priority: 'important', verifiedLabel: 'DU Admission Portal verified ✓', redirectUrl: 'https://admission.uod.ac.in', timestamp: '20 May 2026 • 2:00 PM', freshness: 'ARCHIVE', tags: ['college', 'archive'] },
              { id: 'n8', exam: 'NIMCET 2026', authority: 'NIT Jamshedpur Secretariat', title: 'Target Correction Bracket ending shortly', update: 'Syllabus preferences, photo uploads and category OBC-NCL certificate validations closing online tonight. No extensions.', type: 'important', priority: 'critical', verifiedLabel: 'NIMCET Committee verified ✓', redirectUrl: 'https://nimcet.admissions.nic.in/?utm_source=chatgpt.com', timestamp: '06 Jun 2026 • 1:00 PM', freshness: 'LIVE', tags: ['important', 'live', 'trending'] },
            ];


            // Perform filtering
            const filtered = NEWS_DATA.filter((item) => {
              // search
              const sQuery = examNewsSearch.toLowerCase();
              const matchesSearch = sQuery === '' || 
                item.exam.toLowerCase().includes(sQuery) ||
                item.authority.toLowerCase().includes(sQuery) ||
                item.title.toLowerCase().includes(sQuery) ||
                item.update.toLowerCase().includes(sQuery);

              // Target Exam filter
              const matchesTarget = examNewsTargetFilter === 'ALL' || 
                item.exam.toUpperCase().includes(examNewsTargetFilter.toUpperCase());

              // Category filter
              const matchesCat = examNewsCategory === 'ALL' || item.tags.includes(examNewsCategory) || item.type === examNewsCategory;

              return matchesSearch && matchesTarget && matchesCat;
            });

            if (filtered.length === 0) {
              return (
                <div className="p-8 text-center bg-white/5 rounded-3xl border border-white/5 space-y-3">
                  <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
                  <p className="text-sm font-bold text-white">No updates matched your filtering criteria</p>
                  <p className="text-xs text-slate-400">Try clearing your search text or choosing 'All Updates' to display all updates.</p>
                </div>
              );
            }

            return (
              <div className="space-y-4">
                {examNewsTargetFilter !== 'ALL' && (
                  <h3 className="text-sm font-bold text-white tracking-widest uppercase mb-4 opacity-70">
                    Recommended For You: <span className="text-emerald-400 font-mono tracking-tight">{examNewsTargetFilter} Updates</span>
                  </h3>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filtered.map((ex) => {
                  const isCrit = ex.priority === 'critical';
                  const isImp = ex.priority === 'important';
                  
                  // Evaluate Freshness
                  let freshnessConfig = { badgeClass: 'bg-slate-500/20 text-slate-300 border-slate-500/30', label: '⚪ ARCHIVE', dot: '' };
                  if (ex.freshness === 'LIVE') freshnessConfig = { badgeClass: 'bg-red-500/10 text-red-400 border-red-500/30 animate-pulse', label: '🔴 LIVE', dot: 'bg-red-500 animate-ping' };
                  else if (ex.freshness === 'NEW') freshnessConfig = { badgeClass: 'bg-orange-500/10 text-orange-400 border-orange-500/30', label: '🟠 NEW', dot: 'bg-orange-500' };
                  else if (ex.freshness === 'RECENT') freshnessConfig = { badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/30', label: '🟡 RECENT', dot: 'bg-amber-500' };
                  
                  return (
                    <div 
                      key={ex.id} 
                      className={`p-5 rounded-2xl border bg-black/45 hover:bg-black/75 transition-all text-left flex flex-col justify-between relative overflow-hidden ${
                        isCrit ? 'border-red-500/30 shadow-md shadow-red-950/10' : isImp ? 'border-orange-500/30' : 'border-white/5'
                      } hover:border-amber-500/35`}
                    >
                      {/* Freshness Indicator */}
                      <div className="space-y-3 relative z-10">
                        <div className="flex justify-between items-start gap-2">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className={`px-2 py-0.5 rounded border text-[9px] font-mono font-black uppercase tracking-wider flex items-center gap-1.5 ${freshnessConfig.badgeClass}`}>
                                {ex.freshness === 'LIVE' && <span className="relative flex h-1.5 w-1.5"><span className={`${freshnessConfig.dot} absolute inline-flex h-full w-full rounded-full opacity-75`}></span><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span></span>}
                                {freshnessConfig.label}
                              </span>
                              <span className="text-[10px] text-slate-400 font-medium">Updated {ex.timestamp.includes('06 Jun') ? '12 minutes ago' : ex.timestamp.includes('05 Jun') ? '5 hours ago' : ex.timestamp.includes('04 Jun') ? '2 days ago' : '8 months ago'}</span>
                            </div>
                            <span className="block text-[8px] font-mono text-slate-500 uppercase font-black tracking-widest">{ex.authority}</span>
                            <span className="block text-xs font-black text-white hover:text-amber-400 transition-colors uppercase tracking-tight">{ex.exam}</span>
                          </div>
                          
                          <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-black uppercase tracking-wider mt-1 ${
                            isCrit 
                              ? 'bg-red-500/20 text-red-300' 
                              : isImp 
                                ? 'bg-orange-500/20 text-orange-300' 
                                : 'hidden'
                          }`}>
                            {ex.priority} Alert
                          </span>
                        </div>

                        <div className="space-y-1">
                          <h4 className="text-[15px] font-extrabold text-white leading-snug">{ex.title}</h4>
                          <p className="text-xs text-slate-400 leading-relaxed font-medium">{ex.update}</p>
                        </div>
                      </div>

                      <div className="pt-4 mt-4 border-t border-white/5 flex flex-col gap-2 justify-between items-start text-[10px]">
                        <div className="flex items-center justify-between w-full">
                          <div className="text-slate-400 flex flex-col gap-0.5 text-left">
                            <span className="text-[9px] uppercase font-bold tracking-wider text-slate-500">Source</span>
                            <span className="text-emerald-400 font-mono flex items-center gap-1 font-semibold bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">
                              <CheckCircle className="w-3 h-3" />
                              <span>Official Source Verified</span>
                            </span>
                          </div>
                          <div className="text-right flex flex-col items-end gap-0.5">
                            <span className="text-[9px] uppercase font-bold tracking-wider text-slate-500">Last Updated</span>
                            <span className="text-slate-300 font-mono font-medium">{ex.timestamp}</span>
                          </div>
                        </div>
                        
                        <a 
                          href={ex.redirectUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="w-full mt-2 text-center py-2 bg-white/5 hover:bg-amber-500/10 text-slate-300 hover:text-amber-400 border border-white/10 hover:border-amber-500/20 rounded-lg flex items-center justify-center gap-1.5 font-sans font-bold transition-all text-xs"
                          onClick={(e) => {
                            displayNotice(`🔗 Routing to verified coordinator site: ${ex.exam}`);
                          }}
                        >
                          <span>View Official Notice</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  );
                })}
                </div>
              </div>
            );
          })()}

        </div>
      )}

      {/* SUBTAB 7: PREMIUM MASTER TUTOR CHAT */}
      {activeSubTab === 'premium_tutor' && (
        <div id="subtab-premium-tutor" className="animate-fadeIn relative z-10 w-full text-left">
          <PremiumTutorChat user={user} />
        </div>
      )}

      {/* SUBTAB 6: SMART TOOLS */}
      {activeSubTab === 'tools' && (
        <div id="subtab-tools" className="animate-fadeIn relative z-10 w-full text-left">
          <SpecializedTools setRecentNotification={() => {}} />
        </div>
      )}

    </div>
  );
}
