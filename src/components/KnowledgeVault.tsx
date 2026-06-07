import React, { useState, useMemo, useCallback } from 'react';
import { 
  Folder, 
  FileText, 
  File, 
  Image as ImageIcon, 
  MoreVertical, 
  Search, 
  Plus, 
  Upload, 
  Filter, 
  Download, 
  Eye, 
  Edit3, 
  Copy, 
  Pin, 
  Star, 
  Share2, 
  Trash2, 
  ChevronRight, 
  Search as SearchIcon,
  X,
  BrainCircuit,
  MessageSquare,
  Sparkles,
  CloudLightning,
  Hash,
  LayoutGrid,
  List,
  ArrowUpRight,
  HardDrive,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { VaultFile, VaultFolder, ExamType } from '../types';

interface KnowledgeVaultProps {
  userExam: ExamType;
  onNavigateToTutor: (prompt: string, contextFile?: VaultFile) => void;
}

export default function KnowledgeVault({ userExam, onNavigateToTutor }: KnowledgeVaultProps) {
  // --- STATE ---
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFileType, setSelectedFileType] = useState<string | 'all'>('all');
  const [selectedSubject, setSelectedSubject] = useState<string | 'all'>('all');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadingFile, setUploadingFile] = useState<string | null>(null);
  const [aiAnalysisFile, setAiAnalysisFile] = useState<VaultFile | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  // Folders State
  const [folders, setFolders] = useState<VaultFolder[]>(() => {
    const saved = localStorage.getItem('vault_folders');
    return saved ? JSON.parse(saved) : [
      { id: 'f1', name: 'NIMCET', parentId: null, createdAt: '2026-05-15T10:00:00Z' },
      { id: 'f2', name: 'CUET PG', parentId: null, createdAt: '2026-05-16T11:00:00Z' },
      { id: 'f3', name: 'Mathematics', parentId: 'f1', createdAt: '2026-05-20T09:00:00Z' },
      { id: 'f4', name: 'DBMS Notes', parentId: 'f1', createdAt: '2026-05-21T14:30:00Z' },
      { id: 'f5', name: 'Personal Screenshots', parentId: null, createdAt: '2026-05-25T16:45:00Z' },
      { id: 'f6', name: 'Formula Sheets', parentId: 'f3', createdAt: '2026-06-01T10:15:00Z' },
    ];
  });

  // Files State
  const [files, setFiles] = useState<VaultFile[]>(() => {
    const saved = localStorage.getItem('vault_files');
    return saved ? JSON.parse(saved) : [
      { 
        id: 'file1', 
        name: 'Probability_Advanced_Notes.pdf', 
        type: 'PDF', 
        size: 4500000, 
        createdAt: '2026-06-05T10:00:00Z', 
        folderId: 'f6', 
        tags: ['Mathematics', 'Probability', 'Revision'],
        isPinned: true,
        isFavorite: true,
        subject: 'Mathematics',
        exam: 'NIMCET',
        aiInsights: {
          summary: 'Detailed derivation of Bayes Theorem and Poisson Distribution with 5 solved examples.',
          formulas: ['P(A|B) = P(B|A)P(A)/P(B)', 'λ^k * e^-λ / k!'],
          flashcardsCount: 12
        }
      },
      { 
        id: 'file2', 
        name: 'DBMS_Normalization_Tricks.docx', 
        type: 'DOCX', 
        size: 1200000, 
        createdAt: '2026-06-04T15:20:00Z', 
        folderId: 'f4', 
        tags: ['DBMS', 'Important'],
        isPinned: false,
        isFavorite: true,
        subject: 'DBMS'
      }
    ];
  });

  // Persistence
  React.useEffect(() => {
    localStorage.setItem('vault_folders', JSON.stringify(folders));
  }, [folders]);

  React.useEffect(() => {
    localStorage.setItem('vault_files', JSON.stringify(files));
  }, [files]);

  // --- AI ANALYSIS ---
  const analyzeFile = async (fileId: string, name: string, type: string, base64Data: string) => {
    setIsAnalyzing(true);
    try {
      const resp = await fetch('/api/analyze-vault-file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: name, fileType: type, fileData: base64Data })
      });
      const result = await resp.json();

      setFiles(prev => prev.map(f => f.id === fileId ? {
        ...f,
        aiInsights: {
          ...f.aiInsights,
          summary: result.summary,
          formulas: result.formulas,
          flashcards: result.flashcards,
          flashcardsCount: result.flashcards?.length || 0,
          ocrText: result.ocrText
        }
      } : f));

      // If viewing this file, update current view
      if (aiAnalysisFile?.id === fileId) {
        setAiAnalysisFile(prev => prev ? {
          ...prev,
          aiInsights: {
            summary: result.summary,
            formulas: result.formulas,
            flashcards: result.flashcards,
            ocrText: result.ocrText
          }
        } : null);
      }
    } catch (err) {
      console.error('Analysis failed:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingFile(file.name);
    setUploadProgress(10);
    
    // Read file as base64
    const reader = new FileReader();
    reader.onload = async () => {
      setUploadProgress(50);
      const base64 = (reader.result as string).split(',')[1];
      
      const fileId = `file-${Date.now()}`;
      const fileExt = file.name.split('.').pop()?.toUpperCase() || 'PDF';
      
      const newFile: VaultFile = {
        id: fileId,
        name: file.name,
        type: fileExt as any,
        size: file.size,
        createdAt: new Date().toISOString(),
        folderId: currentFolderId,
        tags: ['New', 'AI Processing'],
        isPinned: false,
        isFavorite: false,
        exam: userExam,
        base64Data: base64
      };

      setFiles(prev => [newFile, ...prev]);
      setUploadProgress(90);

      // Trigger AI analysis automatically for PDF/Images
      if (['PDF', 'PNG', 'JPG', 'JPEG'].includes(fileExt)) {
        await analyzeFile(fileId, file.name, file.type, base64);
      }

      setUploadProgress(100);
      setTimeout(() => {
        setUploadProgress(null);
        setUploadingFile(null);
        setIsUploadModalOpen(false);
      }, 500);
    };
    reader.readAsDataURL(file);
  };

  // --- HELPERS ---
  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const currentPath = useMemo(() => {
    const path: VaultFolder[] = [];
    let tempId = currentFolderId;
    while (tempId) {
      const folder = folders.find(f => f.id === tempId);
      if (folder) {
        path.unshift(folder);
        tempId = folder.parentId;
      } else break;
    }
    return path;
  }, [currentFolderId, folders]);

  const filteredItems = useMemo(() => {
    let resultFiles = files;
    let resultFolders = folders;

    // Filter by Folder
    if (!searchQuery) {
      resultFiles = resultFiles.filter(f => f.folderId === currentFolderId);
      resultFolders = resultFolders.filter(f => f.parentId === currentFolderId);
    } else {
      const q = searchQuery.toLowerCase();
      resultFiles = resultFiles.filter(f => 
        f.name.toLowerCase().includes(q) || 
        f.tags.some(t => t.toLowerCase().includes(q)) ||
        f.subject?.toLowerCase().includes(q)
      );
      resultFolders = resultFolders.filter(f => f.name.toLowerCase().includes(q));
    }

    // Filters
    if (selectedFileType !== 'all') {
      resultFiles = resultFiles.filter(f => f.type === selectedFileType);
      if (searchQuery) resultFolders = []; // Folders don't have types
    }

    if (selectedSubject !== 'all') {
      resultFiles = resultFiles.filter(f => f.subject === selectedSubject);
       if (searchQuery) resultFolders = [];
    }

    return { files: resultFiles, folders: resultFolders };
  }, [files, folders, currentFolderId, searchQuery, selectedFileType, selectedSubject]);

  const handleAction = (action: string, item: VaultFile | VaultFolder) => {
    if (action === 'delete') {
      if ('folderId' in item) {
        setFiles(prev => prev.filter(f => f.id !== item.id));
      } else {
        setFolders(prev => prev.filter(f => f.id !== item.id));
      }
    }
  };

  const createFolder = () => {
    if (!newFolderName.trim()) return;
    const newFolder: VaultFolder = {
      id: `f-${Date.now()}`,
      name: newFolderName.trim(),
      parentId: currentFolderId,
      createdAt: new Date().toISOString()
    };
    setFolders(prev => [...prev, newFolder]);
    setNewFolderName('');
    setIsFolderModalOpen(false);
  };

  const simulateUpload = (fileName: string) => {
    setUploadingFile(fileName);
    setUploadProgress(0);
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        setUploadProgress(100);
        clearInterval(interval);
        
        setTimeout(() => {
          const type = fileName.split('.').pop()?.toUpperCase() as any || 'PDF';
          const newFile: VaultFile = {
            id: `file-${Date.now()}`,
            name: fileName,
            type,
            size: Math.floor(Math.random() * 5000000) + 1000000,
            createdAt: new Date().toISOString(),
            folderId: currentFolderId,
            tags: ['Uploaded', userExam],
            isPinned: false,
            isFavorite: false,
            exam: userExam
          };
          setFiles(prev => [newFile, ...prev]);
          setUploadProgress(null);
          setUploadingFile(null);
          setIsUploadModalOpen(false);
        }, 500);
      } else {
        setUploadProgress(Math.floor(progress));
      }
    }, 300);
  };

  const toggleFavorite = (id: string) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, isFavorite: !f.isFavorite } : f));
  };

  const startAIAnalysis = (file: VaultFile) => {
    setAiAnalysisFile(file);
  };

  return (
    <div className="flex flex-col h-full bg-[#05060b] animate-fadeIn">
      {/* Header & Stats Banner */}
      <div className="px-8 py-6 bg-gradient-to-b from-indigo-500/5 to-transparent border-b border-white/5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[10px] text-indigo-400 font-mono font-black uppercase tracking-widest">
              <CloudLightning className="w-3.5 h-3.5" />
              <span>Smart Storage Hub • Knowledge Vault</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tighter">Knowledge Vault</h1>
            <p className="text-slate-400 text-sm max-w-lg">
              Collect, organize, and analyze your custom resources with Aris AI integration.
            </p>
          </div>

             <div className="flex flex-wrap items-center gap-3">
             <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3">
                <HardDrive className="w-5 h-5 text-indigo-400" />
                <div className="flex flex-col">
                   <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Storage</span>
                   <span className="text-xs text-white font-mono font-bold">{formatSize(files.reduce((acc, f) => acc + f.size, 0))} / 500 MB</span>
                </div>
                <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                   <div className="h-full bg-indigo-500" style={{ width: `${Math.min((files.reduce((acc, f) => acc + f.size, 0) / 500000000) * 100, 100)}%` }} />
                </div>
             </div>
             
             <button 
                onClick={() => setIsFolderModalOpen(true)}
                className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 rounded-2xl font-bold flex items-center gap-2 transition-all active:scale-95"
             >
                <Plus className="w-4 h-4" />
                <span>New Folder</span>
             </button>

             <button 
                onClick={() => setIsUploadModalOpen(true)}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
             >
                <Upload className="w-4 h-4" />
                <span>Upload Resources</span>
             </button>
          </div>
        </div>
      </div>

      {/* Toolbar & Filters */}
      <div className="px-8 py-4 border-b border-white/5 bg-black/20 flex flex-col md:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search notes, PDFs, tags, or OCR content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 self-start md:self-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          <div className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-xl">
             <Filter className="w-3.5 h-3.5 text-slate-500" />
             <select 
               value={selectedFileType}
               onChange={(e) => setSelectedFileType(e.target.value)}
               className="bg-transparent text-xs font-bold text-slate-300 focus:outline-none cursor-pointer"
             >
               <option value="all">All Types</option>
               <option value="PDF">PDF Documents</option>
               <option value="DOCX">Word Docs</option>
               <option value="Image">Image Notes</option>
               <option value="TXT">Text Plain</option>
             </select>
          </div>

          <div className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-xl">
             <Hash className="w-3.5 h-3.5 text-slate-500" />
             <select 
               value={selectedSubject}
               onChange={(e) => setSelectedSubject(e.target.value)}
               className="bg-transparent text-xs font-bold text-slate-300 focus:outline-none cursor-pointer"
             >
               <option value="all">Specialization</option>
               <option value="Mathematics">Mathematics</option>
               <option value="DBMS">DBMS</option>
               <option value="OS">Operating Systems</option>
               <option value="CN">Computer Networks</option>
             </select>
          </div>

          <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-1">
             <button 
               onClick={() => setViewMode('grid')}
               className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
             >
               <LayoutGrid className="w-4 h-4" />
             </button>
             <button 
               onClick={() => setViewMode('list')}
               className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
             >
               <List className="w-4 h-4" />
             </button>
          </div>
        </div>
      </div>

      {/* Main Explorer Area */}
      <div className="flex-1 overflow-y-auto p-8 relative">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 mb-8 text-sm font-bold animate-fadeIn">
          <button 
            onClick={() => setCurrentFolderId(null)}
            className={`transition-colors flex items-center gap-1.5 ${currentFolderId === null ? 'text-indigo-400' : 'text-slate-500 hover:text-white'}`}
          >
            <Folder className="w-4 h-4" />
            <span>Knowledge Vault</span>
          </button>
          
          {currentPath.map((item, idx) => (
            <React.Fragment key={item.id}>
              <ChevronRight className="w-3 h-3 text-slate-700" />
              <button 
                onClick={() => setCurrentFolderId(item.id)}
                className={`transition-colors ${idx === currentPath.length - 1 ? 'text-indigo-400' : 'text-slate-500 hover:text-white'}`}
              >
                {item.name}
              </button>
            </React.Fragment>
          ))}
        </div>

        {/* Content View */}
        {filteredItems.folders.length === 0 && filteredItems.files.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
             <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center mb-6">
                <HardDrive className="w-8 h-8 text-slate-700" />
             </div>
             <h3 className="text-xl font-bold text-white mb-2">Workspace Empty</h3>
             <p className="text-slate-500 text-sm max-w-xs">
                No items found here. Start building your knowledge vault by uploading resources.
             </p>
             <button 
                onClick={() => setIsUploadModalOpen(true)}
                className="mt-6 px-5 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 border border-indigo-500/30 rounded-xl text-xs font-bold transition-all"
             >
                Initialize Upload
             </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            <AnimatePresence mode="popLayout">
              {/* Folders */}
              {filteredItems.folders.map(folder => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={folder.id}
                  onDoubleClick={() => setCurrentFolderId(folder.id)}
                  className="group relative bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 hover:border-indigo-500/30 transition-all cursor-pointer shadow-xl hover:shadow-indigo-500/5"
                >
                   <div className="flex justify-between items-start mb-4">
                      <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400">
                         <Folder className="w-6 h-6 fill-current" />
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleAction('delete', folder); }}
                        className="p-1 text-slate-600 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                   </div>
                   <div className="space-y-1">
                      <h4 className="text-xs font-black text-white truncate group-hover:text-indigo-300 transition-colors">{folder.name}</h4>
                      <p className="text-[10px] text-slate-500 font-mono">Folder</p>
                   </div>
                </motion.div>
              ))}

              {/* Files */}
              {filteredItems.files.map(file => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={file.id}
                  className="group relative bg-[#0a0a1a] border border-white/10 rounded-2xl p-4 hover:border-indigo-500/50 transition-all cursor-pointer shadow-xl hover:shadow-indigo-500/10 overflow-hidden"
                >
                   {/* File Preview Thumbnail (Simulated) */}
                   <div className="relative h-24 bg-white/[0.02] rounded-xl mb-4 flex items-center justify-center group-hover:bg-indigo-500/5 transition-colors overflow-hidden border border-white/5">
                      {file.type === 'PDF' && <FileText className="w-10 h-10 text-rose-500" />}
                      {file.type === 'Image' && <ImageIcon className="w-10 h-10 text-emerald-500" />}
                      {file.type === 'DOCX' && <File className="w-10 h-10 text-blue-500" />}
                      
                      {/* Favorite/Pin Badges */}
                      <div className="absolute top-2 right-2 flex gap-1 z-10">
                         {file.isPinned && <Pin className="w-3 h-3 text-indigo-400 fill-current" />}
                         <button 
                           onClick={(e) => { e.stopPropagation(); toggleFavorite(file.id); }}
                           className={`p-1 rounded-lg transition-all ${file.isFavorite ? 'bg-amber-500/20 text-amber-500' : 'bg-white/5 text-slate-600 hover:text-white'}`}
                         >
                            <Star className={`w-3.5 h-3.5 ${file.isFavorite ? 'fill-current' : ''}`} />
                         </button>
                      </div>

                      {/* Duplicate Alert (Simulated) */}
                      {file.name.includes('Notes v2') && (
                         <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-rose-500/20 border border-rose-500/30 rounded text-[8px] font-black uppercase text-rose-400 flex items-center gap-1 z-10">
                            <AlertTriangle className="w-2.5 h-2.5" />
                            <span>Version Detected</span>
                         </div>
                      )}

                      {/* AI Indicator */}
                      {file.aiInsights && (
                        <div className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-indigo-500/20 border border-indigo-500/30 rounded text-[8px] font-black uppercase text-indigo-400 flex items-center gap-1">
                           <Sparkles className="w-2.5 h-2.5" />
                           <span>AI Ready</span>
                        </div>
                      )}

                      {/* Action Hover Overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-3">
                         <button 
                            onClick={(e) => { e.stopPropagation(); startAIAnalysis(file); }}
                            className="p-2 bg-indigo-600 rounded-lg text-white hover:scale-110 transition-all shadow-lg"
                            title="AI Analysis"
                         >
                            <BrainCircuit className="w-4 h-4" />
                         </button>
                         <button 
                            onClick={(e) => { e.stopPropagation(); handleAction('delete', file); }}
                            className="p-2 bg-rose-600 rounded-lg text-white hover:scale-110 transition-all shadow-lg"
                            title="Delete"
                         >
                            <Trash2 className="w-4 h-4" />
                         </button>
                      </div>
                   </div>

                   <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-[11px] font-bold text-white truncate mb-0.5 group-hover:text-indigo-400 transition-colors">{file.name}</h4>
                          <span className="text-[9px] text-slate-500 font-mono">{formatSize(file.size)} • {file.type}</span>
                        </div>
                      </div>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-1">
                         {file.tags.slice(0, 2).map(tag => (
                           <span key={tag} className="px-1.5 py-0.5 bg-white/5 text-[8px] text-slate-400 rounded-md border border-white/5 uppercase font-bold tracking-wider">{tag}</span>
                         ))}
                         {file.tags.length > 2 && (
                           <span className="px-1.5 py-0.5 bg-white/5 text-[8px] text-slate-500 rounded-md border border-white/5 font-bold">+{file.tags.length - 2}</span>
                         )}
                      </div>
                   </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          /* List View Implementation */
          <div className="space-y-2">
             <div className="grid grid-cols-12 px-4 py-2 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5 mb-4">
                <div className="col-span-6">Name</div>
                <div className="col-span-2">Type</div>
                <div className="col-span-2">Size</div>
                <div className="col-span-2 text-right">Actions</div>
             </div>
             
             {filteredItems.folders.concat([] as any).map((folder: any) => (
                <div 
                  key={folder.id}
                  onDoubleClick={() => setCurrentFolderId(folder.id)}
                  className="grid grid-cols-12 items-center px-4 py-3 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 hover:border-indigo-500/30 transition-all cursor-pointer group"
                >
                   <div className="col-span-6 flex items-center gap-3">
                      <Folder className="w-5 h-5 text-indigo-400 fill-current" />
                      <span className="text-xs font-bold text-white">{folder.name}</span>
                   </div>
                   <div className="col-span-2 text-[11px] text-slate-500 font-mono">Folder</div>
                   <div className="col-span-2 text-[11px] text-slate-500 font-mono">-</div>
                   <div className="col-span-2 flex justify-end gap-2">
                      <button className="p-1.5 text-slate-500 hover:text-white transition-colors"><MoreVertical className="w-4 h-4" /></button>
                   </div>
                </div>
             ))}

             {filteredItems.files.map(file => (
                <div 
                  key={file.id}
                  className="grid grid-cols-12 items-center px-4 py-3 bg-[#0a0a1a] border border-white/10 rounded-xl hover:border-indigo-500/30 transition-all cursor-pointer group"
                >
                   <div className="col-span-6 flex items-center gap-3">
                      {file.type === 'PDF' && <FileText className="w-5 h-5 text-rose-500" />}
                      {file.type === 'Image' && <ImageIcon className="w-5 h-5 text-emerald-500" />}
                      {file.type === 'DOCX' && <File className="w-5 h-5 text-blue-500" />}
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors">{file.name}</span>
                        <div className="flex items-center gap-2 mt-0.5">
                           {file.tags.map(t => <span key={t} className="text-[8px] text-slate-500">#{t}</span>)}
                        </div>
                      </div>
                   </div>
                   <div className="col-span-2 text-[11px] text-slate-500 font-mono">{file.type}</div>
                   <div className="col-span-2 text-[11px] text-slate-500 font-mono">{formatSize(file.size)}</div>
                   <div className="col-span-2 flex justify-end gap-2">
                      <button 
                        onClick={() => startAIAnalysis(file)}
                        className="p-1.5 text-slate-500 hover:text-indigo-400 transition-colors"
                      >
                        <BrainCircuit className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-slate-500 hover:text-white transition-colors"><MoreVertical className="w-4 h-4" /></button>
                   </div>
                </div>
             ))}
          </div>
        )}
      </div>

      {/* AI ANALYSIS SIDEBAR / MODAL overlay */}
      <AnimatePresence>
        {aiAnalysisFile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
             <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95, y: 20 }}
               className="w-full max-w-4xl max-h-[85vh] bg-[#0a0b14] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative"
             >
                <button 
                  onClick={() => setAiAnalysisFile(null)}
                  className="absolute top-6 right-6 p-2 text-slate-500 hover:text-white transition-colors z-10"
                >
                  <X className="w-6 h-6" />
                </button>

                {/* Left: Preview & Meta */}
                <div className="w-full md:w-[40%] bg-white/5 p-8 border-r border-white/5 overflow-y-auto">
                   <div className="flex flex-col items-center text-center space-y-4 mb-8">
                      <div className="w-20 h-20 bg-indigo-500/10 rounded-3xl flex items-center justify-center mb-2">
                         {aiAnalysisFile.type === 'PDF' ? <FileText className="w-10 h-10 text-rose-500" /> : <ImageIcon className="w-10 h-10 text-emerald-500" />}
                      </div>
                      <div>
                        <h2 className="text-lg font-black text-white leading-tight mb-1">{aiAnalysisFile.name}</h2>
                        <p className="text-xs text-slate-500 font-mono uppercase tracking-widest">{aiAnalysisFile.type} DOCUMENT • {formatSize(aiAnalysisFile.size)}</p>
                      </div>
                   </div>

                   <div className="space-y-6">
                      <div>
                        <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-3">AI Detection Metadata</h4>
                        <div className="space-y-2">
                           <div className="flex justify-between text-xs">
                             <span className="text-slate-400">OCR Confidence:</span>
                             <span className="text-emerald-400 font-bold">98.4%</span>
                           </div>
                           <div className="flex justify-between text-xs">
                             <span className="text-slate-400">Readability:</span>
                             <span className="text-white font-bold">High</span>
                           </div>
                           <div className="flex justify-between text-xs">
                             <span className="text-slate-400">Tokens Index:</span>
                             <span className="text-white font-bold">~4,200</span>
                           </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-3">Associated Tags</h4>
                        <div className="flex flex-wrap gap-2">
                           {aiAnalysisFile.tags.map(t => (
                             <span key={t} className="px-2 py-1 bg-white/5 border border-white/5 rounded-lg text-[10px] text-slate-300">#{t}</span>
                           ))}
                        </div>
                      </div>
                   </div>
                </div>

                {/* Right: AI Actions */}
                <div className="flex-1 p-8 overflow-y-auto bg-[#05060b]">
                   <div className="flex items-center gap-3 mb-8">
                      <div className="p-2.5 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                         <BrainCircuit className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-white tracking-tight">Aris AI Integration</h3>
                        <p className="text-xs text-slate-500">Intelligent resource parsing & preparation engine active.</p>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                      <button 
                        onClick={async () => {
                          if (!aiAnalysisFile.aiInsights?.summary) {
                             if (aiAnalysisFile.base64Data) {
                                await analyzeFile(aiAnalysisFile.id, aiAnalysisFile.name, aiAnalysisFile.type, aiAnalysisFile.base64Data);
                             } else {
                                onNavigateToTutor(`Aris, I have a document named "${aiAnalysisFile.name}". It seems to be missing an AI summary. Please analyze it, summarize it, extract the key formulas, and explain any complex concepts in a simplified exam-focused manner.`, aiAnalysisFile);
                             }
                          } else {
                             onNavigateToTutor(`Aris, I have a document named "${aiAnalysisFile.name}". Please summarize it, extract the key formulas, and explain any complex concepts in a simplified exam-focused manner.`, aiAnalysisFile);
                          }
                        }}
                        className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4 hover:bg-indigo-600/10 hover:border-indigo-500/30 transition-all text-left"
                      >
                         <div className="p-2.5 bg-indigo-500/20 rounded-xl text-indigo-400"><Hash className="w-5 h-5" /></div>
                         <div className="flex-1">
                            <span className="block text-sm font-bold text-white">Generate Summary</span>
                            <span className="block text-[10px] text-slate-500">{aiAnalysisFile.aiInsights?.summary ? 'View Summary' : 'Run AI Analysis & Tutor'}</span>
                         </div>
                         <ArrowUpRight className="w-4 h-4 text-slate-700" />
                      </button>

                      <button 
                        onClick={() => {
                          onNavigateToTutor(`Create a conceptual quiz with 5 hard level multiple-choice questions based on the contents of my file "${aiAnalysisFile.name}". Focus on numerical patterns and edge cases.`, aiAnalysisFile);
                        }}
                        className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4 hover:bg-emerald-600/10 hover:border-emerald-500/30 transition-all text-left"
                      >
                         <div className="p-2.5 bg-emerald-500/20 rounded-xl text-emerald-400"><CloudLightning className="w-5 h-5" /></div>
                         <div className="flex-1">
                            <span className="block text-sm font-bold text-white">Interactive Quiz</span>
                            <span className="block text-[10px] text-slate-500">Test logic retention</span>
                         </div>
                         <ArrowUpRight className="w-4 h-4 text-slate-700" />
                       </button>

                      <button 
                        onClick={() => {
                           // Placeholder for now
                        }}
                        className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4 hover:bg-amber-600/10 hover:border-amber-500/30 transition-all text-left"
                      >
                         <div className="p-2.5 bg-amber-500/20 rounded-xl text-amber-400"><Sparkles className="w-5 h-5" /></div>
                         <div className="flex-1">
                            <span className="block text-sm font-bold text-white">Smart Flashcards</span>
                            <span className="block text-[10px] text-slate-500">Anki-style memory sync</span>
                         </div>
                         <ArrowUpRight className="w-4 h-4 text-slate-700" />
                      </button>

                      <button className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4 hover:bg-rose-600/10 hover:border-rose-500/30 transition-all text-left">
                         <div className="p-2.5 bg-rose-500/20 rounded-xl text-rose-400"><Download className="w-5 h-5" /></div>
                         <div className="flex-1">
                            <span className="block text-sm font-bold text-white">Download Source</span>
                            <span className="block text-[10px] text-slate-500">Offline file access</span>
                         </div>
                         <ArrowUpRight className="w-4 h-4 text-slate-700" />
                      </button>
                   </div>

                   {/* Quick AI Insights Box */}
                   <div className="space-y-6">
                      <div className="p-6 bg-indigo-500/5 border border-indigo-500/10 rounded-3xl space-y-4">
                         <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                           <Sparkles className="w-3.5 h-3.5" />
                           <span>Instant Insight Summary</span>
                         </h4>
                         {isAnalyzing ? (
                            <div className="space-y-2 animate-pulse">
                               <div className="h-3 bg-white/10 rounded w-full" />
                               <div className="h-3 bg-white/10 rounded w-[90%]" />
                               <div className="h-3 bg-white/10 rounded w-[80%]" />
                            </div>
                         ) : (
                            <p className="text-slate-300 text-sm leading-relaxed">
                              {aiAnalysisFile.aiInsights?.summary || 'No pre-calculated summary available. Initialize analysis with Aris AI to extract deep conceptual mapping.'}
                            </p>
                         )}
                         
                         {aiAnalysisFile.aiInsights?.formulas && (
                           <div className="space-y-2 mt-4 pt-4 border-t border-white/5">
                              <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">Key Formulas Detected</span>
                              <div className="flex flex-wrap gap-2">
                                {aiAnalysisFile.aiInsights.formulas.map(f => (
                                  <code key={f} className="px-2 py-1 bg-black/40 rounded border border-white/5 text-[10px] text-white font-mono">{f}</code>
                                ))}
                              </div>
                           </div>
                         )}
                      </div>

                      {/* AI Generated Flashcards */}
                      {aiAnalysisFile.aiInsights?.flashcards && aiAnalysisFile.aiInsights.flashcards.length > 0 && (
                        <div className="space-y-4">
                           <h4 className="text-xs font-black text-amber-400 uppercase tracking-widest flex items-center gap-2">
                              <CloudLightning className="w-3.5 h-3.5" />
                              <span>Smart Flashcards ({aiAnalysisFile.aiInsights.flashcards.length})</span>
                           </h4>
                           <div className="grid grid-cols-1 gap-3">
                              {aiAnalysisFile.aiInsights.flashcards.map((card, i) => (
                                <div key={i} className="p-4 bg-white/[0.03] border border-white/5 rounded-2xl group hover:border-amber-500/30 transition-all font-sans">
                                   <div className="text-xs font-black text-amber-500 uppercase tracking-tighter mb-1 font-mono">Q{i+1}:</div>
                                   <p className="text-sm text-white font-bold mb-2">{card.question}</p>
                                   <div className="p-3 bg-black/40 rounded-xl text-xs text-slate-400 italic">
                                      {card.answer}
                                   </div>
                                </div>
                              ))}
                           </div>
                        </div>
                      )}

                      {/* OCR Content */}
                      {aiAnalysisFile.aiInsights?.ocrText && (
                        <div className="space-y-4">
                           <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                              <FileText className="w-3.5 h-3.5" />
                              <span>Searchable OCR Text (Extracted)</span>
                           </h4>
                           <div className="p-6 bg-black/40 border border-white/5 rounded-2xl max-h-60 overflow-y-auto text-xs text-slate-500 font-mono whitespace-pre-wrap leading-relaxed">
                              {aiAnalysisFile.aiInsights.ocrText}
                           </div>
                        </div>
                      )}
                   </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

       {/* UPLOAD MODAL SIMULATION */}
       <AnimatePresence>
         {isUploadModalOpen && (
           <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-xl bg-[#0a0a1a] border border-white/10 rounded-3xl p-8 shadow-2xl relative"
              >
                 <button onClick={() => setIsUploadModalOpen(false)} className="absolute top-6 right-6 text-slate-500 hover:text-white"><X className="w-6 h-6" /></button>
                 
                 <h3 className="text-2xl font-black text-white mb-2">Upload Resources</h3>
                 <p className="text-slate-500 text-sm mb-8 leading-relaxed">Add PDFs, notes, or screenshots to your Knowledge Vault for AI-powered analysis and organization.</p>
                 
                 {uploadProgress !== null ? (
                   <div className="py-12 space-y-6">
                     <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-400">
                           <Upload className="w-8 h-8 animate-bounce" />
                        </div>
                        <div className="text-center">
                           <p className="text-white font-bold">Uploading {uploadingFile}</p>
                           <p className="text-slate-500 text-xs mt-1">{uploadProgress}% complete</p>
                        </div>
                     </div>
                     <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${uploadProgress}%` }}
                          className="h-full bg-indigo-500" 
                        />
                     </div>
                   </div>
                 ) : (
                   <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-white/10 bg-white/[0.02] rounded-2xl p-12 flex flex-col items-center justify-center space-y-4 hover:bg-white/5 hover:border-indigo-500/40 transition-all cursor-pointer group"
                   >
                       <input 
                         type="file" 
                         ref={fileInputRef} 
                         className="hidden" 
                         accept=".pdf,.png,.jpg,.jpeg"
                         onChange={handleFileUpload} 
                       />
                      <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-slate-500 group-hover:text-indigo-400 group-hover:scale-110 transition-all">
                         <Upload className="w-8 h-8" />
                      </div>
                      <div className="text-center">
                         <p className="text-white font-bold">Drag and drop file here</p>
                         <p className="text-slate-500 text-xs mt-1">or click to simulate a file upload</p>
                      </div>
                      <div className="text-[10px] text-slate-600 font-mono">Max size: 50MB (Free) • 500MB (Premium)</div>
                   </div>
                 )}

                 <div className="mt-8 flex justify-end gap-3 text-right">
                    <button onClick={() => setIsUploadModalOpen(false)} className="px-6 py-2.5 rounded-xl border border-white/10 text-slate-400 font-bold text-xs hover:text-white transition-all">Cancel</button>
                 </div>
              </motion.div>
           </div>
         )}
       </AnimatePresence>

       {/* NEW FOLDER MODAL */}
       <AnimatePresence>
         {isFolderModalOpen && (
           <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-md bg-[#0a0a1a] border border-white/10 rounded-3xl p-8 shadow-2xl relative"
              >
                 <button onClick={() => setIsFolderModalOpen(false)} className="absolute top-6 right-6 text-slate-500 hover:text-white"><X className="w-6 h-6" /></button>
                 
                 <h3 className="text-xl font-black text-white mb-6">Create New Folder</h3>
                 
                 <div className="space-y-4">
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Folder Name</label>
                       <input 
                         autoFocus
                         type="text" 
                         value={newFolderName}
                         onChange={(e) => setNewFolderName(e.target.value)}
                         onKeyDown={(e) => e.key === 'Enter' && createFolder()}
                         placeholder="e.g. NIMCET Revision Notes"
                         className="w-full p-3.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-all font-sans"
                       />
                    </div>
                    
                    <div className="flex justify-end gap-3 pt-4">
                       <button onClick={() => setIsFolderModalOpen(false)} className="px-6 py-2.5 rounded-xl border border-white/10 text-slate-400 font-bold text-xs hover:text-white transition-all">Cancel</button>
                       <button 
                         onClick={createFolder}
                         disabled={!newFolderName.trim()}
                         className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white rounded-xl font-bold text-xs transition-all shadow-lg shadow-indigo-500/20"
                       >
                         Create Folder
                       </button>
                    </div>
                 </div>
              </motion.div>
           </div>
         )}
       </AnimatePresence>
    </div>
  );
}
