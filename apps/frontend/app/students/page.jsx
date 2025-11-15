'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import StudentCard from '../../components/StudentCard';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { mockStudents } from '../../lib/mockData';
import { ProtectedRoute } from '../../lib/ProtectedRoute';

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');

  // Load students from localStorage on mount
  useEffect(() => {
    const savedStudents = localStorage.getItem('students');
    if (savedStudents) {
      setStudents(JSON.parse(savedStudents));
    } else {
      setStudents(mockStudents);
      localStorage.setItem('students', JSON.stringify(mockStudents));
    }
  }, []);

  // Save students to localStorage whenever they change
  useEffect(() => {
    if (students.length > 0) {
      localStorage.setItem('students', JSON.stringify(students));
    }
  }, [students]);

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = selectedGrade === '' || student.grade === selectedGrade;
    return matchesSearch && matchesGrade;
  });

  // Get unique grades for filter
  // const uniqueGrades = [...new Set(students.map(s => s.grade))].sort();
  // K–12 grade sort
const gradeOrder = ["Kindergarten", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"];
const uniqueGrades = [...new Set(students.map(s => s.grade))].sort((a, b) => gradeOrder.indexOf(a) - gradeOrder.indexOf(b));

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-950 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex flex-wrap items-center gap-4 justify-between mb-8">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Profiles</p>
              <h1 className="text-4xl font-semibold text-white mt-2">Students</h1>
              <p className="text-slate-400 mt-2">Every student context in one calm view.</p>
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
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Filter by Grade
              </label>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="px-4 py-2 border border-slate-700 rounded-lg bg-slate-900 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
          {filteredStudents.length > 0 ? (
            filteredStudents.map(student => (
              <StudentCard key={student.id} student={student} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-slate-500 text-lg">
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
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
          <p className="text-3xl font-semibold text-white mt-2">{value}</p>
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
    </div>
  );
}

