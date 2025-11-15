'use client';

import { useState } from 'react';
import DeskGrid from '../../components/DeskGrid';
import Button from '../../components/Button';
import { mockDesks } from '../../lib/mockData';
import { generateSeatingChart } from '../../lib/rbsbSeating';
import { ProtectedRoute } from '../../lib/ProtectedRoute';

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

  const handleAutoSort = () => {
    const cols = 4;
    const rows = Math.ceil(desks.length / cols);

    // Derive simple scores from current students.
    const seen = new Map();
    for (const desk of desks) {
      if (!desk.student) continue;
      const s = desk.student;
      if (seen.has(s.id)) continue;

      const textIssues = (s.issues || []).join(' ').toLowerCase();
      const textStrengths = (s.strengths || []).join(' ').toLowerCase();

      let academicScore = 0.6;
      let behaviorScore = 0.6;
      let socialScore = 0.6;
      let supportNeeds = 0;

      if (textIssues.includes('reading') || textIssues.includes('math')) {
        academicScore -= 0.2;
      }
      if (textIssues.includes('missing assignments') || textIssues.includes('poor')) {
        academicScore -= 0.1;
      }
      if (textIssues.includes('disruptive') || textIssues.includes('behavior')) {
        behaviorScore -= 0.25;
      }
      if (textIssues.includes('anxiety') || textIssues.includes('focus')) {
        behaviorScore -= 0.15;
      }
      if (textIssues.includes('social') || textIssues.includes('peer')) {
        socialScore -= 0.2;
      }

      if (textStrengths.includes('leadership') || textStrengths.includes('strong')) {
        academicScore += 0.1;
        behaviorScore += 0.1;
      }
      if (textStrengths.includes('collaborative') || textStrengths.includes('peer')) {
        socialScore += 0.1;
      }

      supportNeeds = Math.min((s.issues || []).length * 0.15, 1);

      const clamp = (v) => Math.max(0, Math.min(1, v));

      seen.set(s.id, {
        id: s.id,
        academicScore: clamp(academicScore),
        behaviorScore: clamp(behaviorScore),
        socialScore: clamp(socialScore),
        supportNeeds,
        original: s,
      });
    }

    const studentsForAlgo = Array.from(seen.values());
    if (studentsForAlgo.length === 0) return;

    const { seatMap } = generateSeatingChart(studentsForAlgo, rows, cols);

    const newDesks = desks.map((desk, index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;
      const seat = seatMap[row]?.[col] || null;
      const student = seat ? seat.original : null;
      return {
        ...desk,
        student,
        available: !student,
      };
    });

    setDesks(newDesks);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-950 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="space-y-8">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Spatial Intelligence</p>
            <h1 className="text-4xl font-semibold text-white mt-2">🪑 Classroom Simulation</h1>
            <p className="text-slate-400 text-lg mt-4">
              Drag, drop, and sculpt seating plans that reflect behavior and collaboration goals.
            </p>
          </div>

          {/* Instructions */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="font-semibold text-white">📝 How to use</p>
            <ul className="text-sm text-slate-400 mt-3 space-y-1 ml-4 list-disc">
              <li>Drag a student card onto any desk—empty desks highlight automatically.</li>
              <li>Save captures the current layout; Reset reverts to the default arrangement.</li>
              <li>Occupancy stats update live so you stay in control.</li>
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
            <Button variant="outline" onClick={handleAutoSort}>
              🧠 Auto-sort Seats
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Tip icon="💡" title="Collaboration" description="Pair complementary strengths to unlock peer learning." />
          <Tip icon="🎯" title="Behavior" description="Balance challenging behaviors with stabilizing peers." />
          <Tip icon="📚" title="Support" description="Group similar needs when delivering targeted instruction." />
          <Tip icon="👥" title="Social Flow" description="Rotate seating to keep social dynamics fresh and inclusive." />
        </div>
      </div>
      </div>
    </ProtectedRoute>
  );
}

function Tip({ icon, title, description }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="flex items-start space-x-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <h3 className="font-semibold text-white">{title}</h3>
          <p className="text-sm text-slate-400 mt-1">{description}</p>
        </div>
      </div>
    </div>
  );
}

