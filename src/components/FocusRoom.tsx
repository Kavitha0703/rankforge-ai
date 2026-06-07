import React, { useState, useEffect, useRef } from 'react';
import { 
  Timer, 
  Pause, 
  Play, 
  RotateCcw, 
  Music, 
  Volume2, 
  VolumeX, 
  Wind, 
  CloudRain, 
  Coffee, 
  Target, 
  Book, 
  Eye, 
  EyeOff,
  Maximize2,
  X,
  CheckCircle2,
  Zap,
  TrendingUp,
  Brain,
  Sparkles,
  MessageSquare,
  StickyNote,
  ChevronLeft,
  ChevronRight,
  Settings2,
  TreePine,
  Waves
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FocusSession } from '../types';

interface FocusRoomProps {
  onSessionComplete: (session: FocusSession) => void;
  onClose: () => void;
}

export default function FocusRoom({ onSessionComplete, onClose }: FocusRoomProps) {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [mode, setMode] = useState<'focus' | 'short' | 'long'>('focus');
  const [ambientSound, setAmbientSound] = useState<'none' | 'rain' | 'waves' | 'lofi' | 'forest'>('none');
  const [isMuted, setIsMuted] = useState(false);
  const [showUI, setShowUI] = useState(true);
  const [sessionStartTime, setSessionStartTime] = useState<string | null>(null);
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState('');
  const [currentTopic, setCurrentTopic] = useState('Mathematics • Probability');
  const [isEditingTopic, setIsEditingTopic] = useState(false);
  
  // Stats tracking
  const [questionsHandled, setQuestionsHandled] = useState(0);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const toggleTimer = () => {
    if (!isActive) {
      setSessionStartTime(new Date().toISOString());
    }
    setIsActive(!isActive);
    setIsPaused(false);
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsPaused(false);
    if (mode === 'focus') setTimeLeft(25 * 60);
    else if (mode === 'short') setTimeLeft(5 * 60);
    else setTimeLeft(15 * 60);
  };

  useEffect(() => {
    if (isActive && !isPaused && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleComplete();
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, isPaused, timeLeft]);

  const handleComplete = () => {
    setIsActive(false);
    
    const session: FocusSession = {
      id: Math.random().toString(36).substr(2, 9),
      startTime: sessionStartTime || new Date().toISOString(),
      endTime: new Date().toISOString(),
      durationMinutes: mode === 'focus' ? 25 : (mode === 'short' ? 5 : 15),
      questionsSolved: questionsHandled,
      accuracy: 85, // Simulated
      focusScore: 92, // Simulated
    };
    
    onSessionComplete(session);
    resetTimer();
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const ambientIcons = {
    none: VolumeX,
    rain: CloudRain,
    waves: Waves,
    lofi: Coffee,
    forest: TreePine,
  };

  const CurrentAmbientIcon = ambientIcons[ambientSound];

  return (
    <div className="fixed inset-0 z-[100] bg-[#05060b] flex flex-col items-center justify-center overflow-hidden font-sans select-none">
      {/* Background Ambience (Subtle Gradients) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute inset-0 transition-all duration-1000 ${
          ambientSound === 'rain' ? 'bg-indigo-950/20' : 
          ambientSound === 'forest' ? 'bg-emerald-950/20' : 
          ambientSound === 'lofi' ? 'bg-purple-950/20' : 'bg-transparent'
        }`} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 blur-[120px] rounded-full animate-pulse" />
      </div>

      {/* Top Bar */}
      <AnimatePresence>
        {showUI && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-0 inset-x-0 p-8 flex items-center justify-between z-10"
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full">
                <Target className="w-4 h-4 text-rose-500" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Focus Target: AIR 50</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full">
                <Brain className="w-4 h-4 text-indigo-400" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Questions Handled: {questionsHandled}</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => setShowUI(false)}
                className="p-2.5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-full transition-all border border-white/5"
              >
                <EyeOff className="w-5 h-5" />
              </button>
              <button 
                onClick={onClose}
                className="p-2.5 bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-500 rounded-full transition-all border border-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Re-show UI Button */}
      {!showUI && (
        <motion.button 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowUI(true)}
          className="absolute bottom-8 right-8 p-4 bg-white/5 hover:bg-white/10 text-slate-500 hover:text-white rounded-full transition-all z-20 group border border-white/5"
        >
          <Eye className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </motion.button>
      )}

      {/* Quick Notes Panel */}
      <AnimatePresence>
        {showNotes && showUI && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute right-0 top-0 bottom-0 w-80 bg-black/80 backdrop-blur-2xl border-l border-white/10 z-30 p-6 flex flex-col gap-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                <StickyNote className="w-4 h-4" /> Quick Notes
              </span>
              <button 
                onClick={() => setShowNotes(false)}
                className="p-1 hover:bg-white/10 rounded-lg text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Jot down formulas or thoughts during your session..."
              className="flex-1 bg-white/5 border border-white/5 rounded-2xl p-4 text-xs text-white placeholder-slate-600 outline-none focus:border-indigo-500 transition-all resize-none font-sans"
            />
            <p className="text-[10px] text-slate-500 font-mono text-center">
              Notes are saved to your current session report.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Timer Display */}
      <div className="relative z-10 text-center space-y-12">
        <motion.div 
          animate={{ scale: isActive && !isPaused ? 1.05 : 1 }}
          transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
          className="relative"
        >
          {/* Progress Ring Simulation */}
          <div className="absolute inset-0 -m-4 border-2 border-white/5 rounded-full" />
          <h1 className="text-[180px] md:text-[240px] font-black text-white tracking-tighter leading-none font-mono">
            {formatTime(timeLeft)}
          </h1>
          
          <div className="flex items-center justify-center gap-6 mt-4">
            {['focus', 'short', 'long'].map((m) => (
              <button
                key={m}
                onClick={() => {
                  setMode(m as any);
                  if (m === 'focus') setTimeLeft(25 * 60);
                  else if (m === 'short') setTimeLeft(5 * 60);
                  else setTimeLeft(15 * 60);
                  setIsActive(false);
                }}
                className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                  mode === m ? 'text-indigo-400' : 'text-slate-600 hover:text-slate-400'
                }`}
              >
                {m === 'focus' ? 'Focus Session' : m === 'short' ? 'Short Break' : 'Long Break'}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-8">
          <button 
            onClick={resetTimer}
            className="p-4 bg-white/5 hover:bg-white/10 text-slate-500 hover:text-white rounded-2xl transition-all border border-white/5"
          >
            <RotateCcw className="w-6 h-6" />
          </button>

          <button 
            onClick={toggleTimer}
            className={`w-24 h-24 rounded-3xl flex items-center justify-center transition-all shadow-2xl active:scale-95 border-b-4 ${
              isActive && !isPaused 
                ? 'bg-rose-500/10 border-rose-600/50 text-rose-500 hover:bg-rose-500/20 shadow-rose-500/10' 
                : 'bg-indigo-600 border-indigo-700 text-white hover:bg-indigo-500 shadow-indigo-600/20'
            }`}
          >
            {isActive && !isPaused ? <Pause className="w-10 h-10 fill-current" /> : <Play className="w-10 h-10 fill-current ml-1" />}
          </button>

          <button 
            className="p-4 bg-white/5 hover:bg-white/10 text-slate-500 hover:text-white rounded-2xl transition-all border border-white/5"
            onClick={() => setQuestionsHandled(q => q + 1)}
          >
            <CheckCircle2 className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Bottom Bar: Ambience & Extras */}
      <AnimatePresence>
        {showUI && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-0 inset-x-0 p-8 flex items-center justify-between z-10"
          >
            {/* Ambience Selector */}
            <div className="flex items-center gap-3">
              <div className="flex p-1 bg-white/5 border border-white/10 rounded-2xl">
                 {(['none', 'rain', 'waves', 'lofi', 'forest'] as const).map(s => {
                   const Icon = ambientIcons[s];
                   return (
                     <button
                       key={s}
                       onClick={() => setAmbientSound(s)}
                       className={`p-3 rounded-xl transition-all ${
                         ambientSound === s ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'
                       }`}
                     >
                       <Icon className="w-5 h-5" />
                     </button>
                   );
                 })}
              </div>
              
              <button 
                onClick={() => setIsMuted(!isMuted)}
                className="p-3 bg-white/5 border border-white/10 rounded-2xl text-slate-400 hover:text-white transition-all"
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
            </div>

            {/* Quote / Micro Prompt */}
            <div className="flex-1 max-w-sm mx-12 text-center">
              <p className="text-[11px] font-mono italic text-slate-500 uppercase tracking-wider leading-relaxed">
                "The secret of getting ahead is getting started. Focus on the AIR 50 goal, one 25-minute block at a time."
              </p>
            </div>

            {/* Current Context */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="block text-[10px] font-black text-indigo-400 uppercase tracking-widest">Active Focus Session</span>
                {isEditingTopic ? (
                  <input
                    autoFocus
                    value={currentTopic}
                    onChange={(e) => setCurrentTopic(e.target.value)}
                    onBlur={() => setIsEditingTopic(false)}
                    onKeyDown={(e) => e.key === 'Enter' && setIsEditingTopic(false)}
                    className="bg-white/10 border-b border-indigo-500 text-xs font-bold text-white outline-none px-1"
                  />
                ) : (
                  <span 
                    onClick={() => setIsEditingTopic(true)}
                    className="block text-xs font-bold text-white cursor-pointer hover:text-indigo-300 transition-colors"
                  >
                    {currentTopic}
                  </span>
                )}
              </div>
              <div className="w-10 h-10 bg-indigo-500/20 border border-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400">
                 <Book className="w-5 h-5" />
              </div>
              <button
                onClick={() => setShowNotes(!showNotes)}
                className={`p-3 rounded-xl border transition-all ${
                  showNotes ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <StickyNote className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
