import { callLLM } from "./llmClient";
import { buildShortPlanPrompt } from "./prompts/shortPlanPrompt";
import { PlanGenerationInput, ShortTermPlan } from "./models/types";

export async function generateShortTermPlan(
  input: PlanGenerationInput,
): Promise<ShortTermPlan> {
  const prompt = buildShortPlanPrompt(input);
  const raw = await callLLM(prompt);

  let parsed: any;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    // Fallback: try to extract the JSON object from within extra text.
    const firstBrace = raw.indexOf("{");
    const lastBrace = raw.lastIndexOf("}");

    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      const candidate = raw.slice(firstBrace, lastBrace + 1);
      try {
        parsed = JSON.parse(candidate);
      } catch (innerError) {
        // eslint-disable-next-line no-console
        console.error(
          "[ai] Failed to parse LLM plan JSON. Raw output:",
          raw,
        );
        throw new Error("Failed to parse LLM plan JSON");
      }
    } else {
      // eslint-disable-next-line no-console
      console.error("[ai] No JSON object found in LLM output:", raw);
      throw new Error("Failed to parse LLM plan JSON");
    }
  }

  return {
    studentId: input.student.id,
    durationWeeks: input.durationWeeks,
    overallGoal: parsed.overallGoal,
    segments: parsed.segments,
    notesForTeacher: parsed.notesForTeacher,
  };
}


