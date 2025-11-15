export type StudentProfile = {
  id: string;
  name: string;
  grade: string;
  issues: string[];
  strengths: string[];
  goals: string[];
  contextNotes?: string;
};

export type KeywordSet = {
  topics: string[];
  skills: string[];
  behaviors: string[];
  constraints: string[];
};

export type ResearchSnippet = {
  id: string;
  title: string;
  source: string;
  url?: string;
  abstract: string;
  summary: string;
  tags: string[];
  relevanceScore?: number;
};

export type PlanWeekSegment = {
  weekLabel: string; // e.g. "Weeks 1–2"
  focus: string;
  teacherActions: string[];
  studentActions: string[];
  checkIns: string[];
};

export type ShortTermPlan = {
  studentId: string;
  durationWeeks: 2 | 3;
  overallGoal: string;
  segments: PlanWeekSegment[];
  notesForTeacher: string;
};

export type PlanGenerationInput = {
  student: StudentProfile;
  research: ResearchSnippet[];
  durationWeeks: 2 | 3;
};


