'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import StudentDetailPanel from '../../../components/StudentDetailPanel';
import Button from '../../../components/Button';
import { ProtectedRoute } from '../../../lib/ProtectedRoute';
import { getSupabaseClient } from '../../../lib/supabaseClient';

export default function StudentDetailPage({ params }) {
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
          .from('students')
          .select('*')
          .eq('id', params.id)
          .single();

        if (error) {
          if (error.code === 'PGRST116' || error.message?.includes('No rows')) {
            setStudent(null);
          } else {
            console.error('Error fetching student:', error);
            setError('Failed to load student');
          }
        } else {
          setStudent(data);
        }
      } catch (err) {
        console.error('Unexpected error fetching student:', err);
        setError('Failed to load student');
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [params.id]);

  if (!loading && !student) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background-light dark:bg-background-dark py-16 transition-colors">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <h1 className="text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark">Student not found</h1>
            <Link href="/students" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition inline-block">
              Back to Students
            </Link>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark transition-colors">
          <div className="text-text-secondary-light dark:text-text-secondary-dark">Loading...</div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background-light dark:bg-background-dark py-16 transition-colors">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <h1 className="text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark">Error loading student</h1>
            <p className="text-text-secondary-light dark:text-text-secondary-dark">{error}</p>
            <Link href="/students" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition inline-block">
              Back to Students
            </Link>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background-light dark:bg-background-dark py-16 transition-colors">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Breadcrumb + Edit Button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-text-secondary-light dark:text-text-secondary-dark">
              <Link href="/" className="hover:text-text-primary-light dark:hover:text-text-primary-dark transition">Home</Link>
              <span>/</span>
              <Link href="/students" className="hover:text-text-primary-light dark:hover:text-text-primary-dark transition">Students</Link>
              <span>/</span>
              <span className="text-text-primary-light dark:text-text-primary-dark">{student.name}</span>
            </div>
            <Link href={`/students/${student.id}/edit`}>
              <Button variant="outline" size="sm">
                ✏️ Edit Student
              </Button>
            </Link>
          </div>

          {/* Student Detail Panel */}
          <StudentDetailPanel 
            student={student} 
            onEditPlan={() => setShowPlanModal(true)}
          />
        </div>

        {/* Plan Modal (if needed) */}
        {showPlanModal && (
          <div className="fixed inset-0 bg-background-dark/70 dark:bg-background-dark/80 backdrop-blur flex items-center justify-center p-4 z-50">
            <div className="bg-surface-light dark:bg-surface-dark border border-border dark:border-white/10 rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4 transition-colors">
              <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark">Generate AI Plan</h3>
              <p className="text-text-secondary-light dark:text-text-secondary-dark">
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
    </ProtectedRoute>
  );
}

