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

  return (
    <div
      draggable={desk.student ? true : false}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        p-4 rounded-lg border-2 flex flex-col items-center justify-center
        min-h-24 cursor-move transition-all
        ${desk.student ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-300' : ''}
        ${!desk.student ? 'bg-gray-50 border-dashed border-gray-300 hover:bg-gray-100' : ''}
        ${isDragOver ? 'bg-yellow-100 border-yellow-400 scale-105' : ''}
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
          <p className="text-center text-sm font-semibold text-gray-900">
            {desk.student.name.split(' ')[0]}
          </p>
          <p className="text-xs text-gray-600">{desk.id}</p>
        </>
      ) : (
        <>
          <span className="text-3xl text-gray-300 mb-2">🪑</span>
          <p className="text-xs text-gray-500 text-center">{desk.id}</p>
          <p className="text-xs text-gray-400 mt-1">Drop student here</p>
        </>
      )}
    </div>
  );
}

