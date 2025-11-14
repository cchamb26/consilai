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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">👥 Students</h1>
              <p className="text-gray-600 mt-2">Manage and track student profiles</p>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
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
              <p className="text-gray-600 text-lg">No students found matching "{searchTerm}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-semibold">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <span className="text-4xl">{icon}</span>
      </div>
    </div>
  );
}

