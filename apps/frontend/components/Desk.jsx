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
        p-5 rounded-2xl border flex flex-col items-center justify-center gap-2
        min-h-28 cursor-move transition-all duration-300
        ${desk.student ? 'bg-white/5 border-white/15 hover:bg-white/10' : 'border-dashed border-white/10 bg-transparent hover:border-white/30'}
        ${isDragOver ? 'border-indigo-400 bg-indigo-500/10 scale-[1.02]' : ''}
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
          <p className="text-center text-sm font-semibold text-white">
            {desk.student.name}
          </p>
          <p className="text-xs text-slate-400">{desk.id}</p>
          <p className="text-xs text-slate-500">({row + 1}, {col + 1})</p>
        </>
      ) : (
        <>
          <span className="text-3xl text-slate-700 mb-1">🪑</span>
          <p className="text-xs text-slate-500 text-center">{desk.id}</p>
          <p className="text-xs text-slate-600 mt-1">({row + 1}, {col + 1})</p>
          <p className="text-xs text-slate-600 mt-1">Drop student here</p>
        </>
      )}
    </div>
  );
}

