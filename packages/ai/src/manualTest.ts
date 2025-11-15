import {
    generateShortTermPlanWithScraper,
    StudentProfile,
  } from "./index";
  
  async function main() {
    const student: StudentProfile = {
      id: "s1",
      name: "Jane Doe",
      grade: "5",
      issues: ["difficulty focusing in class"],
      strengths: ["strong verbal reasoning"],
      goals: ["improve sustained attention during independent work"],
      contextNotes:
        "Often distracted by peers; works better in small groups.",
    };
  
    const plan = await generateShortTermPlanWithScraper({
      student,
      durationWeeks: 3,
    });
  
    console.log(JSON.stringify(plan, null, 2));
  }
  
  main().catch((err) => {
    console.error("Error in manual test:", err);
    process.exit(1);
  });