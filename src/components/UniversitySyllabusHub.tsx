import React, { useState } from 'react';
import { BookOpen, GraduationCap, Award, PlayCircle, ExternalLink, Calendar, HelpCircle, Sparkles, Building } from 'lucide-react';

interface UniversityExamDetail {
  id: string;
  name: string;
  conductingBody: string;
  cutoffInfo: string;
  courseDuration: string;
  annualFee: string;
  highestCTC: string;
  averageCTC: string;
  placementRecruiters: string[];
  syllabusSections: {
    unitName: string;
    topics: string[];
  }[];
  prepBooks: string[];
  prepStrategy: string;
}

export default function UniversitySyllabusHub() {
  const [activeUniId, setActiveUniId] = useState<string>('vit-mca');

  const UNIVERSITY_EXAMS_DB: UniversityExamDetail[] = [
    {
      id: 'vit-mca',
      name: 'VIT MCA Entrance (VITEEM)',
      conductingBody: 'Vellore Institute of Technology (VIT University)',
      cutoffInfo: 'Requires rank within top 800 to secure Vellore Campus MCA. Scoring above 135/200 ensures a safe berth.',
      courseDuration: '2 Years (Full-Time)',
      annualFee: '₹1.5 Lakhs per Annum',
      highestCTC: '₹22.5 LPA (Microsoft / Amazon CSE)',
      averageCTC: '₹8.4 LPA (TCS Digital, Cognizant, Wipro)',
      placementRecruiters: ['Microsoft', 'Qualcomm', 'Intel', 'TCS Digital', 'Cognizant', 'Infosys'],
      syllabusSections: [
        { unitName: 'Mathematics (80 Questions)', topics: ['Algebra, Quadratic Equations, Logarithms', 'Matrix determinants & systems of linear equations', 'Analytical geometry, straight lines and circles, hyperbola', 'Calculus, Limit limits bounds, differential integration'] },
        { unitName: 'Analytical & Logical Skills (40 Questions)', topics: ['Data interpretation, line charts, percentage variances', 'Blood relations, coding-decoding, grid puzzles', 'Directions vectors, spatial orientations'] },
        { unitName: 'Computer Awareness (40 Questions)', topics: ['Floating point representations, binary logic gates, 1s/2s complement', 'Introduction to C programming syntax, arrays and loops', 'Primary and secondary storage, cache organization'] }
      ],
      prepBooks: [
        'Objective Mathematics by RD Sharma Volume 1',
        'Computer Awareness guidelines handbook by Arihant Publications',
        'Advanced Verbal & Non-Verbal Induction by RS Aggarwal'
      ],
      prepStrategy: '💡 VIT MCA heavily tests quick speed mathematics. You get 160 questions with no negative markings. Do not leave any blank questions! Attempt calculations rapidly and focus on standard algebra formulas.'
    },
    {
      id: 'srm-mca',
      name: 'SRMJEEE MCA Prep (SRM Joint Entrance)',
      conductingBody: 'SRM Institute of Science and Technology (Chennai / NCR)',
      cutoffInfo: 'SRM entrance grades with raw percentiles. Aiming for more than 75% correct is desired for Chennai campus seats.',
      courseDuration: '2 Years (Full-Time)',
      annualFee: '₹1.2 Lakhs per Annum',
      highestCTC: '₹18.0 LPA (Adobe / Barclays)',
      averageCTC: '₹7.2 LPA (TCS, Wipro, Capgemini)',
      placementRecruiters: ['Adobe', 'Barclays', 'Optum', 'HCL Technologies', 'TCS, Capgemini'],
      syllabusSections: [
        { unitName: 'Computer Science Core', topics: ['Basic C and C++ syntax, OOP encapsulation concepts', 'Standard linear data structures: stacks, queues, linked lists', 'Operating system processing models and file storage limits'] },
        { unitName: 'Logical Aptitude & English Language', topics: ['Logical series induction, blood connections, syllogisms', 'Reading comprehension, antonyms and synonyms, correct prepositions'] }
      ],
      prepBooks: [
        'Data Structures and Algorithms Series in C/C++ by Neso Academy guides',
        'SRM MCA Entrance crack guides by Sura publications',
        'High-speed Quantitative logic booklets'
      ],
      prepStrategy: '💡 SRM MCA exam contains a major focus on computer science basics, data structures, and standard arithmetic logic. Practice syntax logic questions in C and verify stack pointer operations before taking the mock.'
    },
    {
      id: 'anna-mca',
      name: 'Anna University (TANCET MCA)',
      conductingBody: 'Anna University (Chennai, Government of Tamil Nadu)',
      cutoffInfo: 'Ranks below 150 (approx 99.5+ raw percentile) are required for securing the College of Engineering, Guindy (CEG Campus). Margin score: > 62 raw marks.',
      courseDuration: '2 Years (Full-Time)',
      annualFee: '₹40,000 per Annum (Highly subsidized government fee)',
      highestCTC: '₹16.0 LPA (Cisco / Caterpillar)',
      averageCTC: '₹6.0 LPA (CTS, TCS, Zoho Corp)',
      placementRecruiters: ['Cisco', 'Zoho Corp', 'Caterpillar', 'PayPal', 'IBM', 'TCS Digital'],
      syllabusSections: [
        { unitName: 'Quantitative Ability (25 Questions)', topics: ['Time and Work, speed calculations, pipes & cisterns', 'Simple and compound interests, profit/loss, percentages', 'Logarithms progression series, permutations and combinations'] },
        { unitName: 'Analytical & Logical Reasoning (25 Questions)', topics: ['Analytical puzzles, seating matrix arrangements, visual logic', 'Critical thinking logical arguments validation'] },
        { unitName: 'Computer Awareness (25 Questions)', topics: ['Basic CPU architectures, system boot limits, OS memory maps', 'Data representation, binary conversion tables, hex bits'] }
      ],
      prepBooks: [
        'TANCET MCA Prep Volume by Sura Editorial Board',
        'Competitive Quantitative Aptitude handbook by RS Aggarwal',
        'Fundamentals of IT computers by PK Sinha'
      ],
      prepStrategy: '💡 TANCET MCA has a negative marking of -1/3rd. Guessing can severely ruin raw marks! Concentrate strictly on your strongest quantitative chapters, particularly percentages, work, and rates of speed.'
    }
  ];

  const activeUni = UNIVERSITY_EXAMS_DB.find(uni => uni.id === activeUniId) || UNIVERSITY_EXAMS_DB[0];

  return (
    <div className="space-y-6 text-left">
      
      {/* Selector tab row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 bg-white/5 border border-white/10 rounded-3xl select-none">
        <div>
          <h3 className="text-base font-black text-white uppercase tracking-wider font-mono flex items-center gap-2">
            <Building className="w-5 h-5 text-indigo-400 animate-pulse" />
            <span>University-Specific Preparation Explorer</span>
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Explore dedicated college portals that other competitive platforms miss, with official websites, placement statistics, and cutoffs.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-2 font-mono text-[10px]">
          {UNIVERSITY_EXAMS_DB.map(uni => (
            <button
              key={uni.id}
              onClick={() => setActiveUniId(uni.id)}
              className={`p-2.5 px-4 rounded-xl border text-[11px] font-bold transition-all cursor-pointer ${
                activeUniId === uni.id 
                  ? 'bg-indigo-600 text-white border-indigo-500 font-extrabold' 
                  : 'bg-black/30 border-white/5 text-slate-400 hover:text-white'
              }`}
            >
              {uni.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main card grid layout splitting details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans text-xs">
        
        {/* Left Side: General Profile, fees and packages */}
        <div className="space-y-5">
          
          {/* General Metadata Box */}
          <div className="p-5 bg-[#0e0f1d] border border-white/10 rounded-3xl space-y-4 shadow-xl">
            <span className="text-[10px] uppercase font-mono font-black text-indigo-400 block tracking-widest border-b border-white/5 pb-1.5">Overview & Cutoffs</span>
            
            <div className="space-y-3 font-sans text-[11px]">
              <div>
                <span className="text-slate-500 font-bold block">Conducting Body:</span>
                <p className="text-white font-medium mt-0.5">{activeUni.conductingBody}</p>
              </div>

              <div>
                <span className="text-slate-500 font-bold block">Course & Duration:</span>
                <p className="text-white font-medium mt-0.5">{activeUni.courseDuration}</p>
              </div>

              <div>
                <span className="text-slate-500 font-[#4ade80] font-bold block">Estimated Annual Fee:</span>
                <p className="text-[#4ade80] font-bold mt-0.5">{activeUni.annualFee}</p>
              </div>

              <div className="pt-2 border-t border-white/5 bg-red-500/[0.02] p-2 rounded-lg border border-red-500/10">
                <span className="text-rose-400 font-black font-mono text-[9px] uppercase tracking-wider block">Historic Cutoff Criteria:</span>
                <p className="text-slate-200 leading-relaxed mt-1 text-[11px]">{activeUni.cutoffInfo}</p>
              </div>
            </div>
          </div>

          {/* Placement Hub Metrics */}
          <div className="p-5 bg-white/5 border border-white/10 rounded-3xl space-y-4">
            <span className="text-[10px] uppercase font-mono font-black text-emerald-400 block tracking-wider border-b border-white/5 pb-1.5">Corporate Placement Hub</span>
            
            <div className="grid grid-cols-2 gap-3.5 select-none font-mono">
              <div className="bg-black/40 p-2.5 rounded-xl border border-white/5">
                <span className="text-[9px] text-[#4ade80] block">Highest Offer:</span>
                <strong className="text-white text-base font-black">{activeUni.highestCTC}</strong>
              </div>
              <div className="bg-black/40 p-2.5 rounded-xl border border-white/5">
                <span className="text-[9px] text-indigo-300 block">Average CTC:</span>
                <strong className="text-white text-sm font-black">{activeUni.averageCTC}</strong>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] text-slate-500 font-bold block">Active Recruiters:</span>
              <div className="flex flex-wrap gap-1">
                {activeUni.placementRecruiters.map((rec, rIdx) => (
                  <span key={rIdx} className="bg-white/5 text-slate-300 p-1 px-2 text-[9px] rounded font-mono border border-white/5">
                     {rec}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Center/Right Side: Syllabus structure and recommended strategy */}
        <div className="lg:col-span-2 space-y-5">
          
          {/* Syllabus details */}
          <div className="p-6 bg-white/5 border border-white/10 rounded-3xl space-y-4 font-sans">
            <span className="text-[10px] uppercase font-mono font-black text-slate-400 block tracking-widest pb-1 border-b border-white/5">Syllabus Breakdown Units</span>
            
            <div className="space-y-3.5">
              {activeUni.syllabusSections.map((sec, sIdx) => (
                <div key={sIdx} className="space-y-1.5">
                  <h4 className="text-xs font-extrabold text-white font-mono flex items-center gap-1.5">
                    <span className="text-indigo-400 font-bold">{sIdx + 1}.</span>
                    <span>{sec.unitName}</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-4 text-[11px] text-slate-300">
                    {sec.topics.map((top, tIdx) => (
                      <p key={tIdx} className="flex gap-2">
                        <span className="text-indigo-500">•</span>
                        <span>{top}</span>
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Strategy & Books recommendations */}
          <div className="p-6 bg-[#0a0c16]/50 border border-white/10 rounded-3xl space-y-4">
            <span className="text-[10px] uppercase font-mono font-black text-amber-400 block tracking-wider pb-1.5 border-b border-white/5">Exam Preparation Strategy</span>
            
            {/* Quick Strategy Quote */}
            <p className="text-slate-300 leading-relaxed font-sans mt-1 p-3.5 bg-black/40 border border-white/5 rounded-2xl italic leading-relaxed text-[11px]">
              {activeUni.prepStrategy}
            </p>

            <div className="space-y-1.5 pt-1.5">
              <span className="text-[10px] text-slate-500 font-black font-mono uppercase block">Recommended Prep Reference Books:</span>
              <ul className="space-y-2 text-[11px] text-slate-300 font-sans list-decimal pl-4 leading-relaxed">
                {activeUni.prepBooks.map((book, bIdx) => (
                  <li key={bIdx}>{book}</li>
                ))}
              </ul>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
