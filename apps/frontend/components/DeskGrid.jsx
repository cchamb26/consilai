'use client';

import { useState, useEffect } from 'react';
import Desk from './Desk';

export default function DeskGrid({ initialDesks }) {
  const [desks, setDesks] = useState(initialDesks);
  const [draggedStudent, setDraggedStudent] = useState(null);

  useEffect(() => {
    setDesks(initialDesks);
  }, [initialDesks]);

  const handleDragStart = (student) => {
    setDraggedStudent(student);
  };

  const handleDrop = (targetDesk, studentId) => {
    // Find the student from any desk
    let draggedStudentData = null;
    let sourceDeskIndex = -1;

    for (let i = 0; i < desks.length; i++) {
      if (desks[i].student?.id === studentId) {
        draggedStudentData = desks[i].student;
        sourceDeskIndex = i;
        break;
      }
    }

    if (!draggedStudentData) return;

    // Create new desks array
    const newDesks = [...desks];
    
    // Remove from source desk
    if (sourceDeskIndex >= 0) {
      newDesks[sourceDeskIndex] = {
        ...newDesks[sourceDeskIndex],
        student: null,
        available: true,
      };
    }

    // Find target desk index and add student
    const targetDeskIndex = newDesks.findIndex(d => d.id === targetDesk.id);
    if (targetDeskIndex >= 0) {
      newDesks[targetDeskIndex] = {
        ...newDesks[targetDeskIndex],
        student: draggedStudentData,
        available: false,
      };
    }

    setDesks(newDesks);
    setDraggedStudent(null);
  };

  const handleDragOver = (desk) => {
    // Visual feedback handled in Desk component
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">🪑 Classroom Seating Chart</h2>
      <p className="text-gray-600 mb-6">Drag and drop students to arrange seating</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {desks.map((desk) => (
          <Desk
            key={desk.id}
            desk={desk}
            onDragStart={handleDragStart}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          />
        ))}
      </div>

      {/* Stats */}
      <div className="mt-8 pt-8 border-t-2 border-gray-200">
        <div className="grid grid-cols-3 gap-4">
          <Stat label="Occupied" value={desks.filter(d => d.student).length} color="blue" />
          <Stat label="Available" value={desks.filter(d => !d.student).length} color="gray" />
          <Stat label="Total Desks" value={desks.length} color="green" />
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, color }) {
  const colors = {
    blue: 'text-blue-600',
    gray: 'text-gray-600',
    green: 'text-green-600',
  };

  return (
    <div className="text-center p-4 bg-gray-50 rounded-lg">
      <p className={`text-2xl font-bold ${colors[color]}`}>{value}</p>
      <p className="text-sm text-gray-600 mt-1">{label}</p>
    </div>
  );
}

