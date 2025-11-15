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
    <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-semibold text-white">🪑 Classroom Seating</h2>
          <p className="text-sm text-slate-400">Drag students to orchestrate seating dynamics</p>
        </div>
        {draggedStudent && (
          <p className="text-sm text-indigo-300 flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-slate-400">Moving</span>
            {draggedStudent.name}
          </p>
        )}
      </div>
      
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
      <div className="mt-10 pt-6 border-t border-white/10">
        <div className="grid grid-cols-3 gap-4">
          <Stat label="Occupied" value={desks.filter(d => d.student).length} color="indigo" />
          <Stat label="Available" value={desks.filter(d => !d.student).length} color="slate" />
          <Stat label="Total Desks" value={desks.length} color="emerald" />
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, color }) {
  const colors = {
    indigo: 'text-indigo-300',
    slate: 'text-slate-300',
    emerald: 'text-emerald-300',
  };

  return (
    <div className="text-center p-5 rounded-2xl bg-white/5 border border-white/10">
      <p className={`text-2xl font-semibold ${colors[color]}`}>{value}</p>
      <p className="text-xs uppercase tracking-wide text-slate-500 mt-2">{label}</p>
    </div>
  );
}

