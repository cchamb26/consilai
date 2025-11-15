import { KeywordSet, StudentProfile } from "./models/types";

type IssueExpansion = {
  /**
   * Canonical label used in inferredIssues.
   */
  label: string;
  /**
   * Seed/base keywords that directly represent this issue.
   */
  baseKeywords: string[];
  /**
   * Deterministic expansions: synonyms, symptom descriptions,
   * teacher-note style phrases, educational/SPED/SEL terminology.
   * All values should be lower-case for matching.
   */
  phrasePatterns: string[];
  /**
   * Expanded keyword set to expose to downstream consumers
   * when this issue is inferred.
   */
  expandedKeywords: string[];
};

const ISSUE_EXPANSIONS: IssueExpansion[] = [
  {
    label: "dyslexia",
    baseKeywords: ["dyslexia"],
    phrasePatterns: [
      "trouble decoding words",
      "slow reading",
      "slow reader",
      "avoids reading",
      "avoids reading aloud",
      "mixes up letters",
      "letter reversals",
      "difficulty with phonics",
      "phonics difficulty",
      "reading comprehension issues",
      "reading comprehension difficulty",
      "reads below grade level",
      "reading below grade level",
      "reading difficulty",
    ],
    expandedKeywords: [
      "dyslexia",
      "reading difficulty",
      "reading disorder",
      "decoding difficulty",
      "phonics difficulty",
      "reading comprehension difficulty",
      "below-grade-level reading",
      "letter reversals",
    ],
  },
  {
    label: "dyscalculia",
    baseKeywords: ["dyscalculia"],
    phrasePatterns: [
      "math difficulty",
      "difficulty with math facts",
      "trouble with basic math",
      "struggles with numbers",
      "counting errors",
      "trouble learning multiplication tables",
      "confuses math symbols",
    ],
    expandedKeywords: [
      "dyscalculia",
      "math difficulty",
      "math learning difficulty",
      "number sense difficulty",
      "calculation difficulty",
    ],
  },
  {
    label: "dysgraphia",
    baseKeywords: ["dysgraphia"],
    phrasePatterns: [
      "writing difficulty",
      "messy handwriting",
      "illegible handwriting",
      "slow writing",
      "trouble getting thoughts on paper",
      "difficulty copying from board",
    ],
    expandedKeywords: [
      "dysgraphia",
      "writing difficulty",
      "handwriting difficulty",
      "written expression difficulty",
    ],
  },
  {
    label: "adhd",
    baseKeywords: ["adhd", "attention deficit"],
    phrasePatterns: [
      "attention issues",
      "easily distracted",
      "fidgeting",
      "off-task frequently",
      "off task frequently",
      "incomplete work",
      "trouble starting tasks",
      "difficulty starting tasks",
      "impulsive comments",
      "impulsive behavior",
      "needs repeated reminders",
      "needs frequent reminders",
      "difficulty focusing",
      "difficulty staying on task",
    ],
    expandedKeywords: [
      "adhd",
      "attention difficulty",
      "attention issues",
      "inattention",
      "hyperactivity",
      "impulsivity",
      "off-task behavior",
      "needs frequent redirection",
    ],
  },
  {
    label: "anxiety",
    baseKeywords: ["anxiety"],
    phrasePatterns: [
      "test panic",
      "test anxiety",
      "avoids class participation",
      "avoids participation",
      "shutdowns",
      "shuts down",
      "stomach aches before class",
      "stomachache before class",
      "freezes when asked questions",
      "freezes when called on",
      "perfectionism that prevents starting",
      "perfectionism",
      "overly worried about grades",
    ],
    expandedKeywords: [
      "anxiety",
      "test anxiety",
      "performance anxiety",
      "school-related anxiety",
      "avoidance behavior",
      "perfectionism",
    ],
  },
  {
    label: "executive_dysfunction",
    baseKeywords: ["executive dysfunction", "executive functioning issues"],
    phrasePatterns: [
      "loses materials",
      "loses homework",
      "misses deadlines",
      "missing assignments",
      "poor organization",
      "disorganized binder",
      "disorganized backpack",
      "disorganized locker",
      "can't plan steps",
      "cannot plan steps",
      "forgets instructions quickly",
      "forgets directions quickly",
      "overwhelmed by multi-step tasks",
      "overwhelmed by multistep tasks",
    ],
    expandedKeywords: [
      "executive dysfunction",
      "executive functioning difficulty",
      "organization difficulty",
      "planning difficulty",
      "task initiation difficulty",
      "time management difficulty",
    ],
  },
  {
    label: "sensory_processing",
    baseKeywords: ["sensory processing issues", "sensory overload"],
    phrasePatterns: [
      "sensory overload",
      "bothered by noise",
      "bothered by lights",
      "covers ears",
      "avoids crowded spaces",
      "overwhelmed by noise",
      "sensitive to textures",
    ],
    expandedKeywords: [
      "sensory processing difficulty",
      "sensory overload",
      "noise sensitivity",
      "sensory sensitivity",
    ],
  },
  {
    label: "vision_hearing_impairment",
    baseKeywords: ["vision impairment", "hearing impairment"],
    phrasePatterns: [
      "trouble seeing the board",
      "sits close to the board",
      "turns head to hear",
      "asks for repetition frequently",
      "frequently asks to repeat instructions",
    ],
    expandedKeywords: [
      "vision impairment",
      "hearing impairment",
      "low vision",
      "hearing difficulty",
    ],
  },
  {
    label: "speech_language",
    baseKeywords: ["speech delay", "language delay"],
    phrasePatterns: [
      "speech delay",
      "language delay",
      "difficulty expressing ideas",
      "struggles expressing ideas clearly",
      "limited vocabulary",
      "slow to respond verbally",
    ],
    expandedKeywords: [
      "speech difficulty",
      "language difficulty",
      "expressive language difficulty",
      "receptive language difficulty",
    ],
  },
  {
    label: "esl_ell",
    baseKeywords: ["esl", "ell", "english learner"],
    phrasePatterns: [
      "limited vocabulary",
      "pauses before answering",
      "asks to repeat instructions",
      "misunderstands complex sentences",
      "struggles expressing ideas clearly",
      "new to english",
    ],
    expandedKeywords: [
      "esl",
      "ell",
      "english language learner",
      "language support needed",
      "academic language difficulty",
    ],
  },
  {
    label: "chronic_health",
    baseKeywords: ["chronic illness", "chronic health"],
    phrasePatterns: [
      "chronic illness",
      "fatigue",
      "frequent absences",
      "misses school for medical reasons",
      "low energy in class",
    ],
    expandedKeywords: [
      "chronic illness",
      "health-related absences",
      "fatigue",
    ],
  },
  {
    label: "behavior_support",
    baseKeywords: ["behavior plan", "behavior support"],
    phrasePatterns: [
      "behavior plan",
      "redirection",
      "needs frequent redirection",
      "de-escalation",
      "escalates quickly",
      "behavior incidents",
    ],
    expandedKeywords: [
      "behavior support",
      "behavior intervention plan",
      "redirection strategies",
      "de-escalation strategies",
    ],
  },
];

