'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getSession } from '@/lib/auth';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Wait for Supabase to process the callback
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check if we have a valid session
        const session = await getSession();
        
        if (session) {
          // Session is valid, redirect to home
          router.push('/');
        } else {
          // No session, redirect to login
          router.push('/login');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        router.push('/login');
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950">
      <div className="text-center space-y-4">
        <div className="animate-spin w-12 h-12 border-4 border-slate-700 border-t-indigo-500 rounded-full mx-auto"></div>
        <p className="text-slate-300">Completing your sign in...</p>
      </div>
    </div>
  );
}
