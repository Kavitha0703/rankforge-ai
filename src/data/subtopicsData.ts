import { DifficultyLevel } from '../types';

export interface SubtopicQuestion {
  id: string;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  difficulty: DifficultyLevel;
}

export interface DetailedSubtopic {
  id: string; // unique ID
  name: string;
  theory: string;
  visualExample: string;
  formulae: string[];
  summaryNotes: string[];
  commonMistakes: string;
  pyqs: {
    exam: string;
    year: number;
    question: string;
    solution: string;
  }[];
  quizQuestions: SubtopicQuestion[];
}

export interface TopicTree {
  topicName: string;
  subtopics: DetailedSubtopic[];
}

export const TOPIC_SUBTOPICS_DB: Record<string, DetailedSubtopic[]> = {
  "set theory": [
    {
      id: "set-intro",
      name: "Introduction to Sets",
      theory: "A set is a well-defined collection of distinct objects. Objects in a set are called elements or members. Sets are typically denoted by capital letters (e.g., A, B, C) and elements by lowercase letters. Sets can be represented in two forms: Roster (tabular) Form, where elements are listed within braces separated by commas, and Set-Builder Form, which specifies the common property possessed by all elements.",
      visualExample: "Let A be the set of vowels in English. tabular form: A = {a, e, i, o, u}. Set-builder form: A = {x | x is a vowel in English alphabet}.",
      formulae: ["x ∈ A (x is an element of A)", "x ∉ A (x is not an element of A)"],
      summaryNotes: ["Sets must be well-defined: {tall students} is NOT a set, whereas {students with height > 165cm} IS a set.", "Order of elements does not matter.", "Elements must be unique; duplicates are not counted."],
      commonMistakes: "Silly mistake: Forgetting that { {1, 2} } is a set containing a single element (which is the set {1, 2}), not two elements (1 and 2). Ensure cardinality checks account for nesting.",
      pyqs: [
        {
          exam: "NIMCET",
          year: 2022,
          question: "If a set A has 5 elements, define the cardinality of its Power Set.",
          solution: "Number of elements in power set = 2^n = 2^5 = 32."
        }
      ],
      quizQuestions: [
        {
          id: "sq-set-1",
          question: "Which of the following is a well-defined set under standard mathematical axioms?",
          options: [
            "A collection of the 5 most difficult books on Calculus",
            "A collection of integers whose absolute value is less than 3",
            "A list of the absolute best teachers in India",
            "A compilation of outstanding student minds in NIMCET"
          ],
          answer: "A collection of integers whose absolute value is less than 3",
          explanation: "Intellectual objectivity: Difficulty, intelligence, and excellence are subjective/unquantifiable unless strict boundary metrics are specified. Absolute value less than 3 defines exactly {-2, -1, 0, 1, 2}.",
          difficulty: "Easy"
        },
        {
          id: "sq-set-2",
          question: "Let S = { x ∈ ℝ | x² + 1 = 0 }. What is the cardinality of S in the real number domain?",
          options: ["0 (Null set)", "1", "2", "Infinite"],
          answer: "0 (Null set)",
          explanation: "There is no real number corresponding to x² = -1. Therefore, the set containing real roots is empty, with 0 elements.",
          difficulty: "Easy"
        },
        {
          id: "sq-set-3",
          question: "How is the set of all prime numbers between 10 and 20 represented in Roster form?",
          options: [
            "{11, 13, 17, 19}",
            "{11, 13, 15, 17, 19}",
            "{9, 11, 13, 17, 19}",
            "{11, 12, 13, 17, 19}"
          ],
          answer: "{11, 13, 17, 19}",
          explanation: "Prime numbers inside this range are 11, 13, 17, and 19. 15 is divisible by 3 and 5.",
          difficulty: "Easy"
        },
        {
          id: "sq-set-4",
          question: "If A = { x inside Integers | x² - 5x + 6 = 0 } and B = { 2, 3 }. Which statement is correct?",
          options: ["A is a subset of B and B is a subset of A (A = B)", "A is a proper prefix of B", "A has more elements than B", "A and B are completely disjoint sets"],
          answer: "A is a subset of B and B is a subset of A (A = B)",
          explanation: "Solving the equation x² - 5x + 6 = 0 gives roots x = 2 and x = 3. Thus, A = {2, 3}. Since sets have identical element subsets, A = B.",
          difficulty: "Medium"
        },
        {
          id: "sq-set-5",
          question: "Find the cardinality of the nested set P = { ∅, {∅}, {∅, {∅}} }.",
          options: ["3", "0", "1", "2"],
          answer: "3",
          explanation: "The elements of P are: 1. ∅, 2. {∅}, 3. {∅, {∅}}. That makes exactly three distinct members. Hence, cardinality is 3.",
          difficulty: "Hard"
        }
      ]
    },
    {
      id: "set-types",
      name: "Types of Sets",
      theory: "Sets are classified based on their elements: \n1. **Empty / Null Set** (∅ or {}): Contains zero elements. \n2. **Finite Set**: Cardinally countable set. \n3. **Infinite Set**: Unbounded set where numbers never stop. \n4. **Equal Sets**: Set A and B are equal (A = B) if they contain exactly the identical elements.\n5. **Equivalent Sets**: Set A and B are equivalent if n(A) = n(B) (same quantity of elements, though actual elements can differ).",
      visualExample: "Equal sets: A = {1, 2}, B = {2, 1}. Equivalent sets: X = {1, 2}, Y = {'apple', 'banana'}.",
      formulae: ["For equivalent sets: n(A) = n(B)", "For equal sets: x ∈ A ⟺ x ∈ B"],
      summaryNotes: ["Every equal set is automatically equivalent.", "Not all equivalent sets are equal.", "The empty set is a subset of every set."],
      commonMistakes: "Confusing ∅ and {0}. ∅ has cardinality 0, whereas {0} is a singleton set containing the element zero, with cardinality 1.",
      pyqs: [
        {
          exam: "CUET PG MCA",
          year: 2023,
          question: "Find the number of non-empty subsets of any finite set containing n elements.",
          solution: "Total subsets count = 2^n. Subtracting the one empty set yields 2^n - 1 non-empty subsets."
        }
      ],
      quizQuestions: [
        {
          id: "sq-type-1",
          question: "If set A = {x | x is a month with 32 days}, what type of set is A?",
          options: ["Null Set", "Singleton Set", "Infinite Set", "Universal Set"],
          answer: "Null Set",
          explanation: "Since no calendar month has 32 days, cardinality is strictly 0. This is an empty or null set.",
          difficulty: "Easy"
        },
        {
          id: "sq-type-2",
          question: "Let A = {1, 2, 3} and B = {u, v, w}. Which relation holds true for these sets?",
          options: ["Equivalent sets", "Equal sets", "A is a subset of B", "Disjoint and non-equivalent"],
          answer: "Equivalent sets",
          explanation: "n(A) = 3 and n(B) = 3. Since elements differ but their counts are equal, they are equivalent sets.",
          difficulty: "Medium"
        },
        {
          id: "sq-type-3",
          question: "What is the cardinality of the power set of {1, 2, 3, 4}?",
          options: ["16", "8", "4", "32"],
          answer: "16",
          explanation: "The power set cardinality of a set with n elements is 2^n. Here 2^4 = 16.",
          difficulty: "Easy"
        },
        {
          id: "sq-type-4",
          question: "If A is a finite set of cardinality N, what describes the collection of proper subsets of A?",
          options: [
            "It has 2^N - 1 elements",
            "It has 2^N elements",
            "It has exactly N elements",
            "It has 2^(N-1) elements"
          ],
          answer: "It has 2^N - 1 elements",
          explanation: "Proper subsets of a set exclude the set itself, meaning we subtract exactly 1 from the total subset count, leaving 2^N - 1.",
          difficulty: "Medium"
        },
        {
          id: "sq-type-5",
          question: "Which of the following describes an infinite set under mathematical definitions?",
          options: [
            "Set of real roots of equation x³ - x² = 0",
            "Set of all coordinate points on a line segment of length 1 cm",
            "Set of human beings currently breathing on Earth",
            "Set of all prime numbers smaller than 100 trillion"
          ],
          answer: "Set of all coordinate points on a line segment of length 1 cm",
          explanation: "Human populations and primes up to a bound are finite (even if very large). A line segment contains an uncountably infinite number of coordinates.",
          difficulty: "Hard"
        }
      ]
    },
    {
      id: "set-ops",
      name: "Set Operations",
      theory: "Operations allow us to combine or relate sets: \n1. **Union** (A ∪ B): Elements in A, B, or both. \n2. **Intersection** (A ∩ B): Only elements present in both sets. \n3. **Difference** (A - B): Elements in A but NOT in B.\n4. **Symmetric Difference** (A ▵ B): Elements in either A or B, but not both (A - B) ∪ (B - A).",
      visualExample: "Let A = {1, 2, 3}, B = {3, 4, 5}. Union = {1, 2, 3, 4, 5}. Intersection = {3}. Difference (A-B) = {1, 2}. Symmetric Difference = {1, 2, 4, 5}.",
      formulae: [
        "n(A ∪ B) = n(A) + n(B) - n(A ∩ B)",
        "n(A ▵ B) = n(A ∪ B) - n(A ∩ B)"
      ],
      summaryNotes: ["Intersection is associative: (A ∩ B) ∩ C = A ∩ (B ∩ C).", "Difference is non-commutative: A - B ≠ B - A.", "A ∩ B = ∅ implies sets are totally disjoint."],
      commonMistakes: "Forgetting to subtract intersection elements. When doing counts, people often do n(A) + n(B) without subtracting n(A ∩ B). Correct for double counting!",
      pyqs: [
        {
          exam: "NIMCET",
          year: 2024,
          question: "If n(A) = 15, n(B) = 20, and n(A ∩ B) = 5. Find n(A ∪ B).",
          solution: "n(A ∪ B) = 15 + 20 - 5 = 30."
        }
      ],
      quizQuestions: [
        {
          id: "sq-op-1",
          question: "If A = {1, 2, 4} and B = {2, 3, 4, 5}. What is A ∩ B?",
          options: ["{2, 4}", "{1, 2, 3, 4, 5}", "{1, 3, 5}", "{2, 3, 4}"],
          answer: "{2, 4}",
          explanation: "Elements common to both sets A and B are 2 and 4.",
          difficulty: "Easy"
        },
        {
          id: "sq-op-2",
          question: "For any two sets A and B, the operation A - B is equivalent to which formulation?",
          options: ["A ∩ B'", "A' ∩ B", "A ∪ B'", "(A ∪ B)'"],
          answer: "A ∩ B'",
          explanation: "A - B consists of elements in A and NOT in B, which is explicitly the intersection of set A with the complement of set B.",
          difficulty: "Medium"
        },
        {
          id: "sq-op-3",
          question: "If n(A) = 45, n(B) = 32, and n(A ∪ B) = 65, find the intersection n(A ∩ B).",
          options: ["12", "13", "15", "8"],
          answer: "12",
          explanation: "n(A ∩ B) = n(A) + n(B) - n(A ∪ B) = 45 + 32 - 65 = 12.",
          difficulty: "Easy"
        },
        {
          id: "sq-op-4",
          question: "What is the symmetric difference (A ▵ B) of sets A = {a, b, c} and B = {c, d, e}?",
          options: ["{a, b, d, e}", "{c}", "{a, b}", "{d, e}"],
          answer: "{a, b, d, e}",
          explanation: "The symmetric difference excludes the common intersection element 'c' and combines the distinct elements: {a, b, d, e}.",
          difficulty: "Easy"
        },
        {
          id: "sq-op-5",
          question: "Under universal complement operations, what is the value of (A ∪ B)' ∪ (A' ∩ B) equal to?",
          options: ["A'", "B'", "A", "Universal Set"],
          answer: "A'",
          explanation: "By De Morgan's laws: (A ∪ B)' = A' ∩ B'. Now, (A' ∩ B') ∪ (A' ∩ B) = A' ∩ (B' ∪ B) = A' ∩ Universal = A'. Beautiful distributive law reduction.",
          difficulty: "Hard"
        }
      ]
    },
    {
      id: "set-venn",
      name: "Venn Diagrams",
      theory: "Venn diagrams are geometric representations of set structures popularized by John Venn. Universal set is depicted as a outer rectangle, and subsets are represented as overlapping or disjoint circles within the rectangle. This is the visual baseline for algebraic logic.",
      visualExample: "An outer box U with two overlapping circles labeled A and B. The overlap represents (A ∩ B). Circles shaded together represent (A ∪ B). Shading outside circles represents (A ∪ B)'.",
      formulae: ["Symmetric shading: (A - B) ∪ (B - A) ∪ (A ∩ B) = A ∪ B", "n(U) = n(A ∪ B) + n((A ∪ B)')"],
      summaryNotes: ["Very efficient for solving counting questions with three parameters (A, B, C).", "Ensure you start filling the Venn diagram from the innermost intersection (A ∩ B ∩ C) and work your way outwards."],
      commonMistakes: "When given '30 people like tea only', that goes strictly to the region (Tea - Coffee). If given '30 people like tea', that encompasses the entire tea circle (including coffee drinkers!). Distinguish these carefully.",
      pyqs: [
        {
          exam: "NIMCET",
          year: 2021,
          question: "In a group of 100 students, 70 like Math, 40 like CS. How many like both if everyone likes at least one?",
          solution: "Total = n(Math) + n(CS) - Both. 100 = 70 + 40 - Both ⟹ Both = 10."
        }
      ],
      quizQuestions: [
        {
          id: "sq-venn-1",
          question: "In a diagram with two overlapping circles A and B, which region is represented by the area exclusive to circle B?",
          options: ["B - A", "A - B", "A ∩ B", "A' ∩ B'"],
          answer: "B - A",
          explanation: "The crescent area belonging to B with the overlap of A removed is the set B minus A (B - A).",
          difficulty: "Easy"
        },
        {
          id: "sq-venn-2",
          question: "In a survey of 50 students, 30 play Cricket and 25 play Football. If 10 play both, how many play neither sport?",
          options: ["5", "10", "15", "0"],
          answer: "5",
          explanation: "Total playing Cricket or Football = 30 + 25 - 10 = 45. Hence, those playing neither = 50 - 45 = 5.",
          difficulty: "Medium"
        },
        {
          id: "sq-venn-3",
          question: "A shaded rectangle with circles A and B completely unshaded corresponds to which math expression?",
          options: ["(A ∪ B)'", "(A ∩ B)'", "A' ∪ B'", "A' ∩ B"],
          answer: "(A ∪ B)'",
          explanation: "Unshaded circles represent the union. Shading strictly outside represents the complement of the union, (A ∪ B)'.",
          difficulty: "Easy"
        },
        {
          id: "sq-venn-4",
          question: "In a tier-1 institute, 60% students passed in Math, 50% in English, and 30% passed in both. What is the fail percentage in both subjects?",
          options: ["20%", "10%", "30%", "15%"],
          answer: "20%",
          explanation: "Total passed in English or Math = 60% + 50% - 30% = 80%. Therefore, failing in both = 100% - 80% = 20%.",
          difficulty: "Medium"
        },
        {
          id: "sq-venn-5",
          question: "A class of 120 has 70 taking Physics, 55 Chemistry, 45 Math. 25 Physics & Chemistry, 20 Chemistry & Math, 15 Physics & Math. If 5 take all three, how many take Physics only?",
          options: ["35", "40", "30", "25"],
          answer: "35",
          explanation: "Physics only = Total Physics - (P&C overlap) - (P&M overlap) + (All three) = 70 - 25 - 15 + 5 = 35. Classic 3-circle Venn calculation.",
          difficulty: "Hard"
        }
      ]
    },
    {
      id: "set-demorgan",
      name: "De Morgan's Laws",
      theory: "De Morgan's laws are dual laws relating the intersection and union of sets through packaging variables underneath universal complements. These laws are critical for simplifying hardware boolean expressions.",
      visualExample: "Shaded Venn space representing that the complement of the intersection (everything outside the narrow overlap) is equivalent to the union of the separate complements.",
      formulae: [
        "(A ∪ B)' = A' ∩ B'",
        "(A ∩ B)' = A' ∪ B'"
      ],
      summaryNotes: ["Union flips to intersection under complementation, and vice versa.", "These laws extend to any arbitrary number of sets: (A₁ ∪ A₂ ∪ ... ∪ Aₙ)' = A₁' ∩ A₂' ∩ ... ∩ Aₙ'."],
      commonMistakes: "Writing (A ∪ B)' = A' ∪ B'. Changing the sign is critical! ALWAYS flip the cup: ∪ flips to ∩ and ∩ flips to ∪.",
      pyqs: [
        {
          exam: "GATE CS",
          year: 2020,
          question: "Simplify the logical expression NOT (A AND B) OR NOT (A OR B).",
          solution: "By De Morgan, (A ∩ B)' ∪ (A ∪ B)' = (A ∩ B)' since the intersection's complement is larger than and completely subsumes the union's complement."
        }
      ],
      quizQuestions: [
        {
          id: "sq-dem-1",
          question: "According to De Morgan's Law, (X ∩ Y)' is explicitly equal to which of the following options?",
          options: ["X' ∪ Y'", "X' ∩ Y'", "X' - Y'", "(X' ∪ Y)'"],
          answer: "X' ∪ Y'",
          explanation: "The complement of the intersection is equivalent to the union of the separate complements. The ∩ flips to ∪.",
          difficulty: "Easy"
        },
        {
          id: "sq-dem-2",
          question: "If A and B are disjoint subsets of the universal set U, what can be simplified from (A ∪ B)'?",
          options: ["A' ∩ B'", "U", "Empty Set", "A ∪ B"],
          answer: "A' ∩ B'",
          explanation: "De Morgan's law applies universally to any sets regardless of overlap: (A ∪ B)' = A' ∩ B'.",
          difficulty: "Easy"
        },
        {
          id: "sq-dem-3",
          question: "Under standard set algebra rules, reduce the compound expression [ A ∩ (B ∪ C) ]'.",
          options: [
            "A' ∪ (B' ∩ C')",
            "A' ∩ (B' ∪ C')",
            "A' ∪ B' ∪ C'",
            "(A ∩ B)' ∩ C'"
          ],
          answer: "A' ∪ (B' ∩ C')",
          explanation: "Apply De Morgan to the outer intersection: [A ∩ (B ∪ C)]' = A' ∪ (B ∪ C)'. Applying De Morgan inside the parenthesis yields: A' ∪ (B' ∩ C').",
          difficulty: "Hard"
        },
        {
          id: "sq-dem-4",
          question: "Express the set { x ∈ U | x is not in A and x is not in B } as a single set expression.",
          options: ["(A ∪ B)'", "(A ∩ B)'", "A' ∪ B", "A - B"],
          answer: "(A ∪ B)'",
          explanation: "The condition means the elements are in A' and in B', which is A' ∩ B'. By De Morgan this equals (A ∪ B)'.",
          difficulty: "Medium"
        },
        {
          id: "sq-dem-5",
          question: "What is the complement of the universal set U under De Morgan limits?",
          options: ["∅ (Empty Set)", "U itself", "A ∩ B", "A ∪ B"],
          answer: "∅ (Empty Set)",
          explanation: "The complement of the universal set includes everything not in the universal set, which is absolutely nothing, representing ∅.",
          difficulty: "Easy"
        }
      ]
    },
    {
      id: "set-powers",
      name: "Power Sets",
      theory: "The power set of a set S, denoted P(S), is the set of all subsets of S, including the empty set and S itself. The elements of the power set are themselves sets. Power sets have high exponential cardinality which forms the basis of binary number combinations.",
      visualExample: "If S = {1, 2}. P(S) = { ∅, {1}, {2}, {1, 2} }.",
      formulae: ["Cardinality of P(S) = 2ⁿ where n = |S|"],
      summaryNotes: ["If S is empty, P(S) contains exactly 1 element: { ∅ }.", "The empty set is always a member of the power set.", "S is always a member of P(S)."],
      commonMistakes: "Mistaking subsets for elements. Let S={a}. This means {a} ∈ P(S), whereas a ∉ P(S) (a is an element of S, but a set containing a is an element of the power set). Ensure nested brackets are written properly.",
      pyqs: [
        {
          exam: "NIMCET",
          year: 2023,
          question: "If cardinality of a set S is 3, what is the cardinality of its Power Set?",
          solution: "2³ = 8 elements."
        }
      ],
      quizQuestions: [
        {
          id: "sq-pow-1",
          question: "Let A = {∅}. How many elements are in the Power Set of A?",
          options: ["2", "1", "0", "4"],
          answer: "2",
          explanation: "Set A has exactly 1 element (the empty set). Its power set cardinality is 2¹ = 2, containing { ∅, {∅} }.",
          difficulty: "Easy"
        },
        {
          id: "sq-pow-2",
          question: "Which of the following always holds true for any set S and its power set P(S)?",
          options: [
            "S ∈ P(S) and ∅ ∈ P(S)",
            "S ⊂ P(S) and ∅ ∉ P(S)",
            "S = P(S) under real dimensions",
            "P(S) is always a subset of S"
          ],
          answer: "S ∈ P(S) and ∅ ∈ P(S)",
          explanation: "Since S and ∅ are always subsets of S, they must both be listed as elements (members) in the Power Set P(S). Therefore, they 'belong to' P(S).",
          difficulty: "Medium"
        },
        {
          id: "sq-pow-3",
          question: "If P(A) contains 256 elements, what is the cardinality of the original set A?",
          options: ["8", "7", "6", "9"],
          answer: "8",
          explanation: "We know 2ⁿ = 256. Solving for n gives n = 8.",
          difficulty: "Easy"
        },
        {
          id: "sq-pow-4",
          question: "Find the cardinality of P(P(∅)). (The power set of the power set of empty set).",
          options: ["2", "4", "1", "0"],
          answer: "2",
          explanation: "P(∅) = {∅}, which has N=1 element. The power set of this, P(P(∅)), will contain 2¹ = 2 elements (∅ and {∅}).",
          difficulty: "Medium"
        },
        {
          id: "sq-pow-5",
          question: "If P(A) ∩ P(B) = { ∅, {1} }. What can we confidently say about the intersection A ∩ B?",
          options: ["A ∩ B = {1}", "A ∩ B = ∅", "A ∪ B = {1}", "A and B are equal sets"],
          answer: "A ∩ B = {1}",
          explanation: "The intersection of power sets of A and B is equal to the power set of their intersection: P(A ∩ B) = P(A) ∩ P(B). Thus P(A ∩ B) = {∅, {1}}, which represents the power set of {1}. So A ∩ B = {1}.",
          difficulty: "Hard"
        }
      ]
    }
  ],
  "probability & statistics": [
    {
      id: "prob-conditional",
      name: "Conditional Probability",
      theory: "Conditional probability computes the probability of event A, given that event B has already occurred. It is mathematically formulated as the intersection of both events divided by the probability of the conditioning event. This is the cornerstone of Bayesian probability networks.",
      visualExample: "Venn diagram where the entire sample space shrink from the original box to exclusive circle B. Event A's remaining probability is bounded inside the intersection zone.",
      formulae: ["P(A | B) = P(A ∩ B) / P(B)", "P(A ∩ B) = P(A | B) * P(B)"],
      summaryNotes: ["If A and B are independent events, P(A | B) = P(A) and P(B | A) = P(B).", "Denominator P(B) must be strictly greater than 0."],
      commonMistakes: "Using P(A | B) = P(A)/P(B). This is a fatal misconception. Remember to only analyze the mutual intersection area relative to B.",
      pyqs: [
        {
          exam: "NIMCET",
          year: 2023,
          question: "If P(A) = 0.6, P(B) = 0.4 and P(A ∩ B) = 0.2. What is P(A | B)?",
          solution: "P(A | B) = 0.2 / 0.4 = 0.5."
        }
      ],
      quizQuestions: [
        {
          id: "sq-cond-1",
          question: "A fair die is rolled. Given that the outcome is an even number, find the probability that it is a 6.",
          options: ["1/3", "1/6", "1/2", "2/3"],
          answer: "1/3",
          explanation: "The given conditioning space is Even = {2, 4, 6} (3 cases). The number 6 represents 1 case inside this space. Hence 1/3.",
          difficulty: "Easy"
        },
        {
          id: "sq-cond-2",
          question: "If two events A and B are mutually exclusive, what is P(A | B) equal to? (Assume B is non-empty).",
          options: ["0", "1", "P(A)", "P(A ∩ B)"],
          answer: "0",
          explanation: "Mutually exclusive means they cannot occur together, so P(A ∩ B) = 0. Thus, P(A|B) = 0 / P(B) = 0.",
          difficulty: "Easy"
        },
        {
          id: "sq-cond-3",
          question: "If P(A) = 0.8, P(B) = 0.5, and P(B | A) = 0.4. What is P(A | B)?",
          options: ["0.64", "0.32", "0.40", "0.50"],
          answer: "0.64",
          explanation: "Find P(A ∩ B) = P(B | A) * P(A) = 0.4 * 0.8 = 0.32. Now P(A | B) = P(A ∩ B) / P(B) = 0.32 / 0.5 = 0.64.",
          difficulty: "Medium"
        },
        {
          id: "sq-cond-4",
          question: "Let A and B be independent events with non-zero probability. Which of the following is true?",
          options: [
            "P(A | B) = P(A)",
            "P(A ∩ B) = 0",
            "P(A | B) = P(B)",
            "P(A | B) + P(B | A) = 1"
          ],
          answer: "P(A | B) = P(A)",
          explanation: "Independence means the occurrence of event B has no impact on event A's probability. So P(A | B) = P(A).",
          difficulty: "Medium"
        },
        {
          id: "sq-cond-5",
          question: "A diagnostic clinic tests for a rare syndrome. 1% of population has it. The false positive rate is 5% and true positive sensitivity is 99%. Find the conditional probability of actually having the syndrome given a positive test.",
          options: ["1/6 (approx 16.6%)", "99%", "50%", "1%"],
          answer: "1/6 (approx 16.6%)",
          explanation: "By Bayes: P(Has|+) = [P(+|Has)*P(Has)] / [P(+|Has)*P(Has) + P(+|NoHas)*P(NoHas)] = (0.99 * 0.01) / [(0.99*0.01) + (0.05 * 0.99)] = 0.0099 / (0.0099 + 0.0495) = 0.0099 / 0.0594 = 1/6. Highly counterintuitive medical math!",
          difficulty: "Hard"
        }
      ]
    },
    {
      id: "prob-bayes",
      name: "Baye's Theorem",
      theory: "Bayes' Theorem provides a rigorous mathematical bridge relating conditional probabilities when events must be inverted, updating a priori evidence with diagnostic data. This is utilized in Spam routing, fault diagnostics, and advanced machine learning modeling.",
      visualExample: "A partitioning of sample space S into A₁, A₂, A₃ (hypotheses) with a overlapping event B (evidence) cutting through them.",
      formulae: ["P(Aᵢ | B) = [ P(B | Aᵢ) * P(Aᵢ) ] / Σ [ P(B | Aⱼ) * P(Aⱼ) ]"],
      summaryNotes: ["The denominator represents the Law of Total Probability.", "Prior probability is updated to posterior probability.", "Extremely popular for questions involving double-urn drawing."],
      commonMistakes: "Incorrect tree branching. Ensure that all the sub-branches of conditional options sum to exactly 1.0 at their local forks.",
      pyqs: [
        {
          exam: "NIMCET",
          year: 2024,
          question: "In a factory, machine X produces 60% of parts, and machine Y produces 40%. Machine X has 2% defects, and machine Y has 4% defects. If a part is selected and found defective, what is the probability it came from machine Y?",
          solution: "P(Defect) = 0.60 * 0.02 + 0.40 * 0.04 = 0.012 + 0.016 = 0.028. P(Y | Defect) = (0.40 * 0.04) / 0.028 = 0.016 / 0.028 = 16/28 = 4/7."
        }
      ],
      quizQuestions: [
        {
          id: "sq-bayes-1",
          question: "Three bags contain balls: Bag 1 (3 red, 7 white), Bag 2 (8 red, 2 white). One bag is picked at random. A red ball is drawn. If P(Bag 1 | Red) is wanted, what are the primary hypotheses?",
          options: [
            "Selecting Bag 1 vs Selecting Bag 2",
            "Red ball vs White ball",
            "Ten balls total vs Three red balls",
            "Selecting both bags at the same time"
          ],
          answer: "Selecting Bag 1 vs Selecting Bag 2",
          explanation: "Hypotheses are the mutually exclusive starting partitions. In this case, choosing which bag is the source of the draw: Bag 1 or Bag 2.",
          difficulty: "Easy"
        },
        {
          id: "sq-bayes-2",
          question: "Using the bags from above: Bag 1 (3 Red, 7 White) and Bag 2 (8 Red, 2 White). If a bag is randomly picked and a ball drawn is found to be Red, what is the exact probability that it came from Bag 1?",
          options: ["3/11", "3/10", "4/5", "3/8"],
          answer: "3/11",
          explanation: "P(Bag 1) = P(Bag 2) = 0.5. P(Red|B1) = 3/10 = 0.3. P(Red|B2) = 8/10 = 0.8. Total probability P(Red) = 0.5*0.3 + 0.5*0.8 = 0.55. P(B1|Red) = (0.5 * 0.3) / 0.55 = 15/55 = 3/11.",
          difficulty: "Medium"
        },
        {
          id: "sq-bayes-3",
          question: "A person speaks truth in 3 out of 4 cases. He throws a standard die and reports that it is a 6. What is the probability that it is actually a 6?",
          options: ["3/8", "1/6", "3/4", "3/24"],
          answer: "3/8",
          explanation: "Let T = speaks truth, A = reports 6, S = actual 6. P(S) = 1/6, P(S') = 5/6. P(A|S) = P(T) = 3/4. P(A|S') = P(Lies) = 1/4. P(Actual 6|Reports 6) = [(3/4)*(1/6)] / [(3/4)*(1/6) + (1/4)*(5/6)] = (3/24) / [3/24 + 5/24] = 3/8. Mind-bending math classic!",
          difficulty: "Hard"
        },
        {
          id: "sq-bayes-4",
          question: "Which of the following describes the denominator in Bayes formulation?",
          options: [
            "Total Probability of the evidence occurrence",
            "Prior probability of the hypothesis",
            "Joint probability of prior and posterior",
            "Conditional variance of the sampling distribution"
          ],
          answer: "Total Probability of the evidence occurrence",
          explanation: "The denominator sum Σ P(B|Aⱼ) * P(Aⱼ) represents the total consolidated probability of the evidence event B.",
          difficulty: "Medium"
        },
        {
          id: "sq-bayes-5",
          question: "If P(A) = 0.3, P(B|A) = 0.6, and P(B|A') = 0.4. What is the total probability P(B)?",
          options: ["0.46", "0.50", "0.18", "0.28"],
          answer: "0.46",
          explanation: "P(B) = P(B|A)*P(A) + P(B|A')*P(A') = 0.6*0.3 + 0.4*(1 - 0.3) = 0.18 + 0.4*0.7 = 0.18 + 0.28 = 0.46.",
          difficulty: "Easy"
        }
      ]
    }
  ],
  "database management system (dbms)": [
    {
      id: "dbms-normal",
      name: "Database Normalization",
      theory: "DBMS Normalization is the mathematical process of decomposing database schemas to secure them from write, insert and delete anomalies. Normal forms (1NF, 2NF, 3NF, BCNF, 4NF) provide progressively rising tiers of structural purity by evaluating Functional Dependencies (FDs).",
      visualExample: "A giant unnormalized spreadsheet table broken down via primary keys into three clean relational tables: Users, Orders, and OrderItems.",
      formulae: [
        "A Functional Dependency X ➔ Y holds if for any two rows where X₁ = X₂, we must have Y₁ = Y₂.",
        "To check 3NF: For X ➔ Y, either X is a superkey, or Y is a prime attribute."
      ],
      summaryNotes: ["1NF demands atomic values only (no lists or objects in cells).", "2NF bans partial keys dependency (non-prime elements must depend on the complete Candidate Key).", "BCNF is strictly stronger than 3NF: determinant must be a Super Key."],
      commonMistakes: "Mistaking a non-prime attribute for a candidate key. Before doing any normalization analysis, ALWAYS compute attribute closures (e.g. X⁺) to find the primary candidate keys.",
      pyqs: [
        {
          exam: "GATE CS",
          year: 2021,
          question: "Let relation R(A, B, C, D) have FDs: A ➔ B and B ➔ C. What is the candidate key?",
          solution: "Computing closures: (AD)⁺ = {A,D,B,C} which is the entire relation. Since no other subset covers everything, AD is the single Candidate Key."
        }
      ],
      quizQuestions: [
        {
          id: "sq-norm-1",
          question: "Which of the normal forms is specifically designed to eliminate transitive functional dependency?",
          options: ["Third Normal Form (3NF)", "Second Normal Form (2NF)", "First Normal Form (1NF)", "Boyce-Codd Normal Form (BCNF)"],
          answer: "Third Normal Form (3NF)",
          explanation: "3NF is defined precisely to forbid transitive dependencies where non-prime attributes depend on other non-prime attributes.",
          difficulty: "Easy"
        },
        {
          id: "sq-norm-2",
          question: "A relation R(A, B) contains a single functional dependency A ➔ B. If A is NOT a superkey, which normal form does it violate?",
          options: ["Boyce-Codd Normal Form (BCNF)", "First Normal Form Only", "Second Normal Form ONLY", "None, it is perfectly in BCNF"],
          answer: "Boyce-Codd Normal Form (BCNF)",
          explanation: "Under BCNF, for any non-trivial functional dependency X ➔ Y, the determinant X must strictly be a superkey. Since A is not, it violates BCNF.",
          difficulty: "Medium"
        },
        {
          id: "sq-norm-3",
          question: "What does it mean for an attribute to be a 'prime attribute' under database axioms?",
          options: [
            "It is member of some Candidate Key of the relation",
            "It has prime integer primary keys",
            "It cannot be set to NULL value",
            "It cannot be updated once inserted"
          ],
          answer: "It is member of some Candidate Key of the relation",
          explanation: "A prime attribute is defined precisely as any attribute that forms a part of any candidate key.",
          difficulty: "Easy"
        },
        {
          id: "sq-norm-4",
          question: "Let R(A, B, C, D) have FDs: AB ➔ C, C ➔ D, D ➔ A. What is the complete set of candidate keys?",
          options: ["{AB, BC, BD}", "{AB, BC}", "{AB, CD}", "{AB, BC, CD, AD}"],
          answer: "{AB, BC, BD}",
          explanation: "(AB)⁺ = {A,B,C,D}. Since AB is a key, and we have C ➔ D and D ➔ A, we can replace A in AB. Let's check BC closure: (BC)⁺ = {B,C,D,A} so BC is a key. Let's check BD closure: (BD)⁺ = {B,D,A,C} so BD is also a candidate key. This yields {AB, BC, BD}.",
          difficulty: "Hard"
        },
        {
          id: "sq-norm-5",
          question: "If a database table is decomposed to satisfy BCNF criteria, which feature might occasionally be lost as a trade-off?",
          options: ["Dependency Preservation", "Lossless Join capability", "Data atomicity", "Index references"],
          answer: "Dependency Preservation",
          explanation: "BCNF decomposition is guaranteed to be lossless-join, but it may not always preserve all original functional dependencies. 3NF guarantees both.",
          difficulty: "Medium"
        }
      ]
    }
  ]
};

