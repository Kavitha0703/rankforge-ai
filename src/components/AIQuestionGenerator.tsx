import React, { useState, useEffect } from 'react';
import { Sparkles, PlayCircle, Clock, CheckCircle2, AlertTriangle, ShieldCheck, Bookmark, ArrowRight, Activity, Flame, Award, Lightbulb, Code } from 'lucide-react';
import { DifficultyLevel, QuestionType, ExamType } from '../types';

interface AIQuestion {
  id: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert (AIR 50-100)';
  type: 'MCQ' | 'Multi-Select' | 'Numerical' | 'Assertion-Reason' | 'Match-the-Following' | 'Coding';
  question: string;
  options?: string[];
  columns?: { left: string[]; right: string[] }; // For Match the following
  answer: string | string[] | Record<string, string>;
  explanation: string;
  shortcut: string;
  trap: string;
  codeSnippet?: string;
}

interface AIQuestionGeneratorProps {
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
  addPoints: (p: number) => void;
  setRecentNotification: (msg: string) => void;
}

export default function AIQuestionGenerator({ user, setUser, addPoints, setRecentNotification }: AIQuestionGeneratorProps) {
  // Option controls
  const [selectedExam, setSelectedExam] = useState<ExamType>('NIMCET');
  const [selectedSubject, setSelectedSubject] = useState<'Mathematics' | 'Computer Science' | 'Quantitative Aptitude' | 'General English'>('Mathematics');
  const [selectedTopic, setSelectedTopic] = useState<string>('Probability & Statistics');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'Easy' | 'Medium' | 'Hard' | 'Expert'>('Hard');
  const [selectedType, setSelectedType] = useState<'MCQ' | 'Multi-Select' | 'Numerical' | 'Assertion-Reason' | 'Match-the-Following' | 'Coding'>('MCQ');
  
  // AIR 50-100 Training Mode state
  const [trainingModeActive, setTrainingModeActive] = useState<boolean>(false);
  
  // Generator simulation states
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationLogs, setGenerationLogs] = useState<string[]>([]);
  const [generatedQuestions, setGeneratedQuestions] = useState<AIQuestion[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  
  // Active test answers & evaluation states
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [selectedMultiOptions, setSelectedMultiOptions] = useState<string[]>([]);
  const [typedNumeric, setTypedNumeric] = useState<string>('');
  const [matchAnswers, setMatchAnswers] = useState<Record<string, string>>({});
  const [codingDraft, setCodingDraft] = useState<string>('');
  
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  
  // Speed metrics tracking
  const [timeSpent, setTimeSpent] = useState(0);
  const [speedWarning, setSpeedWarning] = useState<'Fast' | 'Optimal' | 'Danger'>('Optimal');
  const [scoreCount, setScoreCount] = useState(0);
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  // Track timer count for active question
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (generatedQuestions.length > 0 && !isEvaluated && !isGenerating) {
      interval = setInterval(() => {
        setTimeSpent(prev => {
          const next = prev + 1;
          const limit = trainingModeActive ? 45 : 90;
          if (next > limit) {
            setSpeedWarning('Danger');
          } else if (next > limit * 0.6) {
            setSpeedWarning('Optimal');
          } else {
            setSpeedWarning('Fast');
          }
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [generatedQuestions, currentQIndex, isEvaluated, isGenerating, trainingModeActive]);

  // Synchronize options with premium training mode
  const toggleTrainingMode = () => {
    const isNextActive = !trainingModeActive;
    setTrainingModeActive(isNextActive);
    if (isNextActive) {
      setSelectedDifficulty('Expert');
      setRecentNotification('⚔️ AIR 50-100 Elite Training Mode active: Difficulty set to Expert + Speed tracking limits tightened!');
    } else {
      setSelectedDifficulty('Hard');
      setRecentNotification('Training mode returned to standard.');
    }
  };

  // Generate simulated highly-technical questions based on user selections
  const handleInstantiation = () => {
    setIsGenerating(true);
    setGenerationLogs([]);
    setGeneratedQuestions([]);
    setIsEvaluated(false);
    setCurrentQIndex(0);
    
    const logs = [
      "Connecting to RankForge AI Cognitive Pipeline...",
      `Scanning curriculum maps for [${selectedExam}] -> [${selectedSubject}]`,
      `Validating structural rules for [${selectedType}] layout`,
      "Loading 50,000+ national historic PYQ benchmarks...",
      "Injecting exam distractor traps and common silly errors...",
      "Generating high-precision custom mathematical proof...",
      "AI Pipeline successfully instantiated! Loading drill set..."
    ];

    logs.forEach((log, index) => {
      setTimeout(() => {
        setGenerationLogs(prev => [...prev, log]);
        if (index === logs.length - 1) {
          setTimeout(() => {
            triggerQuestionMapping();
            setIsGenerating(false);
          }, 600);
        }
      }, index * 350);
    });
  };

  const triggerQuestionMapping = () => {
    // Generate customized high-fidelity questions
    const difficultyLabel = trainingModeActive ? 'Expert (AIR 50-100)' : selectedDifficulty;

    const dummyQuestionsList: AIQuestion[] = [
      {
        id: `aq-1-${Date.now()}`,
        topic: selectedTopic,
        difficulty: difficultyLabel === 'Expert' ? 'Expert (AIR 50-100)' : difficultyLabel as any,
        type: selectedType,
        question: getQuestionText(1),
        options: getQuestionOptions(1),
        columns: getQuestionColumns(1),
        answer: getQuestionCorrectAnswer(1),
        explanation: getQuestionExplanation(1),
        shortcut: getQuestionShortcut(1),
        trap: getQuestionTrap(1),
        codeSnippet: getQuestionCodeSnippet(1)
      },
      {
        id: `aq-2-${Date.now()}`,
        topic: selectedTopic,
        difficulty: difficultyLabel === 'Expert' ? 'Expert (AIR 50-100)' : difficultyLabel as any,
        type: selectedType,
        question: getQuestionText(2),
        options: getQuestionOptions(2),
        columns: getQuestionColumns(2),
        answer: getQuestionCorrectAnswer(2),
        explanation: getQuestionExplanation(2),
        shortcut: getQuestionShortcut(2),
        trap: getQuestionTrap(2),
        codeSnippet: getQuestionCodeSnippet(2)
      },
      {
        id: `aq-3-${Date.now()}`,
        topic: selectedTopic,
        difficulty: difficultyLabel === 'Expert' ? 'Expert (AIR 50-100)' : difficultyLabel as any,
        type: selectedType,
        question: getQuestionText(3),
        options: getQuestionOptions(3),
        columns: getQuestionColumns(3),
        answer: getQuestionCorrectAnswer(3),
        explanation: getQuestionExplanation(3),
        shortcut: getQuestionShortcut(3),
        trap: getQuestionTrap(3),
        codeSnippet: getQuestionCodeSnippet(3)
      }
    ];

    setGeneratedQuestions(dummyQuestionsList);
    setTimeSpent(0);
    setSpeedWarning('Fast');
  };

  // Hardcoded academic questions to provide incredibly high fidelity depending on type selected
  const getQuestionText = (index: number): string => {
    if (selectedType === 'MCQ') {
      if (selectedSubject === 'Mathematics') {
        return index === 1 
          ? `Let X and Y be two independent finite random variables modeled under Poisson distributions such that P(X = 1) = P(X = 2) and P(Y = 2) = P(Y = 3). Define the probability of their sum being P(X + Y = 1).`
          : `Find the total number of distinct onto functions (surjections) mapping set A of size 5 to set B of size 3.`;
      } else if (selectedSubject === 'Computer Science') {
        return index === 1
          ? `A relational schema R(A, B, C, D, E) is evaluated under functional dependencies: {A -> BC, CD -> E, B -> D, E -> A}. Identify the total count of Candidate Keys for R.`
          : `An operating system uses a paging system with standard 32-bit logical addresses. If the physical page frame size is 4 KB and page table descriptors occupy 4 bytes, compute the size of a single-level page table.`;
      }
      return index === 1 
        ? `Excluding scheduled technical maintenance stoppages, a fiber optic route transfers data at 100 Gbps. Including packet drop buffers, it runs at 80 Gbps. How many seconds does the channel stand idle per minute?`
        : `Nine coins are flipped in sequence. What is the ratio of getting exactly 5 heads to getting at least 2 heads?`;
    }
    
    if (selectedType === 'Multi-Select') {
      return index === 1
        ? `Given the set S = {a, b, c}. Select all options representing reflexive and symmetric binary relations on S.`
        : `Which of the following processes or components reside inside the main memory kernel space during operating system execution?`;
    }

    if (selectedType === 'Numerical') {
      return index === 1
        ? `Compute the remainder when 2^2026 is divided by the prime partition divisor 17.`
        : `What is the total number of non-empty subsets of a power set constructed from a set of size 3?`;
    }

    if (selectedType === 'Assertion-Reason') {
      return index === 1
        ? `Assertion (A): A relation R under candidate key AB is always in 3NF if all attributes are prime.\nReason (R): 3NF allows functional dependencies X -> Y where Y is part of a candidate key.`
        : `Assertion (A): Banker's deadlock avoidance algorithm guarantees high CPU scheduling speed.\nReason (R): Banker's algorithm executes process scheduling recursively in O(1) time.`;
    }

    if (selectedType === 'Match-the-Following') {
      return index === 1
        ? `Match the following Normalization Forms with their critical dependency bounds:`
        : `Match the following operating system locks with their primary hardware mechanism:`;
    }

    if (selectedType === 'Coding') {
      return index === 1
        ? `Write an optimal program in Python/Java/JS to compute the maximum sum of a contiguous subarray in O(N) linear time (Kadane's Algorithm).`
        : `Implement a binary search tree lookup returning true if a given value resides nested within the elements list, in O(log N) average complexity.`;
    }

    return "Sample structural query under RankForge AI dynamic syllabus limits.";
  };

  const getQuestionOptions = (index: number): string[] | undefined => {
    if (selectedType === 'MCQ') {
      if (selectedSubject === 'Mathematics') {
        return index === 1 
          ? ['5e^-5', '5e^-6', '6e^-5', 'e^-5']
          : ['150', '240', '120', '180'];
      } else if (selectedSubject === 'Computer Science') {
        return index === 1
          ? ['2 keys', '3 keys', '4 keys', '5 keys']
          : ['4 MB', '4 KB', '2 MB', '1 MB'];
      }
      return index === 1
        ? ['12 seconds', '10 seconds', '15 seconds', '8 seconds']
        : ['126/502', '126/512', '126/511', '126/495'];
    }

    if (selectedType === 'Multi-Select') {
      return index === 1
        ? [
            "R1 = {(a,a), (b,b), (c,c), (a,b), (b,a)}",
            "R2 = {(a,a), (b,b), (c,c)}",
            "R3 = {(a,b), (b,a)}",
            "R4 = {(a,a), (b,b), (c,c), (a,c)}"
          ]
        : [
            "Process Control Block (PCB)",
            "System Page Table Map",
            "Slack User Interface Assets",
            "Keyboard Event Buffers"
          ];
    }

    if (selectedType === 'Assertion-Reason') {
      return [
        "Both (A) and (R) are true and (R) is the correct explanation of (A)",
        "Both (A) and (R) are true but (R) is NOT the correct explanation of (A)",
        "(A) is true but (R) is false",
        "Both (A) and (R) are false"
      ];
    }

    return undefined;
  };

  const getQuestionColumns = (index: number) => {
    if (selectedType === 'Match-the-Following') {
      return index === 1
        ? {
            left: ['P. 2NF', 'Q. 3NF', 'R. BCNF', 'S. 4NF'],
            right: ['1. No Multivalued FDs', '2. No Partial dependencies', '3. Determinant SuperKey', '4. No Transitive FDs']
          }
        : {
            left: ['P. Spinlock', 'Q. Semaphore', 'R. Monitors', 'S. Peterson\'s'],
            right: ['1. High-level language construct', '2. Software solutions for 2 processes', '3. Busy waiting mechanism', '4. Integer status counters']
          };
    }
    return undefined;
  };

  const getQuestionCorrectAnswer = (index: number): any => {
    if (selectedType === 'MCQ') {
      if (selectedSubject === 'Mathematics') {
        return index === 1 ? '5e^-5' : '150';
      } else if (selectedSubject === 'Computer Science') {
        return index === 1 ? '4 keys' : '4 MB';
      }
      return index === 1 ? '12 seconds' : '126/502';
    }

    if (selectedType === 'Multi-Select') {
      return index === 1
        ? ["R1 = {(a,a), (b,b), (c,c), (a,b), (b,a)}", "R2 = {(a,a), (b,b), (c,c)}"]
        : ["Process Control Block (PCB)", "System Page Table Map", "Keyboard Event Buffers"];
    }

    if (selectedType === 'Numerical') {
      return index === 1 ? '4' : '255';
    }

    if (selectedType === 'Assertion-Reason') {
      return index === 1
        ? "Both (A) and (R) are true and (R) is the correct explanation of (A)"
        : "Both (A) and (R) are false";
    }

    if (selectedType === 'Match-the-Following') {
      return index === 1
        ? { 'P': '2', 'Q': '4', 'R': '3', 'S': '1' }
        : { 'P': '3', 'Q': '4', 'R': '1', 'S': '2' };
    }

    return "Kadane";
  };

  const getQuestionExplanation = (index: number): string => {
    return `Deep academic breakdown initialized. For this rigorous concept, the core formulation follows standard axioms. The mathematical model proves that proper elimination of disjoint boundaries ensures an elegant solutions timeline. By testing boundary criteria under high weightage conditions, we confirm exact validation results.`;
  };

  const getQuestionShortcut = (index: number): string => {
    return "Skip deep matrix transformations and evaluate the boundary prime characteristics. Under symmetric structures, reflexive determinants converge in O(1) time.";
  };

  const getQuestionTrap = (index: number): string => {
    return "The examiner often pads options with un-reflexive subsets. Don't throw away marks by forgetting the diagonal constraints.";
  };

  const getQuestionCodeSnippet = (index: number): string | undefined => {
    if (selectedType === 'Coding') {
      return index === 1
        ? `def maxSubArray(nums):\n    # Write Python implementation here\n    # Optimal complexity: O(N)\n    pass`
        : `function searchBST(root, val) {\n    // Write JavaScript search code here\n    // Return true or false\n}`;
    }
    return undefined;
  };

  // Evaluation logic
  const handleAnswerSubmit = () => {
    const activeQ = generatedQuestions[currentQIndex];
    let correct = false;

    if (activeQ.type === 'MCQ' || activeQ.type === 'Assertion-Reason') {
      correct = selectedOption === activeQ.answer;
    } else if (activeQ.type === 'Multi-Select') {
      const actualAns = activeQ.answer as string[];
      correct = selectedMultiOptions.length === actualAns.length && 
                selectedMultiOptions.every(opt => actualAns.includes(opt));
    } else if (activeQ.type === 'Numerical') {
      correct = typedNumeric.trim() === activeQ.answer;
    } else if (activeQ.type === 'Match-the-Following') {
      const ansMap = activeQ.answer as Record<string, string>;
      correct = Object.keys(ansMap).every(key => matchAnswers[key] === ansMap[key]);
    } else if (activeQ.type === 'Coding') {
      correct = codingDraft.length > 25; // Simulate coding pass
    }

    setIsCorrect(correct);
    setIsEvaluated(true);

    if (correct) {
      setScoreCount(s => s + 1);
      const pointsGranted = trainingModeActive ? 40 : 20;
      addPoints(pointsGranted);
      
      let speedText = speedWarning === 'Fast' ? 'AIR 10% Fast Fire! 🔥' : speedWarning === 'Optimal' ? 'Optimal Pace' : 'Pace Slow';
      setRecentNotification(`✅ Correct answer! Earned +${pointsGranted} RankPoints. Speed rating: ${speedText}`);
    } else {
      setRecentNotification("❌ Incorrect response. Study the Aris explanation below to secure your concepts.");
    }
  };

  const handleNextQuestion = () => {
    if (currentQIndex < generatedQuestions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setIsEvaluated(false);
      setSelectedOption('');
      setSelectedMultiOptions([]);
      setTypedNumeric('');
      setMatchAnswers({});
      setCodingDraft('');
      setTimeSpent(0);
      setSpeedWarning('Fast');
    } else {
      // Conclude drill set
      setRecentNotification(`🏆 Drill set completed! Scored ${scoreCount}/${generatedQuestions.length}!`);
      setGeneratedQuestions([]);
      setScoreCount(0);
    }
  };

  const toggleBookmarkQuestion = (id: string) => {
    setBookmarks(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      setRecentNotification(prev.includes(id) ? "Removed from revision board" : "⭐ Injected into active revision card board.");
      return next;
    });
  };

  const activeQuestion = generatedQuestions[currentQIndex];

  return (
    <div className="space-y-6">
      
      {/* Tab Header layout */}
      <div className="p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 py-1 px-2.5 rounded-md uppercase tracking-widest font-mono">
            MASSSIVE COGNITIVE PIPELINE V2.5
          </span>
          <h2 className="text-xl font-black text-white mt-1.5 font-sans">AI Study Material & Question Aggregation Engine</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Instead of manual entries, dynamically parameterize high-fidelity syllabus questions across multiple formats.
          </p>
        </div>

        {/* AIR 50-100 Premium Training Switch */}
        <button
          onClick={toggleTrainingMode}
          className={`px-5 py-3 rounded-2xl border transition-all flex items-center gap-3 shrink-0 ${
            trainingModeActive 
              ? 'bg-gradient-to-r from-[#ef4444]/20 to-[#f59e0b]/20 border-red-500/40 text-rose-400 shadow-[0_0_20px_rgba(239,68,68,0.25)]' 
              : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-400'
          }`}
        >
          <div className="relative">
            <Flame className={`w-5 h-5 ${trainingModeActive ? 'text-rose-500 animate-pulse' : 'text-slate-500'}`} />
            {trainingModeActive && <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full animate-ping" />}
          </div>
          <div className="text-left text-xs">
            <span className="block font-black uppercase tracking-wider font-mono">AIR 50-100 Training Mode</span>
            <span className="text-[10px] text-slate-400">
              {trainingModeActive ? 'Expert-Tier + Speed Limit Active' : 'Enhance difficulty standard'}
            </span>
          </div>
        </button>
      </div>

      {/* Simulator Generation Panel */}
      {generatedQuestions.length === 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Form settings */}
          <div className="lg:col-span-2 p-6 bg-white/5 border border-white/10 rounded-3xl space-y-5 text-left text-xs">
            <h4 className="text-sm font-black text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-400" />
              <span>Configure Generation Metrics</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Target Exam */}
              <div className="space-y-1.5">
                <label className="text-slate-400 font-bold">Target Syllabus Exam</label>
                <select
                  value={selectedExam}
                  onChange={(e) => setSelectedExam(e.target.value as ExamType)}
                  className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white outline-none"
                >
                  <option value="NIMCET">NIMCET (MCA)</option>
                  <option value="CUET PG MCA">CUET PG MCA (NTA)</option>
                  <option value="TANCET MCA">TANCET MCA (Anna Univ)</option>
                  <option value="CAT">CAT (IIM Management)</option>
                  <option value="GATE CS">GATE CS (IIT level)</option>
                  <option value="Placements">Placements Coding</option>
                </select>
              </div>

              {/* Subject */}
              <div className="space-y-1.5">
                <label className="text-slate-400 font-bold">Academic Subject Domain</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value as any)}
                  className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white outline-none"
                >
                  <option value="Mathematics">Mathematics</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Quantitative Aptitude">Quantitative Aptitude</option>
                  <option value="General English">General English</option>
                </select>
              </div>

              {/* Topic */}
              <div className="space-y-1.5">
                <label className="text-slate-400 font-bold">Chapter Target Unit</label>
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white outline-none"
                >
                  <option value="Probability & Statistics">Probability & Statistics</option>
                  <option value="Set Theory">Set Theory</option>
                  <option value="DBMS Normalization">DBMS Normalization theory</option>
                  <option value="Operating Systems">Operating Systems CPU</option>
                  <option value="Arithmetical Progressions">Arithmetical Progressions (QA)</option>
                </select>
              </div>

              {/* Question Format */}
              <div className="space-y-1.5">
                <label className="text-slate-400 font-bold">Interactive Layout Format</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value as any)}
                  className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white outline-none"
                >
                  <option value="MCQ">MCQ (4 Options Single Correct)</option>
                  <option value="Multi-Select">Multi Select (1 or more correct)</option>
                  <option value="Numerical">Numerical (Direct Integer Output)</option>
                  <option value="Assertion-Reason">Assertion Reason logically duals</option>
                  <option value="Match-the-Following">Match column A with column B</option>
                  <option value="Coding">Coding snippet sandbox challenges</option>
                </select>
              </div>

              {/* Difficulty Level */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-slate-400 font-bold">Cognitive Difficulty Tier</label>
                {trainingModeActive ? (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 text-rose-400 rounded-xl font-bold flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Expert (AIR 50-100 Elite Rank Mode locked)</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-4 gap-2">
                    {['Easy', 'Medium', 'Hard', 'Expert'].map(l => (
                      <button
                        key={l}
                        onClick={() => setSelectedDifficulty(l as any)}
                        className={`p-2 rounded-xl text-[10px] font-bold border capitalize transition-all ${
                          selectedDifficulty === l 
                            ? 'bg-indigo-600 text-white border-indigo-500 font-extrabold' 
                            : 'bg-black/30 border-white/5 hover:bg-white/5 text-slate-400'
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleInstantiation}
              disabled={isGenerating}
              className="w-full mt-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-extrabold rounded-2xl flex items-center justify-center gap-2 text-xs shadow-md shadow-indigo-500/10 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-emerald-300 animate-spin" />
              <span>Instantiate AI Syllabus Aggregation Engine (3 Questions)</span>
            </button>
          </div>

          {/* AI Logs or dynamic status column */}
          <div className="p-6 bg-black/40 border border-white/5 rounded-3xl flex flex-col justify-between text-left text-xs h-full relative overflow-hidden">
            <div className="space-y-4">
              <span className="text-[10px] font-black uppercase text-slate-500 font-mono tracking-widest block">Pipeline Diagnostics</span>
              
              {isGenerating ? (
                <div className="space-y-2 font-mono text-[10px] text-indigo-300">
                  {generationLogs.map((log, lIdx) => (
                    <div key={lIdx} className="flex gap-2 items-center">
                      <span className="text-indigo-500">▶</span>
                      <p>{log}</p>
                    </div>
                  ))}
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden mt-4">
                    <div className="bg-indigo-500 h-full w-[45%] animate-pulse" />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex gap-3.5 items-start">
                    <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-xl shrink-0">
                      <Bookmark className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">Dynamic Synthesis Benefits</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                        Rather than manual memory limits, generation pulls actual parameter templates from academic standards, ensuring pristine exam alignment.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3.5 items-start">
                    <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded-xl shrink-0">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">AIR 50 Target Estimator</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                        Under Training mode, the system monitors your speed. Solving questions correctly below 45 seconds adds exclusive sub-rank marks!
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 border-t border-white/5 pt-4 text-[10px] text-slate-500 font-mono">
              <span>Database state: <strong>Verified OK</strong></span>
              <span className="block mt-0.5">Active connections: <strong>NIMCET // CUET PG // GATE CS</strong></span>
            </div>
          </div>
        </div>
      ) : (
        
        /* Active Test Question UI Panel */
        <div className="space-y-6">
          <div className="p-5 bg-[#0d0e1b]/90 border border-white/10 rounded-3xl shadow-xl space-y-4 text-left">
            
            {/* Action tracker header */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  Question {currentQIndex + 1} of {generatedQuestions.length}
                </span>
                <span className="text-[9px] bg-slate-500/20 text-slate-300 px-2 py-0.5 rounded uppercase tracking-wider font-bold">
                  {activeQuestion.difficulty}
                </span>
              </div>

              {/* Speed Monitor widget */}
              <div className="flex items-center gap-3 font-mono text-[11px]">
                <div className={`p-1.5 px-3 rounded-lg border flex items-center gap-2 ${
                  speedWarning === 'Danger' ? 'bg-red-500/10 border-red-500/20 text-red-400 animate-pulse' :
                  speedWarning === 'Optimal' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                  'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                }`}>
                  <Clock className="w-3.5 h-3.5" />
                  <span>Timespent: <strong>{timeSpent}s</strong></span>
                  <span className="text-[9px] text-slate-400 bg-black/30 px-1 py-0.5 rounded">{speedWarning} Pace</span>
                </div>

                <button 
                  onClick={() => toggleBookmarkQuestion(activeQuestion.id)}
                  className={`p-1.5 rounded-lg border ${
                    bookmarks.includes(activeQuestion.id) ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40' : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
                  }`}
                  title="Bookmark question"
                >
                  ⭐
                </button>
              </div>
            </div>

            {/* Question Text */}
            <div className="space-y-4">
              <p className="text-xs text-white font-bold font-sans leading-relaxed">
                {activeQuestion.question}
              </p>

              {/* Optional Code Snippet view if coding type */}
              {activeQuestion.codeSnippet && (
                <div className="p-3 bg-black/40 border border-white/5 rounded-xl text-xs font-mono text-emerald-400">
                  <pre>{activeQuestion.codeSnippet}</pre>
                </div>
              )}

              {/* MCQs options */}
              {(activeQuestion.type === 'MCQ' || activeQuestion.type === 'Assertion-Reason') && activeQuestion.options && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  {activeQuestion.options.map((opt, oIdx) => {
                    const isSelected = selectedOption === opt;
                    const isAnsCorrect = opt === activeQuestion.answer;

                    return (
                      <button
                        key={oIdx}
                        disabled={isEvaluated}
                        onClick={() => setSelectedOption(opt)}
                        className={`text-left p-3.5 rounded-2xl border text-xs font-sans transition-all flex items-start gap-3 ${
                          isEvaluated 
                            ? isAnsCorrect 
                              ? 'bg-emerald-950/20 border-emerald-500/50 text-emerald-300'
                              : isSelected
                                ? 'bg-red-950/20 border-red-500/50 text-red-300'
                                : 'bg-white/5 border-white/5 text-slate-400'
                            : isSelected 
                              ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-inner font-semibold' 
                              : 'bg-white/5 border-white/5 hover:border-white/10 text-slate-300'
                        }`}
                      >
                        <span className={`w-5 h-5 rounded-full border text-[9px] flex items-center justify-center shrink-0 ${
                          isSelected ? 'border-indigo-400 text-indigo-400 bg-indigo-500/10' : 'border-slate-500 text-slate-400'
                        }`}>
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Multi Select Option */}
              {activeQuestion.type === 'Multi-Select' && activeQuestion.options && (
                <div className="space-y-2.5 pt-2">
                  <span className="block text-[10px] text-indigo-300 uppercase tracking-wider font-mono">Multiple Select (Choose more than 1 option):</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {activeQuestion.options.map((opt, oIdx) => {
                      const isSelected = selectedMultiOptions.includes(opt);
                      const isAnsCorrect = (activeQuestion.answer as string[]).includes(opt);

                      return (
                        <button
                          key={oIdx}
                          disabled={isEvaluated}
                          onClick={() => {
                            setSelectedMultiOptions(prev => 
                              isSelected ? prev.filter(x => x !== opt) : [...prev, opt]
                            );
                          }}
                          className={`text-left p-3.5 rounded-2xl border text-xs font-sans transition-all flex items-start gap-3 ${
                            isEvaluated 
                              ? isAnsCorrect 
                                ? 'bg-emerald-950/20 border-emerald-500/50 text-emerald-300'
                                : isSelected
                                  ? 'bg-red-950/20 border-red-500/50 text-red-300'
                                  : 'bg-white/5 border-white/5 text-slate-400'
                              : isSelected 
                                ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-inner font-semibold' 
                                : 'bg-white/5 border-white/5 hover:border-white/10 text-slate-300'
                          }`}
                        >
                          <span className={`w-4 h-4 border rounded text-[9px] flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-indigo-500 text-white border-indigo-500' : 'border-slate-500 text-slate-400'
                          }`}>
                            {isSelected ? '✓' : ''}
                          </span>
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Numerical Options */}
              {activeQuestion.type === 'Numerical' && (
                <div className="p-4 bg-black/30 border border-white/5 rounded-2xl space-y-3 max-w-sm">
                  <span className="block text-[10px] text-slate-400 font-mono">INTEGER ANSWER INPUT:</span>
                  <input
                    type="text"
                    disabled={isEvaluated}
                    value={typedNumeric}
                    onChange={(e) => setTypedNumeric(e.target.value)}
                    placeholder="Enter final derived digit value"
                    className="w-full p-2.5 bg-black/50 border border-white/10 rounded-xl text-white font-mono text-center outline-none text-xs"
                  />
                  {isEvaluated && (
                    <p className="text-[11px] text-slate-400 font-mono text-center">
                      Correct Answer: <strong className="text-emerald-400 font-bold">{activeQuestion.answer as string}</strong>
                    </p>
                  )}
                </div>
              )}

              {/* Match column options */}
              {activeQuestion.type === 'Match-the-Following' && activeQuestion.columns && (
                <div className="p-4 bg-black/40 border border-white/10 rounded-3xl space-y-4">
                  <span className="block text-[10px] text-indigo-300 font-mono uppercase tracking-wider">Match-the-Following Columns:</span>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                    <div className="space-y-1.5 p-3 bg-white/5 rounded-xl">
                      <span className="block text-[9px] text-slate-400 uppercase font-black mb-1.5">Column Left</span>
                      {activeQuestion.columns.left.map((l, idx) => (
                        <div key={idx} className="p-1 text-white">{l}</div>
                      ))}
                    </div>
                    <div className="space-y-1.5 p-3 bg-white/5 rounded-xl">
                      <span className="block text-[9px] text-slate-400 uppercase font-black mb-1.5">Column Right</span>
                      {activeQuestion.columns.right.map((r, idx) => (
                        <div key={idx} className="p-1 text-white">{r}</div>
                      ))}
                    </div>
                  </div>

                  {/* Matrix Selector */}
                  <div className="space-y-2 pt-2 border-t border-white/5 text-[11px] font-sans">
                    <span className="block font-bold text-slate-400">Map Pairs Selection:</span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {['P', 'Q', 'R', 'S'].map(char => (
                        <div key={char} className="flex items-center gap-1.5 bg-black/20 p-2 rounded-xl border border-white/5 justify-between">
                          <span className="font-bold text-white font-mono">{char} ➔</span>
                          <select
                            disabled={isEvaluated}
                            value={matchAnswers[char] || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              setMatchAnswers(prev => ({ ...prev, [char]: val }));
                            }}
                            className="bg-black/50 text-white outline-none rounded p-1 border border-white/10 text-[10px] font-mono"
                          >
                            <option value="">Choose</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                          </select>
                        </div>
                      ))}
                    </div>

                    {isEvaluated && (
                      <div className="p-2 bg-black/40 rounded border border-white/5 text-[10px] font-mono select-none">
                        Correct Mapping: {Object.entries(activeQuestion.answer as Record<string, string>).map(([k, v]) => `${k}➔${v}`).join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Coding draft challenge */}
              {activeQuestion.type === 'Coding' && (
                <div className="space-y-2.5 pt-2 font-sans">
                  <span className="block text-[10px] text-teal-400 font-mono">✏️ IMPLEMENT KADANE OR BST SEARCH (25+ characters minimum required):</span>
                  <textarea
                    disabled={isEvaluated}
                    value={codingDraft}
                    onChange={(e) => setCodingDraft(e.target.value)}
                    placeholder="// Write optimal solutions logic..."
                    rows={6}
                    className="w-full bg-black/70 border border-white/10 rounded-2xl p-4 text-xs font-mono text-white outline-none focus:border-indigo-500"
                  />
                </div>
              )}

              {/* Submit panel or feedback */}
              <div className="flex justify-between items-center gap-4 pt-4 border-t border-white/5 select-none font-sans">
                {!isEvaluated ? (
                  <button
                    onClick={handleAnswerSubmit}
                    className="py-2.5 px-6 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-black font-extrabold rounded-xl text-xs transition-opacity shadow-md cursor-pointer"
                  >
                    Assess Selected Answer
                  </button>
                ) : (
                  <div className="flex gap-2 items-center">
                    <span className="text-xs font-bold text-white">
                      {isCorrect ? '🎉 Correct Answer!' : '💡 Incorrect response'}
                    </span>
                    <button
                      onClick={handleNextQuestion}
                      className="py-2.5 px-6 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold rounded-xl text-xs transition-opacity cursor-pointer flex items-center gap-2"
                    >
                      <span>{currentQIndex === generatedQuestions.length - 1 ? 'Conclude Drill' : 'Next Question'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              {/* Advanced Diagnostic view by Aris */}
              {isEvaluated && (
                <div className="p-5 bg-black/50 border border-white/5 rounded-3xl space-y-3.5 mt-4 transition-all animate-fadeIn">
                  <div className="flex gap-2.5 items-center pb-2 border-b border-white/5">
                    <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
                    <span className="text-xs font-black text-white uppercase tracking-wider font-mono">Aris Explanations Engine Guidance</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    
                    {/* Derivation explanations */}
                    <div className="space-y-1 bg-white/[0.01] p-3 rounded-xl border border-white/5">
                      <span className="text-[10px] text-teal-400 uppercase font-black block">Theoretical Derivations</span>
                      <p className="text-slate-300 leading-relaxed font-sans">{activeQuestion.explanation}</p>
                    </div>

                    <div className="space-y-4">
                      {/* Shortcut analysis */}
                      <div className="space-y-1 bg-emerald-950/10 p-3 rounded-xl border border-emerald-500/20 text-emerald-300">
                        <span className="text-[10px] text-emerald-400 uppercase font-black block flex items-center gap-1">
                          <Lightbulb className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>Senior Rank Shortcut Method</span>
                        </span>
                        <p className="font-mono text-[11px] leading-relaxed">{activeQuestion.shortcut}</p>
                      </div>

                      {/* Silly Examiner trap warning */}
                      <div className="space-y-1 bg-red-950/10 p-3 rounded-xl border border-red-500/20 text-red-300">
                        <span className="text-[10px] text-rose-400 uppercase font-black block flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                          <span>Examiner Trap Warnings</span>
                        </span>
                        <p className="font-mono text-[11px] leading-relaxed">{activeQuestion.trap}</p>
                      </div>
                    </div>

                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
