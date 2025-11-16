'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Button from '../../../../components/Button';
import StudentForm from '../../../../components/StudentForm';
import { ProtectedRoute } from '../../../../lib/ProtectedRoute';
import { getSupabaseClient } from '../../../../lib/supabaseClient';

export default function EditStudentPage({ params }) {
  const router = useRouter();
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
        } else if (data) {
          // Convert arrays back to comma-separated strings for form
          setStudent({
            ...data,
            issues: Array.isArray(data.issues) ? data.issues.join(', ') : data.issues || '',
            strengths: Array.isArray(data.strengths) ? data.strengths.join(', ') : data.strengths || '',
            goals: Array.isArray(data.goals) ? data.goals.join(', ') : data.goals || '',
          });
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

  const handleSubmit = async (formData) => {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('students')
        .update({
          name: formData.name,
          email: formData.email,
          grade: formData.grade,
          issues: formData.issues,
          strengths: formData.strengths,
          goals: formData.goals,
          avatar: formData.avatar,
          behavioral_notes: formData.issues.join(', '),
        })
        .eq('id', params.id)
        .select('*')
        .single();

      if (error) {
        console.error('Error updating student:', error);
        alert('Failed to update student. Please try again.');
        return;
      }

      // Redirect back to student detail page
      router.push(`/students/${params.id}`);
    } catch (err) {
      console.error('Unexpected error updating student:', err);
      alert('Failed to update student. Please try again.');
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center min-h-screen bg-slate-950">
          <div className="text-slate-300">Loading...</div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center min-h-screen bg-slate-950">
          <div className="text-slate-300">Error: {error}</div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!student) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-slate-950 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <h1 className="text-2xl font-semibold text-white">Student not found</h1>
            <Link href="/students" className="text-indigo-300 hover:text-white transition inline-block">
              Back to Students
            </Link>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-950 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-sm text-slate-500">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <span>/</span>
            <Link href="/students" className="hover:text-white transition">Students</Link>
            <span>/</span>
            <Link href={`/students/${params.id}`} className="hover:text-white transition">{student.name}</Link>
            <span>/</span>
            <span className="text-slate-300">Edit</span>
          </div>

          <StudentForm onSubmit={handleSubmit} initialData={student} />

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <Button
              variant="secondary"
              type="button"
              className="border-red-500/40 text-red-300 hover:bg-red-500/10"
              onClick={async () => {
                if (!confirm('Are you sure you want to delete this student? This cannot be undone.')) {
                  return;
                }
                try {
                  const supabase = getSupabaseClient();
                  const { error } = await supabase.from('students').delete().eq('id', params.id);
                  if (error) {
                    console.error('Error deleting student:', error);
                    alert('Failed to delete student. Please try again.');
                    return;
                  }
                  router.push('/students');
                } catch (err) {
                  console.error('Unexpected error deleting student:', err);
                  alert('Failed to delete student. Please try again.');
                }
              }}
            >
              Delete Student
            </Button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