export const DEFAULT_SUBTOPICS_FALLBACK = (topicName: string): DetailedSubtopic[] => [
  {
    id: `sub-${topicName.replace(/\s+/g, '-').toLowerCase()}-1`,
    name: `Overview of ${topicName}`,
    theory: `This subtopic covers the foundational concepts, definitions, and scope of ${topicName} for computer science, mathematics, and quantitative logical exam streams. Mastery of this domain requires targeted practice.`,
    visualExample: `A mental conceptual model dividing the study domain of ${topicName} into major sections containing specific test indices.`,
    formulae: [`Study Time > 2 Hours per day`, `Success Probability = Quant + Practice`],
    summaryNotes: ["Focus on understanding basic definitions first.", "Identify repeating themes in earlier competitive papers.", "Do active recall of formula sets daily."],
    commonMistakes: "Underestimating basic conceptual limits and jumping directly to complex questions without formula recall.",
    pyqs: [
      {
        exam: "NIMCET",
        year: 2024,
        question: `Discuss the structural configuration of any standard question framed under ${topicName}.`,
        solution: "Analyze boundaries, verify assumptions, apply respective formulas, and eliminate choices."
      }
    ],
    quizQuestions: [
      {
        id: `q-fallback-1`,
        question: `What is the most recommended starting action when solving a complex problem in ${topicName}?`,
        options: [
          "Carefully identify all known parameters and bound constraints",
          "Immediately pick option (C) as it is statistically the most common answer",
          "Attempt to write a long proof without looking at the choices",
          "Skip the question immediately to save time regardless of points"
        ],
        answer: "Carefully identify all known parameters and bound constraints",
        explanation: "Pristine academic methodology: Starting with known terms prevents silly mistakes and misaligning formulas.",
        difficulty: "Easy"
      },
      {
        id: `q-fallback-2`,
        question: "How does active recall benefit memory retention compared to passive reading?",
        options: [
          "It forces neural retrieval of info, solidifying retention links",
          "It makes studying slower and less productive",
          "It is only useful for history students, not math or computer CS",
          "It causes faster brain fatigue and should be avoided entirely"
        ],
        answer: "It forces neural retrieval of info, solidifying retention links",
        explanation: "Cognitive science shows that actively querying the mind makes memory structures significantly more resilient.",
        difficulty: "Medium"
      },
      {
        id: `q-fallback-3`,
        question: "Why should we avoid double-counting in set intersections?",
        options: [
          "It artificially inflates the resulting cardinality index",
          "It is mathematically illegal only under binary structures",
          "Venn diagrams do not allow circles to overlap unless numbers are prime",
          "It violates standard hardware memory limits"
        ],
        answer: "It artificially inflates the resulting cardinality index",
        explanation: "Failing to subtract the intersection means items contained in both sets are wrongly counted twice.",
        difficulty: "Easy"
      },
      {
        id: `q-fallback-4`,
        question: "Under standard competitive exams, what is the best strategy to manage limited time?",
        options: [
          "Divide time by allocating fixed seconds to each question, logging errors for later",
          "Spend 20 minutes on the first question to build total confidence",
          "Select randomly for all questions and sleep for the remaining duration",
          "Never read the final paragraph of lengthy English questions"
        ],
        answer: "Divide time by allocating fixed seconds to each question, logging errors for later",
        explanation: "Disciplined time allocation ensures you scan every solvable question instead of getting bottlenecked.",
        difficulty: "Medium"
      },
      {
        id: `q-fallback-5`,
        question: "What represents high academic rigor during study prep?",
        options: [
          "Rigorously analyzing one's mistakes in mock tests and logging those in an error diary",
          "Reading a textbook page 100 times without ever solving any MCQs",
          "Believing that you know everything instinctively without testing",
          "Relying solely on external playlists without writing any personal shortcuts"
        ],
        answer: "Rigorously analyzing one's mistakes in mock tests and logging those in an error diary",
        explanation: "Consistently correcting personal weak spots is the single most verified way to boost competitive accuracy.",
        difficulty: "Hard"
      }
    ]
  }
];

export function getDetailedSubtopics(topicName: string): DetailedSubtopic[] {
  const normName = topicName.toLowerCase().trim();
  if (TOPIC_SUBTOPICS_DB[normName]) {
    return TOPIC_SUBTOPICS_DB[normName];
  }
  
  // Fuzzy checks
  for (const key of Object.keys(TOPIC_SUBTOPICS_DB)) {
    if (normName.includes(key) || key.includes(normName)) {
      return TOPIC_SUBTOPICS_DB[key];
    }
  }
  
  return DEFAULT_SUBTOPICS_FALLBACK(topicName);
}
