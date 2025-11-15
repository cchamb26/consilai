'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { signOut } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    setIsProfileOpen(false);
    router.push('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-slate-100 shadow-xl border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 font-bold text-xl">
            <span className="text-2xl">🎓</span>
            <span>ConsilAI</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-1">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/students">Students</NavLink>
            <NavLink href="/classroom">Classroom</NavLink>
            <NavLink href="/plans">Plans</NavLink>
          </div>

          {/* User Profile Section */}
          <div className="hidden md:flex items-center gap-4">
            {!loading && user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-800 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-sm font-semibold">
                    {user.user_metadata?.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm">{user.user_metadata?.name || user.email}</span>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-slate-900 rounded-lg border border-slate-700 shadow-xl z-50">
                    <div className="p-4 border-b border-slate-700">
                      <p className="text-sm font-medium text-slate-100">{user.user_metadata?.name || 'User'}</p>
                      <p className="text-xs text-slate-400">{user.email}</p>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-slate-800 text-slate-300 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : !loading ? (
              <Link 
                href="/login"
              >
                <span className="px-4 py-2 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition-colors inline-block cursor-pointer">
                  Sign In
                </span>
              </Link>
            ) : null}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md hover:bg-slate-800"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <MobileNavLink href="/">Home</MobileNavLink>
            <MobileNavLink href="/students">Students</MobileNavLink>
            <MobileNavLink href="/classroom">Classroom</MobileNavLink>
            <MobileNavLink href="/plans">Plans</MobileNavLink>
            <div className="pt-2 border-t border-slate-700">
              {!loading && user ? (
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-slate-800 transition-colors text-slate-300"
                >
                  Sign Out
                </button>
              ) : !loading ? (
                <Link 
                  href="/login"
                >
                  <span className="block px-3 py-2 rounded-md text-base font-medium hover:bg-slate-800 transition-colors text-slate-300 cursor-pointer">
                    Sign In
                  </span>
                </Link>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

function NavLink({ href, children }) {
  return (
    <Link
      href={href}
      className="px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-800 transition-colors"
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ href, children }) {
  return (
    <Link
      href={href}
      className="block px-3 py-2 rounded-md text-base font-medium hover:bg-slate-800 transition-colors"
    >
      {children}
    </Link>
  );
}

