import React, { useState, useMemo } from 'react';
import { 
  GitMerge, 
  Layers, 
  CheckCircle2, 
  Circle, 
  Lock, 
  ArrowRight, 
  Brain, 
  Sparkles, 
  Info,
  ChevronRight,
  Target,
  Zap,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ExamType } from '../types';

interface ConceptNode {
  id: string;
  name: string;
  status: 'locked' | 'unlocked' | 'completed';
  dependencies: string[];
  importance: 'Required' | 'Recommended' | 'Optional';
  mastery: number; // 0-100
  subject: string;
}

interface ConceptGraphProps {
  exam: ExamType;
}

export default function ConceptGraph({ exam }: ConceptGraphProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  
  const nodes: ConceptNode[] = [
    { id: 'sets', name: 'Sets & Relations', status: 'completed', dependencies: [], importance: 'Required', mastery: 95, subject: 'Mathematics' },
    { id: 'counting', name: 'Basic Counting', status: 'completed', dependencies: [], importance: 'Required', mastery: 100, subject: 'Mathematics' },
    { id: 'logic', name: 'Basic Logic', status: 'completed', dependencies: [], importance: 'Required', mastery: 88, subject: 'Logical Reasoning' },
    { id: 'trig', name: 'Trigonometry', status: 'unlocked', dependencies: [], importance: 'Required', mastery: 45, subject: 'Mathematics' },
    { id: 'pac', name: 'Permutations & Combinations', status: 'unlocked', dependencies: ['sets', 'counting'], importance: 'Required', mastery: 62, subject: 'Mathematics' },
    { id: 'prob', name: 'Probability', status: 'locked', dependencies: ['pac'], importance: 'Required', mastery: 0, subject: 'Mathematics' },
    { id: 'bayes', name: 'Bayes Theorem', status: 'locked', dependencies: ['prob'], importance: 'Required', mastery: 0, subject: 'Mathematics' },
    { id: 'calc', name: 'Calculus', status: 'locked', dependencies: ['trig'], importance: 'Required', mastery: 0, subject: 'Mathematics' },
    { id: 'dbms_intro', name: 'DBMS Intro', status: 'completed', dependencies: [], importance: 'Required', mastery: 100, subject: 'Computer Awareness' },
    { id: 'rel_alg', name: 'Relational Algebra', status: 'unlocked', dependencies: ['dbms_intro'], importance: 'Required', mastery: 40, subject: 'Computer Awareness' },
    { id: 'norm', name: 'Normalization', status: 'locked', dependencies: ['rel_alg'], importance: 'Required', mastery: 0, subject: 'Computer Awareness' },
    { id: 'sql', name: 'SQL Mastery', status: 'locked', dependencies: ['norm'], importance: 'Recommended', mastery: 0, subject: 'Computer Awareness' },
  ];

  const selectedNode = useMemo(() => nodes.find(n => n.id === selectedNodeId), [selectedNodeId]);

  const dependencyChain = useMemo(() => {
    if (!selectedNodeId) return [];
    const chain: ConceptNode[] = [];
    let currentId: string | undefined = selectedNodeId;
    
    const findNode = (id: string) => nodes.find(n => n.id === id);
    
    const buildChain = (id: string) => {
      const node = findNode(id);
      if (node) {
        node.dependencies.forEach(depId => buildChain(depId));
        if (!chain.find(n => n.id === node.id)) {
          chain.push(node);
        }
      }
    };
    
    buildChain(selectedNodeId);
    return chain;
  }, [selectedNodeId, nodes]);

  return (
    <div className="p-8 space-y-8 bg-[#05060b] min-h-full animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
           <div className="flex items-center gap-2 text-[10px] text-indigo-400 font-black uppercase tracking-[0.2em] mb-1">
              <GitMerge className="w-4 h-4" />
              <span>Smart Dependency Engine • Concept Mapping</span>
           </div>
           <h1 className="text-4xl font-black text-white tracking-tighter">AI Concept Graph</h1>
           <p className="text-slate-400 text-sm max-w-lg font-medium">Visualize prerequisite relationships and track your conceptual mastery path for {exam}.</p>
        </div>

        <div className="flex items-center gap-3 p-1.5 bg-white/5 border border-white/10 rounded-2xl">
           {['Mathematics', 'Logical Reasoning', 'Computer Awareness'].map(s => (
             <button key={s} className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all whitespace-nowrap">{s}</button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Graph View (Simulated with Grid) */}
        <div className="lg:col-span-8 bg-[#0a0b14]/50 border border-white/10 rounded-[40px] p-10 min-h-[600px] flex items-center justify-center relative overflow-hidden">
           <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:40px_40px]" />
           <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] -translate-y-32 translate-x-32" />
           
           <div className="relative z-10 grid grid-cols-3 gap-16 md:gap-24">
              {nodes.map((node, idx) => (
                <motion.div 
                  key={node.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => setSelectedNodeId(node.id)}
                  className={`relative flex flex-col items-center gap-4 cursor-pointer group`}
                >
                   {/* Prerequisite Line Simulation (for specific pairs) */}
                   {node.dependencies.length > 0 && (
                     <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-0.5 h-12 bg-white/5" />
                   )}
                   
                   <div className={`w-20 h-20 rounded-[24px] border-2 transition-all flex items-center justify-center relative shadow-2xl ${
                     selectedNodeId === node.id 
                      ? 'border-indigo-500 bg-indigo-500/10 ring-4 ring-indigo-500/10' 
                      : node.status === 'completed' 
                        ? 'border-emerald-500/40 bg-emerald-500/5 hover:border-emerald-500' 
                        : node.status === 'unlocked'
                          ? 'border-white/10 bg-white/5 hover:border-white/30'
                          : 'border-white/5 bg-black/20 opacity-40'
                   }`}>
                      {node.status === 'completed' ? <CheckCircle2 className="w-8 h-8 text-emerald-500" /> : 
                       node.status === 'unlocked' ? <Circle className="w-8 h-8 text-slate-500" /> : 
                       <Lock className="w-8 h-8 text-slate-700" />}
                      
                      {/* Mastery Mini Circular Progress */}
                      {node.mastery > 0 && (
                        <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#0a0b14] border border-white/10 rounded-full flex items-center justify-center text-[8px] font-black text-indigo-400">
                           {node.mastery}%
                        </div>
                      )}
                   </div>
                   <span className={`text-[10px] font-black uppercase text-center tracking-widest max-w-[100px] ${selectedNodeId === node.id ? 'text-indigo-400' : 'text-slate-500 group-hover:text-white'}`}>
                      {node.name}
                   </span>
                </motion.div>
              ))}
           </div>
        </div>

        {/* Node Detail Sidebar */}
        <div className="lg:col-span-4 space-y-6">
           <AnimatePresence mode="wait">
             {selectedNode ? (
               <motion.div 
                 key={selectedNode.id}
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: 20 }}
                 className="p-8 bg-[#0a0b14] border border-white/10 rounded-[32px] space-y-8 h-full"
               >
                  <div className="space-y-4">
                     <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{selectedNode.subject}</span>
                        <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${
                          selectedNode.importance === 'Required' ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' : 'bg-white/5 border-white/10 text-slate-400'
                        }`}>
                           {selectedNode.importance}
                        </div>
                     </div>
                     <h2 className="text-3xl font-black text-white tracking-tight leading-[0.9]">{selectedNode.name}</h2>
                     <div className="space-y-2">
                        <div className="flex justify-between text-[11px]">
                           <span className="text-slate-500 flex items-center gap-1.5"><Activity className="w-3.5 h-3.5" /> Concept Mastery</span>
                           <span className="text-white font-black">{selectedNode.mastery}%</span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                           <div style={{ width: `${selectedNode.mastery}%` }} className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                        </div>
                     </div>
                  </div>

                   <div className="space-y-4">
                     <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                       <Layers className="w-3.5 h-3.5" /> Prerequisite Roadmap
                     </h4>
                     <div className="relative pl-4 space-y-6">
                        {/* Vertical line helper */}
                        <div className="absolute left-1.5 top-2 bottom-2 w-px bg-white/5" />
                        
                        {dependencyChain.map((dep, idx) => (
                          <div key={dep.id} className="relative flex flex-col gap-1">
                             {/* Connector dot */}
                             <div className={`absolute -left-[14.5px] top-1.5 w-3 h-3 rounded-full border-2 bg-[#0a0b14] z-10 ${
                               dep.status === 'completed' ? 'border-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]' : dep.status === 'unlocked' ? 'border-white/20' : 'border-white/5'
                             }`} />
                             
                             <div className="flex items-center gap-3">
                                <span className={`text-xs font-bold ${dep.id === selectedNode.id ? 'text-indigo-400 font-black' : 'text-slate-400'}`}>
                                  {dep.name}
                                </span>
                                {dep.status === 'completed' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 ml-auto" />}
                             </div>
                             
                             {dep.dependencies.length > 0 && (
                               <div className="flex flex-wrap gap-1 mt-1">
                                 {dep.dependencies.map(dId => (
                                   <span key={dId} className="text-[8px] px-1.5 py-0.5 bg-white/5 rounded border border-white/5 text-slate-500 font-mono">
                                     ← {nodes.find(n => n.id === dId)?.name || dId}
                                   </span>
                                 ))}
                               </div>
                             )}
                          </div>
                        ))}
                     </div>
                  </div>

                  <div className="p-6 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl hover:bg-indigo-500/10 transition-all cursor-pointer group">
                     <div className="flex items-center gap-3 mb-2">
                        <Brain className="w-5 h-5 text-indigo-400" />
                        <h4 className="text-sm font-black text-white uppercase tracking-tight">AI Diagnostic</h4>
                     </div>
                     <p className="text-xs text-slate-500 leading-relaxed group-hover:text-slate-400">
                        {selectedNode.status === 'completed' 
                          ? `You have mastered ${selectedNode.name}. You are ready for ${selectedNode.id === 'pac' ? 'Probability' : 'the next level'}.` 
                          : `Stuck here? Unlock this chapter by solving 10 base questions from ${nodes.find(n => n.id === selectedNode.dependencies[0])?.name || 'foundations'}.`
                        }
                     </p>
                  </div>

                  <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-3 group active:scale-95">
                     <span>Learn this Concept</span>
                     <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
               </motion.div>
             ) : (
               <div className="p-8 bg-[#0a0b14]/30 border border-white/5 border-dashed rounded-[32px] h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-slate-700">
                     <Info className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                     <h4 className="text-lg font-black text-slate-400">Select a Module</h4>
                     <p className="text-xs text-slate-600 max-w-[200px]">Click on a node in the graph to view prerequisites and AI diagnostics.</p>
                  </div>
               </div>
             )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
