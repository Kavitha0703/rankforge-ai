import { ExamType } from '../types';

export interface LectureResource {
  id: string;
  subject: string;
  exam: ExamType | 'ALL';
  channel: string;
  title: string;
  language: 'English' | 'Hindi' | 'Tamil' | 'Telugu' | 'Mixed';
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  rating: number;
  reviewsCount: number;
  duration: string;
  youtubeUrl: string;
  verified: boolean;
  bestFor: string[];
}

export interface PlaylistReview {
  id: string;
  playlistId: string;
  userName: string;
  rating: number;
  reviewText: string;
  date: string;
}

export const LECTURE_RESOURCES: LectureResource[] = [
  {
    id: 'lr-dbms-gs',
    subject: 'Database Systems',
    exam: 'GATE CS',
    channel: 'Gate Smashers',
    title: 'Complete DBMS Course & SQL Derivations',
    language: 'Mixed',
    level: 'Beginner',
    rating: 4.8,
    reviewsCount: 3200,
    duration: '45 Hours',
    youtubeUrl: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiFAN6I81CgLf3YLNIBDKyDs',
    verified: true,
    bestFor: ['NIMCET', 'GATE CS', 'CUET PG MCA', 'University MCA Entrances']
  },
  {
    id: 'lr-dbms-ak',
    subject: 'Database Systems',
    exam: 'GATE CS',
    channel: 'Amit Khurana',
    title: 'Advanced Database Systems & Normalization Theory',
    language: 'Mixed',
    level: 'Intermediate',
    rating: 4.7,
    reviewsCount: 1420,
    duration: '60 Hours',
    youtubeUrl: 'https://www.youtube.com/playlist?list=PLmXKhU9FNesR1rUXriA0M3Uco6v8vALlz',
    verified: true,
    bestFor: ['GATE CS', 'UGC NET', 'CUET PG MCA']
  },
  {
    id: 'lr-dbms-neso',
    subject: 'Database Systems',
    exam: 'CUET PG MCA',
    channel: 'Neso Academy',
    title: 'Database Management Systems Visual Course',
    language: 'English',
    level: 'Beginner',
    rating: 4.8,
    reviewsCount: 2200,
    duration: '35 Hours',
    youtubeUrl: 'https://www.youtube.com/playlist?list=PLBlnK6fEyqRi_Fs676Ndfu1_v_Uv6T662',
    verified: true,
    bestFor: ['CUET PG MCA', 'University Exams', 'Placements']
  },
  {
    id: 'lr-os-jenny',
    subject: 'Computer Science',
    exam: 'NIMCET',
    channel: "Jenny's Lectures CS IT",
    title: 'Operating Systems For MCA & B.Tech Entrances',
    language: 'Mixed',
    level: 'Beginner',
    rating: 4.9,
    reviewsCount: 4500,
    duration: '52 Hours',
    youtubeUrl: 'https://www.youtube.com/playlist?list=PLdo5W4Nhv31a5ucW_S1K3-x6ztYF-8r34',
    verified: true,
    bestFor: ['NIMCET', 'TANCET MCA', 'Placements', 'GATE CS']
  },
  {
    id: 'lr-m-gp',
    subject: 'Mathematics',
    exam: 'NIMCET',
    channel: 'Dr. Gajendra Purohit',
    title: 'Higher Level Calculus & Integration Tricks',
    language: 'Hindi',
    level: 'Intermediate',
    rating: 4.7,
    reviewsCount: 2800,
    duration: '40 Hours',
    youtubeUrl: 'https://www.youtube.com/playlist?list=PLU6Yg8niUqg05ZqP7lXorEBy_Q6YfIit4',
    verified: true,
    bestFor: ['NIMCET', 'GATE CS Math', 'University Exams']
  },
  {
    id: 'lr-prob-khan',
    subject: 'Calculus',
    exam: 'NIMCET',
    channel: 'Khan Academy',
    title: 'Advanced Probability & Statistical Bounds',
    language: 'English',
    level: 'Advanced',
    rating: 4.9,
    reviewsCount: 6100,
    duration: '18 Hours',
    youtubeUrl: 'https://www.youtube.com/playlist?list=PL13281563EA7163B5',
    verified: true,
    bestFor: ['NIMCET', 'GATE CS', 'CAT', 'CUET PG MCA']
  },
  {
    id: 'lr-dsa-neso',
    subject: 'Computer Science',
    exam: 'Placements',
    channel: 'Neso Academy',
    title: 'Programming & Data Structures in C/C++',
    language: 'English',
    level: 'Beginner',
    rating: 4.8,
    reviewsCount: 3800,
    duration: '48 Hours',
    youtubeUrl: 'https://www.youtube.com/playlist?list=PLBlnK6fEyqRj9yddMC8stM8Kz60M14yR6',
    verified: true,
    bestFor: ['Placements', 'CUET PG MCA', 'TANCET MCA']
  },
  {
    id: 'lr-apt-ah',
    subject: 'Quantitative Aptitude',
    exam: 'CAT',
    channel: 'Aptitude Hub',
    title: 'High-Speed Quantitative Aptitude Masterclass',
    language: 'English',
    level: 'Intermediate',
    rating: 4.6,
    reviewsCount: 950,
    duration: '22 Hours',
    youtubeUrl: 'https://www.youtube.com/playlist?list=PL3A3DFF7F4B0E8FC0',
    verified: false,
    bestFor: ['CAT', 'NIMCET Reasoning', 'Placements']
  },
  {
    id: 'lr-reasoning-career',
    subject: 'Quantitative Aptitude',
    exam: 'NIMCET',
    channel: 'Career Avenues MCA',
    title: 'NIMCET Logical & Analytical Reasoning Hub',
    language: 'Mixed',
    level: 'Beginner',
    rating: 4.5,
    reviewsCount: 740,
    duration: '30 Hours',
    youtubeUrl: 'https://www.youtube.com/watch?v=k7Y5SibZhqw',
    verified: true,
    bestFor: ['NIMCET', 'CUET PG MCA', 'TANCET MCA']
  },
  {
    id: 'lr-math-tancet-babu',
    subject: 'Mathematics',
    exam: 'TANCET MCA',
    channel: 'Reddy Math Lectures',
    title: 'TANCET MCA Algebra & Numerical Operations',
    language: 'Tamil',
    level: 'Beginner',
    rating: 4.6,
    reviewsCount: 420,
    duration: '25 Hours',
    youtubeUrl: 'https://www.youtube.com/playlist?list=PL49C6D1F17FF5D99B',
    verified: false,
    bestFor: ['TANCET MCA', 'State MCA Exams']
  },
  {
    id: 'lr-dsa-telugu',
    subject: 'Computer Science',
    exam: 'Placements',
    channel: 'Telugu Tech Tutorials',
    title: 'Data Structures and Algorithms Series in Telugu',
    language: 'Telugu',
    level: 'Beginner',
    rating: 4.5,
    reviewsCount: 310,
    duration: '28 Hours',
    youtubeUrl: 'https://www.youtube.com/playlist?list=PL1A3DFF7F4B0E8FC1',
    verified: false,
    bestFor: ['Placements', 'University Exams']
  }
];

