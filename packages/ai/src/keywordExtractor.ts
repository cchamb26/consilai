import { KeywordSet, StudentProfile } from "./models/types";

export function extractStudentKeywords(student: StudentProfile): KeywordSet {
  const text = [
    ...student.issues,
    ...student.strengths,
    ...student.goals,
    student.contextNotes ?? "",
  ]
    .join(" ")
    .toLowerCase();

  const topics: string[] = [];
  const skills: string[] = [];
  const behaviors: string[] = [];
  const constraints: string[] = [];

  const pushIfFound = (needle: string, bucket: string[]) => {
    if (text.includes(needle.toLowerCase())) {
      bucket.push(needle);
    }
  };

  // Example heuristic keywords — extend as needed.
  pushIfFound("reading", topics);
  pushIfFound("math", topics);
  pushIfFound("writing", topics);
  pushIfFound("science", topics);

  pushIfFound("anxiety", behaviors);
  pushIfFound("focus", behaviors);
  pushIfFound("disruptive", behaviors);
  pushIfFound("participation", behaviors);

  pushIfFound("collaboration", skills);
  pushIfFound("confidence", skills);
  pushIfFound("leadership", skills);
  pushIfFound("organization", skills);

  pushIfFound("time", constraints);
  pushIfFound("schedule", constraints);
  pushIfFound("resources", constraints);

  return { topics, skills, behaviors, constraints };
}


