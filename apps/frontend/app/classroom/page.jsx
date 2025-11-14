'use client';

import { useState } from 'react';
import DeskGrid from '../../components/DeskGrid';
import Button from '../../components/Button';
import { mockDesks } from '../../lib/mockData';

export default function ClassroomPage() {
  const [desks, setDesks] = useState(mockDesks);

  const handleReset = () => {
    setDesks(mockDesks);
    alert('Seating arrangement reset to default');
  };

  const handleSave = () => {
    console.log('Saving seating arrangement:', desks);
    alert('Seating arrangement saved! (Demo mode)');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🪑 Classroom Simulation</h1>
          <p className="text-gray-600 text-lg mb-6">
            Interactive seating chart - drag and drop students to arrange their seats
          </p>

          {/* Instructions */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mb-6">
            <p className="font-semibold text-blue-900">📝 How to use:</p>
            <ul className="text-sm text-blue-800 mt-2 space-y-1 ml-4">
              <li>• Click and drag a student card to move them to a different desk</li>
              <li>• Drop on any empty desk (chair icon) to place the student</li>
              <li>• View statistics at the bottom to track occupancy</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-3 flex-wrap">
            <Button variant="primary" onClick={handleSave}>
              💾 Save Seating
            </Button>
            <Button variant="secondary" onClick={handleReset}>
              🔄 Reset to Default
            </Button>
            <Button variant="outline">
              📊 View Analytics
            </Button>
            <Button variant="outline">
              📥 Export CSV
            </Button>
          </div>
        </div>

        {/* Desk Grid */}
        <DeskGrid initialDesks={desks} />

        {/* Tips Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Tip icon="💡" title="Optimize for Collaboration" description="Place students with complementary strengths together to promote peer learning and collaborative problem-solving." />
          <Tip icon="🎯" title="Behavior Management" description="Separate students with disruptive behaviors and seat them near positive role models for better classroom dynamics." />
          <Tip icon="📚" title="Learning Support" description="Position students with similar issues together to allow you to target group instruction more effectively." />
          <Tip icon="👥" title="Social Integration" description="Mix different social groups to encourage new friendships and reduce cliques." />
        </div>
      </div>
    </div>
  );
}

function Tip({ icon, title, description }) {
  return (
    <div className="bg-white rounded-lg p-6 shadow border-l-4 border-purple-500">
      <div className="flex items-start space-x-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <h3 className="font-bold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        </div>
      </div>
    </div>
  );
}

