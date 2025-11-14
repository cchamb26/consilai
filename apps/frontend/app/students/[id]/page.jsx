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
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Student not found</h1>
          <Link href="/students" className="text-blue-600 hover:underline mt-4 inline-block">
            Back to Students
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center space-x-2 text-sm">
          <Link href="/" className="text-blue-600 hover:underline">Home</Link>
          <span className="text-gray-400">/</span>
          <Link href="/students" className="text-blue-600 hover:underline">Students</Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-600">{student.name}</span>
        </div>

        {/* Student Detail Panel */}
        <StudentDetailPanel 
          student={student} 
          onEditPlan={() => setShowPlanModal(true)}
        />
      </div>

      {/* Plan Modal (if needed) */}
      {showPlanModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Generate AI Plan</h3>
            <p className="text-gray-600 mb-6">
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

