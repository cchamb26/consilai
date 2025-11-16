'use client';

import { useEffect, useState } from 'react';

export function Notification({ message, type = 'success', onClose }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!isVisible) return null;

  const bgColor = type === 'error' ? 'bg-red-500' : 'bg-emerald-500';

  return (
    <div className={`fixed top-20 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg font-medium animate-in slide-in-from-top z-50`}>
      {message}
    </div>
  );
}
