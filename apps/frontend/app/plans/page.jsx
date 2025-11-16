'use client';

import { useState, useEffect } from 'react';
import Button from '../../components/Button';
import Textarea from '../../components/Textarea';
import PlanResultCard from '../../components/PlanResultCard';
import { mockPlans } from '../../lib/mockData';
import { ProtectedRoute } from '../../lib/ProtectedRoute';
import { getSupabaseClient } from '../../lib/supabaseClient';

export default function PlansPage() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSavingPlan, setIsSavingPlan] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [studentError, setStudentError] = useState(null);

  const student = students.find((s) => s.id === selectedStudent);

  // Fetch students for the current teacher from Supabase
  useEffect(() => {
    const supabase = getSupabaseClient();

    const fetchStudents = async () => {
      setLoadingStudents(true);
      try {
        const { data, error } = await supabase
          .from('teacher_students')
          .select('*')
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Error fetching students for plans:', error);
          setStudentError('Failed to load students');
          setStudents([]);
        } else {
          setStudents(data || []);
          setStudentError(null);
        }
      } catch (err) {
        console.error('Unexpected error fetching students for plans:', err);
        setStudentError('Failed to load students');
        setStudents([]);
      } finally {
        setLoadingStudents(false);
      }
    };

    fetchStudents();

    // Optional: listen for real-time student changes so the list updates
    const channel = supabase
      .channel('plans-students-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'students' },
        () => {
          fetchStudents();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleGenerate = async () => {
    if (!selectedStudent) {
      alert('Please select a student');
      return;
    }

    if (!student) {
      alert('Selected student could not be loaded. Please try again.');
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          student,
          customInstructions: customPrompt,
          durationWeeks: 3,
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error('Plan generation failed:', response.status, text);
        alert('Failed to generate plan. Please try again.');
        return;
      }

      const { plan, sources } = await response.json();

      const aiGeneratedPlan = {
        id: Date.now(),
        studentId: plan.studentId,
        studentName: student.name,
        title: 'Personalized Learning Plan',
        objectives: plan.overallGoal,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(
          Date.now() + plan.durationWeeks * 7 * 24 * 60 * 60 * 1000,
        )
          .toISOString()
          .split('T')[0],
        status: 'Generated',
        milestones: Array.isArray(plan.segments)
          ? plan.segments.map((seg, index) => {
              const teacherSteps = Array.isArray(seg.teacherActions)
                ? seg.teacherActions.filter(Boolean)
                : [];

              const details =
                teacherSteps.length >= 3
                  ? teacherSteps.slice(0, 6)
                  : teacherSteps;

              return {
                title: `${seg.weekLabel}: ${seg.focus}`,
                details,
                _segmentIndex: index,
              };
            })
          : [],
        sources: Array.isArray(sources) ? sources : [],
      };

      setGeneratedPlan(aiGeneratedPlan);
    } catch (err) {
      console.error('Unexpected error generating plan:', err);
      alert('Failed to generate plan. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSavePlan = async () => {
    if (!generatedPlan) return;

    // Example plans are not persisted
    const isExample = !generatedPlan.studentId;
    if (isExample) {
      alert('Example plans are for demonstration only and are not saved to Supabase.');
      return;
    }

    try {
      setIsSavingPlan(true);
      const supabase = getSupabaseClient();

      const payload = {
        student_id: generatedPlan.studentId || null,
        title: generatedPlan.title,
        objectives: generatedPlan.objectives,
        start_date: generatedPlan.startDate || null,
        end_date: generatedPlan.endDate || null,
        status: generatedPlan.status || 'Generated',
        milestones: Array.isArray(generatedPlan.milestones)
          ? generatedPlan.milestones
          : [],
        custom_prompt: customPrompt || null,
      };

      if (generatedPlan.planId) {
        // Update existing plan
        const { data, error } = await supabase
          .from('plans')
          .update(payload)
          .eq('id', generatedPlan.planId)
          .select('*')
          .single();

        if (error) {
          console.error('Error updating plan:', error);
          alert('Failed to update plan. Please try again.');
        } else {
          setGeneratedPlan((prev) => ({ ...prev, ...data, planId: data.id }));
          alert('Plan updated successfully.');
        }
      } else {
        // Insert new plan
        const { data, error } = await supabase
          .from('plans')
          .insert(payload)
          .select('*')
          .single();

        if (error) {
          console.error('Error saving plan:', error);
          alert('Failed to save plan. Please try again.');
        } else {
          setGeneratedPlan((prev) => ({
            ...prev,
            ...data,
            planId: data.id,
          }));
          alert('Plan saved successfully.');
        }
      }
    } catch (err) {
      console.error('Unexpected error saving plan:', err);
      alert('Failed to save plan. Please try again.');
    } finally {
      setIsSavingPlan(false);
    }
  };

  const handleDownloadCsv = () => {
    if (!generatedPlan) return;

    const rows = [];
    rows.push(['Field', 'Value']);
    rows.push(['Title', generatedPlan.title || '']);
    rows.push(['Student', generatedPlan.studentName || student?.name || '']);
    rows.push(['Status', generatedPlan.status || '']);
    rows.push(['Start Date', generatedPlan.startDate || '']);
    rows.push(['End Date', generatedPlan.endDate || '']);
    rows.push(['Objectives', (generatedPlan.objectives || '').replace(/\n/g, ' ')]);
    rows.push(['Custom Prompt', (customPrompt || '').replace(/\n/g, ' ')]);

    if (Array.isArray(generatedPlan.milestones) && generatedPlan.milestones.length > 0) {
      rows.push([]);
      rows.push(['Milestones', '']);
      generatedPlan.milestones.forEach((m, index) => {
        rows.push([`Step ${index + 1}`, (m || '').replace(/\n/g, ' ')]);
      });
    }

    const csvContent = rows
      .map((cols) =>
        cols
          .map((c) => {
            const s = String(c ?? '');
            const needsQuotes = s.includes(',') || s.includes('"') || s.includes('\n');
            const escaped = s.replace(/"/g, '""');
            return needsQuotes ? `"${escaped}"` : escaped;
          })
          .join(','),
      )
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const filenameSafeTitle = (generatedPlan.title || 'plan').replace(/[^a-z0-9]+/gi, '-');
    link.href = url;
    link.setAttribute('download', `${filenameSafeTitle || 'plan'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background-light dark:bg-background-dark py-16 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 space-y-3">
          <p className="text-xs uppercase tracking-[0.4em] text-text-secondary-light dark:text-text-secondary-dark">Plans</p>
          <h1 className="text-4xl font-semibold text-text-primary-light dark:text-text-primary-dark">🤖 AI Plan Generator</h1>
          <p className="text-text-secondary-light dark:text-text-secondary-dark text-lg">
            Generate personalized learning plans powered by AI and backend-curated research—no uploads or manual inputs needed.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Form */}
          <div className="rounded-3xl border border-border dark:border-white/10 bg-surface-light dark:bg-surface-dark/50 p-8 backdrop-blur transition-colors">
            <h2 className="text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">Plan Parameters</h2>
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-6">
              After you complete a student profile, ConsilAI automatically extracts key terms, scrapes relevant research, and summarizes findings in the backend. Select a student below and optionally add any extra instructions.
            </p>

            <div className="space-y-6">
              {/* Student Selection */}
              <div>
                <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
                  Select Student *
                </label>
                <select
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className="w-full px-4 py-2 border border-border dark:border-white/10 rounded-lg bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                >
                  <option value="">
                    {loadingStudents
                      ? 'Loading students...'
                      : studentError
                        ? 'Error loading students'
                        : students.length === 0
                          ? 'No students yet — create one first'
                          : 'Choose a student...'}
                  </option>
                  {!loadingStudents && !studentError &&
                    students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} - {s.grade}
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
              <div className="rounded-2xl border border-border dark:border-white/10 bg-primary-50 dark:bg-primary-900/30 p-4 transition-colors">
                <p className="font-semibold text-text-primary-light dark:text-text-primary-dark text-sm mb-2">💡 Tips</p>
                <ul className="text-xs text-text-secondary-light dark:text-text-secondary-dark space-y-1">
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
                  studentName={generatedPlan.studentName || student?.name || 'Selected Student'}
                  onSave={handleSavePlan}
                  onDownloadCsv={handleDownloadCsv}
                  isSaving={isSavingPlan}
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
              <div className="rounded-3xl border border-dashed border-border dark:border-white/15 bg-surface-light dark:bg-surface-dark/50 p-12 h-full flex flex-col items-center justify-center text-center transition-colors">
                <span className="text-6xl mb-4">📋</span>
                <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">
                  {selectedStudent ? 'Ready to Generate' : 'Select a Student'}
                </h3>
                <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm max-w-sm">
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
          <h2 className="text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-6">📚 Example Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockPlans.map((plan) => (
              <button
                key={plan.id}
                type="button"
                onClick={() => {
                  setSelectedStudent('');
                  setGeneratedPlan({
                    ...plan,
                    studentId: '',
                    studentName: 'Example Student',
                  });
                }}
                className="text-left rounded-2xl border border-border dark:border-white/10 bg-surface-light dark:bg-surface-dark/50 p-6 hover:border-primary-400 dark:hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <h3 className="font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">{plan.title}</h3>
                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-4">{plan.objectives}</p>
                <div className="flex items-center justify-between text-xs text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wide">
                  <span>
                    {plan.startDate} — {plan.endDate}
                  </span>
                  <span className="text-amber-300">{plan.status}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
      </div>
    </ProtectedRoute>
  );
}

