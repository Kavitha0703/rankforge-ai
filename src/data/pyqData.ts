import { ExamType, DifficultyLevel } from '../types';

export interface PYQQuestion {
  id: string;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  shortcut: string;
  commonMistakes: string;
  difficulty: DifficultyLevel;
  topic: string;
  subject: string;
}

export interface PYQPaper {
  id: string;
  exam: ExamType;
  year: number;
  title: string;
  subject: string;
  questions: PYQQuestion[];
}

export const PYQ_PAPERS: PYQPaper[] = [
  {
    id: 'nimcet-2025',
    exam: 'NIMCET',
    year: 2025,
    title: 'NIMCET 2025 Official Paper',
    subject: 'Mathematics & Computer Awareness',
    questions: [
      {
        id: 'n25-q1',
        question: 'If A and B are two events such that P(A) = 0.4, P(B) = 0.8 and P(B|A) = 0.6. Find the value of P(A ∪ B).',
        options: [
          '0.96',
          '0.84',
          '0.72',
          '0.90'
        ],
        answer: '0.96',
        explanation: 'We are given P(B|A) = P(A ∩ B) / P(A). Therefore, P(A ∩ B) = P(B|A) * P(A) = 0.6 * 0.4 = 0.24. Now, using the addition theorem: P(A ∪ B) = P(A) + P(B) - P(A ∩ B) = 0.4 + 0.8 - 0.24 = 0.96.',
        shortcut: 'P(A ∪ B) = P(A) + P(B) - P(B|A)P(A). Substitute values directly: 0.4 + 0.8 - (0.6 * 0.4) = 1.2 - 0.24 = 0.96.',
        commonMistakes: 'A common mistake is thinking A and B are independent events and calculating P(A ∩ B) as P(A)P(B) = 0.32, which results in P(A ∪ B) = 0.88, which is incorrect.',
        difficulty: 'Medium',
        topic: 'Probability & Statistics',
        subject: 'Mathematics'
      },
      {
        id: 'n25-q2',
        question: 'What is the 2s complement of the binary float -5.75 using an 8-bit fixed point format where 5 bits represent the integer part (with sign) and 3 bits represent the fractional part?',
        options: [
          '11010010',
          '10100100',
          '11011000',
          '10100010'
        ],
        answer: '11010010',
        explanation: 'Step 1: Express positive 5.75 in binary. 5 is 0101, and 0.75 is 0.11(base 2). So +5.75 = 0101.110. Step 2: Since we have 5 bits for integer and 3 bits for fraction, the +5.75 magnitude representation is 01010110. Step 3: To find the 2s complement for negative: invert bits: 10101001, and add 1 to the LSB: 10101001 + 00000001 = 11010010.',
        shortcut: 'Write positive version 01010110. Working from right to left, copy bits until you see the first 1 (copying the 0 at end, and the first 1), then invert all remaining bits on left. You get 11010010.',
        commonMistakes: 'Ignoring the fractional bit offset or doing standard 2s complement without treating it as fixed point coordinate shifts.',
        difficulty: 'Hard',
        topic: 'Data Representation',
        subject: 'Computer awareness'
      }
    ]
  },
  {
    id: 'nimcet-2024',
    exam: 'NIMCET',
    year: 2024,
    title: 'NIMCET 2024 Solved Paper',
    subject: 'Trigonometry & Set theory',
    questions: [
      {
        id: 'n24-q1',
        question: 'If Tan A + Sin A = m and Tan A - Sin A = n, then the value of m^2 - n^2 is equal to:',
        options: [
          '4 Route(mn)',
          '2 Route(mn)',
          'mn',
          '4mn'
        ],
        answer: '4 Route(mn)',
        explanation: 'We have m^2 - n^2 = (m - n)(m + n) = (2 Sin A) * (2 Tan A) = 4 Sin A Tan A. Now let us calculate 4 * sqrt(mn) = 4 * sqrt(Tan^2 A - Sin^2 A) = 4 * sqrt(Sin^2 A / Cos^2 A - Sin^2 A) = 4 * sqrt(Sin^2 A * (1 - Cos^2 A)/Cos^2 A) = 4 * sqrt(Sin^4 A / Cos^2 A) = 4 * (Sin^2 A / Cos A) = 4 Sin A Tan A. Since both terms are identical, m^2 - n^2 = 4*sqrt(mn).',
        shortcut: 'Put A = 45 degrees. Then Tan A = 1, Sin A = 0.707. m = 1.707, n = 0.293. m^2 - n^2 = 2.913 - 0.085 = 2.828. Testing option A: 4 * sqrt(m*n) = 4 * sqrt(0.5) = 4 * 0.707 = 2.828. Matches perfectly!',
        commonMistakes: 'Expanding Tan as Sin/Cos too early and getting lost in algebra.',
        difficulty: 'Medium',
        topic: 'Trigonometry',
        subject: 'Mathematics'
      }
    ]
  },
  {
    id: 'cuet-2025',
    exam: 'CUET PG MCA',
    year: 2025,
    title: 'CUET PG MCA 2025 Paper',
    subject: 'Computer Science Core',
    questions: [
      {
        id: 'c25-q1',
        question: 'In a Relational Database, if functional dependency sets are F = {A -> B, B -> C, C -> D}. Which of the following normal form is satisfied by R(A, B, C, D) but NOT a higher normal form?',
        options: [
          '2NF',
          '1NF',
          '3NF',
          'BCNF'
        ],
        answer: '2NF',
        explanation: 'Step 1: Compute candidate key. Since A determines B, which determines C, which determines D, A+ = {A,B,C,D}. So A is the candidate key. Step 2: Verify prime and non-prime attributes. Prime attribute is A. Non-prime are B, C, D. Step 3: Check 2NF. 2NF prevents partial dependencies (where proper subset of primary key determines non-prime). Since A is single attribute, subset partial dependency can not exist. Thus R is in 2NF. Step 4: Check 3NF. 3NF prevents transitive dependencies (X -> Y where X is not superkey and Y is non-prime). Here B -> C. B is not a superkey, and C is non-prime. This is transitive dependency! Hence, it is in 2NF but NOT 3NF.',
        shortcut: 'Transitive chain (A -> B -> C -> D) is present and there are no partial dependencies because the key A is a single attribute. Single-attribute candidates are automatically in 2NF. Transitive chain fails 3NF. Hence exact match is 2NF.',
        commonMistakes: 'Believing that it is in BCNF because everything is simple LHS-to-RHS. B and C are not superkeys, so it immediately fails BCNF and 3NF.',
        difficulty: 'Hard',
        topic: 'Operating Systems',
        subject: 'Computer Science Core'
      }
    ]
  },
  {
    id: 'gate-2025',
    exam: 'GATE CS',
    year: 2025,
    title: 'GATE CS 2025 Paper Solution',
    subject: 'Discrete Structures & Graph Theory',
    questions: [
      {
        id: 'g25-q1',
        question: 'Let G be a simple connected planar graph with 10 vertices and 15 edges. How many bounded faces are present in any planar representation of G?',
        options: [
          '6',
          '7',
          '8',
          '5'
        ],
        answer: '6',
        explanation: 'According to Eulers planar equation: V - E + F = 2, where V = vertices, E = edges, and F = total faces (including the unbounded outer face). Given V = 10, E = 15. So, 10 - 15 + F = 2 => F = 7 total faces. The question asks for BOUNDED faces. Bounded faces = Total faces - Unbounded outer face = 7 - 1 = 6.',
        shortcut: 'Calculate Total Faces directly using Euler Formula: F = E - V + 2 = 15 - 10 + 2 = 7. Subtract 1 for the outer region of planar graphs. 7 - 1 = 6 bounded faces.',
        commonMistakes: 'Forgetting to subtract the single infinite unbounded face, resulting in answering 7, which is the total face count.',
        difficulty: 'Medium',
        topic: 'Graph Theory',
        subject: 'Discrete Mathematics'
      }
    ]
  }
];

