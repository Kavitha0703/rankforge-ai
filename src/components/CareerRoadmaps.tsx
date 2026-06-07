import React, { useState } from 'react';
import { 
  Compass, 
  Code2, 
  Database, 
  ShieldCheck, 
  Cpu, 
  Terminal, 
  BarChart, 
  CheckCircle2, 
  ArrowRight, 
  Briefcase, 
  Trophy, 
  Star,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Boxes,
  Workflow
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type CareerTrack = 'SWE' | 'DS' | 'AI' | 'CS' | 'DEVOPS' | 'PM';

interface RoadmapStep {
  title: string;
  skills: string[];
  projects?: string[];
  certifications?: string[];
}

interface Roadmap {
  id: CareerTrack;
  title: string;
  description: string;
  icon: any;
  color: string;
  salary: string;
  demand: 'High' | 'Very High' | 'Critical';
  steps: RoadmapStep[];
}

export default function CareerRoadmaps() {
  const [selectedTrack, setSelectedTrack] = useState<CareerTrack>('SWE');
  const [expandedStep, setExpandedStep] = useState<number | null>(0);

  const roadmaps: Roadmap[] = [
    {
      id: 'SWE',
      title: 'Software Engineer',
      description: 'Focus on full-stack web and mobile application development using modern frameworks.',
      icon: Code2,
      color: 'indigo',
      salary: '₹10L - ₹35L LPA',
      demand: 'Very High',
      steps: [
        {
          title: 'Foundations & Algorithm Mastery',
          skills: ['Data Structures (Trees, Graphs)', 'Algorithms (DP, Greedy)', 'Java/C++/Python', 'Time Complexity'],
          projects: ['Advanced CLI Tools', 'Logic Optimizers'],
          certifications: ['LeetCode Top 100', 'Codeforces Specialist']
        },
        {
          title: 'Modern Tech Stacks',
          skills: ['React/Next.js', 'Node.js/Go', 'PostgreSQL/Redis', 'TypeScript'],
          projects: ['Real-time Collaboration Platform', 'Complex Data Dashboards'],
          certifications: ['Meta Full Stack', 'AWS Certified Developer']
        },
        {
          title: 'System Design & Scalability',
          skills: ['Load Balancing', 'Microservices', 'Caching Strategies', 'Message Queues'],
          projects: ['Distributed Notification System', 'URL Shortener at Scale']
        }
      ]
    },
    {
      id: 'AI',
      title: 'AI & ML Engineer',
      description: 'Design and deploy machine learning models and large language models for production.',
      icon: Cpu,
      color: 'rose',
      salary: '₹15L - ₹50L LPA',
      demand: 'Critical',
      steps: [
        {
          title: 'Math & Statistical Rigor',
          skills: ['Linear Algebra', 'Multivariable Calculus', 'Probability', 'Optimization'],
          certifications: ['DeepLearning.AI Spec', 'Mathematics for ML']
        },
        {
          title: 'Model Development',
          skills: ['PyTorch/TensorFlow', 'Scikit-Learn', 'Feature Engineering', 'NLP/Computer Vision'],
          projects: ['Sentiment Analysis Engine', 'Object Detection App']
        },
        {
          title: 'LLM & Generative AI',
          skills: ['RAG Architectures', 'Fine-tuning (LoRA)', 'Vector DBs (Pinecone)', 'Prompt Engineering'],
          projects: ['Custom Knowledge AI Assistant', 'Style Transfer Generator']
        }
      ]
    },
    {
      id: 'DS',
      title: 'Data Scientist',
      description: 'Analyze complex data sets to provide actionable business intelligence and predictions.',
      icon: Database,
      color: 'emerald',
      salary: '₹12L - ₹40L LPA',
      demand: 'High',
      steps: [
        {
          title: 'Data Processing & Storage',
          skills: ['SQL Mastery', 'Pandas/NumPy', 'Spark/Hadoop', 'Data Warehousing'],
        },
        {
          title: 'Visualization & Storytelling',
          skills: ['Tableau/Power BI', 'D3.js', 'Storytelling with Data', 'Matplotlib'],
          projects: ['COVID-19 Global Trends Tracker', 'Retail E-commerce Analytics']
        }
      ]
    }
  ];

  const currentRoadmap = roadmaps.find(r => r.id === selectedTrack) || roadmaps[0];

  return (
    <div className="flex flex-col h-full bg-[#05060b] animate-fadeIn">
      {/* Hero Sidebar-like Nav */}
      <div className="px-8 py-8 border-b border-white/5 bg-gradient-to-r from-indigo-500/5 to-transparent flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[10px] text-indigo-400 font-black uppercase tracking-[0.2em] mb-1">
             <Workflow className="w-4 h-4" />
             <span>Post-Exam Strategy • Career Architect</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter">Career Roadmaps</h1>
          <p className="text-slate-400 text-sm max-w-lg font-medium">Expert-curated paths to help MCA students transition into high-paying tech roles.</p>
        </div>

        <div className="flex flex-wrap gap-2">
           {roadmaps.map(r => {
             const Icon = r.icon;
             return (
               <button
                 key={r.id}
                 onClick={() => { setSelectedTrack(r.id); setExpandedStep(0); }}
                 className={`px-4 py-2.5 rounded-2xl flex items-center gap-3 transition-all font-bold text-xs border ${
                   selectedTrack === r.id 
                     ? `bg-${r.color}-600/10 border-${r.color}-500/30 text-${r.color}-400 shadow-lg shadow-${r.color}-500/5` 
                     : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10 hover:text-white'
                 }`}
               >
                 <Icon className="w-4 h-4" />
                 <span>{r.title}</span>
               </button>
             );
           })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 lg:px-12 lg:py-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
         {/* Left: Summary & Market Info */}
         <div className="lg:col-span-4 space-y-6">
            <div className={`p-8 bg-${currentRoadmap.color}-600/5 border border-${currentRoadmap.color}-500/10 rounded-[32px] space-y-6 relative overflow-hidden`}>
               <div className={`absolute top-0 right-0 w-32 h-32 bg-${currentRoadmap.color}-500/10 blur-[80px] -translate-y-16 translate-x-16`} />
               <div className={`w-14 h-14 bg-${currentRoadmap.color}-500/10 rounded-2xl flex items-center justify-center text-${currentRoadmap.color}-400 mb-2`}>
                  <currentRoadmap.icon className="w-8 h-8" />
               </div>
               <div>
                  <h2 className="text-2xl font-black text-white tracking-tight leading-tight">{currentRoadmap.title}</h2>
                  <p className="text-sm text-slate-400 mt-2 leading-relaxed">{currentRoadmap.description}</p>
               </div>

               <div className="space-y-4 pt-4">
                  <div className="flex items-center justify-between">
                     <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Market Demand</span>
                     <span className={`text-[10px] font-black uppercase tracking-widest ${currentRoadmap.demand === 'Critical' ? 'text-rose-500' : 'text-emerald-500'}`}>{currentRoadmap.demand}</span>
                  </div>
                  <div className="flex items-center justify-between">
                     <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Comp. Range (LPA)</span>
                     <span className="text-sm font-black text-white">{currentRoadmap.salary}</span>
                  </div>
               </div>
            </div>

            <div className="p-8 bg-[#0a0b14] border border-white/10 rounded-[32px] space-y-6">
               <div className="flex items-center gap-3">
                  <Trophy className="w-5 h-5 text-amber-400" />
                  <h4 className="font-black text-white uppercase tracking-tight text-sm">Key Benchmarks</h4>
               </div>
               <div className="space-y-3">
                  {['Tier 1 MCA College Degree', '3+ High-Impact Projects', 'LeetCode (400+ Solved)', 'Specialized Internship'].map(b => (
                    <div key={b} className="flex items-center gap-3 text-xs text-slate-400">
                       <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                       <span>{b}</span>
                    </div>
                  ))}
               </div>
            </div>
         </div>

         {/* Right: Steps Roadmap */}
         <div className="lg:col-span-8">
            <div className="relative space-y-8 pl-8">
               {/* Vertical Connection Line */}
               <div className="absolute left-0 top-6 bottom-6 w-0.5 bg-gradient-to-b from-indigo-500 via-indigo-500/20 to-transparent" />

               {currentRoadmap.steps.map((step, idx) => (
                 <motion.div 
                   key={idx}
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: idx * 0.1 }}
                   className="relative"
                 >
                    {/* Node Dot */}
                    <div className={`absolute -left-10 top-2 w-4 h-4 rounded-full border-2 border-[#05060b] shadow-xl ${expandedStep === idx ? 'bg-indigo-500 scale-125' : 'bg-slate-700'} transition-all`} />
                    
                    <div className={`p-8 bg-[#0a0b14] border rounded-3xl transition-all cursor-pointer ${expandedStep === idx ? 'border-indigo-500/30 ring-1 ring-indigo-500/10' : 'border-white/5 hover:border-white/10'}`} onClick={() => setExpandedStep(expandedStep === idx ? null : idx)}>
                       <div className="flex items-center justify-between mb-4">
                          <div className="space-y-1">
                             <span className="text-[10px] text-indigo-400 font-black uppercase tracking-widest">Phase 0{idx + 1}</span>
                             <h3 className="text-xl font-black text-white tracking-tight">{step.title}</h3>
                          </div>
                          {expandedStep === idx ? <ChevronUp className="w-5 h-5 text-slate-600" /> : <ChevronDown className="w-5 h-5 text-slate-600" />}
                       </div>

                       <AnimatePresence>
                          {expandedStep === idx && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                                  <div className="space-y-4">
                                     <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Core Skillset</h5>
                                     <div className="flex flex-wrap gap-2">
                                        {step.skills.map(s => (
                                          <span key={s} className="px-3 py-1 bg-white/5 border border-white/5 rounded-xl text-xs text-white/80 font-bold">{s}</span>
                                        ))}
                                     </div>
                                  </div>
                                  
                                  {(step.projects || step.certifications) && (
                                    <div className="space-y-6">
                                       {step.projects && (
                                         <div className="space-y-3">
                                            <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Recommended Projects</h5>
                                            <div className="space-y-2">
                                               {step.projects.map(p => (
                                                 <div key={p} className="flex items-center gap-2 text-xs text-slate-400 group/item">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/40" />
                                                    <span className="group-hover/item:text-white transition-colors">{p}</span>
                                                 </div>
                                               ))}
                                            </div>
                                         </div>
                                       )}
                                       {step.certifications && (
                                         <div className="space-y-3">
                                            <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Top Certifications</h5>
                                            <div className="space-y-2">
                                               {step.certifications.map(c => (
                                                 <div key={c} className="flex items-center gap-2 text-xs text-slate-400">
                                                    <Star className="w-3 h-3 text-amber-500 fill-current" />
                                                    <span>{c}</span>
                                                 </div>
                                               ))}
                                            </div>
                                         </div>
                                       )}
                                    </div>
                                  )}
                               </div>
                            </motion.div>
                          )}
                       </AnimatePresence>
                    </div>
                 </motion.div>
               ))}
            </div>

            <div className="mt-12 p-10 bg-gradient-to-br from-[#0a0b14] to-indigo-950/20 border border-white/10 rounded-[40px] flex flex-col md:flex-row items-center gap-10">
               <div className="w-24 h-24 bg-indigo-600/10 border border-indigo-600/20 rounded-[32px] flex items-center justify-center flex-shrink-0">
                  <Terminal className="w-10 h-10 text-indigo-400" />
               </div>
               <div className="space-y-4">
                  <h4 className="text-xl font-black text-white tracking-tight">Need a Personalized Project Roadmap?</h4>
                  <p className="text-slate-400 text-sm leading-relaxed max-w-lg">Aris AI can draft a custom 30-day technical project plan based on your chosen career track and current coding knowledge.</p>
                  <button className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-black transition-all shadow-xl shadow-indigo-600/20 flex items-center gap-2 active:scale-95">
                     Connect with AI Career Mentor <ArrowRight className="w-4 h-4" />
                  </button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
