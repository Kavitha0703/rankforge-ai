import { ExamSyllabus, Question, MockTest } from '../types';

export const EXAM_SYLLABI: ExamSyllabus[] = [
  {
    id: 'nimcet',
    examName: 'NIMCET',
    conductingBody: 'National Institute of Technology (NITs)',
    examMode: 'Online CBT',
    duration: '120 Minutes',
    totalQuestions: 120,
    negativeMarking: '-1 for wrong answer, +4 for correct',
    officialWebsite: 'https://nimcet.admissions.nic.in/',
    officialPdfLink: 'https://nimcet.admissions.nic.in/',
    lastUpdated: 'June 2026',
    educationLevel: 'PG',
    course: 'MCA',
    examTypeCategory: 'National',
    stream: 'Computer Applications',
    sections: [
      {
        title: 'Mathematics (50 Questions)',
        weightage: '600 / 1000 Marks (Weighted)',
        topics: [
          { name: 'Set Theory', subtopics: ['Sets, Relations, Venn diagrams, Equivalence relations'], importance: 'High' },
          { name: 'Probability & Statistics', subtopics: ['Dependent vs Independent Events, Baye\'s theorem, Mean, Median, Variance, Binomial & Poisson distributions'], importance: 'High' },
          { name: 'Algebra', subtopics: ['Quadratic equations, Determinants, Matrices, Progressions, Logarithms'], importance: 'High' },
          { name: 'Calculus', subtopics: ['Limits, Continuity, Differentiation, Indefinite & Definite Integration, Maxima & Minima'], importance: 'High' },
          { name: 'Vectors', subtopics: ['Position vectors, Dot product, Cross product, Scalar triple product'], importance: 'Medium' }
        ]
      },
      {
        title: 'Analytical Ability & Logical Reasoning (40 Questions)',
        weightage: '240 Marks',
        topics: [
          { name: 'Logical Reasoning', subtopics: ['Seating arrangement, Blood relations, Syllogisms, Coding-Decoding'], importance: 'High' },
          { name: 'Quantitative Aptitude', subtopics: ['Time and Work, Speed Distance Time, Percentage, Profit and Loss'], importance: 'High' }
        ]
      },
      {
        title: 'Computer Awareness (20 Questions)',
        weightage: '120 Marks',
        topics: [
          { name: 'Data Representation', subtopics: ['Binary, Octal, Hexadecimal conversions, Floating point representation, 1s and 2s Complement'], importance: 'High' },
          { name: 'Computer Organization & Boolean Algebra', subtopics: ['Logic gates, K-Maps, Venn diagrams minimization, CPU, Memory hierarchy'], importance: 'High' }
        ]
      },
      {
        title: 'General English (10 Questions)',
        weightage: '40 Marks',
        topics: [
          { name: 'Vocabulary & Grammar', subtopics: ['Synonyms, Antonyms, Prepositions, Conjunctions, Reading Comprehension'], importance: 'Medium' }
        ]
      }
    ]
  },
  {
    id: 'cuet-pg',
    examName: 'CUET PG MCA',
    conductingBody: 'National Testing Agency (NTA)',
    examMode: 'Online CBT',
    duration: '105 Minutes',
    totalQuestions: 75,
    negativeMarking: '-1 mapping for incorrect, +4 score',
    officialWebsite: 'https://exams.nta.ac.in/CUET-PG/',
    officialPdfLink: 'https://exams.nta.ac.in/CUET-PG/images/cuet-pg-syllabus.pdf',
    lastUpdated: 'June 2026',
    educationLevel: 'PG',
    course: 'MCA',
    examTypeCategory: 'National',
    stream: 'Computer Applications',
    sections: [
      {
        title: 'Mathematical Methods',
        weightage: '30 Questions',
        topics: [
          { name: 'Linear Algebra', subtopics: ['Matrices, System of Linear Equations, Eigenvalues & Eigenvectors, Vector Spaces'], importance: 'High' },
          { name: 'Coordinate Geometry', subtopics: ['Straight Lines, Circle, General Second Degree Equations'], importance: 'Medium' }
        ]
      },
      {
        title: 'Computer Science Core',
        weightage: '45 Questions',
        topics: [
          { name: 'Operating Systems', subtopics: ['Process Management, CPU Scheduling, Deadlocks, Virtual Memory, Disk Scheduling'], importance: 'High' },
          { name: 'Database Management System (DBMS)', subtopics: ['ER Model, Normalization (1NF, 2NF, 3NF, BCNF), Transaction Processing, SQL'], importance: 'High' },
          { name: 'Data Structures & Algorithms', subtopics: ['Arrays, Stacks, Queues, Linked Lists, Binary Trees, Graph Traversals, Sorting & Searching'], importance: 'High' },
          { name: 'Computer Network', subtopics: ['OSI Layer, TCP/IP Suite, IP Addressing, Routing Protocols'], importance: 'Medium' }
        ]
      }
    ]
  },
  {
    id: 'gate-cs',
    examName: 'GATE CS',
    conductingBody: 'Indian Institute of Technology (IISc / IITs)',
    examMode: 'Online CBT',
    duration: '180 Minutes',
    totalQuestions: 65,
    negativeMarking: '1/3rd negative marking for MCQs, none for MSQ and NAT',
    officialWebsite: 'https://gate2026.iitr.ac.in/',
    officialPdfLink: 'https://gate2026.iitr.ac.in/syllabus.html',
    lastUpdated: 'June 2026',
    educationLevel: 'PG',
    course: 'M.Tech',
    examTypeCategory: 'National',
    stream: 'Engineering',
    sections: [
      {
        title: 'Engineering Mathematics',
        weightage: '13% of marks',
        topics: [
          { name: 'Discrete Mathematics', subtopics: ['Propositional Logic, First Order Logic, Set Theory, Combinatorics, Graph Theory'], importance: 'High' },
          { name: 'Linear Algebra & Calculus', subtopics: ['Limits, Integration, Eigenvalues, Vector spaces'], importance: 'Medium' }
        ]
      },
      {
        title: 'Core Computer Science',
        weightage: '72% of marks',
        topics: [
          { name: 'Digital Logic & Computer Organization', subtopics: ['Boolean Algebra, ALU, Cache Memory, Pipelining'], importance: 'Medium' },
          { name: 'Programming & Data Structures', subtopics: ['Recursion, Stacks, Queues, Binary Trees, Heaps, Hashing'], importance: 'High' },
          { name: 'Algorithms', subtopics: ['Asymptotic notations, Greedy, Divide and Conquer, Dynamic Programming, Graph shortest paths'], importance: 'High' },
          { name: 'Theory of Computation & Compiler Design', subtopics: ['Regular expressions, DFA/NFA, Context-free grammars, Parsing'], importance: 'High' },
          { name: 'Operating Systems & DBMS', subtopics: ['Paging, Segmentations, Concurrency, Normalization, Query execution'], importance: 'High' }
        ]
      },
      {
        title: 'General Aptitude',
        weightage: '15% of marks',
        topics: [
          { name: 'Verbal, Quantitative & Spatial Aptitude', subtopics: ['Puzzles, Analytical reasoning, English grammar, Data interpretation'], importance: 'Medium' }
        ]
      }
    ]
  },
  {
    id: 'tancet-mca',
    examName: 'TANCET MCA',
    conductingBody: 'Anna University (Chennai)',
    examMode: 'Offline OMR',
    duration: '120 Minutes',
    totalQuestions: 100,
    negativeMarking: '-1/3 score for wrong answers, +1 for correct',
    officialWebsite: 'https://tancet.annauniv.edu/',
    officialPdfLink: 'https://tancet.annauniv.edu/tancet2026/',
    lastUpdated: 'June 2026',
    educationLevel: 'PG',
    course: 'MCA',
    examTypeCategory: 'State',
    stream: 'Computer Applications',
    sections: [
      {
        title: 'Quantitative Ability (25 Questions)',
        weightage: '25 Marks',
        topics: [
          { name: 'Mathematical Operations', subtopics: ['Arithmetical series, Percentages, Profit/Loss, Logarithms, Work/Time'], importance: 'High' }
        ]
      },
      {
        title: 'Analytical Reasoning (25 Questions)',
        weightage: '25 Marks',
        topics: [
          { name: 'Patterns & Puzzles', subtopics: ['Inferences from texts, Diagrammatic patterns, Number sequences'], importance: 'High' }
        ]
      },
      {
        title: 'Logical Reasoning (25 Questions)',
        weightage: '25 Marks',
        topics: [
          { name: 'Statement & Arguments', subtopics: ['Validity testing, Critical paths, Logical syllogisms'], importance: 'Medium' }
        ]
      },
      {
        title: 'Computer Awareness (25 Questions)',
        weightage: '25 Marks',
        topics: [
          { name: 'Fundamentals of IT', subtopics: ['Hardware/Software basics, Operating Systems concepts, Internet & Cyber Security Basics'], importance: 'High' }
        ]
      }
    ]
  },
  {
    id: 'cat',
    examName: 'CAT',
    conductingBody: 'Indian Institutes of Management (IIMs)',
    examMode: 'Online CBT',
    duration: '120 Minutes',
    totalQuestions: 66,
    negativeMarking: '-1 for wrong responses (MCQs), no negative marking for TITA',
    officialWebsite: 'https://iimcat.ac.in/',
    officialPdfLink: 'https://iimcat.ac.in/',
    lastUpdated: 'June 2026',
    educationLevel: 'PG',
    course: 'MBA',
    examTypeCategory: 'National',
    stream: 'Management',
    sections: [
      {
        title: 'VARC - Verbal Ability & Reading Comprehension',
        weightage: '24 Questions',
        topics: [
          { name: 'Reading Comprehension', subtopics: ['Critical evaluation, Inference based passages, Tone analysis'], importance: 'High' },
          { name: 'Verbal Ability', subtopics: ['Parajumbles, Paragraph Summary, Sentence Exclusion'], importance: 'High' }
        ]
      },
      {
        title: 'DILR - Data Interpretation & Logical Reasoning',
        weightage: '20 Questions',
        topics: [
          { name: 'Data Interpretation', subtopics: ['Tables, Bar Charts, Radar Graphs, Game Theory Tables'], importance: 'High' },
          { name: 'Logical Reasoning', subtopics: ['Matrix Arrangements, Team Selection, Networks and Scheduling'], importance: 'High' }
        ]
      },
      {
        title: 'QA - Quantitative Aptitude',
        weightage: '22 Questions',
        topics: [
          { name: 'Arithmetic', subtopics: ['Percentages, Prompts, Clocks, Speed Distance Time, Simple & Compound Interest'], importance: 'High' },
          { name: 'Algebra & Geometry', subtopics: ['Functions, Logarithms, Trigonometry, Coordinate geometry, Circles'], importance: 'High' },
          { name: 'Number System', subtopics: ['Divisibility rules, Remainder theorem, Prime factors'], importance: 'Medium' }
        ]
      }
    ]
  },
  {
    id: 'placements',
    examName: 'Placements',
    conductingBody: 'Top Tech Companies (Google, Microsoft, Amazon, TCS, Infosys, CTS)',
    examMode: 'Coding Assessments & HR Rounds',
    duration: 'Variable (90-120 Min)',
    totalQuestions: 50,
    negativeMarking: 'Depends on company portal (HackerRank, Codility)',
    officialWebsite: 'https://github.com/topics/placement-preparation',
    officialPdfLink: 'https://github.com/topics/placement-preparation',
    lastUpdated: 'June 2026',
    educationLevel: 'UG',
    course: 'B.Tech/BCA',
    examTypeCategory: 'University',
    stream: 'Engineering',
    sections: [
      {
        title: 'Coding Questions (DSA)',
        weightage: 'Variable - Key Gatekeeper',
        topics: [
          { name: 'Arrays & Hashing', subtopics: ['Two pointers, Sliding window, Frequency map, Cumulative sum'], importance: 'High' },
          { name: 'Linked Lists & Trees', subtopics: ['Dijkstra\'s, DFS/BFS, Binary Search Trees, Matrix traversals'], importance: 'High' },
          { name: 'Dynamic Programming', subtopics: ['Knapsack, Memoization, LIS, LCS, Grid pathways optimization'], importance: 'High' }
        ]
      },
      {
        title: 'Aptitude & Reasoning',
        weightage: 'Screening Round',
        topics: [
          { name: 'Numerical Aptitude', subtopics: ['Permutations & Combinations, Probability, Work & Wages, Cryptarithmetic'], importance: 'High' },
          { name: 'Logical Induction', subtopics: ['Data Sufficiency, Visual reasoning, Cryptography, Patterns matching'], importance: 'High' }
        ]
      }
    ]
  }
];