export function extractStudentKeywords(student: StudentProfile): KeywordSet {
  const fullText = [
    ...student.issues,
    ...student.strengths,
    ...student.goals,
    student.contextNotes ?? "",
  ]
    .join(" ")
    .toLowerCase();

  const expandedKeywords = new Set<string>();
  const matchedPatterns = new Set<string>();
  const inferredIssues = new Set<string>();

  const textIncludes = (needle: string): boolean =>
    fullText.includes(needle.toLowerCase());

  for (const issue of ISSUE_EXPANSIONS) {
    let matched = false;

    // Check base keywords directly.
    for (const base of issue.baseKeywords) {
      if (textIncludes(base)) {
        matched = true;
        matchedPatterns.add(base);
      }
    }

    // Check phrase patterns (symptoms, teacher-note phrases, etc.).
    for (const phrase of issue.phrasePatterns) {
      if (textIncludes(phrase)) {
        matched = true;
        matchedPatterns.add(phrase);
      }
    }

    if (matched) {
      inferredIssues.add(issue.label);
      issue.expandedKeywords.forEach((kw) => expandedKeywords.add(kw));
      issue.baseKeywords.forEach((kw) => expandedKeywords.add(kw));
    }
  }

  return {
    expandedKeywords: Array.from(expandedKeywords),
    matchedPatterns: Array.from(matchedPatterns),
    inferredIssues: Array.from(inferredIssues),
  };
}

