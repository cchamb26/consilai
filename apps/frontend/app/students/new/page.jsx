'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '../../../components/Button';
import StudentForm from '../../../components/StudentForm';
import { ProtectedRoute } from '../../../lib/ProtectedRoute';
import { getSupabaseClient } from '../../../lib/supabaseClient';

export default function NewStudentPage() {
  const router = useRouter();

  const handleSubmit = async (formData) => {
    const supabase = getSupabaseClient();

    // Ensure the teacher has at least one classroom; create a default if none exists
    const getOrCreateDefaultClassroom = async () => {
      const { data: classrooms, error: classroomError } = await supabase
        .from('classrooms')
        .select('id')
        .order('created_at', { ascending: true })
        .limit(1);

      if (classroomError) {
        console.error('Error fetching classrooms:', classroomError);
        throw classroomError;
      }

      if (classrooms && classrooms.length > 0) {
        return classrooms[0].id;
      }

      // Create a default classroom for this teacher
      const { data: created, error: createError } = await supabase
        .from('classrooms')
        .insert({
          name: 'My Classroom',
          description: 'Default classroom',
        })
        .select('id')
        .single();

      if (createError) {
        console.error('Error creating default classroom:', createError);
        throw createError;
      }

      return created.id;
    };

    try {
      const classroomId = await getOrCreateDefaultClassroom();

      const { data, error } = await supabase
        .from('students')
        .insert({
          classroom_id: classroomId,
          name: formData.name,
          email: formData.email,
          grade: formData.grade,
          issues: formData.issues,
          strengths: formData.strengths,
          goals: formData.goals,
          avatar: formData.avatar,
          behavioral_notes: formData.issues.join(', '),
        })
        .select('*')
        .single();

      if (error) {
        console.error('Error creating student:', error);
        alert('Failed to create student. Please try again.');
        return;
      }

      // Redirect to the new student's detail page
      router.push(`/students/${data.id}`);
    } catch (err) {
      console.error('Unexpected error creating student:', err);
      alert('Failed to create student. Please try again.');
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background-light dark:bg-background-dark py-16 transition-colors" key={"new-student"}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-text-secondary-light dark:text-text-secondary-dark">
          <Link href="/" className="hover:text-text-primary-light dark:hover:text-text-primary-dark transition">Home</Link>
          <span>/</span>
          <Link href="/students" className="hover:text-text-primary-light dark:hover:text-text-primary-dark transition">Students</Link>
          <span>/</span>
          <span className="text-text-primary-light dark:text-text-primary-dark">New</span>
        </div>

        <StudentForm onSubmit={handleSubmit} />
      </div>
      </div>
    </ProtectedRoute>
  );
}

