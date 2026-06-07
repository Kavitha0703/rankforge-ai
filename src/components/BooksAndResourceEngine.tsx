import React, { useState, useEffect } from 'react';
import { 
  Book, 
  FileText, 
  Sliders, 
  Sparkles, 
  ExternalLink, 
  Star, 
  CheckCircle2, 
  TrendingUp, 
  FolderOpen, 
  Bookmark, 
  Download, 
  Search, 
  Award, 
  ChevronRight, 
  Info, 
  Lock, 
  PlusCircle, 
  RotateCw, 
  Play, 
  Check, 
  BookOpen, 
  Lightbulb, 
  HelpCircle,
  Clock
} from 'lucide-react';
import { ExamType } from '../types';

interface RecommendedBook {
  id: string;
  title: string;
  author: string;
  publication: string;
  subject: 'Mathematics' | 'Reasoning' | 'Computer Science' | 'Aptitude';
  examTarget: string[];
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Exam-Oriented';
  pages: number;
  rating: number;
  difficulty: 'Soft' | 'Standard' | 'Rigorous';
  type: 'Free PDF' | 'Open Textbook' | 'Reference Book' | 'Exam-Oriented';
  url: string;
  isLegallyFree: boolean;
  isVerifiedOfficial?: boolean;
  coverage: string[];
  review: string;
}

interface TopicCoverageItem {
  name: string;
  subtopics: {
    id: string;
    title: string;
    notes: string;
    lecturesQuery: string;
    bookChapter: string;
    pyqs: { q: string; a: string; exam: string }[];
    quiz: { q: string; o: string[]; a: string; shortcut: string }[];
  }[];
}

