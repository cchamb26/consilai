'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Button from '../../../../components/Button';
import StudentForm from '../../../../components/StudentForm';
import { ProtectedRoute } from '../../../../lib/ProtectedRoute';

export default function EditStudentPage({ params }) {
  const router = useRouter();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load student from localStorage
    const savedStudents = localStorage.getItem('students');
    if (savedStudents) {
      const students = JSON.parse(savedStudents);
      const found = students.find(s => s.id === params.id);
      if (found) {
        // Convert arrays back to comma-separated strings for form
        setStudent({
          ...found,
          issues: Array.isArray(found.issues) ? found.issues.join(', ') : found.issues,
          strengths: Array.isArray(found.strengths) ? found.strengths.join(', ') : found.strengths,
          goals: Array.isArray(found.goals) ? found.goals.join(', ') : found.goals,
        });
      }
    }
    setLoading(false);
  }, [params.id]);

  const handleSubmit = (formData) => {
    // Get existing students
    const savedStudents = localStorage.getItem('students');
    const students = savedStudents ? JSON.parse(savedStudents) : [];

    // Update student
    const updatedStudents = students.map(s =>
      s.id === params.id ? { ...s, ...formData } : s
    );

    localStorage.setItem('students', JSON.stringify(updatedStudents));

    // Redirect back to student detail page
    router.push(`/students/${params.id}`);
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
        </div>
      </div>
    </ProtectedRoute>
  );
}
