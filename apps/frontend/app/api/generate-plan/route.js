import { NextResponse } from 'next/server';
import {
  fetchResearchForStudent,
  generateShortTermPlan,
} from '../../../../../packages/ai/src/index';

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      student,
      customInstructions = '',
      durationWeeks = 3,
    } = body || {};

    if (!student || !student.id) {
      return NextResponse.json(
        { error: 'Missing or invalid student payload' },
        { status: 400 },
      );
    }

    const toArray = (value) => {
      if (!value) return [];
      if (Array.isArray(value)) return value;
      return [value];
    };

    const studentProfile = {
      id: String(student.id),
      name: student.name || 'Unnamed student',
      grade: student.grade || '',
      issues: toArray(student.issues),
      strengths: toArray(student.strengths),
      goals: toArray(student.goals),
      contextNotes: [
        student.behavioral_notes || '',
        customInstructions || '',
      ]
        .filter(Boolean)
        .join(' '),
    };

    const research = await fetchResearchForStudent(studentProfile);

    const plan = await generateShortTermPlan({
      student: studentProfile,
      research,
      durationWeeks,
    });

    const sources = research
      .filter((snippet) => snippet && snippet.url && snippet.url.length > 0)
      .map((snippet) => ({
        title: snippet.title,
        url: snippet.url,
        source: snippet.source,
      }));

    return NextResponse.json({ plan, sources });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[api/generate-plan] Error:', err);
    return NextResponse.json(
      { error: 'Failed to generate plan' },
      { status: 500 },
    );
  }
}