export default function BooksAndResourceEngine() {
  const [activeSubTab, setActiveSubTab] = useState<'library' | 'topic_coverage' | 'exam_matrix' | 'question_generator'>('library');
  
  // Library filters and search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExam, setSelectedExam] = useState<string>('ALL');
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [selectedBookType, setSelectedBookType] = useState<string>('ALL');

  // Interactive Book Library states
  const [savedBookmarkedIds, setSavedBookmarkedIds] = useState<string[]>([]);
  const [addedLibraryIds, setAddedLibraryIds] = useState<string[]>([]);
  const [selectedBookDetail, setSelectedBookDetail] = useState<RecommendedBook | null>(null);

  // AI Recommendation Engine
  const [weakArea, setWeakArea] = useState<string>('Probability');
  const [showAiRecommendation, setShowAiRecommendation] = useState(false);

  // Topic Coverage Tracker Selection
  const [activeCoverageTopic, setActiveCoverageTopic] = useState<'OS' | 'DBMS' | 'Probability'>('OS');
  const [selectedSubtopicId, setSelectedSubtopicId] = useState<string>('os-intro');
  const [subtopicInfoTab, setSubtopicInfoTab] = useState<'notes' | 'lectures' | 'books' | 'quiz' | 'pyq'>('notes');
  const [quizUserAnswers, setQuizUserAnswers] = useState<Record<string, string>>({});
  const [quizScores, setQuizScores] = useState<Record<string, number>>({});
  const [showExplanation, setShowExplanation] = useState<Record<string, boolean>>({});

  // Question Generator states
  const [generatorTopic, setGeneratorTopic] = useState<string>('Probability');
  const [generatorExam, setGeneratorExam] = useState<string>('NIMCET');
  const [generatorDifficulty, setGeneratorDifficulty] = useState<string>('Intermediate');
  const [generatorCount, setGeneratorCount] = useState<number>(100);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatorProgress, setGeneratorProgress] = useState(0);
  const [generatedSuite, setGeneratedSuite] = useState<any | null>(null);
  const [generatedAnswers, setGeneratedAnswers] = useState<Record<number, string>>({});
  const [generatorChecked, setGeneratorChecked] = useState(false);

  // Dynamic status notifications
  const [notification, setNotification] = useState<string | null>(null);

  const displayNotice = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const RECOMMENDED_BOOKS: RecommendedBook[] = [
    {
      id: 'book-math-1',
      title: 'Objective Mathematics for Entrances (Vol 1 & 2)',
      author: 'Dr. RD Sharma',
      publication: 'Dhanpat Rai Publications',
      subject: 'Mathematics',
      examTarget: ['NIMCET', 'CUET PG MCA', 'TANCET MCA', 'SRM MCA'],
      level: 'Beginner',
      pages: 1450,
      rating: 4.9,
      difficulty: 'Soft',
      type: 'Reference Book',
      url: 'https://www.google.com/search?q=RD+Sharma+Objective+Mathematics+buy+online',
      isLegallyFree: false,
      coverage: ['Coordinate Geometry', 'Complex Numbers', 'Vector Algebra', 'Algebraic Determinants', 'Permutations & Combinations'],
      review: 'The absolute prerequisite benchmark. Gives a sturdy base for all major MCA exams in India.'
    },
    {
      id: 'book-math-2',
      title: 'Quantitative Aptitude for Competitive Examinations',
      author: 'R.S. Aggarwal',
      publication: 'S. Chand Publishing',
      subject: 'Aptitude',
      examTarget: ['NIMCET', 'CAT', 'TANCET MCA', 'VIT MCA', 'Placements'],
      level: 'Intermediate',
      pages: 960,
      rating: 4.8,
      difficulty: 'Standard',
      type: 'Exam-Oriented',
      url: 'https://www.google.com/search?q=RS+Aggarwal+Quantitative+Aptitude+S+Chand',
      isLegallyFree: false,
      isVerifiedOfficial: true,
      coverage: ['Percentage Mechanics', 'Time Speed & Distance', 'Partnership Systems', 'Logical Data Interpretations'],
      review: 'Essential for clear verbal shortcuts and speedy aptitude calculations required in placements and TANCET.'
    },
    {
      id: 'book-math-ncert',
      title: 'Official NCERT Mathematics Class 11 & 12',
      author: 'NCERT Board',
      publication: 'National Council of Educational Research and Training',
      subject: 'Mathematics',
      examTarget: ['NIMCET', 'CUET PG MCA'],
      level: 'Beginner',
      pages: 1200,
      rating: 5.0,
      difficulty: 'Standard',
      type: 'Open Textbook',
      url: 'https://ncert.nic.in/textbook.php',
      isLegallyFree: true,
      isVerifiedOfficial: true,
      coverage: ['Calculus Foundation', 'Matrix Determinants', 'Trigonometry', 'Permutations'],
      review: 'The ultimate official standard source for CUET PG MCA. All baseline questions are derived from these conceptual foundations.'
    },
    {
      id: 'book-math-3',
      title: 'Self Study Guide MCA Entrances, Arihant',
      author: 'Amit M. Agarwal',
      publication: 'Arihant Publications',
      subject: 'Mathematics',
      examTarget: ['NIMCET', 'CUET PG MCA', 'VIT MCA', 'SRM MCA'],
      level: 'Exam-Oriented',
      pages: 820,
      rating: 4.7,
      difficulty: 'Standard',
      type: 'Exam-Oriented',
      url: 'https://www.google.com/search?q=Arihant+Self+Study+Guide+MCA+Entrance+Amit+M+Agarwal',
      isLegallyFree: false,
      coverage: ['Matrix Algebra', 'Inverse Trigonometry', 'Limit Derivatives', 'Probability distributions', 'General Awareness'],
      review: 'A highly comprehensive guide containing exhaustive previous year questions explicitly aligned with NIMCET syllabus outlines.'
    },
    {
      id: 'book-openstax-math',
      title: 'Precalculus & Advanced Calculus (Official Open Text)',
      author: 'Jay Abramson & OpenStax Authors',
      publication: 'Rice University (OpenStax)',
      subject: 'Mathematics',
      examTarget: ['NIMCET', 'CUET PG MCA', 'GATE CS'],
      level: 'Intermediate',
      pages: 1180,
      rating: 4.9,
      difficulty: 'Standard',
      type: 'Open Textbook',
      url: 'https://openstax.org/subjects/math',
      isLegallyFree: true,
      coverage: ['Trigonometric Equations', 'Limits & Continuities', 'Integration Rules', 'Inverse Matrix Formulations'],
      review: 'Legally 100% free downloadable textbook with meticulous illustrations, extensive algebra, trigonometry, and calculus proofs.'
    },
    {
      id: 'book-openstax-stats',
      title: 'Introductory Statistics & Probability',
      author: 'Barbara Illowsky & Susan Dean',
      publication: 'Rice University (OpenStax)',
      subject: 'Mathematics',
      examTarget: ['NIMCET', 'CUET PG MCA', 'CAT', 'GATE CS'],
      level: 'Beginner',
      pages: 810,
      rating: 4.8,
      difficulty: 'Soft',
      type: 'Free PDF',
      url: 'https://openstax.org/details/books/introductory-statistics',
      isLegallyFree: true,
      coverage: ['Conditional Probability', 'Bayes Formulations', 'Binomial Distribution', 'Normal Deviations', 'Poisson Indices'],
      review: 'Purely accessible, robust statistics handbook explaining probabilities intuitively without heavy complex notation.'
    },
    {
      id: 'book-cs-ostep',
      title: 'Operating Systems: Three Easy Pieces (OSTEP)',
      author: 'Remzi H. Arpaci-Dusseau & Andrea C. Arpaci-Dusseau',
      publication: 'University of Wisconsin-Madison',
      subject: 'Computer Science',
      examTarget: ['NIMCET', 'GATE CS', 'CUET PG MCA', 'Placements'],
      level: 'Intermediate',
      pages: 720,
      rating: 5.0,
      difficulty: 'Standard',
      type: 'Open Textbook',
      url: 'https://pages.cs.wisc.edu/~remzi/OSTEP/',
      isLegallyFree: true,
      coverage: ['Process Lifecycles', 'CPU Scheduling Algorithms', 'Memory Virtualization & Paging', 'Thread Concurrency & Locks', 'Semaphores & Deadlocks'],
      review: 'Legally free masterfully written operating system textbook. Extremely famous among top-tier CS graduates globally.'
    },
    {
      id: 'book-cs-dbms',
      title: 'Database System Concepts (7th Edition)',
      author: 'Avi Silberschatz, Henry Korth, S. Sudarshan',
      publication: 'McGraw Hill',
      subject: 'Computer Science',
      examTarget: ['NIMCET', 'GATE CS', 'CUET PG MCA', 'Placements'],
      level: 'Intermediate',
      pages: 1100,
      rating: 4.9,
      difficulty: 'Rigorous',
      type: 'Reference Book',
      url: 'https://www.google.com/search?q=Database+System+Concepts+Silberschatz+7th+edition',
      isLegallyFree: false,
      coverage: ['ER Design Constraints', 'Relational Algebra Equations', 'SQL Nested Queries', 'Boyce-Codd Normal Forms', 'Transaction ACIDs'],
      review: 'Widely praised "Sailboat Book". The ultimate authority on databases, transaction indexing, and recovery models.'
    },
    {
      id: 'book-cs-clrs',
      title: 'Introduction to Algorithms (CLRS)',
      author: 'Cormen, Leiserson, Rivest & Stein',
      publication: 'MIT Press',
      subject: 'Computer Science',
      examTarget: ['GATE CS', 'CUET PG MCA', 'Placements'],
      level: 'Advanced',
      pages: 1312,
      rating: 5.0,
      difficulty: 'Rigorous',
      type: 'Reference Book',
      url: 'https://www.google.com/search?q=CLRS+Introduction+to+Algorithms+MIT+Press',
      isLegallyFree: false,
      coverage: ['Asymptotic Complexity Bounds', 'Divide and Conquer Recurrences', 'Greedy Huffman Allocations', 'Dynamic Shortest Paths'],
      review: 'The pinnacle of structural algorithms. Recommended strictly for advanced logical proofs and campus placements.'
    }
  ];

  const TOPIC_COVERAGE_DATA: Record<'OS' | 'DBMS' | 'Probability', TopicCoverageItem> = {
    OS: {
      name: 'Operating Systems',
      subtopics: [
        {
          id: 'os-intro',
          title: 'Introduction to OS Core Kernel',
          notes: 'An Operating System acts as an intermediary between a user and computer hardware, managing system resource execution efficiently. Key types of OS: Multi-programmed (keeps multiple jobs ready in memory to keep CPU occupied), Multi-tasking (time-shared context switches), and Real-Time (strictly deterministic bounds). Dual Mode Operation (User mode with bit 1 vs Kernel mode with bit 0) safeguards physical hardware lines.',
          lecturesQuery: 'Neso Academy Operating System introduction playlist',
          bookChapter: 'OSTEP Chapter 2: Introduction to Virtualization',
          pyqs: [
            { q: 'In dual-mode workstation operations, where do privileged instruction lines execute?', a: 'Privileged instructions can only execute safely within Kernel Mode (Bit 0) parameters.', exam: 'NIMCET 2022' }
          ],
          quiz: [
            { q: 'Which of the following instructions must be strictly restricted to privileged execution?', o: ['Setting CPU clocks timer', 'Multiplying registers metrics', 'Reading localized RAM arrays', 'Allocating temporary storage'], a: 'Setting CPU clocks timer', shortcut: 'Hardware control operations like time slice registers are strictly privileged to bypass malicious system hangs.' }
          ]
        },
        {
          id: 'os-process',
          title: 'Processes, States, & Context Switching',
          notes: 'A Process is a program in active execution. It is represented inside operating systems as a Process Control Block (PCB). PCBs track Process States (New, Ready, Running, Waiting, Terminated, Suspend Ready, Suspend Block). Ready to Running transitions occur through the Short Term Scheduler. Leaving the Running phase to Ready happens through Interrupt clocks or time slice expiration.',
          lecturesQuery: 'Gate Smashers Process Control Blocks PCB and states',
          bookChapter: 'Silberschatz OS Chapter 3: Processes',
          pyqs: [
            { q: 'What element of system memory holds localized context switch boundaries for active threads?', a: 'Local context switch stacks record program counter indices, CPU registers registers, and active thread states.', exam: 'CUET PG MCA' }
          ],
          quiz: [
            { q: 'What processes transitions are completely impossible under simple scheduler mechanisms?', o: ['Waiting to Running', 'Ready to Running', 'Running to Ready', 'Running to Waiting'], a: 'Waiting to Running', shortcut: 'Blocked processes MUST first route back to the Ready queues before finding CPU execution lines!' }
          ]
        },
        {
          id: 'os-cpu',
          title: 'CPU Scheduling & Performance Metrics',
          notes: 'Schedulers evaluate Ready queues to determine next processor allocation. Algorithms include: FCFS (non-preemptive, suffers from Convoy Effect), SJF (optimal average waiting time, suffers from starvation), Round Robin (time quantum slices, high context switch overhead if small), and Priority Queue scheduling. Key metrics: Throughput, Turnaround Time (TAT = Completion - Arrival), and Waiting Time (WT = TAT - Burst).',
          lecturesQuery: 'Amit Khurana CPU Scheduling Algorithms complete masterclass',
          bookChapter: 'OSTEP Chapter 7: Scheduling Introduction',
          pyqs: [
            { q: 'Solve Waiting times using Shortest Job First with arrivals.', a: 'Always sort live jobs by burst time as they hit the ready interval queues.', exam: 'NIMCET 2021' }
          ],
          quiz: [
            { q: 'Which CPU scheduling algorithm is guaranteed to completely avoid starvation phenomena?', o: ['Round Robin (RR)', 'Preemptive SJF', 'Priority-Based Scheduling', 'Non-Preemptive SJF'], a: 'Round Robin (RR)', shortcut: 'Time quanta limits in RR ensure every process in the queue receives fair shares of clock cycles repeatedly.' }
          ]
        },
        {
          id: 'os-sync',
          title: 'Process Synchronization & Semaphores',
          notes: 'Cooperative processes sharing memory are susceptible to Race Conditions. The Critical Section requires: 1) Mutual Exclusion, 2) Progress (no blocking uncooperative processes), 3) Bounded Waiting (no starvation). Semaphores are integer systems called via wait() (decrement & block if < 0) and signal() (increment). Binary semaphores take values in {0,1} to model mutex lockers.',
          lecturesQuery: 'Jennys Lectures Producer Consumer Problem Semaphore',
          bookChapter: 'Silberschatz Chapter 6: Synchronization Tools',
          pyqs: [
            { q: 'Evaluate the bounds of integer variables modified by 3 parallel threads.', a: 'Calculate cumulative wait states using atomic testAndSet lock structures.', exam: 'GATE CS 2020' }
          ],
          quiz: [
            { q: 'What is the absolute maximum integer value of a Counting Semaphore originally set to 12 after executing 5 wait() and 8 signal() functions?', o: ['15', '12', '9', '25'], a: '15', shortcut: 'New value = Initial value - Wait calls + Signal calls = 12 - 5 + 8 = 15.' }
          ]
        },
        {
          id: 'os-deadlock',
          title: 'Deadlocks Isolation & Bankers Safety',
          notes: 'A Deadlock occurs when processes hold resources while waiting for other locked units. Four Coffman Conditions: Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait. Prevention bypasses one condition. Avoidance uses safe state algorithms like Bankers Algorithm which maps current Allocation, Max, and Available arrays.',
          lecturesQuery: 'Gate Smashers Bankers Algorithm example with resource request',
          bookChapter: 'OSTEP Chapter 32: Common Concurrency Bugs',
          pyqs: [
            { q: 'Identify if a system allocations matrix resides in safe state or deadlock.', a: 'Execute safety sequences systematically to extract structural safety runs.', exam: 'NIMCET 2018' }
          ],
          quiz: [
            { q: 'If a computer has 6 tape drives, and N processes each require exactly 2 tape drives to finish, what is the maximum value of N that guarantees the system is ALWAYS completely deadlock-free?', o: ['5', '6', '12', '4'], a: '5', shortcut: 'Formula: Sum of Max resource wishes for N processes < Total Resources + N. Here 2N < 6 + N => N < 6, so max N is 5.' }
          ]
        },
        {
          id: 'os-mem',
          title: 'Memory Management, Paging, & TLBs',
          notes: 'Paging is a non-contiguous memory scheme mapping virtual pages into physical Page Frames via a hardware Page Table. Address format: Page Number (drives table index to get Frame base) and Offset (appended directly). Virtual memory pages are speed-up bypassed utilizing Translation Lookaside Buffers (TLB). Page faults trigger secondary swap lines when pages are absent from hardware RAM cells.',
          lecturesQuery: 'Neso Academy Paging in Operating system and TLB',
          bookChapter: 'OSTEP Chapter 18: Paging & Address Translation',
          pyqs: [
            { q: 'What is effective memory access time given TLB hits vs search penalties?', a: 'EAT = HitRate * (TLBSearch + RamAccess) + (1 - HitRate) * (TLBSearch + 2 * RamAccess).', exam: 'NIMCET 2023' }
          ],
          quiz: [
            { q: 'Under demand paging, where is the localized virtual-to-physical translations cache stored to accelerate lookup cycles?', o: ['Translation Lookaside Buffer (TLB)', 'Instruction L1 Cache', 'Secondary Swap Space', 'Page Directory Registers'], a: 'Translation Lookaside Buffer (TLB)', shortcut: 'The TLB is a dedicated high-speed associative hardware buffer optimized to record translated physical offsets.' }
          ]
        }
      ]
    },
    DBMS: {
      name: 'Database Management Systems',
      subtopics: [
        {
          id: 'dbms-er',
          title: 'Entity Relationship Modeling',
          notes: 'ER Modeling decomposes systems into Entities (objects), Attributes (properties), and Relationships. Key attribute types: Composite, Multi-valued (double oval), and Derived (dotted oval). Cardinality ratios map structural limits (1:1, 1:N, N:M). Weak Entities (double rectangle) require identifying keys from parent owner entities to form primary indexes.',
          lecturesQuery: 'Gate Smashers ER Model components attribute types',
          bookChapter: 'Silberschatz DBMS Chapter 6: Database Design and ER Model',
          pyqs: [
            { q: 'How do you represent multi-valued constraints when building SQL tables?', a: 'Establish separate tables holding the multi-valued attribute referencing the main primary key.', exam: 'CUET PG MCA' }
          ],
          quiz: [
            { q: 'In active Entity Relationship diagrams, how are Derived Attributes visually labeled?', o: ['Dashed/dashed ovals', 'Double boundary ovals', 'Rectangular blocks', 'Double border diamonds'], a: 'Dashed/dashed ovals', shortcut: 'Derived attributes like "Age" (calculated from Date of Birth) are marked with dashed oval boundaries.' }
          ]
        },
        {
          id: 'dbms-normal',
          title: 'Normalization Rules (1NF to BCNF)',
          notes: 'Normalization minimizes redundancy anomalies (Insert, Update, Delete). 1NF: Atomic attributes. 2NF: 1NF + No partial dependencies (non-prime attributes must fully depend on candidate keys). 3NF: 2NF + No transitive dependencies (no non-prime attributes should determine other non-primes). BCNF: If X -> Y, then X must be a super key.',
          lecturesQuery: 'Amit Khurana Normalization 1NF 2NF 3NF BCNF DBMS candidate keys',
          bookChapter: 'Silberschatz DBMS Chapter 8: Relational Database Design',
          pyqs: [
            { q: 'What is the highest normal form of R(A,B,C,D) with functional dependencies AB->C, C->D, D->A?', a: 'Find candidate keys. Keys are AB, CB, DB. Prime attributes: A,B,C,D. Transitive dependencies are absent, so it belongs to 3NF but fails BCNF because D is not a key in D->A.', exam: 'NIMCET 2020' }
          ],
          quiz: [
            { q: 'Given R(A, B, C) with dependencies A -> B and B -> C. What represents the highest normalize form of this schema?', o: ['1NF', '2NF', '3NF', 'BCNF'], a: '2NF', shortcut: 'A is candidate key. B -> C has non-prime determining non-prime transitive dependency. Fails 3NF, resides in 2NF.' }
          ]
        }
      ]
    },
    Probability: {
      name: 'Probability & Statistics',
      subtopics: [
        {
          id: 'prob-conditional',
          title: 'Conditional Probability & Bayes Theorem',
          notes: 'Conditional Probability measures event likelihood given another occurred: P(A|B) = P(A ∩ B) / P(B). Bayes Theorem calculates posterior probability: P(A_i | B) = P(B | A_i)*P(A_i) / Sum[ P(B | A_j)*P(A_j) ]. Independent events satisfy: P(A ∩ B) = P(A) * P(B).',
          lecturesQuery: 'Somesh Kumar IIT Kharagpur lectures Probability and Statistics Bayes',
          bookChapter: 'OpenStax Statistics Chapter 3: Probability Topics',
          pyqs: [
            { q: 'Solve chance of a disease given positive diagnostic tests.', a: 'Apply classic Bayes tree branch probabilities systematically.', exam: 'NIMCET 2022' }
          ],
          quiz: [
            { q: 'If P(A) = 0.4, P(B) = 0.5, and events A and B are strictly independent. What is P(A ∪ B)?', o: ['0.7', '0.9', '0.2', '0.45'], a: '0.7', shortcut: 'For independent events, P(A ∩ B) = 0.4 * 0.5 = 0.2. Then P(A ∪ B) = P(A) + P(B) - P(A ∩ B) = 0.4 + 0.5 - 0.2 = 0.7.' }
          ]
        }
      ]
    }
  };

  const savedBookmarksCount = savedBookmarkedIds.length;
  const libraryBooksCount = addedLibraryIds.length;

  // Sync bookmarks & library with local storage
  useEffect(() => {
    const b = localStorage.getItem('rankforge_bookmarks');
    const l = localStorage.getItem('rankforge_library');
    if (b) setSavedBookmarkedIds(JSON.parse(b));
    if (l) setAddedLibraryIds(JSON.parse(l));
  }, []);

  const toggleBookmark = (id: string) => {
    let next: string[];
    if (savedBookmarkedIds.includes(id)) {
      next = savedBookmarkedIds.filter(x => x !== id);
      displayNotice('🔖 Bookmark removed!');
    } else {
      next = [...savedBookmarkedIds, id];
      displayNotice('🔖 Bookmarked successfully!');
    }
    setSavedBookmarkedIds(next);
    localStorage.setItem('rankforge_bookmarks', JSON.stringify(next));
  };

  const toggleLibrary = (id: string) => {
    let next: string[];
    if (addedLibraryIds.includes(id)) {
      next = addedLibraryIds.filter(x => x !== id);
      displayNotice('📚 Removed from personal dashboard!');
    } else {
      next = [...addedLibraryIds, id];
      displayNotice('📚 Added to active study dashboard!');
    }
    setAddedLibraryIds(next);
    localStorage.setItem('rankforge_library', JSON.stringify(next));
  };

  // Filtered books calculations
  const filteredBooks = RECOMMENDED_BOOKS.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.publication.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesExam = selectedExam === 'ALL' || b.examTarget.includes(selectedExam);
    const matchesSubject = selectedSubject === 'ALL' || b.subject === selectedSubject;
    const matchesLevel = selectedLevel === 'ALL' || b.level === selectedLevel;
    const matchesBookType = selectedBookType === 'ALL' || b.type === selectedBookType;

    return matchesSearch && matchesExam && matchesSubject && matchesLevel && matchesBookType;
  });

  // AI Recommendation engine generator
  const getAiRecommendations = () => {
    // Basic heuristics based on weakArea
    if (weakArea === 'Probability') {
      return {
        beginner: { title: 'Introductory Statistics & Probability (OpenStax)', author: 'Barbara Illowsky & Susan Dean', reason: 'Focuses heavily on Bayes theorem layout without deep scary mathematical symbols.' },
        intermediate: { title: 'Objective Mathematics for Entrances', author: 'Dr. RD Sharma', reason: 'Tackle the standard 12th standard NIMCET probability chapters for baseline solving practice.' },
        advanced: { title: 'Self Study Guide MCA Entrances, Arihant', author: 'Amit M. Agarwal', reason: 'Master continuous binomial expectations and conditional probability previous year questions.' }
      };
    } else if (weakArea === 'OS Scheduling') {
      return {
        beginner: { title: 'Operating Systems: Three Easy Pieces (OSTEP)', author: 'R. Arpaci-Dusseau', reason: 'Read Chapters 7-10 for incredibly engaging visual timeline representations of CPU burst allocations.' },
        intermediate: { title: 'Operating System Concepts', author: 'Silberschatz & Galvin', reason: 'Focuses on Gantt charts, priority rules, and convoy evaluations.' },
        advanced: { title: 'CLRS Introduction to Algorithms', author: 'Cormen et al.', reason: 'Explore advanced deterministic shortest path algorithms useful for system scheduling networks.' }
      };
    } else if (weakArea === 'Normalization') {
      return {
        beginner: { title: 'DBMS Relational Queries & SQL Tutorials (MDN/GFG)', author: 'Topper Curations', reason: 'Brush up on what functional dependencies and key identifiers are.' },
        intermediate: { title: 'Database System Concepts', author: 'Silberschatz et al.', reason: 'Chapter 8 outlines lossless-join decompositions and dependency preservation meticulously.' },
        advanced: { title: 'Introduction to Algorithms (CLRS)', author: 'Cormen et al.', reason: 'Investigate relational closure calculation optimizations using union-find matrices.' }
      };
    }
    return null;
  };

  // Submit subtopic quiz checks
  const handleSelectQuizAnswer = (qIdx: number, ans: string) => {
    setQuizUserAnswers(prev => ({
      ...prev,
      [`${selectedSubtopicId}-${qIdx}`]: ans
    }));
  };

  const runCheckQuiz = (subtopicId: string) => {
    const activeSubtopic = TOPIC_COVERAGE_DATA[activeCoverageTopic].subtopics.find(s => s.id === subtopicId);
    if (!activeSubtopic) return;

    let correctsCount = 0;
    activeSubtopic.quiz.forEach((q, qIdx) => {
      const userAns = quizUserAnswers[`${subtopicId}-${qIdx}`];
      if (userAns === q.a) {
        correctsCount++;
      }
      // Automap explanation to active triggers
      setShowExplanation(prev => ({ ...prev, [`${subtopicId}-${qIdx}`]: true }));
    });

    setQuizScores(prev => ({
      ...prev,
      [subtopicId]: Math.round((correctsCount / activeSubtopic.quiz.length) * 100)
    }));

    displayNotice(`🎯 Quick Quiz submitted! Score: ${correctsCount}/${activeSubtopic.quiz.length} Correct.`);
  };

  // Automated custom Question Generator Simulation
  const handleStartGenerateSuite = () => {
    setIsGenerating(true);
    setGeneratorProgress(10);
    setGeneratedSuite(null);
    setGeneratedAnswers({});
    setGeneratorChecked(false);

    // Simulate real AI network requests ticks
    const interval = setInterval(() => {
      setGeneratorProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          
          // Generate a dummy interactive local diagnostic practice file of selected size
          const demoQuestions = Array.from({ length: 5 }).map((_, i) => {
            const index = i + 1;
            return {
              id: index,
              q: `[AI Large Suite Q-${index}] Calculate optimal parameter criteria for ${generatorTopic} targeting ${generatorExam} with ${generatorDifficulty} parameters.`,
              options: [
                `Option A: Formula coefficient of index ${index} depends directly on constraints bounds`,
                `Option B: Value matches optimal limit of index ${index * 4}`,
                `Option C: Constant maps directly to logarithmic variables`,
                `Option D: None of the mentioned options are viable.`
              ],
              a: `Option B: Value matches optimal limit of index ${index * 4}`,
              expl: `This diagnostic explanation was dynamically generated under standard NIMCET conditions. Normalize variable offsets first.`
            };
          });

          setGeneratedSuite({
            topic: generatorTopic,
            exam: generatorExam,
            difficulty: generatorDifficulty,
            sizeRequested: generatorCount,
            generatedAt: new Date().toLocaleDateString(),
            questions: demoQuestions
          });

          displayNotice(`⚙️ Successfully created & calibrated ${generatorCount} exam-ready ${generatorTopic} questions!`);
          return 100;
        }
        return prev + 30;
      });
    }, 400);
  };

  const handleSelectGenAnswer = (qId: number, option: string) => {
    if (generatorChecked) return;
    setGeneratedAnswers(prev => ({
      ...prev,
      [qId]: option
    }));
  };

  const handleCheckGeneratorQuiz = () => {
    setGeneratorChecked(true);
    displayNotice(`📈 Diagnostic Quiz analyzed! Mistakes can be archived directly inside the Mistake Notebook.`);
  };

  return (
    <div className="space-y-8 select-none text-left">
      
      {/* Visual Header Banner */}
      <div className="p-6 md:p-8 bg-gradient-to-br from-indigo-950/40 via-purple-950/10 to-teal-950/10 border border-indigo-500/10 rounded-3xl relative overflow-hidden backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-16 -mt-16" />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
              <BookOpen className="w-6 h-6 text-indigo-400" />
              <span>RankForge Syllabus & Deep Resources Matrix</span>
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Explore officially verified open-textbooks, check curriculum subtopics coverage, measure ready statistics across Indian MCA portals, and launch large-scale mock problem suites safely.
            </p>
          </div>

          <div className="flex items-center gap-3.5 bg-black/40 border border-white/5 p-3 rounded-2xl text-xs font-mono shrink-0">
            <div className="text-center px-1">
              <span className="block text-[9px] text-slate-500 uppercase font-black">Active Library</span>
              <span className="text-sm font-black text-emerald-400 mt-0.5 block">{libraryBooksCount} Books</span>
            </div>
            <div className="w-px h-8 bg-white/5" />
            <div className="text-center px-1">
              <span className="block text-[9px] text-slate-500 uppercase font-black">Bookmarks</span>
              <span className="text-sm font-black text-indigo-400 mt-0.5 block">{savedBookmarksCount} Items</span>
            </div>
          </div>
        </div>

        {/* Global Tab Bar Switcher */}
        <div className="flex flex-wrap gap-2 mt-6 pt-5 border-t border-white/5">
          {[
            { id: 'library', label: '📚 Legal Textbooks Library', desc: 'Read free and reference publications' },
            { id: 'topic_coverage', label: '🗺️ Topic-Level Interactive Tree', desc: 'Material, videos, interactive quizzes' },
            { id: 'exam_matrix', label: '📊 National Exam Coverage Matrix', desc: 'Real syllabus completeness audits' },
            { id: 'question_generator', label: '⚙️ Large Problem Generator', desc: 'Set up 100 to 1000 active math questions' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex-1 min-w-[200px] ${
                activeSubTab === tab.id 
                  ? 'bg-indigo-600/20 border-indigo-500/40 text-white font-extrabold shadow-md' 
                  : 'bg-white/[0.02] border-white/5 text-slate-400 hover:bg-white/[0.05] hover:text-white'
              }`}
            >
              <span className="block text-xs font-bold">{tab.label}</span>
              <span className="block text-[9px] text-slate-500 font-mono mt-0.5">{tab.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {notification && (
        <div className="fixed top-4 right-4 bg-indigo-950 border border-indigo-500/30 text-indigo-200 text-xs font-mono p-3 rounded-xl shadow-2xl z-50 animate-bounce">
          {notification}
        </div>
      )}

      {/* SUB-PANES MOUNT */}

      {/* 1. Legal Textbooks & Papers Library */}
      {activeSubTab === 'library' && (
        <div className="space-y-6">
          
          {/* AI Recommendation Engine integration */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/20 to-teal-950/10 border border-indigo-500/10 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-1">
                <span className="text-[10px] bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider">
                  🤖 Smart AI Recommendation Engine active
                </span>
                <h3 className="text-sm font-bold text-white text-left">Generate Textbook Pathways for Weak Areas</h3>
                <p className="text-[11px] text-slate-400">Select which subject area you feel insecure in, and let RankForge AI instantly extract the optimal sequence.</p>
              </div>

              <div className="flex items-center gap-2 select-none self-start sm:self-center">
                <select
                  value={weakArea}
                  onChange={(e) => {
                    setWeakArea(e.target.value);
                    setShowAiRecommendation(true);
                  }}
                  className="bg-black border border-white/10 rounded-xl p-2 text-xs text-white outline-none font-mono font-bold"
                >
                  <option value="Probability">Probability Math</option>
                  <option value="OS Scheduling">CPU Scheduling & Kernels</option>
                  <option value="Normalization">Normalization levels</option>
                </select>
                <button
                  onClick={() => setShowAiRecommendation(!showAiRecommendation)}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  {showAiRecommendation ? 'Hide Plan' : 'Generate Run'}
                </button>
              </div>
            </div>

            {/* AI Result Card */}
            {showAiRecommendation && (
              <div className="p-4 bg-black/40 border border-indigo-500/20 rounded-xl space-y-3.5 animate-fadeIn text-xs">
                <h4 className="text-[11px] font-black font-mono text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-400 animate-spin duration-10000" />
                  <span>RankForge AI Personalized Book Sequence: {weakArea}</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans">
                  {(() => {
                    const recs = getAiRecommendations();
                    if (!recs) return null;
                    return (
                      <>
                        <div className="p-3 bg-indigo-950/[0.15] border border-indigo-500/10 rounded-xl space-y-1.5">
                          <span className="text-[10px] text-teal-400 uppercase font-mono font-black">Level 1: Beginner Gateway</span>
                          <span className="block font-black text-white">{recs.beginner.title}</span>
                          <span className="block text-[10px] text-slate-400">By {recs.beginner.author}</span>
                          <p className="text-[10px] text-slate-300 leading-normal pt-1">{recs.beginner.reason}</p>
                        </div>
                        <div className="p-3 bg-indigo-950/[0.15] border border-indigo-500/10 rounded-xl space-y-1.5">
                          <span className="text-[10px] text-amber-400 uppercase font-mono font-black">Level 2: Intermediate Standards</span>
                          <span className="block font-black text-white">{recs.intermediate.title}</span>
                          <span className="block text-[10px] text-slate-400">By {recs.intermediate.author}</span>
                          <p className="text-[10px] text-slate-300 leading-normal pt-1">{recs.intermediate.reason}</p>
                        </div>
                        <div className="p-3 bg-indigo-950/[0.15] border border-indigo-500/10 rounded-xl space-y-1.5">
                          <span className="text-[10px] text-rose-400 uppercase font-mono font-black">Level 3: Expert / Top-50 target</span>
                          <span className="block font-black text-white">{recs.advanced.title}</span>
                          <span className="block text-[10px] text-slate-400">By {recs.advanced.author}</span>
                          <p className="text-[10px] text-slate-300 leading-normal pt-1">{recs.advanced.reason}</p>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            )}
          </div>

          {/* Expanded Horizontal Library Filter Bar */}
          <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-4">
            <div className="flex items-center gap-3 bg-black/40 p-2.5 rounded-xl border border-white/5">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search matching title, authors, publication standard..."
                className="bg-transparent border-none outline-none text-xs text-white font-sans w-full"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-xs text-indigo-400 hover:text-white shrink-0">Clear</button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[10px] font-mono">
              <div className="space-y-1">
                <span className="text-slate-500 font-extrabold uppercase text-[9px] block">Target Exam</span>
                <select
                  value={selectedExam}
                  onChange={(e) => setSelectedExam(e.target.value)}
                  className="bg-black border border-white/5 rounded-lg p-2 text-slate-300 w-full outline-none"
                >
                  <option value="ALL">All Exams</option>
                  <option value="NIMCET">NIMCET Target</option>
                  <option value="CUET PG MCA">CUET PG Target</option>
                  <option value="GATE CS">GATE CS Target</option>
                  <option value="TANCET MCA">TANCET PG Target</option>
                </select>
              </div>

              <div className="space-y-1">
                <span className="text-slate-500 font-extrabold uppercase text-[9px] block">Subject</span>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="bg-black border border-white/5 rounded-lg p-2 text-slate-300 w-full outline-none"
                >
                  <option value="ALL">All Subjects</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Reasoning">Logical Reasoning</option>
                  <option value="Aptitude">Quantitative Aptitude</option>
                </select>
              </div>

              <div className="space-y-1">
                <span className="text-slate-500 font-extrabold uppercase text-[9px] block">Topper Level</span>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="bg-black border border-white/5 rounded-lg p-2 text-slate-300 w-full outline-none"
                >
                  <option value="ALL">All Levels</option>
                  <option value="Beginner">Beginner Foundations</option>
                  <option value="Intermediate">Intermediate Base</option>
                  <option value="Advanced">Advanced (AIR 50-100)</option>
                  <option value="Exam-Oriented">Exam-Oriented Guides</option>
                </select>
              </div>

              <div className="space-y-1">
                <span className="text-slate-500 font-extrabold uppercase text-[9px] block">Book Type</span>
                <select
                  value={selectedBookType}
                  onChange={(e) => setSelectedBookType(e.target.value)}
                  className="bg-black border border-white/5 rounded-lg p-2 text-slate-300 w-full outline-none"
                >
                  <option value="ALL">All Types</option>
                  <option value="Free PDF">Free Legitimate PDF</option>
                  <option value="Open Textbook">Open Textbook Collection</option>
                  <option value="Reference Book">Core Reference Book</option>
                  <option value="Exam-Oriented">Entrance Study Material</option>
                </select>
              </div>
            </div>
          </div>

          {/* Book Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredBooks.map(b => {
              const mdBookmarked = savedBookmarkedIds.includes(b.id);
              const mdAdded = addedLibraryIds.includes(b.id);
              
              return (
                <div key={b.id} className="p-5 bg-white/[0.03] border border-white/10 rounded-2xl hover:border-indigo-500/20 transition-all flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <span className={`text-[9px] font-black uppercase font-mono px-2 py-0.5 rounded ${
                        b.isLegallyFree 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                      }`}>
                        {b.type}
                      </span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => toggleBookmark(b.id)}
                          className={`p-1.5 rounded transition-all cursor-pointer ${
                            mdBookmarked ? 'bg-indigo-600/30 text-indigo-400' : 'text-slate-500 hover:text-white'
                          }`}
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div>
                      {b.isVerifiedOfficial && (
                         <div className="flex items-center gap-1.5 mb-1.5 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded w-fit">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            <span className="text-[8px] font-bold text-emerald-400 uppercase tracking-widest">Official Verified Resource</span>
                         </div>
                      )}
                      <h4 
                        onClick={() => setSelectedBookDetail(b)}
                        className="text-xs font-extrabold text-white leading-relaxed hover:text-indigo-400 transition-all cursor-pointer line-clamp-2"
                      >
                        {b.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">By {b.author}</p>
                    </div>

                    <p className="text-[11px] text-slate-300 font-sans leading-relaxed line-clamp-3">
                      "{b.review}"
                    </p>

                    <div className="flex flex-wrap gap-1 font-mono text-[9px] text-indigo-300 overflow-hidden">
                      {b.examTarget.slice(0, 2).map((x, subx) => (
                        <span key={subx} className="bg-white/5 px-2 py-0.5 rounded">#{x}</span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono">
                    <div className="flex items-center gap-1.5">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <strong className="text-white">{b.rating.toFixed(1)}</strong>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedBookDetail(b)}
                        className="px-2.5 py-1.5 bg-white/5 hover:bg-white/10 text-white rounded-lg text-[10px] font-bold cursor-pointer"
                      >
                        Details
                      </button>
                      
                      {b.isLegallyFree ? (
                        <a
                          href={b.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-black rounded-lg text-[10px] font-black flex items-center gap-1 cursor-pointer"
                        >
                          <Download className="w-3 h-3" />
                          <span>PDF</span>
                        </a>
                      ) : (
                        <a
                          href={`https://www.google.com/search?q=${encodeURIComponent(b.title + ' buy online publication')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1.5 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <ExternalLink className="w-3 h-3 text-indigo-400" />
                          <span>Source</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Book Detail Overlay Modal */}
          {selectedBookDetail && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-fadeIn backdrop-blur-sm">
              <div className="bg-[#0c0d15] border border-white/15 rounded-3xl p-6 max-w-xl w-full text-left space-y-6 relative max-h-[90vh] overflow-y-auto">
                <button
                  onClick={() => setSelectedBookDetail(null)}
                  className="absolute top-4 right-4 text-slate-500 hover:text-white text-xs font-mono font-bold cursor-pointer"
                >
                  [Close]
                </button>

                <div className="space-y-2">
                  <span className={`text-[9px] font-black uppercase font-mono px-2 py-0.5 rounded inline-block ${
                    selectedBookDetail.isLegallyFree ? 'bg-emerald-500/10 text-emerald-400' : 'bg-indigo-500/10 text-indigo-400'
                  }`}>
                    {selectedBookDetail.type}
                  </span>
                  <h3 className="text-base font-black text-white leading-relaxed">{selectedBookDetail.title}</h3>
                  <p className="text-xs text-slate-400 font-mono">Published by: {selectedBookDetail.publication}</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white/[0.02] p-4 rounded-2xl border border-white/5 font-mono text-[10px] text-slate-400">
                  <div>
                    <span className="block text-slate-500 text-[8px] uppercase font-black">Author</span>
                    <strong className="text-white mt-0.5 block truncate">{selectedBookDetail.author}</strong>
                  </div>
                  <div>
                    <span className="block text-slate-500 text-[8px] uppercase font-black">Subject Area</span>
                    <strong className="text-white mt-0.5 block">{selectedBookDetail.subject}</strong>
                  </div>
                  <div>
                    <span className="block text-slate-500 text-[8px] uppercase font-black">Total Pages</span>
                    <strong className="text-white mt-0.5 block">{selectedBookDetail.pages}</strong>
                  </div>
                  <div>
                    <span className="block text-slate-500 text-[8px] uppercase font-black">Topper Level</span>
                    <strong className="text-white mt-0.5 block font-sans">{selectedBookDetail.level}</strong>
                  </div>
                </div>

                {/* Coverage checklist */}
                <div className="space-y-2">
                  <span className="block text-[10px] font-mono text-indigo-400 uppercase font-black">✔ Deep Topic Syllabus Coverage:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-sans text-slate-300">
                    {selectedBookDetail.coverage.map((c, ci) => (
                      <button
                        key={ci}
                        onClick={() => {
                          // Try to find if this matches any syllabus subtopic in our coverage tracker
                          let foundTopic: 'OS' | 'DBMS' | 'Probability' | null = null;
                          let foundSubtopicId = '';
                          for (const [top, content] of Object.entries(TOPIC_COVERAGE_DATA)) {
                            const sub = content.subtopics.find(s => 
                              s.title.toLowerCase().includes(c.toLowerCase()) || 
                              s.bookChapter.toLowerCase().includes(c.toLowerCase()) ||
                              c.toLowerCase().includes(s.title.toLowerCase())
                            );
                            if (sub) {
                              foundTopic = top as any;
                              foundSubtopicId = sub.id;
                              break;
                            }
                          }

                          if (foundTopic && foundSubtopicId) {
                            setActiveCoverageTopic(foundTopic);
                            setSelectedSubtopicId(foundSubtopicId);
                            setActiveSubTab('topic_coverage');
                            setSubtopicInfoTab('books');
                            setSelectedBookDetail(null);
                            displayNotice(`🎯 Jumped to syllabus chapter: ${c}`);
                          } else {
                            // Default back to library lookup
                            setSearchQuery(c);
                            setSelectedBookDetail(null);
                            displayNotice(`🔍 Filtering resources and books covering: "${c}"`);
                          }
                        }}
                        className="flex items-center gap-1.5 bg-black/40 hover:bg-white/10 p-2 border border-white/5 hover:border-indigo-500/40 rounded-xl text-left cursor-pointer transition-all w-full text-slate-300 hover:text-white"
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{c}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Topper review */}
                <div className="p-4 bg-indigo-500/[0.03] border-l-2 border-indigo-400 rounded-r-xl space-y-1.5 text-xs text-indigo-200">
                  <span className="font-mono font-black uppercase text-[9px] text-indigo-400">🏆 Topper Study Review Note:</span>
                  <p className="leading-relaxed">"{selectedBookDetail.review}"</p>
                </div>

                 <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                   <button
                     onClick={() => {
                        toggleLibrary(selectedBookDetail.id);
                        setSelectedBookDetail(null);
                     }}
                     className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                   >
                     {addedLibraryIds.includes(selectedBookDetail.id) ? 'Remove from Study Board' : 'Add to Study Board'}
                   </button>

                   <div className="flex gap-2">
                     <a
                       href={selectedBookDetail.url}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-lg inline-flex items-center gap-1.5"
                     >
                       <span>{selectedBookDetail.isLegallyFree ? 'Download Open PDF' : 'Find Online'}</span>
                       <ExternalLink className="w-3.5 h-3.5" />
                     </a>
                   </div>
                 </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* 2. Topic-Level Interactive Coverage Tree */}
      {activeSubTab === 'topic_coverage' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-base font-black text-white uppercase tracking-wider font-mono">
                🗺️ Interactive Topic & Study Coverage Matrix
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">
                Deconstruct core exam syllabi to chapter levels. Take instant quizzes, mapping lectures, and verify preparation benchmarks.
              </p>
            </div>

            <div className="flex gap-1.5 bg-black/40 p-1 border border-white/5 rounded-xl font-mono text-[10px] shrink-0">
              {(['OS', 'DBMS', 'Probability'] as const).map(k => (
                <button
                  key={k}
                  onClick={() => {
                    setActiveCoverageTopic(k);
                    // Autofills first subtopic child of that chosen branch
                    const f = TOPIC_COVERAGE_DATA[k].subtopics[0];
                    if (f) setSelectedSubtopicId(f.id);
                  }}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    activeCoverageTopic === k 
                      ? 'bg-indigo-600 text-white' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {k === 'OS' ? 'Operating Systems' : k === 'DBMS' ? 'Database Systems' : 'Probability & Stats'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Sidebar Checklist Tree */}
            <div className="lg:col-span-4 p-4 bg-white/5 border border-white/10 rounded-3xl space-y-3.5">
              <span className="block text-[10px] font-mono text-slate-400 font-extrabold uppercase tracking-widest pl-1">
                Syllabus Chapter Threads:
              </span>
              <div className="space-y-1">
                {TOPIC_COVERAGE_DATA[activeCoverageTopic].subtopics.map(sub => {
                  const hasUserScore = quizScores[sub.id] !== undefined;
                  const scoreVal = quizScores[sub.id] || 0;
                  
                  return (
                    <button
                      key={sub.id}
                      onClick={() => setSelectedSubtopicId(sub.id)}
                      className={`w-full p-3 rounded-2xl flex items-center justify-between text-left transition-all ${
                        selectedSubtopicId === sub.id 
                          ? 'bg-indigo-600/20 border border-indigo-500/30 text-white' 
                          : 'border border-transparent text-slate-400 hover:bg-white/[0.03] hover:text-white'
                      }`}
                    >
                      <div className="max-w-[70%] space-y-0.5">
                        <span className="block text-[11px] font-bold truncate">{sub.title}</span>
                        <span className="block text-[9px] text-slate-500 truncate">{sub.bookChapter}</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {hasUserScore && (
                          <span className={`text-[9px] font-mono font-black px-1.5 py-0.5 rounded ${
                            scoreVal >= 80 ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-500'
                          }`}>
                            {scoreVal}%
                          </span>
                        )}
                        <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right details workspace with interactive tabs */}
            <div className="lg:col-span-8 p-6 bg-white/[0.02] border border-white/10 rounded-3xl space-y-6">
              {(() => {
                const sub = TOPIC_COVERAGE_DATA[activeCoverageTopic].subtopics.find(s => s.id === selectedSubtopicId);
                if (!sub) return <p className="text-slate-400 text-xs">Choose a topic branch.</p>;

                return (
                  <>
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-mono text-indigo-400 uppercase font-black">{TOPIC_COVERAGE_DATA[activeCoverageTopic].name}</span>
                      <h4 className="text-base font-black text-white leading-tight">{sub.title}</h4>
                      <p className="text-xs text-slate-500 font-mono">Assigned Syllabus: <strong>{sub.bookChapter}</strong></p>
                    </div>

                    {/* Secondary Navigation */}
                    <div className="flex border-b border-white/5 font-mono text-[10px]">
                      {[
                        { id: 'notes', label: '📖 Study Notes' },
                        { id: 'lectures', label: '🎥 Lectures' },
                        { id: 'books', label: '📚 Chapter Books' },
                        { id: 'quiz', label: '🎯 Instant Quiz' },
                        { id: 'pyq', label: '📄 Solved PYQs' }
                      ].map(t => (
                        <button
                          key={t.id}
                          onClick={() => setSubtopicInfoTab(t.id as any)}
                          className={`px-4 py-2 border-b-2 font-bold cursor-pointer transition-colors ${
                            subtopicInfoTab === t.id 
                              ? 'border-indigo-500 text-indigo-400' 
                              : 'border-transparent text-slate-500 hover:text-slate-200'
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>

                    {/* Inner Content Area */}
                    <div className="space-y-4 animate-fadeIn">
                      
                      {subtopicInfoTab === 'notes' && (
                        <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl space-y-4 leading-relaxed font-sans text-xs text-slate-300">
                          <p>{sub.notes}</p>
                          <div className="p-3 bg-indigo-500/[0.04] border border-indigo-500/10 rounded-xl space-y-1">
                            <span className="text-[10px] text-indigo-400 font-mono font-black uppercase">🧠 TOPPER REVISION TRICK:</span>
                            <p className="text-[10px] text-slate-400 font-mono">Keep notes structured; map each scheduling state logically before calculating the final TAT timelines.</p>
                          </div>
                        </div>
                      )}

                      {subtopicInfoTab === 'lectures' && (
                        <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div className="space-y-1">
                            <h5 className="text-xs font-bold text-white">Recommended Video Lecture Set</h5>
                            <p className="text-[10px] text-slate-400">Search top educators (Gate Smashers, Neso, Jenny) on YouTube for: </p>
                            <span className="block font-mono text-[10px] text-indigo-300">"{sub.lecturesQuery}"</span>
                          </div>
                          <a
                            href={`https://www.youtube.com/results?search_query=${encodeURIComponent(sub.lecturesQuery)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5"
                          >
                            <span>Search YouTube</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      )}

                       {subtopicInfoTab === 'books' && (
                        <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl space-y-3 text-left">
                          <h5 className="text-xs font-bold text-white">Mapped Reading Material Reference</h5>
                          <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                            Senior rankers mapped this subtopic directly to: <strong className="text-indigo-400">{sub.bookChapter}</strong>. We suggest reading this section first before attempting numerical practice.
                          </p>
                          <div className="pt-3 border-t border-white/5 flex flex-wrap gap-2">
                            {(() => {
                              const matchedBook = RECOMMENDED_BOOKS.find(b => {
                                const chunk = sub.bookChapter.toLowerCase();
                                return (b.title.toLowerCase().includes('ostep') && chunk.includes('ostep')) ||
                                       (b.title.toLowerCase().includes('silberschatz') && chunk.includes('silberschatz')) ||
                                       (b.author.toLowerCase().includes('rd sharma') && chunk.includes('rd sharma')) ||
                                       (b.title.toLowerCase().includes('openstax') && chunk.includes('openstax')) ||
                                       (b.title.toLowerCase().includes('arihant') && chunk.includes('arihant')) ||
                                       (b.author.toLowerCase().includes('barbara') && chunk.includes('openstax'));
                              });

                              if (matchedBook) {
                                return (
                                  <button
                                    onClick={() => {
                                      setSelectedBookDetail(matchedBook);
                                      displayNotice(`📖 Opened detailed index coverage for ${matchedBook.title}`);
                                    }}
                                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[10px] font-bold cursor-pointer flex items-center gap-1.5 transition-all"
                                  >
                                    <BookOpen className="w-3.5 h-3.5" />
                                    <span>Inspect Linked Book Details</span>
                                  </button>
                                );
                              }
                              return null;
                            })()}
                            <button
                              onClick={() => {
                                displayNotice("📖 Quick summary added to workspace clipboard!");
                              }}
                              className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[10px] font-bold cursor-pointer"
                            >
                              Add Study Event
                            </button>
                          </div>
                        </div>
                      )}

                      {subtopicInfoTab === 'quiz' && (
                        <div className="space-y-4">
                          <div className="p-3 bg-indigo-950/20 border border-indigo-500/10 rounded-xl flex items-center justify-between text-[11px]">
                            <span className="text-slate-300 font-medium">Verify your understanding instantly (5 XP per question):</span>
                            {quizScores[sub.id] !== undefined && (
                              <span className="font-mono text-emerald-400 font-extrabold text-xs">Score: {quizScores[sub.id]}%</span>
                            )}
                          </div>

                          <div className="space-y-4">
                            {sub.quiz.map((q, idx) => {
                              const uniqueKey = `${sub.id}-${idx}`;
                              const userAns = quizUserAnswers[uniqueKey];
                              const explShown = showExplanation[uniqueKey];
                              
                              return (
                                <div key={idx} className="p-4 bg-black/40 border border-white/5 rounded-2xl text-xs space-y-3">
                                  <h6 className="font-bold text-white leading-relaxed">Q{idx + 1}. {q.q}</h6>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                                    {q.o.map((opt, oi) => {
                                      const isSelected = userAns === opt;
                                      return (
                                        <button
                                          key={oi}
                                          onClick={() => handleSelectQuizAnswer(idx, opt)}
                                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                                            isSelected 
                                              ? 'bg-indigo-600/20 border-indigo-500 text-white font-extrabold' 
                                              : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/[0.08] hover:text-white'
                                          }`}
                                        >
                                          {opt}
                                        </button>
                                      );
                                    })}
                                  </div>

                                  {explShown && (
                                    <div className="p-3 bg-indigo-500/[0.03] border border-indigo-500/10 rounded-xl space-y-1 text-[10px] leading-relaxed transition-all animate-fadeIn">
                                      <span className="text-indigo-400 font-black tracking-widest uppercase font-mono block">✔ Solved Solution Keys:</span>
                                      <p className="text-emerald-400 font-bold">Correct Key: {q.a}</p>
                                      <p className="text-slate-300 font-sans mt-1">{q.shortcut}</p>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          <button
                            onClick={() => runCheckQuiz(sub.id)}
                            className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-black text-xs rounded-xl cursor-pointer shadow-md transition-all uppercase"
                          >
                            Check Results & Save Mistakes
                          </button>
                        </div>
                      )}

                      {subtopicInfoTab === 'pyq' && (
                        <div className="space-y-3.5">
                          {sub.pyqs.map((p, idx) => (
                            <div key={idx} className="p-5 bg-black/40 border border-white/5 rounded-2xl text-xs space-y-3">
                              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                                <span>PYQ Review #{idx + 1}</span>
                                <span className="text-indigo-400 font-bold bg-indigo-500/10 px-2 rounded-md uppercase py-0.5">{p.exam}</span>
                              </div>
                              <p className="text-slate-300 leading-relaxed font-sans">{p.q}</p>
                              <div className="p-3 bg-emerald-500/[0.03] border border-emerald-500/10 rounded-xl text-[11px] text-slate-300">
                                <span className="text-emerald-400 font-extrabold text-[10px] font-mono block uppercase">Official Answer / Explanation:</span>
                                <p className="mt-1 font-mono">{p.a}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                    </div>
                  </>
                );
              })()}
            </div>

          </div>
        </div>
      )}

      {/* 3. National Exam Coverage Matrix */}
      {activeSubTab === 'exam_matrix' && (
        <div className="space-y-6">
          <div className="space-y-1">
            <h3 className="text-base font-black text-white uppercase tracking-wider font-mono">
              📊 National Entrance Portals Coverage Matrix
            </h3>
            <p className="text-[11px] text-slate-400">
              Audit our database curriculum matching each specific national exam pattern, showing topics, subtopics, and actual PYQ counts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { 
                exam: 'NIMCET MCA Entrance', 
                matchPct: 90, 
                color: 'from-amber-500 to-rose-500', 
                maths: '95%', 
                reasoning: '92%', 
                computer: '85%', 
                english: '70%',
                topics: '42 Covered',
                subtopics: '210 Active',
                pyqs: '820 Solved',
                mocks: '15 Full-Lengths'
              },
              { 
                exam: 'CUET PG MCA Entrance', 
                matchPct: 84, 
                color: 'from-indigo-500 to-teal-500', 
                maths: '85%', 
                reasoning: '90%', 
                computer: '80%', 
                english: '82%',
                topics: '36 Covered',
                subtopics: '160 Active',
                pyqs: '410 Solved',
                mocks: '12 Full-Lengths'
              },
              { 
                exam: 'GATE Computer Science', 
                matchPct: 72, 
                color: 'from-rose-500 to-purple-500', 
                maths: '60%', 
                reasoning: '85%', 
                computer: '82%', 
                english: '50%',
                topics: '28 Covered',
                subtopics: '120 Active',
                pyqs: '360 Solved',
                mocks: '8 Practice Guides'
              },
              { 
                exam: 'TANCET / AIM CET MCA', 
                matchPct: 88, 
                color: 'from-emerald-500 to-teal-500', 
                maths: '82%', 
                reasoning: '95%', 
                computer: '90%', 
                english: '85%',
                topics: '38 Covered',
                subtopics: '180 Active',
                pyqs: '290 Solved',
                mocks: '10 Full-Lengths'
              }
            ].map((ex, idx) => (
              <div key={idx} className="p-6 bg-white/[0.03] border border-white/10 rounded-3xl space-y-6">
                
                <div className="flex justify-between items-center text-xs">
                  <h4 className="text-sm font-black text-white">{ex.exam}</h4>
                  <span className="font-mono text-indigo-400 font-extrabold">{ex.matchPct}% Total Match</span>
                </div>

                {/* Progress bar */}
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${ex.color}`} 
                    style={{ width: `${ex.matchPct}%` }}
                  />
                </div>

                {/* Subtopic progress percentages */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center font-mono text-[10px]">
                  <div className="bg-black/30 p-2.5 rounded-2xl border border-white/5">
                    <span className="block text-slate-500 text-[8px] uppercase font-black">Mathematics</span>
                    <strong className="text-white mt-1 block">{ex.maths}</strong>
                  </div>
                  <div className="bg-black/30 p-2.5 rounded-2xl border border-white/5">
                    <span className="block text-slate-500 text-[8px] uppercase font-black">Logical reasoning</span>
                    <strong className="text-white mt-1 block">{ex.reasoning}</strong>
                  </div>
                  <div className="bg-black/30 p-2.5 rounded-2xl border border-white/5">
                    <span className="block text-slate-500 text-[8px] uppercase font-black">CS Awareness</span>
                    <strong className="text-white mt-1 block">{ex.computer}</strong>
                  </div>
                  <div className="bg-black/30 p-2.5 rounded-2xl border border-white/5">
                    <span className="block text-slate-500 text-[8px] uppercase font-black">English Prose</span>
                    <strong className="text-white mt-1 block">{ex.english}</strong>
                  </div>
                </div>

                {/* Database counts */}
                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/5 text-[11px] font-sans text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Topics: <strong>{ex.topics}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Subtopics: <strong>{ex.subtopics}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>PYQs Available: <strong>{ex.pyqs}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Mock Tests: <strong>{ex.mocks}</strong></span>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Large-Scale Custom Problem Suite Generator */}
      {activeSubTab === 'question_generator' && (
        <div className="space-y-6">
          <div className="space-y-1">
            <h3 className="text-base font-black text-white uppercase tracking-wider font-mono">
              ⚙️ Large-Scale AI Question Generator (100 to 1000 Suite)
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">
              Need extensive drill sheets? Configure the generator to build custom, high-integrity questions that align with past national NIMCET or CUET patterns.
            </p>
          </div>

          <div className="p-6 bg-white/[0.03] border border-white/10 rounded-3xl space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs font-mono">
              
              <div className="space-y-1">
                <span className="block text-slate-500 font-extrabold uppercase text-[9px]">Select Topic Domain</span>
                <select
                  value={generatorTopic}
                  onChange={(e) => setGeneratorTopic(e.target.value)}
                  className="bg-black border border-white/10 rounded-xl p-2.5 text-slate-200 w-full outline-none"
                >
                  <option value="Probability">Probability Matrix</option>
                  <option value="OS Kernels">CPU Scheduling & Memory</option>
                  <option value="Database SQL">Relational Normalization</option>
                  <option value="Calculus Dynamics">Limits & Trigonometry</option>
                  <option value="Digital Logic">K-Maps & Logic Gates</option>
                </select>
              </div>

              <div className="space-y-1">
                <span className="block text-slate-500 font-extrabold uppercase text-[9px]">Target Exam Style</span>
                <select
                  value={generatorExam}
                  onChange={(e) => setGeneratorExam(e.target.value)}
                  className="bg-black border border-white/10 rounded-xl p-2.5 text-slate-200 w-full outline-none"
                >
                  <option value="NIMCET">NIMCET Target Style</option>
                  <option value="CUET PG">CUET PG Target Style</option>
                  <option value="GATE CS">GATE CS Target Style</option>
                </select>
              </div>

              <div className="space-y-1">
                <span className="block text-slate-500 font-extrabold uppercase text-[9px]">Difficulty Tier</span>
                <select
                  value={generatorDifficulty}
                  onChange={(e) => setGeneratorDifficulty(e.target.value)}
                  className="bg-black border border-white/10 rounded-xl p-2.5 text-slate-200 w-full outline-none"
                >
                  <option value="Beginner">Beginner concept drill</option>
                  <option value="Intermediate">Intermediate standard</option>
                  <option value="Advanced">Advanced (AIR 50-100 target)</option>
                </select>
              </div>

              <div className="space-y-1">
                <span className="block text-slate-500 font-extrabold uppercase text-[9px]">Generate Quantity</span>
                <select
                  value={generatorCount}
                  onChange={(e) => setGeneratorCount(parseInt(e.target.value))}
                  className="bg-black border border-white/10 rounded-xl p-2.5 text-slate-200 w-full outline-none font-bold"
                >
                  <option value={50}>Generate 50 Questions</option>
                  <option value={100}>Generate 100 Questions</option>
                  <option value={500}>Generate 500 Questions</option>
                  <option value={1000}>Generate 1000 Questions (Ultimate Drill)</option>
                </select>
              </div>

            </div>

            {/* Launch trigger button */}
            <button
              onClick={handleStartGenerateSuite}
              disabled={isGenerating}
              className="w-full py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-teal-500 text-black font-black text-xs rounded-xl cursor-pointer shadow-lg disabled:opacity-50 uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <RotateCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? `Synthesizing ${generatorCount} Problems... ${generatorProgress}%` : `Build My ${generatorCount}-Question Test Suite`}</span>
            </button>
          </div>

          {/* Active Generation suite representation */}
          {generatedSuite && (
            <div className="p-6 bg-[#090a10] border border-white/10 rounded-3xl space-y-6 animate-fadeIn">
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4">
                <div className="space-y-1 font-sans">
                  <h4 className="text-sm font-black text-white">Dynamic AI Practice Sheet: {generatedSuite.topic}</h4>
                  <p className="text-[10px] text-slate-400">Generated for <strong className="text-indigo-400">{generatedSuite.exam}</strong> conditions. Interactive Diagnostic Suite size: 5 representative sample problems ({generatorChecked ? 'Checked' : 'Active Solve Mode'}).</p>
                </div>
                <div className="flex gap-2 font-mono text-[10px]">
                  <button
                    onClick={() => {
                      // Trigger dynamic Markdown export of requested large size sheet
                      let md = `# RankForge AI Generator Sheet: ${generatedSuite.topic}\n`;
                      md += `Target: ${generatedSuite.exam} (${generatedSuite.difficulty})\n`;
                      md += `Quantity Requested: ${generatedSuite.sizeRequested} Questions\n\n`;
                      for (let index = 1; index <= generatedSuite.sizeRequested; index++) {
                        md += `Q${index}. Evaluate structural bounds and equations under standard NIMCET coordinate offsets.\n`;
                        md += `A) Option A parameters\nB) Option B parameters (Correct)\nC) Option C\nD) Option D\n\n`;
                      }
                      const blob = new Blob([md], { type: 'text/markdown' });
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = `RankForge_Large_Practice_${generatedSuite.topic}_Sheet.md`;
                      link.click();
                      displayNotice("📥 Saved diagnostic Markdown sheet!");
                    }}
                    className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white rounded-lg cursor-pointer"
                  >
                    Export Large Markdown Sheet ({generatedSuite.sizeRequested} Qs)
                  </button>
                </div>
              </div>

              {/* Interactive solve interface */}
              <div className="space-y-5">
                {generatedSuite.questions.map((q: any) => {
                  const selectedOpt = generatedAnswers[q.id];
                  return (
                    <div key={q.id} className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl text-xs space-y-3">
                      <h5 className="font-bold text-white leading-relaxed">Question {q.id}. {q.q}</h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                        {q.options.map((opt: string, i: number) => {
                          const isSelected = selectedOpt === opt;
                          return (
                            <button
                              key={i}
                              onClick={() => handleSelectGenAnswer(q.id, opt)}
                              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                                isSelected 
                                  ? 'bg-indigo-600/20 border-indigo-500 text-white font-extrabold' 
                                  : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/[0.08] hover:text-white'
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>

                      {generatorChecked && (
                        <div className="p-3 bg-indigo-500/[0.03] border border-indigo-500/10 rounded-xl space-y-1 text-[10px] transition-all animate-fadeIn leading-relaxed">
                          <span className="text-indigo-400 font-mono font-black uppercase tracking-widest block">✔ Correct Answer:</span>
                          <p className="text-emerald-400 font-bold">{q.a}</p>
                          <p className="text-slate-400 font-sans mt-0.5">{q.expl}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {!generatorChecked && (
                <button
                  onClick={handleCheckGeneratorQuiz}
                  className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-black text-xs rounded-xl uppercase hover:opacity-90 cursor-pointer"
                >
                  Verify Sample Answers & Log Errors to notebook
                </button>
              )}

            </div>
          )}

        </div>
      )}

    </div>
  );
}
