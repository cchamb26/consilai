import { NextResponse } from 'next/server';
import { generateShortTermPlanWithScraper } from '../../../../packages/ai/dist/index.js';

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

    const plan = await generateShortTermPlanWithScraper({
      student: studentProfile,
      durationWeeks,
    });

    return NextResponse.json({ plan });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[api/generate-plan] Error:', err);
    return NextResponse.json(
      { error: 'Failed to generate plan' },
      { status: 500 },
    );
  }
}


