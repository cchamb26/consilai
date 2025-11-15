'use client';

import { useState } from 'react';
import Button from '../../components/Button';
import Textarea from '../../components/Textarea';
import PlanResultCard from '../../components/PlanResultCard';
import { mockStudents, mockPlans } from '../../lib/mockData';
import { ProtectedRoute } from '../../lib/ProtectedRoute';

export default function PlansPage() {
  const [selectedStudent, setSelectedStudent] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const student = mockStudents.find(s => s.id === selectedStudent);

  const handleGenerate = async () => {
    if (!selectedStudent) {
      alert('Please select a student');
      return;
    }

    setIsGenerating(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockGeneratedPlan = {
        id: Date.now(),
        studentId: selectedStudent,
        title: 'Personalized Learning Plan',
        objectives: `This plan focuses on developing ${student.strengths[0]} while addressing ${student.issues[0]}. The curriculum automatically incorporates backend research summaries and personalized strategies tailored to ${student.name}'s unique profile.`,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'Generated',
        milestones: [
          `Week 1-2: Assess current baseline for "${student.issues[0]}"`,
          `Week 3-4: Implement peer mentoring sessions leveraging "${student.strengths[0]}"`,
          `Week 5-8: Progressive skill building with weekly check-ins`,
          `Week 9-12: Evaluation and plan refinement based on progress`,
          `Celebrate progress and plan next phases`,
        ],
      };

      setGeneratedPlan(mockGeneratedPlan);
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-950 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 space-y-3">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Plans</p>
          <h1 className="text-4xl font-semibold text-white">🤖 AI Plan Generator</h1>
          <p className="text-slate-400 text-lg">
            Generate personalized learning plans powered by AI and backend-curated research—no uploads or manual inputs needed.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Form */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
            <h2 className="text-2xl font-semibold text-white mb-2">Plan Parameters</h2>
            <p className="text-sm text-slate-400 mb-6">
              After you complete a student profile, ConsilAI automatically extracts key terms, scrapes relevant research, and summarizes findings in the backend. Select a student below and optionally add any extra instructions.
            </p>

            <div className="space-y-6">
              {/* Student Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Select Student *
                </label>
                <select
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className="w-full px-4 py-2 border border-white/10 rounded-lg bg-slate-900 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Choose a student...</option>
                  {mockStudents.map(student => (
                    <option key={student.id} value={student.id}>
                      {student.name} - {student.grade}
                    </option>
                  ))}
                </select>
              </div>

              {/* Custom Prompt */}
              <Textarea
                label="Custom Instructions (Optional)"
                placeholder="Add any specific requirements or focus areas for the plan..."
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                rows={4}
              />

              {/* Generate Button */}
              <Button
                variant="primary"
                size="lg"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? '⏳ Generating...' : '✨ Generate Plan'}
              </Button>

              {/* Tips */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="font-semibold text-white text-sm mb-2">💡 Tips</p>
                <ul className="text-xs text-slate-400 space-y-1">
                  <li>• AI considers student issues, strengths, and goals</li>
                  <li>• Backend research scraping runs automatically per student</li>
                  <li>• Plans are 90 days with weekly milestones</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right: Result Preview */}
          <div>
            {generatedPlan ? (
              <>
                <PlanResultCard
                  plan={generatedPlan}
                  studentName={student?.name || 'Selected Student'}
                />
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => setGeneratedPlan(null)}
                  className="w-full mt-4"
                >
                  Generate Another Plan
                </Button>
              </>
            ) : (
              <div className="rounded-3xl border border-dashed border-white/15 bg-white/5 p-12 h-full flex flex-col items-center justify-center text-center">
                <span className="text-6xl mb-4">📋</span>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {selectedStudent ? 'Ready to Generate' : 'Select a Student'}
                </h3>
                <p className="text-slate-400 text-sm max-w-sm">
                  {selectedStudent
                    ? 'Click "Generate Plan" to create a personalized learning plan powered by AI.'
                    : 'Choose a student from the form to generate their personalized learning plan.'
                  }
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Example Plans Section */}
        <div className="mt-14">
          <h2 className="text-2xl font-semibold text-white mb-6">📚 Example Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockPlans.map(plan => (
              <div key={plan.id} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="font-semibold text-white mb-2">{plan.title}</h3>
                <p className="text-sm text-slate-400 mb-4">{plan.objectives}</p>
                <div className="flex items-center justify-between text-xs text-slate-500 uppercase tracking-wide">
                  <span>
                    {plan.startDate} — {plan.endDate}
                  </span>
                  <span className="text-amber-300">{plan.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>
    </ProtectedRoute>
  );
}