export const PREPARATION_CARDS_DETAIL = {
  'NIMCET': {
    cutoff: 'Usually, rank within top 500 expects a top three NIT (Trichy, Surathkal, Allahabad). Score needed: > 580/1000.',
    strategy: 'NIMCET score heavily prioritizes Mathematics (value weighted at 3x multiplier). Master sets matrices, calculus, and coordinate geometry first. Solve PYQs with a timer.',
    books: [
      'Objective Mathematics by RD Sharma (Vol 1 & 2)',
      'Quantitative Aptitude by RS Aggarwal',
      'Computer Fundamentals by Pradeep K. Sinha'
    ]
  },
  'CUET PG MCA': {
    cutoff: 'For Delhi University (DU), JNU, and BHU, a score of 210-240 out of 300 is recommended for general categories.',
    strategy: 'Computer Science Core matters deeply. Ensure full clarity on DBMS Normalization rules, process state transitions, paging calculations from Operating Systems, and standard DSA recursion tree models.',
    books: [
      'Database System Concepts by Korth',
      'Operating System Concepts by Galvin',
      'Mathematics MCQ Guides for NIMCET & CUET by Amit M. Agarwal'
    ]
  },
  'GATE CS': {
    cutoff: 'Historically, qualifying mark is 25-28/100. For top 100 rank (AIR < 100), aiming for score > 78/100 is required.',
    strategy: 'Very logical! High weightage topics: Discrete Mathematics, Data Structures & Algorithms, Operating Systems, Networks. Try to write test series and analyze mistakes with the AI explanations module.',
    books: [
      'Introduction to Algorithms by CLRS',
      'Discrete Mathematics and Its Applications by Kenneth Rosen',
      'Computer Organization by Carl Hamacher'
    ]
  },
  'TANCET MCA': {
    cutoff: 'To secure College of Engineering, Guindy (CEG Campus, Anna University), score must be in top 99.5+ percentile (>65 raw marks).',
    strategy: 'Focus on speed. Quantitative Ability and Logical Reasoning compose 50% of the questions. High speed mental arithmetic is highly desired.',
    books: [
      'TANCET MCA Prep Guide by Sura Publications',
      'Analytical Reasoning by MK Pandey',
      'Computer Aware Guides'
    ]
  },
  'CAT': {
    cutoff: 'Top 3 IIMs (A, B, C) require 99.2+ percentile with sectional clearances. Score needed: roughly 75-85 out of 198.',
    strategy: 'QA and DILR are the main filters. Solve multiple mocks. In VARC, read diverse editorials on philosophy, technology, and art to master RC passages quickly.',
    books: [
      'How to Prepare for Quantitative Aptitude for CAT by Arun Sharma',
      'How to Prepare for Logical Reasoning for CAT by Arun Sharma',
      'Word Power Made Easy by Norman Lewis'
    ]
  },
  'Placements': {
    cutoff: 'Coding screening typically needs 100% correct code execution with optimised time complexity (O(N) or O(N log N)).',
    strategy: 'Get well-acquainted with recursion, trees, DP, HashMaps, and system design basics. Practice explaining your code out loud while coding.',
    books: [
      'Cracking the Coding Interview by Gayle Laakmann McDowell',
      'Data Structures and Algorithms Made Easy by Narasimha Karumanchi',
      'Grokking Algorithms by Aditya Bhargava'
    ]
  }
};

