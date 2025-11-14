'use client';

import { useState } from 'react';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Textarea from '../../components/Textarea';
import PlanResultCard from '../../components/PlanResultCard';
import { mockStudents, mockPlans } from '../../lib/mockData';

export default function PlansPage() {
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedResearch, setSelectedResearch] = useState('');
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
        objectives: `This plan focuses on developing ${student.strengths[0]} while addressing ${student.issues[0]}. The curriculum will integrate research findings and personalized learning strategies tailored to ${student.name}'s unique profile.`,
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
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🤖 AI Plan Generator</h1>
          <p className="text-gray-600 text-lg">
            Generate personalized learning plans powered by AI and research insights
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Plan Parameters</h2>

            <div className="space-y-6">
              {/* Student Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Student *
                </label>
                <select
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choose a student...</option>
                  {mockStudents.map(student => (
                    <option key={student.id} value={student.id}>
                      {student.name} - {student.grade}
                    </option>
                  ))}
                </select>
              </div>

              {/* Research Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Use Research Insights
                </label>
                <select
                  value={selectedResearch}
                  onChange={(e) => setSelectedResearch(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">None - Use AI only</option>
                  <option value="1">The Impact of Peer Support...</option>
                  <option value="2">Adaptive Learning Strategies...</option>
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
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <p className="font-semibold text-blue-900 text-sm mb-2">💡 Tips:</p>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li>• AI considers student issues, strengths, and goals</li>
                  <li>• Research insights inform evidence-based strategies</li>
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
              <div className="bg-white rounded-lg shadow-lg p-12 h-full flex flex-col items-center justify-center text-center">
                <span className="text-6xl mb-4">📋</span>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {selectedStudent ? 'Ready to Generate' : 'Select a Student'}
                </h3>
                <p className="text-gray-600 text-sm">
                  {selectedStudent
                    ? 'Click "Generate Plan" to create a personalized learning plan powered by AI'
                    : 'Choose a student from the form to generate their personalized learning plan'
                  }
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Example Plans Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">📚 Example Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockPlans.map(plan => (
              <div key={plan.id} className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
                <h3 className="font-bold text-gray-900 mb-2">{plan.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{plan.objectives}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    {plan.startDate} to {plan.endDate}
                  </span>
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold">
                    {plan.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

