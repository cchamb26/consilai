'use client';

import Link from 'next/link';
import { useState } from 'react';
import StudentCard from '../../components/StudentCard';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { mockStudents } from '../../lib/mockData';

export default function StudentsPage() {
  const [students, setStudents] = useState(mockStudents);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
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

          {/* Search */}
          <Input
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
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
              <p className="text-slate-500 text-lg">No students found matching "{searchTerm}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
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