export const INITIAL_REVIEWS: PlaylistReview[] = [
  {
    id: 'rev-1',
    playlistId: 'lr-dbms-gs',
    userName: 'Aryan Sharma',
    rating: 5,
    reviewText: 'Excellent explanations of normalization! Got my concepts of 3NF/BCNF fully clear in just 2 days. Highly recommended for NIMCET aspirants.',
    date: '2026-05-12'
  },
  {
    id: 'rev-2',
    playlistId: 'lr-dbms-gs',
    userName: 'Deepak Rao',
    rating: 4,
    reviewText: 'Fabulous trick shortcuts for SQL query questions. Really helpful for solving direct MCQs under 1 minute.',
    date: '2026-06-01'
  },
  {
    id: 'rev-3',
    playlistId: 'lr-dbms-ak',
    userName: 'Priya K.',
    rating: 5,
    reviewText: 'Most comprehensive database theory on the web. The mathematical proofs for lossless join decomposition are extremely rigorous. Perfect for GATE CS.',
    date: '2026-05-20'
  },
  {
    id: 'rev-4',
    playlistId: 'lr-dbms-neso',
    userName: 'Shalini J',
    rating: 5,
    reviewText: 'Neso Academy visuals are top tier. Best explanation of Entity Relationship diagrams with clean drawings.',
    date: '2026-04-18'
  },
  {
    id: 'rev-5',
    playlistId: 'lr-os-jenny',
    userName: 'Karthik Raja',
    rating: 5,
    reviewText: 'Jenny Maam has simplified semaphore locks and deadlock avoidance (Banker’s algorithm) so nicely. Watch this for sure!',
    date: '2026-05-29'
  },
  {
    id: 'rev-6',
    playlistId: 'lr-m-gp',
    userName: 'Akshay V',
    rating: 4,
    reviewText: 'Great shortcut formula tricks for definite integration bounds. Spares you at least 3-4 steps in competitive exam questions.',
    date: '2026-03-11'
  }
];
