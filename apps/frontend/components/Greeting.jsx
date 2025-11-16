'use client';

import { useAuth } from '@/lib/AuthContext';

export default function Greeting() {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!user) {
    return null;
  }

  const name = user.user_metadata?.name || user.email?.split('@')[0] || 'there';
  const displayName = name.split(' ')[0]; // Get first name only

  return (
    <div className="bg-gradient-to-r from-primary-50 dark:from-primary-900 to-secondary-50 dark:to-secondary-900 border-b border-border dark:border-slate-800 px-4 sm:px-6 lg:px-8 py-4 transition-colors">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark">
          Hello, <span className="bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">{displayName}!</span>
        </h2>
      </div>
    </div>
  );
}
