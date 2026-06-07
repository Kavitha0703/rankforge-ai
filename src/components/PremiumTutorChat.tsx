import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, Bot, User, BrainCircuit, Target, BookOpen, Clock, AlertCircle, Edit3, MessageSquareCode,
  Copy, Share2, Download, Mic, PenTool, RefreshCw, Pin, Plus, Search, CheckCircle, ExternalLink, MessageCircle, BarChart3
} from 'lucide-react';

export function PremiumTutorChat({ user }: { user: any }) {
  const [conversations, setConversations] = useState([
    { id: 'c1', title: 'Probability Strategy', category: 'Today', pinned: true },
    { id: 'c2', title: 'DBMS Revision Plan', category: 'Today', pinned: false },
    { id: 'c3', title: 'NIMCET Mock Analysis', category: 'Yesterday', pinned: false },
    { id: 'c4', title: 'Bayes Theorem Weakness', category: 'Yesterday', pinned: true },
    { id: 'c5', title: 'College Predictor Help', category: 'Previous 7 Days', pinned: false },
  ]);

  const [activeConversationId, setActiveConversationId] = useState('c1');
  const [messages, setMessages] = useState([
    {
      id: 'm1',
      role: 'user',
      text: 'Explain Bayes Theorem for NIMCET',
    },
    {
      id: 'm2',
      role: 'assistant',
      isPremiumRender: true,
      text: 'Here is a comprehensive breakdown of Bayes Theorem designed specifically for NIMCET.',
      content: {
        directAnswer: 'Bayes Theorem calculates the probability of an event based on prior knowledge of conditions related to the event. It essentially allows you to "reverse" conditional probabilities.',
        formula: 'P(A|B) = \\frac{P(B|A) \\cdot P(A)}{P(B)}',
        difficulty: 'Hard',
        importance: 'High (2-3 questions in NIMCET)',
        flowchart: [
          { steps: ['Probability', 'Sample Space', 'Counting Techniques', 'Conditional Prob', 'Bayes Theorem'] }
        ],
        stats: [
          { topic: 'Probability', mastery: 70 },
          { topic: 'DBMS', mastery: 90 },
          { topic: 'Reasoning', mastery: 60 }
        ]
      }
    }
  ]);

  const [inputValue, setInputValue] = useState('');
  const [mentorMode, setMentorMode] = useState<'supportive'|'strict'|'topper'>('topper');
  
  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;
    
    const newMsg = {
      id: Date.now().toString(),
      role: 'user',
      text: inputValue
    };
    
    setMessages(prev => [...prev, newMsg]);
    setInputValue('');
    
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        isPremiumRender: true,
        text: 'Analyzing your query...',
        content: {
          directAnswer: 'I have generated a new strategic response covering fundamental shortcuts and dynamic mapping.',
          formula: 'E = mc^2',
          difficulty: 'Medium',
          importance: 'High',
          flowchart: [],
          stats: []
        }
      }]);
    }, 1200);
  };

  const handleNewChat = () => {
    const newId = 'c' + Date.now();
    setConversations(prev => [{ id: newId, title: 'New Conversation', category: 'Today', pinned: false }, ...prev]);
    setActiveConversationId(newId);
    setMessages([{ id: 'm1', role: 'assistant', text: 'Hello! I am your Premium AI Rank Mentor. What topic would you like to master today?' }]);
  };

  return (
    <div className="flex h-[85vh] min-h-[600px] max-h-[900px] bg-black md:border border-white/10 md:rounded-3xl overflow-hidden font-sans">
      
      {/* LEFT SIDEBAR: History & Chat Management (300px) */}
      <div className="hidden md:flex w-[280px] lg:w-[320px] flex-shrink-0 bg-white/[0.02] border-r border-white/5 flex-col">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-white/5 space-y-3">
          <button 
            onClick={handleNewChat}
            className="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-slate-200 text-indigo-950 rounded-xl font-black text-sm transition-all"
          >
            <span className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Mentor Chat
            </span>
            <Edit3 className="w-4 h-4 opacity-50" />
          </button>
          
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search conversations..." 
              className="w-full bg-black/40 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>
        </div>

        {/* Sidebar Chat List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-5">
          {/* PINNED SECTION */}
          <div className="space-y-1">
            <span className="px-3 text-[10px] font-mono text-slate-500 font-bold uppercase tracking-widest flex items-center gap-1.5">
              <Pin className="w-3 h-3 text-indigo-400" /> Pinned
            </span>
            <div className="space-y-0.5 mt-2">
              {conversations.filter(c => c.pinned).map(c => (
                <button 
                  key={c.id} 
                  onClick={() => setActiveConversationId(c.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs flex items-center justify-between group transition-all ${activeConversationId === c.id ? 'bg-indigo-500/15 text-indigo-200 font-bold' : 'text-slate-400 hover:bg-white/5 hover:text-white font-medium'}`}
                >
                  <span className="truncate pr-4 flex items-center gap-2">
                    <MessageCircle className="w-3.5 h-3.5 opacity-60" />
                    {c.title}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* TODAY SECTION */}
          <div className="space-y-1">
            <span className="px-3 text-[10px] font-mono text-slate-500 font-bold uppercase tracking-widest">Today</span>
            <div className="space-y-0.5 mt-2">
              {conversations.filter(c => !c.pinned && c.category === 'Today').map(c => (
                <button 
                  key={c.id} 
                  onClick={() => setActiveConversationId(c.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs flex items-center justify-between group transition-all ${activeConversationId === c.id ? 'bg-indigo-500/15 text-indigo-200 font-bold' : 'text-slate-400 hover:bg-white/5 hover:text-white font-medium'}`}
                >
                  <span className="truncate pr-4 flex items-center gap-2">
                    <MessageCircle className="w-3.5 h-3.5 opacity-60" />
                    {c.title}
                  </span>
                </button>
              ))}
            </div>
          </div>
          
          {/* YESTERDAY SECTION */}
          <div className="space-y-1">
            <span className="px-3 text-[10px] font-mono text-slate-500 font-bold uppercase tracking-widest">Yesterday</span>
            <div className="space-y-0.5 mt-2">
              {conversations.filter(c => !c.pinned && c.category === 'Yesterday').map(c => (
                <button 
                  key={c.id} 
                  onClick={() => setActiveConversationId(c.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs flex items-center justify-between group transition-all ${activeConversationId === c.id ? 'bg-indigo-500/15 text-indigo-200 font-bold' : 'text-slate-400 hover:bg-white/5 hover:text-white font-medium'}`}
                >
                  <span className="truncate pr-4 flex items-center gap-2">
                    <MessageCircle className="w-3.5 h-3.5 opacity-60" />
                    {c.title}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Footer info */}
        <div className="p-4 border-t border-white/5 text-[10px] text-slate-500 text-center font-medium">
          Encrypted Mentor Session
        </div>
      </div>

      {/* RIGHT MAIN AREA: Chat Window */}
      <div className="flex-1 flex flex-col relative bg-[#0a0a0e]">
        {/* Chat Header */}
        <div className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-black/40 backdrop-blur-md absolute top-0 w-full z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-teal-400 flex items-center justify-center p-[1px]">
              <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
                <BrainCircuit className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
            <div>
              <h3 className="text-white text-sm font-bold flex items-center gap-2">
                Premium AI Tutor <span className="px-1.5 py-0.5 rounded text-[8px] bg-indigo-500/20 text-indigo-300 font-mono uppercase tracking-wider">Aris v4</span>
              </h3>
              <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Active Connection Secured
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 transition-all font-medium">
              <Share2 className="w-3.5 h-3.5" /> Share
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 transition-all font-medium">
              <Download className="w-3.5 h-3.5" /> Export PDF
            </button>
            <div className="w-px h-4 bg-white/10 mx-1" />
            <div className="flex bg-black/40 rounded-lg p-0.5 border border-white/5">
              {['supportive', 'strict', 'topper'].map(mode => (
                <button 
                  key={mode}
                  onClick={() => setMentorMode(mode as any)}
                  className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase transition-all ${mentorMode === mode ? 'bg-indigo-500/20 text-indigo-300 shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto pt-24 pb-32 px-4 md:px-12 space-y-8 scroll-smooth">
          {messages.map(msg => (
            <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              
              {/* Avatar (AI only) */}
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center flex-shrink-0 mt-1">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                </div>
              )}

              {/* Message Content */}
              <div className={`max-w-[85%] space-y-4 ${msg.role === 'user' ? 'bg-indigo-600 text-white px-5 py-3.5 rounded-2xl rounded-tr-none shadow-lg' : 'text-slate-300'}`}>
                {msg.role === 'user' ? (
                  <div className="text-[13px] font-medium leading-relaxed">{msg.text}</div>
                ) : (
                  <div className="space-y-6 w-full">
                    
                    {/* DIRECT ANSWER */}
                    {msg.content?.directAnswer ? (
                      <div className="space-y-1">
                        <span className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                          <Target className="w-3 h-3" /> Direct Answer
                        </span>
                        <p className="text-[14px] leading-relaxed text-slate-200">
                          {msg.content.directAnswer}
                        </p>
                      </div>
                    ) : (
                      <p className="text-[14px] leading-relaxed text-slate-200">{msg.text}</p>
                    )}

                    {/* PREMIUM MATHEMATICS RENDERING */}
                    {msg.content?.formula && (
                      <div className="p-4 bg-slate-900/50 border border-white/10 rounded-2xl flex flex-col items-center justify-center gap-3 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
                        <span className="text-[10px] font-mono font-bold text-slate-500 uppercase self-start">Mathematical Formula</span>
                        <div className="bg-black/60 px-6 py-4 rounded-xl border border-white/5 text-xl font-mono text-emerald-300 tracking-wider font-medium font-serif italic shadow-inner">
                          {msg.content.formula}
                        </div>
                        <button className="absolute right-3 top-3 p-1.5 rounded-lg bg-white/5 opacity-0 group-hover:opacity-100 transition-all text-slate-400 hover:text-white">
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {/* PREMIUM FLOWCHART / DIAGRAM RENDERING */}
                    {msg.content?.flowchart && (
                      <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl space-y-4 relative overflow-hidden">
                        <span className="text-[10px] font-mono font-bold text-slate-500 uppercase flex items-center gap-1.5">
                          <BrainCircuit className="w-3 h-3" /> Concept Map
                        </span>
                        
                        <div className="flex flex-col items-center space-y-2">
                          {msg.content.flowchart[0].steps.map((step: string, idx: number, arr: string[]) => (
                            <React.Fragment key={idx}>
                              <div className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-xs text-indigo-200 font-bold w-48 text-center shadow-lg">
                                {step}
                              </div>
                              {idx < arr.length - 1 && (
                                <div className="h-4 w-px bg-indigo-500/40 relative">
                                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 border-r border-b border-indigo-500/80 rotate-45" />
                                </div>
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* PREMIUM DATA TABLE RENDERING */}
                    {msg.content?.difficulty && (
                      <div className="overflow-hidden border border-white/10 rounded-xl bg-black/40">
                        <table className="w-full text-left text-xs font-sans">
                          <thead className="bg-white/5 border-b border-white/10 text-slate-400 font-mono uppercase">
                            <tr>
                              <th className="px-4 py-2.5 font-semibold">Topic Overview</th>
                              <th className="px-4 py-2.5 font-semibold">Classification</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5 text-slate-300">
                            <tr className="hover:bg-white/[0.02]">
                              <td className="px-4 py-3 font-medium">Difficulty Level</td>
                              <td className="px-4 py-3"><span className="px-2 py-0.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded text-[10px] uppercase font-bold">{msg.content.difficulty}</span></td>
                            </tr>
                            <tr className="hover:bg-white/[0.02]">
                              <td className="px-4 py-3 font-medium">Exam Importance</td>
                              <td className="px-4 py-3"><span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded text-[10px] uppercase font-bold">{msg.content.importance}</span></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* PREMIUM BAR GRAPH (STUDENT STATS) */}
                    {msg.content?.stats && (
                      <div className="space-y-3 p-4 bg-white/5 rounded-2xl border border-white/10">
                         <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                          <BarChart3 className="w-3 h-3" /> Capability Analysis
                        </span>
                        
                        <div className="space-y-3 mt-3">
                          {msg.content.stats.map((stat: any, id: number) => (
                            <div key={id} className="space-y-1">
                              <div className="flex justify-between items-center text-[10px] font-mono">
                                <span className="text-slate-300 font-bold">{stat.topic}</span>
                                <span className={stat.mastery >= 80 ? 'text-emerald-400' : stat.mastery >= 60 ? 'text-amber-400' : 'text-rose-400'}>{stat.mastery}%</span>
                              </div>
                              <div className="w-full bg-black/60 h-2 rounded-full overflow-hidden border border-white/5">
                                <div 
                                  className={`h-full rounded-full transition-all duration-1000 ${stat.mastery >= 80 ? 'bg-emerald-500' : stat.mastery >= 60 ? 'bg-amber-500' : 'bg-rose-500'}`}
                                  style={{ width: `${stat.mastery}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* ACTION PLAN MAP */}
                    {msg.content?.directAnswer && (
                       <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl space-y-3">
                         <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest">
                          🛡️ Tactical Action Plan
                         </span>
                         <ul className="space-y-2 text-xs text-emerald-100 leading-relaxed">
                           <li className="flex items-start gap-2">
                             <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                             <span><strong>Step 1:</strong> Master basic sets and union/intersection counting models.</span>
                           </li>
                           <li className="flex items-start gap-2">
                             <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                             <span><strong>Step 2:</strong> Solve 50 introductory conditionals focusing on mutually exclusive scenarios.</span>
                           </li>
                           <li className="flex items-start gap-2">
                             <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                             <span><strong>Step 3:</strong> Transition to reverse induction (Bayes standard mapping).</span>
                           </li>
                         </ul>
                       </div>
                    )}

                    {/* Utilities Block / Action Buttons */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      <button className="px-3 py-1.5 bg-black/40 hover:bg-white/10 border border-white/10 rounded-lg text-[10px] font-bold text-slate-300 flex items-center gap-1.5 transition-all">
                        <Copy className="w-3 h-3 text-slate-400" /> Copy Explanation
                      </button>
                      <button className="px-3 py-1.5 bg-black/40 hover:bg-white/10 border border-white/10 rounded-lg text-[10px] font-bold text-slate-300 flex items-center gap-1.5 transition-all">
                        <RefreshCw className="w-3 h-3 text-slate-400" /> Regenerate
                      </button>
                      <button className="px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 rounded-lg text-[10px] font-bold text-indigo-300 flex items-center gap-1.5 transition-all">
                        <PenTool className="w-3 h-3" /> Generate Whiteboard
                      </button>
                      <button className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-lg text-[10px] font-bold text-emerald-300 flex items-center gap-1.5 transition-all">
                        <Mic className="w-3 h-3" /> Play Audio Tutor
                      </button>
                    </div>

                  </div>
                )}
              </div>
              
              {msg.role === 'user' && (
                <button className="opacity-0 hover:opacity-100 flex items-center justify-center p-2 h-fit text-slate-400 hover:text-white transition-all bg-white/5 rounded-full mt-2">
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
          
          {/* Suggested Prompts Pill Container */}
          <div className="flex justify-start gap-2 pt-8">
            {['Explain Binomial Distribution 🎲', 'Give me 3 PYQs on Bayes 📘', 'What are common mistakes? ⚠️'].map(prompt => (
              <button 
                key={prompt}
                onClick={() => setInputValue(prompt)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-[11px] font-medium text-slate-300 transition-all font-sans"
              >
                {prompt}
              </button>
            ))}
          </div>

        </div>

        {/* Input Dock Area */}
        <div className="absolute bottom-0 w-full bg-gradient-to-t from-black via-black to-transparent pt-10 pb-6 px-4 md:px-12 z-20">
          <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto relative group">
            
            {/* Input Options (Floating above input) */}
            <div className="absolute -top-10 left-2 flex items-center gap-2">
               <button type="button" className="flex items-center gap-1.5 px-3 py-1 rounded-t-lg bg-[#14141a] border border-b-0 border-white/10 text-[10px] font-bold text-slate-300 font-mono">
                 <PenTool className="w-3 h-3 text-indigo-400" /> Draw Note Mode
               </button>
               <button type="button" className="flex items-center gap-1.5 px-3 py-1 rounded-t-lg bg-black/40 text-[10px] font-bold text-slate-500 hover:text-slate-300 font-mono transition-all">
                 <Mic className="w-3 h-3" /> Voice Input
               </button>
            </div>

            <div className="relative flex items-end gap-2 bg-[#14141a] border border-white/15 group-focus-within:border-indigo-500/50 rounded-2xl rounded-tl-none p-2 transition-all shadow-2xl">
              <button type="button" className="p-3 text-slate-400 hover:text-amber-400 transition-all mb-0.5">
                <Plus className="w-5 h-5" />
              </button>
              
              <textarea 
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Ask your Premium AI Tutor any mathematical or strategic doubt..."
                className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none resize-none pt-3 pb-3 min-h-[44px] max-h-32"
                rows={1}
              />
              
              <button 
                type="submit"
                disabled={!inputValue.trim()}
                className={`p-3 rounded-xl mb-0.5 transition-all ${inputValue.trim() ? 'bg-white text-indigo-900 hover:scale-105 active:scale-95 shadow-md shadow-white/20 cursor-pointer' : 'bg-white/5 text-slate-500 cursor-not-allowed'}`}
              >
                <RefreshCw className={`w-4 h-4 ${inputValue.trim() && 'rotate-90 hidden'}`} />
                {inputValue.trim() && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                )}
              </button>
            </div>
            <div className="text-center mt-3">
              <span className="text-[9px] text-slate-500 font-medium">RankForge AI can make mistakes. Verify critical concepts and formulas with official standard textbooks.</span>
            </div>
          </form>
        </div>
      </div>

    </div>
  );
}
