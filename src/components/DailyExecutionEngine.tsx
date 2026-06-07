import React, { useState, useEffect } from 'react';
import { Target, CheckCircle2, Clock, BrainCircuit, RefreshCw, ChevronRight, CalendarCog, FileText, CheckCircle, Zap, Timer, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProgress } from '../types';

interface DailyExecutionEngineProps {
  progress: UserProgress;
  onUpdateProgress: (updates: Partial<UserProgress>) => void;
}

export default function DailyExecutionEngine({ progress, onUpdateProgress }: DailyExecutionEngineProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCompletionToast, setShowCompletionToast] = useState(false);
  
  const [tasks, setTasks] = useState([
    {
      id: 'task-1',
      subject: 'Probability',
      type: 'practice',
      desc: 'Solve 15 High-impact Questions (NIMCET PYQs)',
      targetCount: 15,
      actualCount: progress.dailyQuestionsSolved || 0,
      time: '30 min',
      xpReward: 25,
      completed: false
    },
    {
      id: 'task-2',
      subject: 'Mock Test',
      type: 'mock',
      desc: 'Complete 1 Sectional Mock Test',
      targetCount: 1,
      actualCount: progress.dailyMocksAttempted || 0,
      time: '45 min',
      xpReward: 50,
      completed: false
    },
    {
      id: 'task-3',
      subject: 'Revision',
      type: 'revision',
      desc: 'DBMS Normalization Concept Check',
      targetCount: 5,
      actualCount: progress.dailyRevisionCount || 0,
      time: '20 min',
      xpReward: 15,
      completed: false
    }
  ]);

  // Sync tasks with real progress and auto-complete
  useEffect(() => {
    setTasks(prev => prev.map(task => {
      let current = 0;
      if (task.type === 'practice') current = progress.dailyQuestionsSolved;
      if (task.type === 'mock') current = progress.dailyMocksAttempted;
      if (task.type === 'revision') current = progress.dailyRevisionCount;

      const newlyCompleted = current >= task.targetCount && !task.completed;
      
      if (newlyCompleted) {
        // Trigger rewards once
        onUpdateProgress({
          points: (progress.points || 0) + task.xpReward
        });
        setShowCompletionToast(true);
        setTimeout(() => setShowCompletionToast(false), 3000);
      }

      return {
        ...task,
        actualCount: current,
        completed: current >= task.targetCount
      };
    }));
  }, [progress.dailyQuestionsSolved, progress.dailyMocksAttempted, progress.dailyRevisionCount]);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const overallPercentage = Math.round((completedTasks / totalTasks) * 100);
  
  // Calculate remaining time
  const remainingTime = tasks.reduce((acc, t) => {
    if (t.completed) return acc;
    const mins = parseInt(t.time.split(' ')[0]);
    const progressFactor = 1 - (t.actualCount / t.targetCount);
    return acc + (mins * progressFactor);
  }, 0);

  const handleGeneratePlan = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 text-left relative">
      <AnimatePresence>
        {showCompletionToast && (
          <motion.div 
            initial={{ opacity: 0, y: 20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-8 left-1/2 z-[100] px-6 py-3 bg-indigo-600 border border-indigo-400 text-white rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-sm"
          >
            <Award className="w-5 h-5 text-amber-300" />
            <span>Task Auto-Completed! XP Reward Added.</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-indigo-900/40 via-purple-900/20 w-full p-6 rounded-3xl border border-indigo-500/30 shadow-lg shadow-indigo-900/20 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
         
         <div className="relative z-10 space-y-2">
            <div className="flex items-center gap-2">
               <Zap className="w-5 h-5 text-amber-400" />
               <h3 className="text-xl font-black text-white font-sans tracking-tight">AI Execution Hub</h3>
            </div>
            <p className="text-xs text-slate-400 font-medium max-w-xl">
              Watching your real-time activity. Tasks automatically complete as you interact with the platform.
            </p>
         </div>

         <div className="flex flex-col items-end gap-1 shrink-0 relative z-10">
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
               <Timer className="w-3.5 h-3.5" /> Est. Time Remaining
            </span>
            <span className="text-lg font-black text-white font-mono">
               {remainingTime > 0 ? `${Math.ceil(remainingTime)}m` : 'Goal Reached!'}
            </span>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Tracker Panel */}
        <div className="md:col-span-4 space-y-6">
           <div className="bg-[#0e101a]/80 p-6 rounded-3xl border border-white/5 space-y-6">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Daily Completion</h4>
                <div className="flex items-baseline gap-2 my-2">
                   <div className="text-4xl font-black text-white">{overallPercentage}%</div>
                   <div className="text-xs text-emerald-400 font-bold">+{progress.points || 0} XP Today</div>
                </div>
                <div className="w-full bg-black/50 h-2.5 rounded-full overflow-hidden">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: `${overallPercentage}%` }}
                     transition={{ duration: 0.5 }}
                     className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                   />
                </div>
                <p className="text-[10px] text-slate-500 mt-2 font-mono">{completedTasks} of {totalTasks} goals reached</p>
              </div>

              <div className="pt-5 border-t border-white/5 space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Activity Calibration</h4>
                <div className="space-y-3">
                   <div className="flex justify-between items-center text-[11px]">
                     <span className="text-slate-400">Questions Solved</span>
                     <span className="text-white font-mono font-bold">{progress.dailyQuestionsSolved}/15</span>
                   </div>
                   <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500" style={{ width: `${Math.min((progress.dailyQuestionsSolved/15)*100, 100)}%` }} />
                   </div>

                   <div className="flex justify-between items-center text-[11px]">
                     <span className="text-slate-400">Mock Progress</span>
                     <span className="text-white font-mono font-bold">{progress.dailyMocksAttempted}/1</span>
                   </div>
                   <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500" style={{ width: `${Math.min((progress.dailyMocksAttempted/1)*100, 100)}%` }} />
                   </div>
                </div>
              </div>
           </div>
        </div>

        {/* Task List Panel */}
        <div className="md:col-span-8 space-y-3">
           {tasks.map((task, index) => {
              const progressPct = Math.min((task.actualCount / task.targetCount) * 100, 100);
              return (
                <motion.div 
                    key={task.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`group relative flex flex-col p-5 rounded-2xl border transition-all ${task.completed ? 'bg-emerald-500/5 border-emerald-500/20 border-l-4 border-l-emerald-500' : 'bg-white/[0.02] border-white/5 hover:border-indigo-500/30'}`}
                >
                    <div className="flex items-center justify-between z-10">
                        <div className="flex items-center gap-4">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all shrink-0 ${task.completed ? 'bg-emerald-500 border-emerald-500' : 'bg-transparent border-slate-700'}`}>
                                {task.completed && <CheckCircle2 className="w-4 h-4 text-[#05060b]" />}
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${task.completed ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/10 text-slate-300'}`}>
                                    {task.subject}
                                    </span>
                                    <span className="text-[9px] font-mono text-slate-500 tracking-tighter">
                                        REWARD: +{task.xpReward} XP
                                    </span>
                                </div>
                                <h4 className={`text-sm md:text-base font-bold transition-all ${task.completed ? 'text-slate-400 line-through' : 'text-white'}`}>{task.desc}</h4>
                            </div>
                        </div>
                        <div className={`flex flex-col items-end gap-1 text-xs font-mono shrink-0 ml-4 ${task.completed ? 'text-emerald-400' : 'text-slate-400'}`}>
                            <div className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5" />
                                <span>{task.time}</span>
                            </div>
                            {!task.completed && <span className="text-[10px] text-indigo-400">{Math.round(progressPct)}% progress</span>}
                        </div>
                    </div>
                    
                    {/* Background Progress Fill */}
                    {!task.completed && (
                        <div 
                          className="absolute bottom-0 left-0 h-1 bg-indigo-500/20 transition-all duration-700" 
                          style={{ width: `${progressPct}%` }}
                        />
                    )}
                </motion.div>
              );
           })}

           <div className="pt-4 flex justify-between items-center text-xs text-slate-500 border-t border-white/5 font-mono">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-3 h-3 animate-spin text-slate-700" />
                <span>DYNAMIC ACTIVITY SYNC ACTIVE</span>
              </div>
              <button 
                onClick={handleGeneratePlan}
                className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                <span>RE-CALIBRATE PLAN</span>
                <ChevronRight className="w-3 h-3" />
              </button>
           </div>
        </div>

      </div>
    </div>
  );
}
