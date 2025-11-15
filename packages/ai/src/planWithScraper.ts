import {
  PlanGenerationInput,
  ShortTermPlan,
  StudentProfile,
} from "./models/types";
import { fetchResearchForStudent } from "./researchFetcher";
import { generateShortTermPlan } from "./planGenerator";

export type ScrapedPlanInput = Omit<PlanGenerationInput, "research"> & {
  student: StudentProfile;
};

/**
 * Convenience helper that:
 * - uses the deterministic keyword extractor to build a search query,
 * - calls the Python scraper to fetch research,
 * - and then calls the core generateShortTermPlan helper.
 */
export async function generateShortTermPlanWithScraper(
  input: ScrapedPlanInput,
): Promise<ShortTermPlan> {
  const research = await fetchResearchForStudent(input.student);

  return generateShortTermPlan({
    ...input,
    research,
  });
}


