import React, { useMemo } from 'react';
import { 
  Target, 
  TrendingUp, 
  Zap, 
  Map, 
  Trophy, 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Sword,
  Shield,
  Flag,
  Crosshair,
  Sparkles,
  Flame,
  Brain
} from 'lucide-react';
import { motion } from 'motion/react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';
import { UserProgress, ExamType } from '../types';

interface WarRoomProps {
  user: UserProgress;
  exam: ExamType;
  onNavigateToTutor: (prompt: string) => void;
}

export default function WarRoom({ user, exam, onNavigateToTutor }: WarRoomProps) {
  // Mock performance trend
  const performanceTrend = [
    { day: 'Mon', score: 450 },
    { day: 'Tue', score: 480 },
    { day: 'Wed', score: 465 },
    { day: 'Thu', score: 510 },
    { day: 'Fri', score: 540 },
    { day: 'Sat', score: 525 },
    { day: 'Sun', score: 580 },
  ];

  const gapAnalysis = useMemo(() => {
    return [
      { id: 1, label: 'Accuracy', current: '76%', target: '85%', color: 'rose', val: 76, targetVal: 85 },
      { id: 2, label: 'Speed', current: '1.2m/q', target: '45s/q', color: 'indigo', val: 120, targetVal: 45 },
      { id: 3, label: 'Mock Mastery', current: '7 Mocks', target: '20 Mocks', color: 'amber', val: 7, targetVal: 20 },
    ];
  }, []);

  const successProbabilities = [
    { range: 'Top 50', prob: 18, color: 'text-rose-500' },
    { range: 'Top 100', prob: 42, color: 'text-amber-500' },
    { range: 'Top 500', prob: 87, color: 'text-emerald-500' },
  ];

  return (
    <div className="p-8 space-y-8 bg-[#05060b] min-h-full animate-fadeIn">
      {/* Header Banner */}
      <div className="relative p-10 bg-gradient-to-br from-indigo-950/40 via-[#0a0b14] to-rose-950/20 border border-white/10 rounded-[40px] overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Sword className="w-64 h-64 rotate-12" />
        </div>
        
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-3">
             <div className="px-3 py-1 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-2">
                <Flame className="w-3.5 h-3.5" />
                <span>Mission Critical • War Room Active</span>
             </div>
             <div className="px-3 py-1 bg-white/5 border border-white/10 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-full">
                Target AIR: {user.targetRank}
             </div>
          </div>
          
          <h1 className="text-5xl font-black text-white tracking-tighter max-w-2xl leading-[1.1]">
            Projecting AIR <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-indigo-400">178</span> for {exam}.
          </h1>
          <p className="text-slate-400 text-lg max-w-xl font-medium">
            You are 128 positions away from your target. The next 14 days are critical for fundamental speed optimization.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
             <div className="flex items-center gap-3 px-5 py-3 bg-white/5 border border-white/10 rounded-2xl">
                <Crosshair className="w-6 h-6 text-indigo-400" />
                <div>
                   <span className="block text-[10px] text-slate-500 font-black uppercase tracking-wider">Gap to AIR 50</span>
                   <span className="block text-xl font-black text-white">+115 Score</span>
                </div>
             </div>
             <div className="flex items-center gap-3 px-5 py-3 bg-white/5 border border-white/10 rounded-2xl">
                <Shield className="w-6 h-6 text-emerald-400" />
                <div>
                   <span className="block text-[10px] text-slate-500 font-black uppercase tracking-wider">Focus Stability</span>
                   <span className="block text-xl font-black text-white">92%</span>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Probability Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {successProbabilities.map(p => (
          <div key={p.range} className="relative p-6 bg-white/5 border border-white/10 rounded-3xl overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 blur-3xl -translate-y-12 translate-x-12" />
            <span className="block text-[10px] text-slate-500 font-black uppercase tracking-widest mb-4">Probability • {p.range}</span>
            <div className="flex items-end gap-3 mb-6">
               <span className={`text-4xl font-black ${p.color} tracking-tighter`}>{p.prob}%</span>
               <TrendingUp className="w-5 h-5 text-slate-600 mb-2" />
            </div>
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: `${p.prob}%` }}
                 transition={{ duration: 1, delay: 0.2 }}
                 className={`h-full bg-gradient-to-r ${p.range === 'Top 50' ? 'from-rose-500 to-rose-400' : 'from-indigo-500 to-indigo-400'}`}
               />
            </div>
          </div>
        ))}
      </div>

      {/* Main Analysis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Strategy Roadmap */}
        <div className="lg:col-span-2 space-y-6">
           <div className="p-8 bg-[#0a0b14] border border-white/10 rounded-[32px] space-y-8">
              <div className="flex items-center justify-between">
                 <h3 className="text-xl font-black text-white flex items-center gap-3">
                    <Flag className="w-6 h-6 text-indigo-400" />
                    Strategic Gap Analysis
                 </h3>
                 <button className="text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:text-white transition-colors">Generate Action Plan</button>
              </div>

              <div className="space-y-8">
                 {gapAnalysis.map(item => (
                   <div key={item.id} className="space-y-3">
                      <div className="flex justify-between items-end">
                         <div>
                            <span className="block text-xs font-bold text-white mb-0.5">{item.label}</span>
                            <span className="block text-[10px] text-slate-500 font-mono">Current: <span className="text-white">{item.current}</span> vs Target: <span className="text-indigo-400">{item.target}</span></span>
                         </div>
                         <div className="text-right">
                            <span className={`text-xs font-bold ${item.val < item.targetVal ? 'text-rose-400' : 'text-emerald-400'}`}>
                               {item.val < item.targetVal ? `-${(item.targetVal - item.val).toFixed(0)}${item.label === 'Accuracy' ? '%' : ''} Gap` : 'Target Met'}
                            </span>
                         </div>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden flex">
                         <div style={{ width: `${(item.val / item.targetVal) * 100}%` }} className={`h-full ${item.color === 'rose' ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.3)]' : item.color === 'indigo' ? 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.3)]' : 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.3)]'}`} />
                      </div>
                   </div>
                 ))}
              </div>

              {/* Trend Chart */}
              <div className="pt-8 border-t border-white/5">
                 <div className="flex items-center justify-between mb-6">
                    <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Mock Intelligence Trend</span>
                    <div className="flex items-center gap-4">
                       <div className="flex items-center gap-1.5 text-xs text-white/60">
                          <div className="w-2 h-2 rounded-full bg-indigo-500" />
                          <span>Score History</span>
                       </div>
                    </div>
                 </div>
                 <div className="h-56 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={performanceTrend}>
                        <defs>
                          <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                        <XAxis dataKey="day" hide />
                        <YAxis hide />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#05060b', border: '1px solid #ffffff10', borderRadius: '12px' }}
                          labelStyle={{ display: 'none' }}
                        />
                        <Area type="monotone" dataKey="score" stroke="#6366f1" fillOpacity={1} fill="url(#colorScore)" strokeWidth={3} />
                      </AreaChart>
                    </ResponsiveContainer>
                 </div>
              </div>
           </div>
        </div>

        {/* Right: AI Coaching Diagnostics */}
        <div className="space-y-6">
           <div className="p-8 bg-[#0a0b14] border border-white/10 rounded-[32px] space-y-6">
              <h3 className="text-xl font-black text-white flex items-center gap-3">
                 <Zap className="w-6 h-6 text-amber-400" />
                 AIR 50 Diagnostics
              </h3>

              <div className="space-y-4">
                 {[
                   { label: 'Conceptual Blocker', text: 'Stalling in Conditional Probability and Complex Numbers. Suggest 48h targeted deep-dive.', icon: Brain, color: 'text-indigo-400' },
                   { label: 'Time Management', text: 'Losing 15 mins on average in NIMCET Section B. Abandon tactics for hard questions recommended.', icon: Clock, color: 'text-rose-400' },
                   { label: 'Revision Lag', text: 'You haven\'t revised "OS Scheduling" for 12 days. Predicted retention loss: 35%.', icon: AlertTriangle, color: 'text-amber-400' }
                 ].map((d, i) => (
                   <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-2xl space-y-2">
                      <div className="flex items-center gap-2">
                         <d.icon className={`w-3.5 h-3.5 ${d.color}`} />
                         <span className="text-[10px] font-black text-white uppercase tracking-widest">{d.label}</span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">{d.text}</p>
                   </div>
                 ))}
              </div>

              <button 
                onClick={() => onNavigateToTutor('Aris, I feel stuck. Why is my mock score not increasing despite daily study? Analyze my study time, accuracy, and revision frequency. Provide a specific bottleneck analysis.')}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2 active:scale-95"
              >
                 <Sparkles className="w-4 h-4" />
                 <span>Ask Aris "Why Am I Stuck?"</span>
              </button>
           </div>

           <div className="p-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-[32px] text-white space-y-4 shadow-2xl">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                 <Trophy className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-black tracking-tight">Topper Benchmark</h4>
              <p className="text-indigo-100 text-sm leading-relaxed">
                NIMCET AIR 1 (2025) maintained an average mock score of 720. Your highest is 580. You need +140 points.
              </p>
              <div className="pt-2">
                 <button className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 hover:gap-3 transition-all">
                    View Benchmark Data <ArrowUpRight className="w-3 h-3" />
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
