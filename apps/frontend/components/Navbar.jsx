'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
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
            <NavLink href="/research">Research</NavLink>
            <NavLink href="/plans">Plans</NavLink>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md hover:bg-blue-700"
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
            <MobileNavLink href="/research">Research</MobileNavLink>
            <MobileNavLink href="/plans">Plans</MobileNavLink>
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
      className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ href, children }) {
  return (
    <Link
      href={href}
      className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700 transition-colors"
    >
      {children}
    </Link>
  );
}

