'use client';

import { useState } from 'react';
import StudentAvatar from './StudentAvatar';

export default function Desk({ desk, onDragStart, onDrop, onDragOver }) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragStart = (e) => {
    if (desk.student) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('studentId', desk.student.id);
      onDragStart?.(desk.student);
    }
  };

  const handleDragOver = (e) => {
    if (desk.available || desk.student) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      setIsDragOver(true);
      onDragOver?.(desk);
    }
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const studentId = e.dataTransfer.getData('studentId');
    onDrop?.(desk, studentId);
  };

  const row = desk.position?.y ?? 0;
  const col = desk.position?.x ?? 0;

  return (
    <div
      draggable={!!desk.student}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        p-5 rounded-2xl border-2 flex flex-col items-center justify-center gap-2
        min-h-28 cursor-move transition-all duration-300
        ${desk.student 
          ? 'bg-white dark:bg-primary-900/30 border-primary-400 dark:border-white/15 hover:bg-primary-100 dark:hover:bg-primary-900/50 shadow-md' 
          : 'border-dashed border-primary-300 dark:border-white/10 bg-white/50 dark:bg-transparent hover:border-primary-500 dark:hover:border-white/30 hover:bg-primary-50 dark:hover:bg-primary-900/20'}
        ${isDragOver ? 'border-primary-600 dark:border-primary-400 bg-primary-300/70 dark:bg-primary-500/20 scale-[1.02] shadow-lg' : ''}
      `}
    >
      {desk.student ? (
        <>
          <StudentAvatar 
            name={desk.student.name} 
            avatar={desk.student.avatar} 
            size="md"
            className="mb-2"
          />
          <p className="text-center text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">
            {desk.student.name}
          </p>
          <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">{desk.id}</p>
          <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">({row + 1}, {col + 1})</p>
        </>
      ) : (
        <>
          <span className="text-3xl text-text-secondary-light dark:text-text-secondary-dark mb-1">🪑</span>
          <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark text-center">{desk.id}</p>
          <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1">({row + 1}, {col + 1})</p>
          <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1">Drop student here</p>
        </>
      )}
    </div>
  );
}

