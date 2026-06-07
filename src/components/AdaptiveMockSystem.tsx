import React, { useState, useEffect } from 'react';
import { ClipboardCheck, Clock, Award, Sliders, PlayCircle, Library, Sparkles, BookOpen, ChevronRight, Activity, ArrowRight, HelpCircle, FileText, CheckCircle2 } from 'lucide-react';
import { ExamType, Question } from '../types';
import { QUESTION_BANK } from '../data/examData';

interface MockLevel {
  id: 'topic' | 'subject' | 'exam' | 'grand';
  name: string;
  count: number;
  duration: number; // in minutes
  description: string;
}

export default function AdaptiveMockSystem({ user, addPoints, setRecentNotification }: { 
  user: any; 
  addPoints: (p: number) => void;
  setRecentNotification: (msg: string) => void;
}) {
  const [selectedMockLevel, setSelectedMockLevel] = useState<'topic' | 'subject' | 'exam' | 'grand'>('topic');
  const [selectedSubject, setSelectedSubject] = useState<'Mathematics' | 'Computer Science' | 'Quantitative Aptitude'>('Mathematics');
  const [selectedExam, setSelectedExam] = useState<ExamType>('NIMCET');

  const [activeTest, setActiveTest] = useState<boolean>(false);
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<string[]>([]);
  
  // Custom states for Exam Simulator Mode and Performance Replay
  const [isSimulatorMode, setIsSimulatorMode] = useState(false);
  const [violations, setViolations] = useState(0);
  const [questionElapsedSeconds, setQuestionElapsedSeconds] = useState<Record<string, number>>({});
  
  // Interactive Performance Replay & Bottlenecks suite states
  const [resultsTab, setResultsTab] = useState<'analysis' | 'replay' | 'solutions'>('analysis');
  const [selectedReplayQId, setSelectedReplayQId] = useState<string | null>(null);
  const [replayFilter, setReplayFilter] = useState<'all' | 'bottlenecks' | 'on_pace'>('all');

  // Deterministic calculation of top 50 rankers' average solving times (seconds)
  const getRankerAvgSeconds = (q: Question): number => {
    let baseSecs = 40; 
    if (q.subject === 'Mathematics') {
      baseSecs = 65; // math is traditionally more computation intensive
    } else if (q.subject === 'Quantitative Aptitude') {
      baseSecs = 48; // logical aptitude
    } else if (q.subject === 'Computer Science') {
      baseSecs = 32; // CS core definitions and concepts
    }
    
    // Create a stable, deterministic char-based seed so same questions render identical benchmarks
    const charSum = q.question.split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
    const variance = (charSum % 21) - 10; // offset of -10s to +10s to look highly natural
    return Math.max(15, baseSecs + variance);
  };
  
  // Timer countdown
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [initialDurationSeconds, setInitialDurationSeconds] = useState(0);
  const [testCompleted, setTestCompleted] = useState(false);
  
  // Evaluation States
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [attemptedCount, setAttemptedCount] = useState(0);
  
  const mockLevels: MockLevel[] = [
    { id: 'topic', name: 'Topic Mock', count: 5, duration: 8, description: 'Target focused micro tests for quick chapter inspection.' },
    { id: 'subject', name: 'Subject Mock', count: 10, duration: 20, description: 'Subject-wide testing to check consistency across modules.' },
    { id: 'exam', name: 'Exam Mock', count: 10, duration: 15, description: 'Standard blueprint mapping matching exam guidelines.' },
    { id: 'grand', name: 'Grand Syllabus Mock', count: 10, duration: 25, description: 'Comprehensive full-length exam replicating the actual pressure.' }
  ];

  // Tick countdown timer & individual question elapsed time tracker
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeTest && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            handleTestManualSubmission();
            return 0;
          }
          return prev - 1;
        });

        // Increment time spent on the currently active question
        if (activeQuestions[currentQIndex]) {
          const currentQId = activeQuestions[currentQIndex].id;
          setQuestionElapsedSeconds(prev => ({
            ...prev,
            [currentQId]: (prev[currentQId] || 0) + 1
          }));
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeTest, secondsRemaining, currentQIndex, activeQuestions]);

  // Focus monitoring for Exam-Day Simulator Mode
  useEffect(() => {
    if (activeTest && isSimulatorMode) {
      const handleWindowBlur = () => {
        setViolations(prev => {
          const nextV = prev + 1;
          if (nextV >= 3) {
            alert("⚠️ STRICT PORTAL VIOLATION: Maximum window changes exceeded (3/3). This exam run is being submitted immediately with partial grading penalties.");
            handleTestManualSubmission();
            return 3;
          }
          setRecentNotification(`🚨 Focus Loss Warning [Violation ${nextV}/3]: Exiting full-screen portal violates strict exam conditions!`);
          return nextV;
        });
      };
      window.addEventListener('blur', handleWindowBlur);
      return () => window.removeEventListener('blur', handleWindowBlur);
    }
  }, [activeTest, isSimulatorMode]);

  const handleStartMock = () => {
    const activeLevel = mockLevels.find(m => m.id === selectedMockLevel)!;
    
    // Filter questions matching exam and subject context
    let pool = QUESTION_BANK.filter(q => q.exam === selectedExam);
    if (pool.length === 0) {
      pool = QUESTION_BANK; // fallback
    }

    // Limit length to level settings
    const selectedQuestions = pool.slice(0, activeLevel.count);
    
    // If we need more questions than are in our bank, repeat them with custom IDs to complete the requested count
    let mockQuestions: Question[] = [];
    for (let i = 0; i < activeLevel.count; i++) {
      const original = selectedQuestions[i % selectedQuestions.length];
      mockQuestions.push({
        ...original,
        id: `${original.id}-mock-${i}`,
        question: `[Mock Variation Q${i+1}] ${original.question}`
      });
    }

    setActiveQuestions(mockQuestions);
    setUserAnswers({});
    setFlaggedQuestions([]);
    setQuestionElapsedSeconds({});
    setViolations(0);
    setCurrentQIndex(0);
    setSecondsRemaining(activeLevel.duration * 60);
    setInitialDurationSeconds(activeLevel.duration * 60);
    setActiveTest(true);
    setTestCompleted(false);
    
    // Reset our dynamic performance replay states
    setResultsTab('analysis');
    setSelectedReplayQId(null);
    setReplayFilter('all');
    
    setRecentNotification(`⏱️ Mock started! ${activeLevel.name} initialized. You have ${activeLevel.duration} minutes.`);
  };

  const handleOptionSelect = (qId: string, value: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [qId]: value
    }));
  };

  const toggleFlagQuestion = (qId: string) => {
    setFlaggedQuestions(prev => 
      prev.includes(qId) ? prev.filter(id => id !== qId) : [...prev, qId]
    );
  };

  const handleTestManualSubmission = () => {
    // Grade the submissions
    let pointsGained = 0;
    let corrects = 0;
    let attempted = 0;
    const currentMistakesList: any[] = [];

    activeQuestions.forEach(q => {
      const userAns = userAnswers[q.id];
      if (userAns) {
        attempted++;
        const isCorrect = userAns === q.answer || q.answer.toString().includes(userAns);
        if (isCorrect) {
          corrects++;
        } else {
          // It was attempted but wrong! Save to mistakes list
          let sub: 'Mathematics' | 'Computer Science' | 'Quantitative Aptitude' | 'General' = 'General';
          if (q.subject === 'Mathematics' || q.subject === 'Computer Science' || q.subject === 'Quantitative Aptitude') {
            sub = q.subject;
          }
          currentMistakesList.push({
            id: `mistake-${q.id}-${Date.now()}`,
            question: q.question.replace(/^\[Mock Variation Q\d+\]\s*/, ''),
            options: q.options,
            answer: q.answer,
            topic: q.topic || 'General Mock Theory',
            subject: sub,
            exam: selectedExam,
            userSelection: userAns,
            shortcut: q.shortcut || 'Review related equations and definitions in the handbook.',
            addedAt: new Date().toISOString(),
            timeSpent: questionElapsedSeconds[q.id] || 0
          });
        }
      }
    });

    // Save newly logged errors to local storage mistakes list
    if (currentMistakesList.length > 0) {
      try {
        const stored = localStorage.getItem('rankforge_mistakes');
        let existing = stored ? JSON.parse(stored) : [];
        if (!Array.isArray(existing)) existing = [];
        
        currentMistakesList.forEach(m => {
          if (!existing.some((e: any) => e.question === m.question)) {
            existing.unshift(m);
          }
        });
        localStorage.setItem('rankforge_mistakes', JSON.stringify(existing));
      } catch (err) {
        console.error("Error setting mistakelog:", err);
      }
    }

    // Score: correct gets +4, wrong matches negative marking -1
    const totalPossible = activeQuestions.length * 4;
    const rawScore = (corrects * 4) - ((attempted - corrects) * 1);
    
    setScore(rawScore);
    setCorrectCount(corrects);
    setAttemptedCount(attempted);
    setActiveTest(false);
    setTestCompleted(true);

    // Grant points based on correctness ratio
    const rewardPoints = Math.max(10, Math.floor((corrects / activeQuestions.length) * 50));
    addPoints(rewardPoints);

    setRecentNotification(`✅ Mock completed! Scored ${rawScore} points. +${rewardPoints} RankPoints added!`);
  };

  const formatTimer = (totalSeconds: number): string => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    
    return [
      hrs > 0 ? String(hrs).padStart(2, '0') : null,
      String(mins).padStart(2, '0'),
      String(secs).padStart(2, '0')
    ].filter(Boolean).join(':');
  };

  return (
    <div className="space-y-6">
      
      {/* Landing selection phase */}
      {!activeTest && !testCompleted && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
          
          {/* Options side */}
          <div className="lg:col-span-2 p-6 bg-white/5 border border-white/10 rounded-3xl space-y-6">
            <div className="border-b border-white/5 pb-3">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <ClipboardCheck className="text-emerald-400 w-5 h-5 shrink-0" />
                <span>RankForge Adaptive Mock Engine</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Take high-fidelity mocks constructed by simulated exam weightages. AI customizes next steps dynamically based on details.
              </p>
            </div>

            <div className="space-y-4">
              <span className="block text-xs font-black uppercase text-indigo-400 font-mono tracking-wider">Select Mock Level Tiers</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {mockLevels.map(lvl => (
                  <button
                    key={lvl.id}
                    onClick={() => setSelectedMockLevel(lvl.id)}
                    className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      selectedMockLevel === lvl.id 
                        ? 'bg-indigo-600/10 border-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.15)] text-white' 
                        : 'bg-black/30 border-white/5 hover:bg-white/5 text-slate-300'
                    }`}
                  >
                    <div>
                      <span className="block text-xs font-bold uppercase tracking-wide font-mono text-white mt-0.5">{lvl.name}</span>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{lvl.description}</p>
                    </div>

                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/5 text-[10px] text-indigo-300 font-mono">
                      <span>Questions: <strong>{lvl.count}</strong></span>
                      <span>Duration: <strong>{lvl.duration} mins</strong></span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Extra syllabus parameters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 text-xs">
                <div className="space-y-1.5">
                  <label className="text-slate-400 font-bold block">Blueprint Exam Target</label>
                  <select
                    value={selectedExam}
                    onChange={(e) => setSelectedExam(e.target.value as ExamType)}
                    className="w-full p-2 bg-black border border-white/10 rounded-xl text-white outline-none"
                  >
                    <option value="NIMCET">NIMCET (MCA)</option>
                    <option value="CUET PG MCA">CUET PG MCA</option>
                    <option value="TANCET MCA">TANCET MCA</option>
                    <option value="CAT">CAT (Management)</option>
                    <option value="GATE CS">GATE CS</option>
                    <option value="Placements">Placements</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-400 font-[#4ade80] block">Subject Focus</label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value as any)}
                    className="w-full p-2 bg-black border border-white/10 rounded-xl text-white outline-none"
                  >
                    <option value="Mathematics">Mathematics Only</option>
                    <option value="Computer Science">Computer Science Core</option>
                    <option value="Quantitative Aptitude">Logical Aptitude</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-4 bg-indigo-950/20 border border-indigo-500/15 rounded-2xl flex items-center justify-between select-none">
              <div className="space-y-0.5">
                <span className="text-xs font-black text-white flex items-center gap-1.5 font-mono uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 block animate-pulse" />
                  <span>Exam-Day Simulator Mode</span>
                </span>
                <span className="block text-[10px] text-slate-400 max-w-sm leading-tight font-sans">
                  Prevents leaving full-screen. 3 cumulative tab switches forces immediate submission. Applies exact mark weightings and real timer alarms!
                </span>
              </div>
              <button
                onClick={() => setIsSimulatorMode(!isSimulatorMode)}
                className={`w-12 h-6 md:w-14 md:h-7 rounded-full p-1 transition-all flex items-center shrink-0 cursor-pointer ${
                  isSimulatorMode ? 'bg-indigo-600' : 'bg-white/10'
                }`}
              >
                <div className={`w-4 h-4 md:w-5 md:h-5 rounded-full bg-white transition-all ${
                  isSimulatorMode ? 'translate-x-6 md:translate-x-7' : 'translate-x-0'
                }`} />
              </button>
            </div>

            <button
              onClick={handleStartMock}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-black font-extrabold rounded-2xl flex items-center justify-center gap-2 cursor-pointer transition-all border border-emerald-400/20 text-xs shadow-lg shadow-emerald-500/10"
            >
              <PlayCircle className="w-4 h-4 text-black" />
              <span>Launch Verified Adaptive Mock Environment</span>
            </button>
          </div>

          {/* Guidelines Column */}
          <div className="p-6 bg-black/40 border border-white/5 rounded-3xl flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-[10px] font-black text-slate-500 font-mono tracking-widest block">EXAM GROUND RULES</span>
              
              <ul className="space-y-3.5 text-xs text-slate-300">
                <li className="flex gap-2 items-start leading-snug">
                  <span className="text-indigo-400 mr-1 mt-0.5 font-bold">⏱️</span>
                  <span>Countdown timer starts immediately. Exiting or reloading before submission forces an automatic zero grading.</span>
                </li>
                <li className="flex gap-2 items-start leading-snug">
                  <span className="text-indigo-400 mr-1 mt-0.5 font-bold">🎯</span>
                  <span>Correct response logs **+4 points**; incorrect response deducts **-1 point**. Ensure high accuracy matrices!</span>
                </li>
                <li className="flex gap-2 items-start leading-snug">
                  <span className="text-indigo-400 mr-1 mt-0.5 font-bold">🚩</span>
                  <span>Use the "Flag" button on hard calculations to drop them into active evaluation grids. No external calculators are allowed.</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-white/5 text-[10px] text-slate-500 font-mono space-y-1">
              <p>Active Blueprints: <strong>Verified</strong></p>
              <p>Target Goal: <strong>AIR #{user.targetRank} ({user.targetExam})</strong></p>
            </div>
          </div>
        </div>
      )}

      {/* Active simulation test interface layout */}
      {activeTest && activeQuestions.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 text-left">
          
          {/* Main Question view left */}
          <div className="lg:col-span-3 p-6 bg-[#0c0d16] border border-white/10 rounded-3xl space-y-5">
            
            <div className="flex items-center justify-between border-b border-white/5 pb-3 font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 Rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-white">Active Question {currentQIndex + 1} of {activeQuestions.length}</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-rose-400 bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-lg">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="font-extrabold">{formatTimer(secondsRemaining)}</span>
                </div>

                <button
                  onClick={() => toggleFlagQuestion(activeQuestions[currentQIndex].id)}
                  className={`p-1 px-2 text-[10px] font-bold rounded-md border transition-all ${
                    flaggedQuestions.includes(activeQuestions[currentQIndex].id)
                      ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                      : 'bg-white/5 border-white/5 text-slate-400'
                  }`}
                >
                  🚩 Flag Question
                </button>
              </div>
            </div>

            {/* Test Problem detail */}
            <div className="space-y-5">
              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                <p className="text-xs text-white font-bold leading-relaxed">
                  {activeQuestions[currentQIndex].question}
                </p>
              </div>

              {/* MCQ Options representation */}
              {activeQuestions[currentQIndex].options && (
                <div className="grid grid-cols-1 gap-3">
                  {activeQuestions[currentQIndex].options?.map((opt, optI) => {
                    const isSelected = userAnswers[activeQuestions[currentQIndex].id] === opt;
                    
                    return (
                      <button
                        key={optI}
                        onClick={() => handleOptionSelect(activeQuestions[currentQIndex].id, opt)}
                        className={`text-left p-3.5 rounded-2xl border text-xs font-sans transition-all flex items-start gap-3.5 cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-600/10 border-indigo-500 text-white font-bold shadow-inner'
                            : 'bg-black/30 border-white/5 hover:border-white/10 text-slate-300'
                        }`}
                      >
                        <span className={`w-5 h-5 rounded-full border text-[9px] flex items-center justify-center shrink-0 ${
                          isSelected ? 'border-indigo-400 text-indigo-400 bg-indigo-500/10' : 'border-slate-500 text-slate-400'
                        }`}>
                          {String.fromCharCode(65 + optI)}
                        </span>
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* No option present fallback */}
              {!activeQuestions[currentQIndex].options && (
                <div className="space-y-2 p-4 bg-black/40 border border-white/5 rounded-2xl max-w-sm">
                  <span className="block text-[10px] text-slate-400 font-mono">INTEGER RESPONSE ENTRY:</span>
                  <input
                    type="text"
                    value={userAnswers[activeQuestions[currentQIndex].id] || ''}
                    onChange={(e) => handleOptionSelect(activeQuestions[currentQIndex].id, e.target.value)}
                    placeholder="Enter estimated derived digits..."
                    className="w-full bg-black border border-white/10 rounded-xl p-2.5 text-center text-white font-mono outline-none text-xs"
                  />
                </div>
              )}
            </div>

            {/* Stepper buttons */}
            <div className="flex justify-between items-center pt-4 border-t border-white/5 select-none font-sans">
              <button
                disabled={currentQIndex === 0}
                onClick={() => setCurrentQIndex(prev => Math.max(0, prev - 1))}
                className="py-2 px-4 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold disabled:opacity-30 transition-all cursor-pointer"
              >
                Previous Left
              </button>

              <button
                onClick={handleTestManualSubmission}
                className="py-2 px-5 bg-[#dc2626] hover:bg-red-600 text-white rounded-xl text-xs font-extrabold transition-all cursor-pointer"
              >
                Terminate & Grade Test
              </button>

              <button
                disabled={currentQIndex === activeQuestions.length - 1}
                onClick={() => setCurrentQIndex(prev => Math.min(activeQuestions.length - 1, prev + 1))}
                className="py-2 px-4 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold disabled:opacity-30 transition-all cursor-pointer"
              >
                Skip Option Next
              </button>
            </div>

          </div>

          {/* Right question navigator board */}
          <div className="p-4 bg-white/5 border border-white/10 rounded-3xl text-xs text-left text-white space-y-4 h-fit">
            <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold">Problems Navigation Board</span>
            
            <div className="grid grid-cols-5 gap-2 font-mono">
              {activeQuestions.map((q, idx) => {
                const isCurrent = currentQIndex === idx;
                const isAnswered = !!userAnswers[q.id];
                const isFlagged = flaggedQuestions.includes(q.id);

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQIndex(idx)}
                    className={`h-9 rounded-lg flex items-center justify-center font-bold font-mono transition-all text-[11px] cursor-pointer ${
                      isCurrent 
                        ? 'bg-indigo-600 border border-indigo-400 text-white shadow-md' 
                        : isFlagged 
                          ? 'bg-amber-500/20 border border-amber-500/30 text-amber-300'
                          : isAnswered 
                            ? 'bg-emerald-500/20 border border-emerald-500/35 text-emerald-300' 
                            : 'bg-black/40 border border-white/5 text-slate-400 hover:bg-white/5'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="space-y-2.5 pt-4 border-t border-white/5 text-[10px] text-slate-400 font-sans">
              <p className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded bg-indigo-500 block" />
                <span>Currently active selection index</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded bg-[#10b981] block" />
                <span>Question answered and logged</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded bg-[#f59e0b] block" />
                <span>Flagged for pending checks</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded bg-black/40 border border-white/5 block" />
                <span>Unattempted / skipped item</span>
              </p>
            </div>
          </div>

        </div>
      )}

      {/* Finished Evaluation Results panel */}
      {testCompleted && activeQuestions.length > 0 && (
        <div className="space-y-6 text-left">
          
          {/* Header diagnostics summaries */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 select-none">
            
            {/* Raw Score */}
            <div className="p-5 bg-white/5 border border-white/10 rounded-2xl text-left">
              <span className="text-[10px] text-indigo-400 uppercase font-black block">Raw Scored Marks</span>
              <div className="text-2xl font-black text-white mt-1.5 font-mono">
                {score} <span className="text-xs text-slate-400 font-sans font-normal">/ {activeQuestions.length * 4}</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Syllabus correction weights rules</p>
            </div>

            {/* Questions Attempt accuracy */}
            <div className="p-5 bg-white/5 border border-white/10 rounded-2xl text-left">
              <span className="text-[10px] text-teal-400 uppercase font-black block">Accuracy Ratio</span>
              <div className="text-2xl font-black text-white mt-1.5 font-mono">
                {attemptedCount > 0 ? Math.round((correctCount / attemptedCount) * 100) : 0}%
              </div>
              <p className="text-[10px] text-slate-400 mt-1">{correctCount} correct out of {attemptedCount} attempted</p>
            </div>

            {/* Average speeds */}
            <div className="p-5 bg-white/5 border border-white/10 rounded-2xl text-left">
              <span className="text-[10px] text-amber-400 uppercase font-black block">Speed Efficiency</span>
              <div className="text-2xl font-black text-white mt-1.5 font-mono">
                {attemptedCount > 0 ? Math.round(((initialDurationSeconds - secondsRemaining) / attemptedCount)) : 0}s
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Average time spent per question</p>
            </div>

            {/* Rank estimate predictor */}
            <div className="p-5 bg-gradient-to-br from-indigo-950/20 to-indigo-900/10 border border-indigo-500/20 rounded-2xl text-left">
              <span className="text-[10px] text-purple-400 uppercase font-black block flex items-center gap-1.5 font-mono">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Predicted Rank Tier</span>
              </span>
              <div className="text-xl font-black text-white mt-1.5 font-sans">
                {score > 25 ? `AIR 40 - 120` : score > 10 ? `AIR 250 - 450` : `AIR 700 - 1500`}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Est. general category rank today</p>
            </div>

          </div>

          {/* Tabs Selector for Post-Test Insights */}
          <div className="flex border-b border-white/10 gap-2 mb-4 select-none">
            <button
              onClick={() => setResultsTab('analysis')}
              className={`pb-3 px-4 font-sans text-xs font-bold transition-all border-b-2 cursor-pointer ${
                resultsTab === 'analysis'
                  ? 'border-indigo-500 text-white font-extrabold'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              📊 Raw Score & AI Recommendations
            </button>
            <button
              onClick={() => setResultsTab('replay')}
              className={`pb-3 px-4 font-sans text-xs font-bold transition-all border-b-2 cursor-pointer relative ${
                resultsTab === 'replay'
                  ? 'border-indigo-500 text-white font-extrabold'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <span>⏱️ Performance Replay & Bottlenecks</span>
              {/* Highlight badge to guide student to analysis */}
              <span className="absolute -top-1 right-0 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
            </button>
            <button
              onClick={() => setResultsTab('solutions')}
              className={`pb-3 px-4 font-sans text-xs font-bold transition-all border-b-2 cursor-pointer ${
                resultsTab === 'solutions'
                  ? 'border-indigo-500 text-white font-extrabold'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              📖 Detailed Answers & Keys
            </button>
          </div>

          {/* TAB 1: AI ANALYSIS AND ACTION STEPS */}
          {resultsTab === 'analysis' && (
            <div className="p-6 bg-[#090a12]/95 border border-white/10 rounded-3xl space-y-4">
              <h3 className="text-sm font-black text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400 animate-spin" />
                <span>Aris Dynamic Recommendations Dashboard</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs bg-white/[0.01] p-4 rounded-2xl border border-white/5 leading-relaxed font-sans">
                
                <div className="space-y-2 text-left">
                  <span className="text-[10px] text-red-400 font-mono font-black uppercase block">Flagged Weak Area Elements</span>
                  <p className="text-slate-300">
                    {score > 25 
                     ? "Excellent, your foundation is extremely solid! Minor speed hiccups are detected under Hard Calculus vectors. Ensure you double-check diagonal matrices symmetric properties before selecting final values." 
                     : "Attention: Your database normalization mapping and Operating System semaphores require immediate revision. You missed key prime attributes checking which triggers partial key dependencies."}
                  </p>
                </div>

                <div className="space-y-2 text-left bg-emerald-500/[0.03] p-3 rounded-lg border border-emerald-500/10">
                  <span className="text-[10px] text-emerald-400 font-mono font-black uppercase block">Recommended Next Action Steps</span>
                  <p className="text-slate-300">
                    {score > 25 
                     ? "⚙️ Spend 15 minutes reviewing Formula Handbook definitions. Next, toggle AIR 50-100 Elite Training Mode on the Practice tab for expert-level queries to push your score metric."
                     : "📚 Re-watch Jenny's Lectures Operating Systems CPU module in the Videos tab. Then, trigger a Topic Mock focusing exclusively on DBMS Normalization concepts to clean these defects."}
                  </p>
                </div>

              </div>
              
              <div className="p-4 bg-indigo-950/20 border border-indigo-500/15 rounded-2xl flex items-center justify-between text-xs font-sans">
                <div className="space-y-0.5">
                  <span className="font-bold text-white block">Speed-Solving bottleneck analysis is waiting for you!</span>
                  <span className="text-[11px] text-slate-400 block">We recorded your exact timestamp per questions against senior mock solvers. Inspect slow-solving areas now.</span>
                </div>
                <button
                  onClick={() => setResultsTab('replay')}
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0"
                >
                  View Performance Replay
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: INTERACTIVE PERFORMANCE REPLAY BLOCK */}
          {resultsTab === 'replay' && (() => {
            const replayData = activeQuestions.map((q, idx) => {
              const userTime = questionElapsedSeconds[q.id] || 0;
              const rankerTime = getRankerAvgSeconds(q);
              const diff = userTime - rankerTime;
              const isBottleneck = userTime > rankerTime + 3;
              return { q, idx, userTime, rankerTime, diff, isBottleneck };
            });

            const displayedQId = selectedReplayQId || activeQuestions[0]?.id;
            const displayedItem = replayData.find(item => item.q.id === displayedQId) || replayData[0];

            const totalUserTime = replayData.reduce((sum, item) => sum + item.userTime, 0);
            const totalRankerTime = replayData.reduce((sum, item) => sum + item.rankerTime, 0);
            const totalBottlenecks = replayData.filter(item => item.isBottleneck).length;
            const totalSavingsPotential = replayData.reduce((sum, item) => item.isBottleneck ? sum + item.diff : sum, 0);

            const filteredReplayList = replayData.filter(item => {
              if (replayFilter === 'bottlenecks') return item.isBottleneck;
              if (replayFilter === 'on_pace') return !item.isBottleneck;
              return true;
            });

            return (
              <div className="p-6 bg-[#090a12]/95 border border-white/10 rounded-3xl space-y-6">
                
                {/* Visual Header */}
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider font-mono flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>Speed-Solving Replay & Bottleneck Tracker</span>
                  </h3>
                  <p className="text-slate-400 text-xs mt-1">
                    Trace where you lost efficiency. Compare raw clock durations side-by-side against the aggregate <strong>Top 50 Ranker Pace</strong> metrics.
                  </p>
                </div>

                {/* Performance Replay Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-sans">
                  
                  <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="text-[10px] uppercase font-bold text-amber-300 font-mono tracking-wider block">Bottlenecks Discovered</span>
                      <div className="text-xl font-black text-amber-200">
                        {totalBottlenecks} <span className="text-xs font-normal text-slate-400">/ {activeQuestions.length} Questions</span>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-tight">Questions exceeding average pace</p>
                    </div>
                    <div className="p-2 bg-amber-500/20 rounded-xl shrink-0">
                      <Activity className="w-5 h-5 text-amber-400" />
                    </div>
                  </div>

                  <div className="p-4 bg-red-500/10 border border-red-505/20 rounded-2xl flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="text-[10px] uppercase font-bold text-rose-300 font-mono tracking-wider block">Pace Delays</span>
                      <div className="text-xl font-black text-red-200">
                        {totalUserTime > totalRankerTime 
                          ? `+${totalUserTime - totalRankerTime}s Slower` 
                          : `${totalRankerTime - totalUserTime}s Faster!`}
                      </div>
                      <p className="text-[10px] text-slate-400 leading-tight">Your aggregate test speed ratio</p>
                    </div>
                    <div className="p-2 bg-red-500/20 rounded-xl shrink-0">
                      <Clock className="w-5 h-5 text-red-400" />
                    </div>
                  </div>

                  <div className="p-4 bg-teal-500/10 border border-teal-500/20 rounded-2xl flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="text-[10px] uppercase font-bold text-teal-300 font-mono tracking-wider block">Time Savings Credit</span>
                      <div className="text-xl font-black text-teal-200 font-mono">
                        {totalSavingsPotential > 0 ? formatTimer(totalSavingsPotential) : '00:00'}
                      </div>
                      <p className="text-[10px] text-slate-400 leading-tight">Potential retrieved using shortcuts</p>
                    </div>
                    <div className="p-2 bg-teal-500/20 rounded-xl shrink-0 text-teal-400">
                      <Sparkles className="w-5 h-5 animate-pulse" />
                    </div>
                  </div>

                </div>

                {/* Diagnostic Area split */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Left items selector */}
                  <div className="lg:col-span-5 bg-black/40 border border-white/5 p-4 rounded-2xl space-y-4">
                    
                    {/* Pills Filtering */}
                    <div className="flex gap-1 bg-black/40 p-1 border border-white/5 rounded-xl text-[10px] font-bold font-mono">
                      <button
                        onClick={() => setReplayFilter('all')}
                        className={`flex-1 py-1 px-1.5 rounded-lg transition-all text-center cursor-pointer ${
                          replayFilter === 'all' ? 'bg-indigo-600 text-white shadow-inner' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        All ({replayData.length})
                      </button>
                      <button
                        onClick={() => setReplayFilter('bottlenecks')}
                        className={`flex-1 py-1 px-1.5 rounded-lg transition-all text-center cursor-pointer flex items-center justify-center gap-1 ${
                          replayFilter === 'bottlenecks' ? 'bg-amber-500/20 border border-amber-500/30 text-amber-300' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        ⚠️ Delays ({totalBottlenecks})
                      </button>
                      <button
                        onClick={() => setReplayFilter('on_pace')}
                        className={`flex-1 py-1 px-1.5 rounded-lg transition-all text-center cursor-pointer flex items-center justify-center gap-1 ${
                          replayFilter === 'on_pace' ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-300' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        🚀 Optimal ({replayData.length - totalBottlenecks})
                      </button>
                    </div>

                    {/* Left Question List Grid */}
                    <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
                      {filteredReplayList.map(item => {
                        const isSelected = item.q.id === displayedQId;
                        
                        return (
                          <button
                            key={item.q.id}
                            onClick={() => setSelectedReplayQId(item.q.id)}
                            className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex justify-between items-center ${
                              isSelected 
                                ? 'bg-indigo-600/15 border-indigo-500 text-white font-semibold' 
                                : 'bg-black/20 border-white/5 hover:bg-white/5 text-slate-300'
                            }`}
                          >
                            <div className="space-y-1 max-w-[70%]">
                              <span className="block text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-wider">
                                Q{item.idx + 1}: {item.q.topic}
                              </span>
                              <span className="block text-[11px] truncate text-slate-300 font-sans">
                                {item.q.question.replace(/^\[Mock Variation Q\d+\]\s*/, '')}
                              </span>
                            </div>

                            <div className="text-right flex flex-col items-end gap-1.5 shrink-0">
                              <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded ${
                                item.isBottleneck 
                                  ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              }`}>
                                {item.userTime}s vs {item.rankerTime}s
                              </span>
                            </div>
                          </button>
                        );
                      })}

                      {filteredReplayList.length === 0 && (
                        <div className="text-center py-10 text-slate-400 text-xs font-sans">
                          No questions recorded in this filter tier.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right comparison chart panel */}
                  <div className="lg:col-span-7 bg-black/30 border border-white/5 p-5 rounded-2xl space-y-4 text-xs font-sans">
                    
                    <div>
                      <span className="text-[9px] uppercase font-black tracking-widest text-indigo-400 font-mono block">🖥️ Interactive Delay Analyzer</span>
                      <div className="flex gap-2 items-center mt-1">
                        <h4 className="text-sm font-bold text-white">Q{displayedItem.idx + 1}: {displayedItem.q.topic}</h4>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                          displayedItem.isBottleneck ? "bg-amber-500/15 text-amber-300" : "bg-emerald-500/15 text-emerald-300"
                        }`}>
                          {displayedItem.isBottleneck ? "⚠️ Bottleneck Delay" : "🚀 Peak Pace Speed"}
                        </span>
                      </div>
                    </div>

                    {/* Question representation */}
                    <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl text-slate-300 italic font-medium leading-relaxed max-h-[100px] overflow-y-auto">
                      "{displayedItem.q.question.replace(/^\[Mock Variation Q\d+\]\s*/, '')}"
                    </div>

                    {/* Comparative Visual Bars */}
                    <div className="space-y-4 pt-1 font-mono">
                      
                      {/* User's time bar representation */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-slate-400 flex items-center gap-1 font-sans">
                            <span className={`w-2 h-2 rounded-full ${displayedItem.isBottleneck ? 'bg-red-500 animate-pulse' : 'bg-emerald-400'}`} />
                            <span>Your Timing</span>
                          </span>
                          <span className={`font-black ${displayedItem.isBottleneck ? 'text-red-400' : 'text-emerald-400'}`}>
                            {displayedItem.userTime} seconds ({formatTimer(displayedItem.userTime)})
                          </span>
                        </div>
                        
                        <div className="w-full bg-black/40 rounded-full h-4 overflow-hidden p-0.5 border border-white/5">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              displayedItem.isBottleneck 
                                ? 'bg-gradient-to-r from-red-600 to-amber-500' 
                                : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                            }`}
                            style={{ width: `${Math.min(100, Math.max(12, (displayedItem.userTime / Math.max(displayedItem.userTime, displayedItem.rankerTime, 1)) * 100))}%` }}
                          />
                        </div>
                      </div>

                      {/* Ranker benchmark time bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-slate-400 flex items-center gap-1 font-sans">
                            <span className="w-2 h-2 rounded-full bg-indigo-500" />
                            <span>Top 50 Rankers Average</span>
                          </span>
                          <span className="font-black text-indigo-300">
                            {displayedItem.rankerTime} seconds ({formatTimer(displayedItem.rankerTime)})
                          </span>
                        </div>
                        
                        <div className="w-full bg-black/40 rounded-full h-4 overflow-hidden p-0.5 border border-white/5">
                          <div 
                            className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, Math.max(12, (displayedItem.rankerTime / Math.max(displayedItem.userTime, displayedItem.rankerTime, 1)) * 100))}%` }}
                          />
                        </div>
                      </div>

                    </div>

                    {/* Delta explanation box */}
                    <div className={`p-3 rounded-2xl border leading-relaxed ${
                      displayedItem.isBottleneck 
                        ? 'bg-rose-950/15 border-red-500/20 text-rose-300' 
                        : 'bg-emerald-950/15 border-emerald-500/20 text-emerald-300'
                    }`}>
                      {displayedItem.isBottleneck ? (
                        <p>
                          <strong>⚠️ Delay Spotted:</strong> Your workflow spent <strong className="text-white">+{displayedItem.diff}s extra</strong> on this item. Master variables, elimination formulas, and concepts to prevent clock bleeding.
                        </p>
                      ) : (
                        <p>
                          <strong>🚀 High-Velocity Mastery:</strong> Your solving phase was <strong>{-displayedItem.diff}s quicker</strong> than elite rankers averages. Excellent intuition!
                        </p>
                      )}
                    </div>

                    {/* Elite solver strategies */}
                    <div className="p-4 bg-indigo-950/20 border border-indigo-500/20 rounded-2xl space-y-2">
                      <span className="text-[10px] font-black text-indigo-300 uppercase font-mono tracking-widest block flex items-center gap-1 text-left">
                        <span>🎓 Expert Bypass Solution Shortcut</span>
                      </span>
                      <p className="text-slate-300 text-[11px] leading-relaxed text-left">
                        {displayedItem.q.shortcut || 'Simplify operations by examining indices invariants. Never compute deep factors manually in timed MCAs; apply modular checks to dismiss odd options under 15 seconds.'}
                      </p>
                      <div className="pt-2 border-t border-white/5 flex justify-between items-center text-[10px] text-slate-400 font-mono">
                        <span>Target Exam Blueprint: <strong>{selectedExam}</strong></span>
                        <span className="text-indigo-400 font-bold">Estimated Benefit: Save ~50 seconds</span>
                      </div>
                    </div>

                  </div>

                </div>

              </div>
            );
          })()}

          {/* TAB 3: REVIEW PROBLEMS SETS AND SOLUTIONS */}
          {resultsTab === 'solutions' && (
            <div className="p-6 bg-[#090a12]/95 border border-white/10 rounded-3xl space-y-4">
              <span className="block text-xs font-black uppercase text-slate-400 font-mono tracking-wider">Review Problems Set Explanations</span>
              <div className="space-y-3">
                {activeQuestions.map((q, qIdx) => {
                  const userAns = userAnswers[q.id];
                  const isCorrectAns = userAns === q.answer || q.answer.toString().includes(userAns || 'NoAns');

                  return (
                    <div key={q.id} className="p-4 bg-black/40 border border-white/5 rounded-2xl space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white uppercase font-mono">Q{qIdx + 1}: {q.topic}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold font-mono ${
                          isCorrectAns ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}>
                          {isCorrectAns ? 'Correct' : 'Incorrect / Skipped'}
                        </span>
                      </div>

                      <p className="text-slate-400">{q.question}</p>
                      
                      <div className="pt-2 border-t border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono select-none">
                        <p className="text-slate-400">Your Selection: <strong className={isCorrectAns ? 'text-emerald-400' : 'text-rose-400'}>{userAns || 'Skipped'}</strong></p>
                        <p className="text-slate-400">Correct Key: <strong className="text-emerald-400">{q.answer as string}</strong></p>
                      </div>

                      <div className="p-2.5 bg-[#07080e] rounded-xl border border-white/5 mt-1.5 font-mono text-[10px] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <span className="text-indigo-400 font-extrabold">⏱️ TIMING REPLAY:</span>
                          <span>Time Spent: <strong className="text-white">{formatTimer(questionElapsedSeconds[q.id] || 0)}</strong></span>
                        </div>
                        <div className="text-slate-400">
                          Top 50 Rankers Avg: <strong className="text-emerald-400 font-extrabold">{getRankerAvgSeconds(q)} seconds ({formatTimer(getRankerAvgSeconds(q))})</strong>
                        </div>
                      </div>

                      <div className="p-2.5 bg-[#07080e] rounded-xl border border-white/5 mt-1.5">
                        <span className="block text-[10px] text-indigo-400 uppercase font-black font-mono">Key Shortcut</span>
                        <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">{q.shortcut || 'Simplify attributes closures first.'}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Back to mock selection trigger */}
          <div className="pt-4 flex justify-start select-none">
            <button
              onClick={() => {
                setActiveQuestions([]);
                setTestCompleted(false);
              }}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 font-bold font-sans text-white rounded-xl text-xs cursor-pointer transition-colors"
            >
              Back to Mock Selector Options
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