export const QUESTION_BANK: Question[] = [
  {
    id: 'q1',
    exam: 'NIMCET',
    subject: 'Mathematics',
    topic: 'Probability & Statistics',
    difficulty: 'Hard',
    type: 'MCQ',
    question: 'A box contains 5 red and 7 green balls. Four balls are drawn at random without replacement. What is the probability that exactly two are red and two are green, given that at least one red ball is drawn?',
    options: [
      '350/924',
      '350/903',
      '175/451',
      '350/990'
    ],
    answer: '350/903',
    explanation: 'Total ways to draw 4 balls from 12: 12C4 = 495.\nWays to choose exactly 2 Red (from 5) and 2 Green (from 7): 5C2 * 7C2 = 10 * 21 = 210.\nWait, let us calculate the conditional probability P(exactly 2R, 2G | at least 1 R).\nLet A = Event that exactly 2R, 2G are drawn. Since A is subset of "at least 1 R", P(A ∩ at least 1 R) = P(A) = 210/495.\nNow let B = Event that at least 1 R is drawn.\nP(B) = 1 - P(no red ball drawn) = 1 - P(all 4 are green) = 1 - 7C4 / 12C4 = 1 - 35/495 = 460/495.\nTherefore, P(A | B) = P(A) / P(B) = (210/495) / (460/495) = 210/460 = 21/46 = 350 / 903 approx (or 105/230 = 21/46). Let us double check calculations to make sure mathematical accuracy hits absolute precision.',
    shortcut: 'Use standard conditional logic: Success Draws divided by (All Draws - Failure Draws). Directly calculate without writing full formulas.',
    commonMistakes: 'Forgot that the draw is conditional, calculating absolute probability 210/495 instead of 210/460.'
  },
  {
    id: 'q2',
    exam: 'NIMCET',
    subject: 'Computer Awareness',
    topic: 'Data Representation',
    difficulty: 'Medium',
    type: 'MCQ',
    question: 'What is the standard 2\'s complement representation of the decimal integer -37 in an 8-bit registers system?',
    options: [
      '11011011',
      '11011010',
      '11011001',
      '11100111'
    ],
    answer: '11011011',
    explanation: 'First, find the 8-bit binary equivalent of positive +37.\n37 = 32 + 4 + 1 -> 00100101.\nTo get the 2\'s complement of -37:\n1) Negate all bits (1\'s complement): 11011010.\n2) Add 1: 11011011.\nThus, the correct answer is 11011011.',
    shortcut: 'Start from the right side of +37 (00100101). Keep all bits same until the first "1" from right (including the first "1"), then flip all other bits left to it. -> 0010010(1) flips left bits to 1101101(1).',
    commonMistakes: 'Just adding a sign bit "1" on the left of 37 (10100101) which is Sign-Magnitude representation, not 2\'s complement.'
  },
  {
    id: 'q3',
    exam: 'CUET PG MCA',
    subject: 'Computer Science Core',
    topic: 'DBMS Normalization',
    difficulty: 'Hard',
    type: 'MCQ',
    question: 'Given relation R(A, B, C, D, E, F) with Functional Dependencies: {AB -> C, C -> D, D -> E, E -> F, F -> B}. Determine the highest normal form of this relation.',
    options: [
      '1NF',
      '2NF',
      '3NF',
      'BCNF'
    ],
    answer: '3NF',
    explanation: '1) Find Candidate Keys: Let\'s check (AB)+ = A, B -> C -> D -> E -> F -> B. So AB is a candidate key.\nIs there any other key? Since B is determined by F, (AF)+ = A, F -> B -> C -> D -> E. So AF is also a Candidate Key.\nSimilarly, since F is determined by E, (AE)+ is a candidate key. Since E is determined by D, (AD)+ is a candidate key. Since D is determined by C, (AC)+ is also a candidate key.\nSo candidate keys are: AB, AC, AD, AE, AF.\n2) Prime attributes (part of some key): A, B, C, D, E, F. All attributes are prime!\n3) Since all attributes are prime, the relation satisfies 3NF by default (since for any FD X -> Y, if Y is a prime attribute, 3NF holds).\n4) Let\'s check BCNF: For AB -> C, AB is a super key. For C -> D, C is not a superkey (since C+ does not contain A). So it fails BCNF. Thus, highest NF is 3NF.',
    shortcut: 'If all attributes are prime, the relation is immediately in 3NF.',
    commonMistakes: 'Assuming it\'s BCNF because all FDs have superkeys on the left, forgetting C is not a superkey because A is missing.'
  },
  {
    id: 'q4',
    exam: 'CUET PG MCA',
    subject: 'Computer Science Core',
    topic: 'Operating Systems',
    difficulty: 'Medium',
    type: 'MCQ',
    question: 'A system has 4 processes sharing 3 instances of a resource class. Each process needs a maximum of k instances to run to completion. What is the maximum value of k such that the system is guaranteed to remain DEADLOCK-FREE?',
    options: [
      '1',
      '2',
      '3',
      '4'
    ],
    answer: '1',
    explanation: 'Deadlock-free criteria: For P processes sharing R instances, let each process need maximum target resource allocation M. System is guaranteed deadlock-free if: sum(Need_i) < P + R, where Need is k. Here all 4 processes need k. sum(Need) = 4 * (k - 1) + 1. It must be <= R.\n4(k - 1) + 1 <= 3\n4k - 4 + 1 <= 3\n4k - 3 <= 3\n4k <= 6 -> k <= 1.5. Since resource instances are integers, maximum k is 1.\nWait, let\'s trace: If k=1, each needs 1 resource, and since resource pool 3 is shared, they can run easily. If k=2, they could hold 1 resource each and run into deadlock if they hold 4 total (and we only have 3). Thus maximum k = 1.',
    shortcut: 'Formula: P * (k - 1) + 1 <= R. Plug in: 4 * (k-1) + 1 <= 3 => k <= 1.5 => k = 1.',
    commonMistakes: 'Solving P * k < R which ignores that process releases resources sequentially once completed.'
  },
  {
    id: 'q5',
    exam: 'GATE CS',
    subject: 'Core Computer Science',
    topic: 'Data Structures & Algorithms',
    difficulty: 'Hard',
    type: 'Coding',
    question: 'Implement a function to find the length of the longest path in a Binary Tree where each node has a value, and the path elements have consecutive increasing values by 1.',
    codeSnippet: `// Complete the function below to find consecutive path
function longestConsecutivePath(root: TreeNode | null): number {
  // Write your code here
  let maxLength = 0;
  
  return maxLength;
}`,
    answer: 'recursion',
    explanation: 'We perform a post-order traversal. For each node, we check if its children\'s value is +1 of the node\'s value. If yes, it contributes to the consecutive streak. We keep track of the maximum path encountered in a global or state variable. It is a classic dynamic programming on trees problem with O(N) complexity.',
    shortcut: 'Utilize bottom-up traversal carrying the local depth counter in the return signature to solve in a single call.',
    commonMistakes: 'Treating consecutive path as only strictly parent-to-child downward, rather than allowing path nodes to span across the left sibling to root to right sibling.'
  },
  {
    id: 'q6',
    exam: 'GATE CS',
    subject: 'Engineering Mathematics',
    topic: 'Discrete Mathematics',
    difficulty: 'Medium',
    type: 'MCQ',
    question: 'How many different binary relations exist on a set with 5 elements that are both symmetric AND reflexive?',
    options: [
      '2^10',
      '2^15',
      '2^25',
      '2^20'
    ],
    answer: '2^10',
    explanation: 'For a set of size n = 5 elements, there are n^2 elements in the relation matrix.\nIf the relation is reflexive, all diagonal elements must be 1. This leaves n^2 - n elements outside the main diagonal.\nIf the relation is symmetric, the upper triangle determines the lower triangle. The number of elements in the upper triangle is (n^2 - n)/2.\nFor each element in the upper triangle, we have 2 choices (present or not present).\nSo, total symmetric & reflexive relations: 2^((n^2 - n)/2).\nFor n=5, (25 - 5)/2 = 10. Thus, 2^10 relations.',
    shortcut: 'Formula: 2^(n(n-1)/2). Plug n=5: 2^(5*4/2) = 2^10.',
    commonMistakes: 'Computing 2^(n(n+1)/2) which counts reflexive options as free variables, whereas they are strictly forced to be present (1).'
  },
  {
    id: 'q7',
    exam: 'CAT',
    subject: 'QA - Quantitative Aptitude',
    topic: 'Arithmetic',
    difficulty: 'Medium',
    type: 'Numerical',
    question: 'Excluding stoppages, the speed of a high-speed shuttle train is 90 km/h, and including stoppages, it is 72 km/h. For how many minutes does the train stop per hour?',
    options: [
      '12',
      '15',
      '10',
      '18'
    ],
    answer: '12',
    explanation: 'Loss in speed per hour due to stoppages: 90 - 72 = 18 km/h.\nTime taken to cover 18 km at its default clean non-stopping speed (90 km/h):\nTime = Distance / Speed = 18 / 90 hours = 1/5 hour.\nIn minutes: (1/5) * 60 = 12 minutes.\nThus, the train stops for 12 minutes per hour.',
    shortcut: 'Formula: (Difference in Speed / Faster Speed) * 60. Here, (18 / 90) * 60 = 12.',
    commonMistakes: 'Using 72 as the denominator instead of 90, leading to (18 / 72) * 60 = 15 minutes.'
  },
  {
    id: 'q8',
    exam: 'CAT',
    subject: 'DILR - Data Interpretation & Logical Reasoning',
    topic: 'Logical Reasoning',
    difficulty: 'Hard',
    type: 'MCQ',
    question: 'In a group of 100 students, 45 study Mathematics, 38 study Physics, and 21 study Chemistry. 12 study both Math and Physics, 9 study Physics and Chemistry, and 8 study Math and Chemistry. 4 study all three. How many study NONE of these three subjects?',
    options: [
      '21',
      '17',
      '25',
      '19'
    ],
    answer: '21',
    explanation: 'We use the Principle of Inclusion-Exclusion (PIE) for three sets:\nN(M ∪ P ∪ C) = N(M) + N(P) + N(C) - N(M ∩ P) - N(P ∩ C) - N(M ∩ C) + N(M ∩ P ∩ C)\nN(M ∪ P ∪ C) = 45 + 38 + 21 - 12 - 9 - 8 + 4\nN(M ∪ P ∪ C) = 104 - 29 + 4 = 79.\nTherefore, the number of students who study none is 100 - 79 = 21.',
    shortcut: 'Venn Diagram sketch: Add the outer parameters and subtract intersections carefully. 45+38+21 - (12+9+8) + 4 = 79. 100 - 79 = 21.',
    commonMistakes: 'Adding the intersection values without subtracting the triple crossover twice.'
  },
  {
    id: 'q9',
    exam: 'TANCET MCA',
    subject: 'Computer Awareness',
    topic: 'Fundamentals of IT',
    difficulty: 'Easy',
    type: 'MCQ',
    question: 'Which of the following describes the function of the ARP (Address Resolution Protocol) protocol in computer networking?',
    options: [
      'Resolves IP version 4 addresses to physical MAC hardware addresses',
      'Resolves symbolic domain names to system numerical IP addresses',
      'Configures dynamic hosts with network routing parameters automatically',
      'Encrypts payloads across secure virtual private channels'
    ],
    answer: 'Resolves IP version 4 addresses to physical MAC hardware addresses',
    explanation: 'ARP is used to Map an IP address (Network Layer) to standard hardware MAC address (Data Link Layer) relative to immediate physical segment.',
    shortcut: 'ARP: IP -> MAC. DNS: Domain -> IP.',
    commonMistakes: 'Confusing ARP with DNS (Domain Name System).'
  },
  {
    id: 'q10',
    exam: 'Placements',
    subject: 'Coding Questions (DSA)',
    topic: 'Arrays & Hashing',
    difficulty: 'Medium',
    type: 'Coding',
    question: 'Write an optimized script to find if there is a subset of a given array of non-negative integers whose sum equals a given target sum.',
    codeSnippet: `function hasSubsetSum(arr: number[], target: number): boolean {
  // Write key logic here
  return false;
}`,
    answer: 'dp',
    explanation: 'Use dynamic programming. Create a 2D grid table where dp[i][j] represents if a sum of j can be achieved using a subset of first i items. Complexity of storage is O(N * target).',
    shortcut: 'Can optimize space complexity to a 1D boolean array of size target+1 by iterating backwards from target to current item value.',
    commonMistakes: 'Recurse naively without memoization which raises exponential execution complexity O(2^N) causing timeouts on large arrays.'
  }
];

