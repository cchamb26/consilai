'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import StudentCard from '../../components/StudentCard';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { ProtectedRoute } from '../../lib/ProtectedRoute';
import { getSupabaseClient } from '../../lib/supabaseClient';

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load students from Supabase on mount
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const supabase = getSupabaseClient();
        // RLS ensures we only see the current teacher's students
        const { data, error } = await supabase
          .from('teacher_students')
          .select('*')
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Error fetching students:', error);
          setError('Failed to load students');
          setStudents([]);
        } else {
          setStudents(data || []);
        }
      } catch (err) {
        console.error('Unexpected error fetching students:', err);
        setError('Failed to load students');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = selectedGrade === '' || student.grade === selectedGrade;
    return matchesSearch && matchesGrade;
  });

  // Get unique grades for filter
  // K–12 grade sort
  const gradeOrder = [
    'Kindergarten',
    'Grade 1',
    'Grade 2',
    'Grade 3',
    'Grade 4',
    'Grade 5',
    'Grade 6',
    'Grade 7',
    'Grade 8',
    'Grade 9',
    'Grade 10',
    'Grade 11',
    'Grade 12',
  ];
  const uniqueGrades = [...new Set(students.map((s) => s.grade))].sort(
    (a, b) => gradeOrder.indexOf(a) - gradeOrder.indexOf(b),
  );

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background-light dark:bg-background-dark py-16 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex flex-wrap items-center gap-4 justify-between mb-8">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-text-secondary-light dark:text-text-secondary-dark">Profiles</p>
              <h1 className="text-4xl font-semibold text-text-primary-light dark:text-text-primary-dark mt-2">Students</h1>
              <p className="text-text-secondary-light dark:text-text-secondary-dark mt-2">Every student context in one calm view.</p>
            </div>
            <Link href="/students/new">
              <Button variant="primary" size="lg">
                + Add New Student
              </Button>
            </Link>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-xs">
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="min-w-xs">
              <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
                Filter by Grade
              </label>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="px-4 py-2 border border-border dark:border-slate-700 rounded-lg bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
              >
                <option value="">All Grades</option>
                {uniqueGrades.map(grade => (
                  <option key={grade} value={grade}>
                    {grade}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard label="Total Students" value={students.length} icon="👥" />
          <StatCard label="Filtered Results" value={filteredStudents.length} icon="🔍" />
          <StatCard label="Active Plans" value={students.length} icon="📋" />
        </div>

        {/* Students Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-12">
              <p className="text-text-secondary-light dark:text-text-secondary-dark text-lg">Loading students...</p>
            </div>
          ) : error ? (
            <div className="col-span-full text-center py-12">
              <p className="text-red-400 text-lg">{error}</p>
            </div>
          ) : filteredStudents.length > 0 ? (
            filteredStudents.map((student) => <StudentCard key={student.id} student={student} />)
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-text-secondary-light dark:text-text-secondary-dark text-lg">
                No students found {searchTerm && `matching "${searchTerm}"`}{searchTerm && selectedGrade && ' in'}{selectedGrade && ` ${selectedGrade}`}
              </p>
            </div>
          )}
        </div>
      </div>
      </div>
    </ProtectedRoute>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <div className="rounded-2xl border border-border dark:border-white/10 bg-surface-light dark:bg-surface-dark/50 p-6 transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-text-secondary-light dark:text-text-secondary-dark">{label}</p>
          <p className="text-3xl font-semibold text-text-primary-light dark:text-text-primary-dark mt-2">{value}</p>
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
    </div>
  );
}

