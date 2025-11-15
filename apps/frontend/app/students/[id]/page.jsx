'use client';

import { useState } from 'react';
import Link from 'next/link';
import { mockStudents } from '../../../lib/mockData';
import StudentDetailPanel from '../../../components/StudentDetailPanel';
import Button from '../../../components/Button';

export default function StudentDetailPage({ params }) {
  const [showPlanModal, setShowPlanModal] = useState(false);
  
  const student = mockStudents.find(s => s.id === params.id);

  if (!student) {
    return (
      <div className="min-h-screen bg-slate-950 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h1 className="text-2xl font-semibold text-white">Student not found</h1>
          <Link href="/students" className="text-indigo-300 hover:text-white transition inline-block">
            Back to Students
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-slate-500">
          <Link href="/" className="hover:text-white transition">Home</Link>
          <span>/</span>
          <Link href="/students" className="hover:text-white transition">Students</Link>
          <span>/</span>
          <span className="text-slate-300">{student.name}</span>
        </div>

        {/* Student Detail Panel */}
        <StudentDetailPanel 
          student={student} 
          onEditPlan={() => setShowPlanModal(true)}
        />
      </div>

      {/* Plan Modal (if needed) */}
      {showPlanModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-white/10 rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-xl font-semibold text-white">Generate AI Plan</h3>
            <p className="text-slate-400">
              Use AI to generate a personalized learning plan for {student.name}?
            </p>
            <div className="flex gap-3">
              <Button 
                variant="primary" 
                onClick={() => {
                  alert('Plan generated! (Demo mode)');
                  setShowPlanModal(false);
                }}
              >
                Generate Plan
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => setShowPlanModal(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