export const UNIVERSITY_PREDICTION_DATA = {
  NIMCET: [
    { name: 'NIT Trichy', seatCount: 110, cutoffGeneral: 45, placementPercentage: 98, feesAnnual: 140000, avgCgpaRequired: '8.5+' },
    { name: 'NIT Surathkal', seatCount: 58, cutoffGeneral: 95, placementPercentage: 96, feesAnnual: 150000, avgCgpaRequired: '8.2+' },
    { name: 'MNNIT Allahabad', seatCount: 116, cutoffGeneral: 160, placementPercentage: 95, feesAnnual: 125000, avgCgpaRequired: '8.0+' },
    { name: 'NIT Bhopal (MANIT)', seatCount: 115, cutoffGeneral: 240, placementPercentage: 91, feesAnnual: 130000, avgCgpaRequired: '7.8+' },
    { name: 'NIT Jamshedpur', seatCount: 115, cutoffGeneral: 320, placementPercentage: 92, feesAnnual: 110000, avgCgpaRequired: '7.5+' },
    { name: 'NIT Kurukshetra', seatCount: 64, cutoffGeneral: 410, placementPercentage: 89, feesAnnual: 115000, avgCgpaRequired: '7.5+' },
    { name: 'NIT Raipur', seatCount: 110, cutoffGeneral: 530, placementPercentage: 85, feesAnnual: 105000, avgCgpaRequired: '7.0+' },
    { name: 'NIT Agartala', seatCount: 30, cutoffGeneral: 680, placementPercentage: 81, feesAnnual: 120000, avgCgpaRequired: '7.0+' }
  ],
  'CUET PG MCA': [
    { name: 'Jawaharlal Nehru University (JNU), Delhi', seatCount: 58, cutoffGeneral: 78, placementPercentage: 94, feesAnnual: 5000, avgCgpaRequired: '8.0+' },
    { name: 'University of Delhi (DU), Delhi', seatCount: 46, cutoffGeneral: 120, placementPercentage: 92, feesAnnual: 15000, avgCgpaRequired: '8.2+' },
    { name: 'Banaras Hindu University (BHU), Varanasi', seatCount: 57, cutoffGeneral: 220, placementPercentage: 88, feesAnnual: 12000, avgCgpaRequired: '7.8+' },
    { name: 'Pondicherry University', seatCount: 60, cutoffGeneral: 450, placementPercentage: 82, feesAnnual: 35000, avgCgpaRequired: '7.2+' },
    { name: 'Central University of Rajasthan', seatCount: 40, cutoffGeneral: 650, placementPercentage: 78, feesAnnual: 45000, avgCgpaRequired: '7.0+' }
  ],
  'GATE CS': [
    { name: 'IISc Bangalore (M.Tech CS)', seatCount: 60, cutoffGeneral: 85, placementPercentage: 100, feesAnnual: 40000, avgCgpaRequired: '8.8+' },
    { name: 'IIT Bombay', seatCount: 80, cutoffGeneral: 140, placementPercentage: 99, feesAnnual: 85000, avgCgpaRequired: '8.5+' },
    { name: 'IIT Delhi', seatCount: 75, cutoffGeneral: 180, placementPercentage: 98, feesAnnual: 90000, avgCgpaRequired: '8.5+' },
    { name: 'IIT Madras', seatCount: 70, cutoffGeneral: 220, placementPercentage: 97, feesAnnual: 80000, avgCgpaRequired: '8.3+' },
    { name: 'IIT Kharagpur', seatCount: 85, cutoffGeneral: 285, placementPercentage: 95, feesAnnual: 95000, avgCgpaRequired: '8.0+' },
    { name: 'IIT Roorkee', seatCount: 65, cutoffGeneral: 380, placementPercentage: 93, feesAnnual: 110000, avgCgpaRequired: '7.8+' }
  ]
};
