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
    throw new Error("Failed to parse LLM plan JSON");
  }

  return {
    studentId: input.student.id,
    durationWeeks: input.durationWeeks,
    overallGoal: parsed.overallGoal,
    segments: parsed.segments,
    notesForTeacher: parsed.notesForTeacher,
  };
}


