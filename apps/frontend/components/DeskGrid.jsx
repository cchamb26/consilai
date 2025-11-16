'use client';

import { useState, useEffect } from 'react';
import Desk from './Desk';

export default function DeskGrid({ initialDesks, onDesksChange, cols = 4 }) {
  const [desks, setDesks] = useState(initialDesks);
  const [draggedStudent, setDraggedStudent] = useState(null);

  useEffect(() => {
    setDesks(initialDesks);
  }, [initialDesks]);

  // Notify parent component when desks change
  useEffect(() => {
    if (onDesksChange) {
      onDesksChange(desks);
    }
  }, [desks, onDesksChange]);

  const handleDragStart = (student) => {
    setDraggedStudent(student);
  };

  const handleDrop = (targetDesk, studentId) => {
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

    const newDesks = [...desks];
    const targetDeskIndex = newDesks.findIndex(d => d.id === targetDesk.id);
    
    if (targetDeskIndex >= 0) {
      // If target desk has a student, swap them
      if (newDesks[targetDeskIndex].student && sourceDeskIndex >= 0) {
        const targetStudent = newDesks[targetDeskIndex].student;
        newDesks[sourceDeskIndex] = {
          ...newDesks[sourceDeskIndex],
          student: targetStudent,
          available: false,
        };
        newDesks[targetDeskIndex] = {
          ...newDesks[targetDeskIndex],
          student: draggedStudentData,
          available: false,
        };
      } else {
        // Otherwise, just move the student
        if (sourceDeskIndex >= 0) {
          newDesks[sourceDeskIndex] = {
            ...newDesks[sourceDeskIndex],
            student: null,
            available: true,
          };
        }
        newDesks[targetDeskIndex] = {
          ...newDesks[targetDeskIndex],
          student: draggedStudentData,
          available: false,
        };
      }
    }

    setDesks(newDesks);
    setDraggedStudent(null);
  };

  const handleDragOver = (desk) => {
    // Visual feedback handled in Desk component
  };

  return (
    <div className="rounded-3xl border-2 border-primary-200 dark:border-white/10 bg-primary-50/50 dark:bg-surface-dark/50 p-8 backdrop-blur transition-colors shadow-lg">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark">🪑 Classroom Seating</h2>
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Drag students to orchestrate seating dynamics</p>
        </div>
        {draggedStudent && (
          <p className="text-sm text-primary-600 dark:text-primary-400 flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">Moving</span>
            {draggedStudent.name}
          </p>
        )}
      </div>
      
      <div className="overflow-x-auto w-full">
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, minmax(120px, 1fr))`, gap: '1rem', minWidth: 'fit-content' }}>
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
      </div>

      {/* Stats */}
      <div className="mt-10 pt-6 border-t border-border dark:border-white/10">
        <div className="grid grid-cols-3 gap-4">
          <Stat label="Occupied" value={desks.filter(d => d.student).length} color="primary" />
          <Stat label="Available" value={desks.filter(d => !d.student).length} color="secondary" />
          <Stat label="Total Desks" value={desks.length} color="success" />
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, color }) {
  const colors = {
    primary: 'text-primary-600 dark:text-primary-400',
    secondary: 'text-secondary-600 dark:text-secondary-400',
    success: 'text-emerald-600 dark:text-emerald-400',
  };

  return (
    <div className="text-center p-5 rounded-2xl bg-primary-50 dark:bg-primary-900/30 border border-border dark:border-white/10 transition-colors">
      <p className={`text-2xl font-semibold ${colors[color]}`}>{value}</p>
      <p className="text-xs uppercase tracking-wide text-text-secondary-light dark:text-text-secondary-dark mt-2">{label}</p>
    </div>
  );
}

