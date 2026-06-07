import React, { useState, useEffect } from 'react';
import { BookOpen, AlertCircle, RefreshCw, CheckCircle, Trash2, Download, Search, Tag, Sparkles } from 'lucide-react';

export interface MistakeQuestion {
  id: string;
  question: string;
  options?: string[];
  answer: string;
  topic: string;
  subject: 'Mathematics' | 'Computer Science' | 'Quantitative Aptitude' | 'General';
  exam: string;
  userSelection: string;
  shortcut?: string;
  addedAt: string;
  timeSpent?: number;
}

export default function MistakeNotebook({ setRecentNotification }: {
  setRecentNotification: (msg: string) => void;
}) {
  const [mistakes, setMistakes] = useState<MistakeQuestion[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<'ALL' | 'Mathematics' | 'Computer Science' | 'Quantitative Aptitude'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [resolvedAnswers, setResolvedAnswers] = useState<Record<string, string>>({});
  const [showRevisionSheet, setShowRevisionSheet] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('rankforge_mistakes');
    if (stored) {
      try {
        setMistakes(JSON.parse(stored));
      } catch (err) {
        console.error("Error loading mistakes from storage:", err);
      }
    } else {
      // Seed some starter mistakes so the notebook is not completely empty for the demo if user hasn't failed any questions yet!
      const starterMistakes: MistakeQuestion[] = [
        {
          id: 'starter-1',
          question: 'If L1 is a Regular Language and L2 is Context-Free, which of the following is guaranteed to be Regular?',
          options: ['L1 ∩ L2 (Intersection)', 'L1 ∪ L2 (Union)', 'L1 . L2 (Concatenation)', 'L1* (Kleene Star of L1)'],
          answer: 'L1* (Kleene Star of L1)',
          topic: 'Theory of Computation',
          subject: 'Computer Science',
          exam: 'NIMCET',
          userSelection: 'L1 ∩ L2 (Intersection)',
          shortcut: 'Regular languages are closed under Kleene Star. Intersection of Regular & Context-Free is Context-Free, not necessarily regular.',
          addedAt: new Date(Date.now() - 3600 * 1000 * 24).toISOString()
        },
        {
          id: 'starter-2',
          question: 'Calculate the probability of obtaining exactly 3 heads in 5 independent tosses of a biased coin with head probability p = 2/3.',
          options: ['80/243', '40/81', '20/243', '10/81'],
          answer: '80/243',
          topic: 'Probability & Distributions',
          subject: 'Mathematics',
          exam: 'NIMCET',
          userSelection: '10/81',
          shortcut: 'Use Binomial Distribution P(X=3) = nCr * p^r * q^(n-r). P(X=3) = 5C3 * (2/3)^3 * (1/3)^2 = 10 * (8/27) * (1/9) = 80/243.',
          addedAt: new Date(Date.now() - 3600 * 1000 * 12).toISOString()
        }
      ];
      setMistakes(starterMistakes);
      localStorage.setItem('rankforge_mistakes', JSON.stringify(starterMistakes));
    }
  }, []);

  const handleRemoveMistake = (id: string) => {
    const updated = mistakes.filter(m => m.id !== id);
    setMistakes(updated);
    localStorage.setItem('rankforge_mistakes', JSON.stringify(updated));
    setRecentNotification("📓 Cleaned mistake from notebook successfully!");
  };

  const handleResolveSubmit = (item: MistakeQuestion) => {
    const givenAns = resolvedAnswers[item.id];
    if (!givenAns) return;

    if (givenAns === item.answer || item.answer.includes(givenAns)) {
      setRecentNotification("🏆 Brilliant! Correctly re-solved! You've mastered this concept.");
      // Remove from mistakes
      handleRemoveMistake(item.id);
      setResolvingId(null);
    } else {
      setRecentNotification("❌ Incorrect again. Check the correct key and shortcuts below before trying again!");
    }
  };

  // Filter logic
  const filtered = mistakes.filter(item => {
    const matchesSubject = selectedSubject === 'ALL' || item.subject === selectedSubject;
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.topic.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  // Generate 1-page summary revision notes markdown dynamically
  const generateRevisionExport = () => {
    let md = `# RankForge AI Revision Sheet\n`;
    md += `*Topic review sheet generated on ${new Date().toLocaleDateString()}*\n\n`;
    md += `## 💡 CORE CONCEPTS TO MASTER INDEPENDENTLY\n\n`;

    filtered.forEach((m, idx) => {
      md += `### ${idx + 1}. [${m.subject}] ${m.topic} (${m.exam})\n`;
      md += `**Question:** ${m.question}\n\n`;
      md += `* **Master Key:** \`${m.answer}\` (Correct)\n`;
      md += `* **Your Previous Mistake:** \`${m.userSelection}\` (Faulty logic)\n`;
      md += `* **Revision Formula / Shortcut:** ${m.shortcut || 'Normalize variables first.'}\n\n`;
      md += `---------------------------------------\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `RankForge_Master_Mistakes_Revision_Sheet.md`;
    link.click();
    setRecentNotification("📥 AI Revision Sheet Markdown downloaded successfully!");
  };

  return (
    <div id="view-mistakes-notebook" className="space-y-6 text-left">
      
      {/* Explanation Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 bg-indigo-950/20 border border-indigo-500/10 rounded-3xl backdrop-blur-md">
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen className="text-indigo-400 w-5 h-5 shrink-0" />
            <span>Premium AI Mistake Notebook (Weak Areas Log)</span>
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl">
            This module automatically intercepts incorrect answers submitted during mock tests, adaptive chapters, or practice sessions, and archives them for continuous active recall. Re-solve items to archive them as Mastered!
          </p>
        </div>

        {filtered.length > 0 && (
          <button
            onClick={generateRevisionExport}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 self-start md:self-center"
          >
            <Download className="w-4 h-4" />
            <span>Generate 1-Page Revision Sheet</span>
          </button>
        )}
      </div>

      {/* Inputs Filter Row */}
      <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2.5 bg-black/40 p-2 rounded-xl border border-white/5 w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search within your mistakes log (e.g. Probability, Regular)..."
            className="bg-transparent border-none outline-none font-sans text-xs text-white placeholder-slate-500 w-full"
          />
        </div>

        <div className="flex gap-1 bg-black/40 p-1 border border-white/5 rounded-xl font-mono text-[10px] shrink-0">
          {(['ALL', 'Mathematics', 'Computer Science', 'Quantitative Aptitude'] as const).map(sub => (
            <button
              key={sub}
              onClick={() => setSelectedSubject(sub)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                selectedSubject === sub 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {sub === 'ALL' ? 'All Subjects' : sub}
            </button>
          ))}
        </div>
      </div>

      {/* Mistakes grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((item, idx) => {
          const isResolving = resolvingId === item.id;
          
          return (
            <div key={item.id} className="p-5 bg-[#0b0c13] border border-white/10 rounded-2xl hover:border-red-500/20 transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-red-400 bg-red-400/10 border border-red-400/20 px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                    {item.subject}
                  </span>
                  <span className="text-slate-500">Log #{idx+1}</span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-white leading-relaxed">{item.question}</h4>
                  <p className="text-[10px] text-slate-400 font-mono mt-1">Topic Matrix: <strong className="text-indigo-300">{item.topic}</strong> ({item.exam})</p>
                </div>

                <div className="grid grid-cols-2 gap-3.5 pt-2 text-[10px] font-mono select-none">
                  <div className="p-2.5 bg-red-500/[0.03] border border-red-500/10 rounded-xl">
                    <span className="block text-slate-500 text-[9px] uppercase font-bold">Your False Ans</span>
                    <span className="text-red-400 font-bold mt-0.5 block truncate">{item.userSelection || 'No selection'}</span>
                  </div>
                  <div className="p-2.5 bg-emerald-500/[0.03] border border-emerald-500/10 rounded-xl">
                    <span className="block text-slate-500 text-[9px] uppercase font-bold">Master Solution Key</span>
                    <span className="text-emerald-400 font-bold mt-0.5 block truncate">{item.answer}</span>
                  </div>
                </div>

                {/* Micro-learning Tips */}
                {item.shortcut && (
                  <div className="p-3 bg-indigo-500/[0.03] border border-indigo-500/10 rounded-xl text-[10px] text-indigo-200 font-sans leading-relaxed">
                    <span className="font-extrabold uppercase text-[9px] text-indigo-400 block font-mono mb-0.5">🧠 Recovery Formula / Key Trick:</span>
                    {item.shortcut}
                  </div>
                )}

                {/* Solving Area Triggered */}
                {isResolving && (
                  <div className="p-3 bg-black border border-white/10 rounded-xl space-y-3 animate-fadeIn">
                    <span className="block text-[10px] text-indigo-300 font-bold font-mono">🔧 SUBMIT NEW ATTEMPT RIGHT NOW:</span>
                    
                    {item.options ? (
                      <div className="grid grid-cols-1 gap-2">
                        {item.options.map((opt, optIdx) => (
                          <button
                            key={optIdx}
                            onClick={() => setResolvedAnswers(prev => ({ ...prev, [item.id]: opt }))}
                            className={`p-2 rounded-lg border text-left text-[11px] transition-all cursor-pointer ${
                              resolvedAnswers[item.id] === opt 
                                ? 'bg-indigo-600/20 border-indigo-500 text-white font-extrabold' 
                                : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <input
                        type="text"
                        value={resolvedAnswers[item.id] || ''}
                        onChange={(e) => setResolvedAnswers(prev => ({ ...prev, [item.id]: e.target.value }))}
                        placeholder="Enter numerical digits response..."
                        className="w-full bg-black border border-white/10 rounded-lg p-2 text-white font-mono text-[11px]"
                      />
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleResolveSubmit(item)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-bold cursor-pointer transition-colors"
                      >
                        Check & Master
                      </button>
                      <button
                        onClick={() => setResolvingId(null)}
                        className="px-3 py-1.5 bg-white/10 hover:bg-white/15 text-white rounded-lg text-[10px] font-bold cursor-pointer transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Card Actions */}
              <div className="pt-2.5 border-t border-white/5 flex items-center justify-between">
                {!isResolving && (
                  <button
                    onClick={() => {
                      setResolvingId(item.id);
                      setResolvedAnswers(prev => ({ ...prev, [item.id]: '' }));
                    }}
                    className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white rounded-lg text-[10px] font-bold font-mono transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span>Retry Question</span>
                  </button>
                )}

                <button
                  onClick={() => handleRemoveMistake(item.id)}
                  className="p-1.5 hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 rounded-lg transition-all cursor-pointer font-mono text-[10px] ml-auto flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Archive</span>
                </button>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="col-span-full py-16 text-center bg-white/5 border border-white/5 rounded-3xl space-y-2">
            <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
            <h4 className="text-white text-xs font-bold font-sans">Pristine Record! No Active Mistakes Notebook Entries</h4>
            <p className="text-[10px] text-slate-400 max-w-sm mx-auto">
              Way to go! When you fail a question in mock simulations or chapter practices, they will populate here automatically.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
