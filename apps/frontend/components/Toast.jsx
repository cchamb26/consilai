'use client';

import { useEffect, useState } from 'react';

export function Toast({ message, type = 'info', onClose }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!isVisible) return null;

  const bgColor = {
    info: 'bg-blue-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
  }[type];

  const icon = {
    info: '📋',
    success: '✅',
    warning: '⚠️',
    error: '❌',
  }[type];

  return (
    <div className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in slide-in-from-top z-50`}>
      <span>{icon}</span>
      <span className="font-medium">{message}</span>
    </div>
  );
}
