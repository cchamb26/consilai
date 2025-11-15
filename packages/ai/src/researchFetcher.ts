import { spawn } from "child_process";
import path from "path";
import { KeywordSet, ResearchSnippet, StudentProfile } from "./models/types";
import { extractStudentKeywords } from "./keywordExtractor";

function buildQueryFromKeywords(
  student: StudentProfile,
  keywords: KeywordSet,
): string {
  const baseTerms =
    keywords.expandedKeywords.length > 0
      ? keywords.expandedKeywords
      : [...student.issues, ...student.goals, ...(student.strengths || [])];

  const uniqueTerms = Array.from(
    new Set(
      baseTerms
        .map((t) => t.trim())
        .filter((t) => t.length > 0)
        .slice(0, 8),
    ),
  );

  if (uniqueTerms.length === 0) {
    return `${student.grade} classroom intervention special education`;
  }

  return uniqueTerms.join(" ");
}

export async function fetchResearchForStudent(
  student: StudentProfile,
): Promise<ResearchSnippet[]> {
  const keywords = extractStudentKeywords(student);
  const query = buildQueryFromKeywords(student, keywords);

  const scriptPath = path.resolve(
    __dirname,
    "../../scraper/src/scrapers/scraper.py",
  );

  return new Promise<ResearchSnippet[]>((resolve, reject) => {
    const proc = spawn("python", [scriptPath, query], {
      stdio: ["ignore", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";

    proc.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });

    proc.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    proc.on("close", (code) => {
      if (code !== 0) {
        return reject(
          new Error(
            `scraper exited with code ${code ?? "unknown"}: ${stderr || ""}`,
          ),
        );
      }
      try {
        const parsed = JSON.parse(stdout) as ResearchSnippet[];
        resolve(parsed);
      } catch (err) {
        reject(
          new Error(
            `Failed to parse scraper output as ResearchSnippet[]: ${String(
              err,
            )}`,
          ),
        );
      }
    });
  });
}


