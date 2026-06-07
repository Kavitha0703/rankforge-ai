import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  MapPin, 
  IndianRupee, 
  GraduationCap, 
  ExternalLink, 
  Search, 
  Filter, 
  TrendingUp, 
  Globe, 
  Home, 
  Briefcase, 
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Info,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CollegeDetail, ExamType } from '../types';

interface CollegeExplorerProps {
  userExam: ExamType;
}

export default function CollegeExplorer({ userExam }: CollegeExplorerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCollege, setSelectedCollege] = useState<CollegeDetail | null>(null);
  
  const colleges: CollegeDetail[] = [
    {
      id: '1',
      name: 'National Institute of Technology (NIT), Trichy',
      location: 'Tamil Nadu, India',
      fees: '₹1.5 Lakhs (Total)',
      avgPackage: '₹12.5 LPA',
      highestPackage: '₹42 LPA',
      placementPercentage: '98%',
      cutoffs: [
        { exam: 'NIMCET', rank: 45, year: '2025' },
        { exam: 'NIMCET', rank: 52, year: '2024' }
      ],
      facilities: ['Hostel', 'Library', 'Sports Complex', 'Computing Center', 'Auditorium'],
      officialWebsite: 'https://www.nitt.edu',
      hostelFees: '₹40,000 / Year',
      image: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3'
    },
    {
      id: '2',
      name: 'NITTTR / NIT Surathkal (K)',
      location: 'Karnataka, India',
      fees: '₹1.8 Lakhs (Total)',
      avgPackage: '₹11.2 LPA',
      highestPackage: '₹38 LPA',
      placementPercentage: '96%',
      cutoffs: [
        { exam: 'NIMCET', rank: 85, year: '2025' }
      ],
      facilities: ['Beach Side Campus', 'Smart Classrooms', 'Tinkering Lab'],
      officialWebsite: 'https://www.nitk.ac.in',
      hostelFees: '₹35,000 / Year'
    },
    {
      id: '3',
      name: 'Jawaharlal Nehru University (JNU), Delhi',
      location: 'New Delhi, India',
      fees: '₹5,000 (Total)',
      avgPackage: '₹8.5 LPA',
      highestPackage: '₹22 LPA',
      placementPercentage: '85%',
      cutoffs: [
        { exam: 'CUET PG MCA', rank: 120, year: '2025' }
      ],
      facilities: ['Extensive Library', 'International Environment', 'Low Fees'],
      officialWebsite: 'https://www.jnu.ac.in',
      hostelFees: '₹2,000 / Year'
    },
    {
       id: '4',
       name: 'Vellore Institute of Technology (VIT)',
       location: 'Vellore, Tamil Nadu',
       fees: '₹4.2 Lakhs (Total)',
       avgPackage: '₹7.2 LPA',
       highestPackage: '₹32 LPA',
       placementPercentage: '92%',
       cutoffs: [
          { exam: 'NIMCET', rank: 2500, year: '2025' }
       ],
       facilities: ['World Class Infra', 'Global Exposure'],
       officialWebsite: 'https://vit.ac.in',
       hostelFees: '₹80,000 / Year'
    }
  ];

  const filteredColleges = useMemo(() => {
    return colleges.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className="flex flex-col h-full bg-[#05060b] animate-fadeIn">
      {/* Header Area */}
      <div className="px-8 py-8 border-b border-white/5 bg-gradient-to-b from-indigo-500/5 to-transparent">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[10px] text-indigo-400 font-mono font-black uppercase tracking-widest">
              <Building2 className="w-4 h-4" />
              <span>Campus Intelligence • Admission Hub</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tighter">AI College Explorer</h1>
            <p className="text-slate-400 text-sm max-w-lg font-medium">
              Find your ideal institute. Compare placements, fees, and real AIR cutoffs for {userExam}.
            </p>
          </div>
          
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search colleges by name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 lg:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredColleges.map(college => (
            <motion.div 
              layout
              key={college.id}
              onClick={() => setSelectedCollege(college)}
              className="group relative bg-[#0a0b14] border border-white/10 rounded-[32px] overflow-hidden hover:border-indigo-500/40 transition-all cursor-pointer flex flex-col shadow-2xl hover:shadow-indigo-500/10"
            >
               {/* Image Proxy / Header */}
               <div className="relative h-48 bg-white/5 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b14] to-transparent z-10" />
                  <div className="absolute top-4 left-4 z-20 flex gap-2">
                     <div className="px-3 py-1 bg-indigo-600 rounded-lg text-[9px] font-black text-white uppercase tracking-wider shadow-lg">Tier 1</div>
                     <div className="px-3 py-1 bg-emerald-600 rounded-lg text-[9px] font-black text-white uppercase tracking-wider shadow-lg">High ROI</div>
                  </div>
                  {college.image ? (
                    <img src={`${college.image}?auto=format&fit=crop&w=800&q=80`} alt={college.name} className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center opacity-20">
                       <Building2 className="w-16 h-16 text-slate-500" />
                    </div>
                  )}
               </div>

               <div className="p-6 space-y-6">
                  <div className="space-y-1">
                     <h3 className="text-xl font-black text-white leading-tight group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{college.name}</h3>
                     <div className="flex items-center gap-1.5 text-slate-500">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="text-xs font-bold">{college.location}</span>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div className="p-3 bg-white/5 border border-white/5 rounded-2xl space-y-1">
                        <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                           <IndianRupee className="w-3 h-3" />
                           <span>Total Fees</span>
                        </div>
                        <span className="block text-xs font-black text-white">{college.fees}</span>
                     </div>
                     <div className="p-3 bg-white/5 border border-white/5 rounded-2xl space-y-1">
                        <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                           <TrendingUp className="w-3 h-3 text-emerald-400" />
                           <span>Avg. Package</span>
                        </div>
                        <span className="block text-xs font-black text-emerald-400">{college.avgPackage}</span>
                     </div>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                     <div className="flex -space-x-2">
                        {college.facilities.slice(0, 3).map((f, i) => (
                          <div key={f} className="w-7 h-7 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-[8px] font-black text-indigo-400 z-[3]">
                             {f[0]}
                          </div>
                        ))}
                        {college.facilities.length > 3 && (
                          <div className="w-7 h-7 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-[8px] font-black text-slate-400 z-[0]">
                             +{college.facilities.length - 3}
                          </div>
                        )}
                     </div>
                     <div className="flex items-center gap-1 text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                        View Matrix <ChevronRight className="w-3 h-3" />
                     </div>
                  </div>
               </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* College Detail Modal Overlay */}
      <AnimatePresence>
        {selectedCollege && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-5xl max-h-[90vh] bg-[#0a0b14] border border-white/10 rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row relative"
            >
               <button 
                 onClick={() => setSelectedCollege(null)}
                 className="absolute top-8 right-8 p-2 text-slate-500 hover:text-white transition-colors z-20"
               >
                 <ExternalLink className="w-6 h-6 rotate-45" />
               </button>

               {/* Left: Branding & Visuals */}
               <div className="w-full md:w-[40%] bg-indigo-500/5 p-10 border-r border-white/5 overflow-y-auto space-y-8">
                  <div className="space-y-4">
                     <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-xl">
                        <Building2 className="w-8 h-8" />
                     </div>
                     <h2 className="text-3xl font-black text-white leading-tight uppercase tracking-tighter">{selectedCollege.name}</h2>
                     <p className="text-slate-400 font-medium">{selectedCollege.location}</p>
                  </div>

                  <div className="space-y-4">
                     <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Target AIR Matrix</h4>
                     <div className="space-y-3">
                        {selectedCollege.cutoffs.map(c => (
                          <div key={c.year} className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between">
                             <div className="space-y-0.5">
                                <span className="block text-xs font-black text-white">{c.exam}</span>
                                <span className="block text-[10px] text-slate-500 font-mono italic">Admissions Cycle {c.year}</span>
                             </div>
                             <div className="text-right">
                                <span className="block text-lg font-black text-indigo-400">Under {c.rank}</span>
                             </div>
                          </div>
                        ))}
                     </div>
                  </div>

                  <div className="pt-6">
                     <a 
                       href={selectedCollege.officialWebsite} 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl flex items-center justify-center gap-3 text-white text-xs font-bold transition-all"
                     >
                       <Globe className="w-4 h-4" />
                       Official Institute Portal
                     </a>
                  </div>
               </div>

               {/* Right: Detailed Stats */}
               <div className="flex-1 p-10 overflow-y-auto bg-[#05060b]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                     <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                           <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400"><Briefcase className="w-5 h-5" /></div>
                           <h4 className="text-lg font-black text-white tracking-tight">Placement Report</h4>
                        </div>
                        <div className="space-y-4">
                           <div className="flex justify-between items-center text-sm">
                              <span className="text-slate-500">Placement Percentage</span>
                              <span className="text-white font-bold">{selectedCollege.placementPercentage}</span>
                           </div>
                           <div className="flex justify-between items-center text-sm">
                              <span className="text-slate-500">Highest Package (Offered)</span>
                              <span className="text-emerald-400 font-black">{selectedCollege.highestPackage}</span>
                           </div>
                           <div className="flex justify-between items-center text-sm">
                              <span className="text-slate-500">Average Compensation</span>
                              <span className="text-white font-bold">{selectedCollege.avgPackage}</span>
                           </div>
                        </div>
                     </div>

                     <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                           <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400"><Home className="w-5 h-5" /></div>
                           <h4 className="text-lg font-black text-white tracking-tight">Financial & Living</h4>
                        </div>
                        <div className="space-y-4">
                           <div className="flex justify-between items-center text-sm">
                              <span className="text-slate-500">Tuition Fees (Annual)</span>
                              <span className="text-white font-bold">{selectedCollege.fees}</span>
                           </div>
                           <div className="flex justify-between items-center text-sm">
                              <span className="text-slate-500">Hostel & Mess</span>
                              <span className="text-white font-bold">{selectedCollege.hostelFees}</span>
                           </div>
                           <div className="flex justify-between items-center text-sm">
                              <span className="text-slate-500">Est. Total Monthly</span>
                              <span className="text-amber-400 font-bold">₹10k - 15k</span>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-6">
                     <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/10 rounded-xl text-purple-400"><Layers className="w-5 h-5" /></div>
                        <h4 className="text-lg font-black text-white tracking-tight">Campus Infrastructure</h4>
                     </div>
                     <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {selectedCollege.facilities.map(f => (
                           <div key={f} className="flex items-center gap-2 p-3 bg-white/5 border border-white/5 rounded-2xl">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                              <span className="text-[10px] font-bold text-slate-300">{f}</span>
                           </div>
                        ))}
                     </div>
                  </div>

                  <div className="mt-12 p-8 bg-indigo-600/10 border border-indigo-500/20 rounded-[32px] space-y-4 relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl" />
                     <div className="flex items-center gap-3">
                        <Info className="w-5 h-5 text-indigo-400" />
                        <h5 className="font-black text-white uppercase tracking-tight">RankForge AI Analysis</h5>
                     </div>
                     <p className="text-slate-400 text-sm leading-relaxed relative z-10">
                        {selectedCollege.name} is a high-ROI institute for {userExam} aspirants. Based on your current projection (AIR 178), you have a <span className="text-emerald-400 font-bold">85% probability</span> of securing a seat in the general category. Focusing on the next 2 mock tests could lock this safely.
                     </p>
                  </div>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
