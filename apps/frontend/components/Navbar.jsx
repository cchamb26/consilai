'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useTheme } from '@/lib/ThemeContext';
import { signOut } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    setIsProfileOpen(false);
    router.push('/login');
  };

  return (
    <nav className="bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark shadow-xl border-b border-border dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 font-bold text-xl text-text-primary-light dark:text-text-primary-dark">
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
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md hover:bg-primary-100 dark:hover:bg-primary-900 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            {!loading && user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-primary-100 dark:hover:bg-primary-900 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center text-sm font-semibold text-white">
                    {user.user_metadata?.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm text-text-primary-light dark:text-text-primary-dark">{user.user_metadata?.name || user.email}</span>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-surface-light dark:bg-surface-dark rounded-lg border border-border dark:border-slate-700 shadow-xl z-50 transition-colors">
                    <div className="p-4 border-b border-border dark:border-slate-700">
                      <p className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">{user.user_metadata?.name || 'User'}</p>
                      <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">{user.email}</p>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-primary-100 dark:hover:bg-primary-900 text-text-secondary-light dark:text-text-secondary-dark transition-colors"
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
                <span className="px-4 py-2 bg-primary-500 dark:bg-primary-600 text-white rounded-md font-medium hover:bg-primary-400 dark:hover:bg-primary-500 transition-colors inline-block cursor-pointer">
                  Sign In
                </span>
              </Link>
            ) : null}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            {/* Theme Toggle Mobile */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md hover:bg-primary-100 dark:hover:bg-primary-900 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md hover:bg-primary-100 dark:hover:bg-primary-900 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <MobileNavLink href="/">Home</MobileNavLink>
            <MobileNavLink href="/students">Students</MobileNavLink>
            <MobileNavLink href="/classroom">Classroom</MobileNavLink>
            <MobileNavLink href="/plans">Plans</MobileNavLink>
            <div className="pt-2 border-t border-border dark:border-slate-700">
              {!loading && user ? (
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-primary-100 dark:hover:bg-primary-900 transition-colors text-text-secondary-light dark:text-text-secondary-dark"
                >
                  Sign Out
                </button>
              ) : !loading ? (
                <Link 
                  href="/login"
                >
                  <span className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary-100 dark:hover:bg-primary-900 transition-colors text-text-secondary-light dark:text-text-secondary-dark cursor-pointer">
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
      className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-100 dark:hover:bg-primary-900 text-text-primary-light dark:text-text-primary-dark transition-colors"
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ href, children }) {
  return (
    <Link
      href={href}
      className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary-100 dark:hover:bg-primary-900 text-text-primary-light dark:text-text-primary-dark transition-colors"
    >
      {children}
    </Link>
  );
}