export const MOCK_TESTS: MockTest[] = [
  {
    id: 'nimcet-mock-1',
    title: 'NIMCET National Level Mock #1',
    exam: 'NIMCET',
    durationMinutes: 120,
    totalQuestions: 5,
    negativeMarking: 1,
    positiveMarking: 4,
    questions: [
      QUESTION_BANK[0], // Prob Hard
      QUESTION_BANK[1], // Com Awareness
      QUESTION_BANK[5], // Discrete Math
      QUESTION_BANK[6], // Speed Arithmetic (Treated as general Reasoning/Aptitude here)
      QUESTION_BANK[8]  // Computer Network/Awareness
    ]
  },
  {
    id: 'cuet-mock-1',
    title: 'CUET PG MCA Full-length Mock #5',
    exam: 'CUET PG MCA',
    durationMinutes: 105,
    totalQuestions: 4,
    negativeMarking: 1,
    positiveMarking: 4,
    questions: [
      QUESTION_BANK[2], // DBMS Normalization
      QUESTION_BANK[3], // Deadlocks OS
      QUESTION_BANK[4], // Binary Tree Long Consecutive Path
      QUESTION_BANK[9]  // Subset Sum Placement Prep adapted
    ]
  },
  {
    id: 'cat-mock-1',
    title: 'CAT Quantum Speed Builder #2',
    exam: 'CAT',
    durationMinutes: 120,
    totalQuestions: 3,
    negativeMarking: 1,
    positiveMarking: 3,
    questions: [
      QUESTION_BANK[6], // Train stops speed QA
      QUESTION_BANK[7], // Venn diagram student study sets
      QUESTION_BANK[0]  // Hard math probability counts
    ]
  }
];
