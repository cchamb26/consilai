import { PlanGenerationInput } from "../models/types";

export function buildShortPlanPrompt(input: PlanGenerationInput): string {
  const { student, research, durationWeeks } = input;

  const researchText =
    research.length === 0
      ? "None (use general evidence-based best practices only)."
      : research
          .map((r, idx) => {
            return `Research #${idx + 1}
Title: ${r.title}
Source: ${r.source}
Summary: ${r.summary}
Tags: ${r.tags.join(", ")}`;
          })
          .join("\n\n");

  return `
You are an expert instructional coach.

Goal:
Create a SHORT, highly actionable plan for ONLY ${durationWeeks} weeks
for the following student. The school year is limited, so plans must be
tested in short iterations and then adjusted.

Student profile:
- Name: ${student.name}
- Grade: ${student.grade}
- Issues: ${student.issues.join("; ")}
- Strengths: ${student.strengths.join("; ")}
- Goals: ${student.goals.join("; ")}
- Context notes: ${student.contextNotes ?? "None"}

Relevant research insights:
${researchText}

Output a JSON object with this shape:

{
  "overallGoal": string,
  "segments": [
    {
      "weekLabel": "Weeks 1–2",
      "focus": string,
      "teacherActions": string[],
      "studentActions": string[],
      "checkIns": string[]
    }
  ],
  "notesForTeacher": string
}

Constraints:
- Duration MUST be ${durationWeeks} weeks.
- Keep the plan concise and easy to read for a busy teacher.
- Focus on strategies that can be evaluated within this ${durationWeeks}-week window.
- Do NOT include any explanation outside the JSON.
`;
}


