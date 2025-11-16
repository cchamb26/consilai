'use client';

import { useState, useEffect } from 'react';
import DeskGrid from '../../components/DeskGrid';
import Button from '../../components/Button';
import { Notification } from '../../components/Notification';
import { generateSeatingChart } from '../../lib/rbsbSeating';
import { ProtectedRoute } from '../../lib/ProtectedRoute';

export default function ClassroomPage() {
  const [desks, setDesks] = useState([]);
  const [rows, setRows] = useState(4);
  const [cols, setCols] = useState(4);
  const [initialRows, setInitialRows] = useState(4);
  const [initialCols, setInitialCols] = useState(4);
  const [lastSavedState, setLastSavedState] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [notification, setNotification] = useState(null);

  // Helper to set notification with type
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  // Poll for student count changes and add rows if needed
  useEffect(() => {
    const interval = setInterval(() => {
      const savedStudents = localStorage.getItem('students');
      const students = savedStudents ? JSON.parse(savedStudents) : [];
      const currentCapacity = rows * cols;

      if (students.length > currentCapacity) {
        const rowsNeeded = Math.ceil(students.length / cols);
        const newDesks = Array.from({ length: rowsNeeded * cols }, (_, index) => {
          const row = Math.floor(index / cols);
          const col = index % cols;
          const student = students[index] || null;
          return {
            id: `desk-${index + 1}`,
            position: { x: col, y: row },
            student,
            available: !student,
          };
        });
        setDesks(newDesks);
        setRows(rowsNeeded);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [rows, cols]);

  // Load students from localStorage and initialize desks - refresh on every visit
  useEffect(() => {
    const savedStudents = localStorage.getItem('students');
    const students = savedStudents ? JSON.parse(savedStudents) : [];
    
    // Load saved seating layout if it exists
    const savedSeating = localStorage.getItem('classroomSeating');
    const savedLayout = savedSeating ? JSON.parse(savedSeating) : null;

    if (savedLayout) {
      // Collect all currently placed students from saved layout
      const placedStudentIds = new Set(savedLayout.desks.map(d => d.student?.id).filter(Boolean));
      
      // Find new students that aren't in the saved layout
      const newStudents = students.filter(s => !placedStudentIds.has(s.id));
      
      // Collect all students (existing + new)
      const allStudents = [...savedLayout.desks.map(d => d.student).filter(Boolean), ...newStudents];
      
      // Calculate if we need more desks
      const currentCapacity = savedLayout.rows * savedLayout.cols;
      const neededCapacity = allStudents.length;
      
      let finalRows = savedLayout.rows;
      let finalCols = savedLayout.cols;
      
      // Expand grid if needed to fit all students
      if (neededCapacity > currentCapacity) {
        finalRows = Math.ceil(neededCapacity / savedLayout.cols);
      }
      
      // Rebuild desks array - start with empty desks
      const newDeskCount = finalRows * finalCols;
      const updatedDesks = Array.from({ length: newDeskCount }, (_, index) => {
        const row = Math.floor(index / finalCols);
        const col = index % finalCols;
        return {
          id: `desk-${index + 1}`,
          position: { x: col, y: row },
          student: null,
          available: true,
        };
      });
      
      const usedStudentIds = new Set();
      
      // First pass: preserve existing student positions
      savedLayout.desks.forEach((oldDesk, oldIndex) => {
        if (oldDesk.student) {
          const oldRow = Math.floor(oldIndex / savedLayout.cols);
          const newRow = Math.min(oldRow, finalRows - 1);
          const oldCol = oldIndex % savedLayout.cols;
          const newCol = Math.min(oldCol, finalCols - 1);
          const newIndex = newRow * finalCols + newCol;
          
          if (newIndex < updatedDesks.length && !updatedDesks[newIndex].student) {
            updatedDesks[newIndex] = {
              ...updatedDesks[newIndex],
              student: oldDesk.student,
              available: false,
            };
            usedStudentIds.add(oldDesk.student.id);
          }
        }
      });
      
      // Second pass: place new students in available desks
      let availableIndex = 0;
      newStudents.forEach(newStudent => {
        while (availableIndex < updatedDesks.length && updatedDesks[availableIndex].student) {
          availableIndex++;
        }
        if (availableIndex < updatedDesks.length) {
          updatedDesks[availableIndex] = {
            ...updatedDesks[availableIndex],
            student: newStudent,
            available: false,
          };
          usedStudentIds.add(newStudent.id);
          availableIndex++;
        }
      });
      
      setDesks(updatedDesks);
      setRows(finalRows);
      setCols(finalCols);
      setInitialRows(finalRows);
      setInitialCols(finalCols);
      setLastSavedState({ ...savedLayout, desks: updatedDesks, rows: finalRows, cols: finalCols });
    } else {
      // Create initial desks with all students from localStorage
      const neededCapacity = students.length;
      const initialCapacity = rows * cols;
      const finalRows = neededCapacity > initialCapacity ? Math.ceil(neededCapacity / cols) : rows;
      
      const initialDesks = Array.from({ length: finalRows * cols }, (_, index) => ({
        id: `desk-${index + 1}`,
        position: { x: index % cols, y: Math.floor(index / cols) },
        student: students[index] || null,
        available: !students[index],
      }));
      setDesks(initialDesks);
      setRows(finalRows);
      setInitialRows(finalRows);
      setInitialCols(cols);
    }
  }, []);

  const handleSave = () => {
    const seatingData = {
      desks,
      rows,
      cols,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('classroomSeating', JSON.stringify(seatingData));
    setLastSavedState(seatingData);
    showNotification('Seating saved!');
  };

  const handleReset = () => {
    // If there's a saved state, reset to that
    if (lastSavedState) {
      setDesks(lastSavedState.desks);
      setRows(lastSavedState.rows);
      setCols(lastSavedState.cols);
      showNotification('Seating reset to last saved!');
      return;
    }

    // Otherwise reset to initial state
    const savedStudents = localStorage.getItem('students');
    const students = savedStudents ? JSON.parse(savedStudents) : [];
    
    const resetDesks = Array.from({ length: initialRows * initialCols }, (_, index) => ({
      id: `desk-${index + 1}`,
      position: { x: index % initialCols, y: Math.floor(index / initialCols) },
      student: students[index] || null,
      available: !students[index],
    }));
    
    setDesks(resetDesks);
    setRows(initialRows);
    setCols(initialCols);
    showNotification('Seating reset to default!');
  };

  const handleAutoSort = () => {
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
    showNotification('Seating auto sorted!');
  };

  const handleViewAnalytics = () => {
    setShowAnalytics(true);
    showNotification('Analytics shown!');
  };

  const handleHideAnalytics = () => {
    setShowAnalytics(false);
    showNotification('Analytics hidden!');
  };

  const handleExportCSV = () => {
    const csvRows = [];
    csvRows.push('Desk,Row,Col,Student Name,Grade,Email');
    
    desks.forEach((desk, index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;
      const student = desk.student;
      const name = student ? student.name : 'Empty';
      const grade = student ? student.grade : '-';
      const email = student ? student.email : '-';
      csvRows.push(`${index + 1},${row + 1},${col + 1},"${name}","${grade}","${email}"`);
    });

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `classroom-seating-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    showNotification('CSV exported!');
  };

  const handleAddRow = () => {
    const savedStudents = localStorage.getItem('students');
    const students = savedStudents ? JSON.parse(savedStudents) : [];
    const newRows = rows + 1;
    const newDeskCount = newRows * cols;
    
    if (newDeskCount < students.length) {
      showNotification('Not enough desks for every student!', 'error');
      return;
    }

    const newDesks = createDesksForGrid(newRows, cols, desks, students);
    setDesks(newDesks);
    setRows(newRows);
    showNotification(`Row added! Now ${newRows}x${cols} (${newDeskCount} desks)`);
  };

  const handleRemoveRow = () => {
    if (rows <= 1) {
      showNotification('Cannot have fewer than 1 row!', 'error');
      return;
    }

    // Check if we'd lose students on the last row
    const occupiedCount = desks.filter(d => d.student).length;
    const newRows = rows - 1;
    const newDeskCount = newRows * cols;
    
    if (newDeskCount < occupiedCount) {
      showNotification('Not enough desks for every student!', 'error');
      return;
    }

    const newDesks = createDesksForGrid(newRows, cols, desks, occupiedCount);
    setDesks(newDesks);
    setRows(newRows);
    showNotification(`Row removed! Now ${newRows}x${cols} (${newDeskCount} desks)`);
  };

  const handleAddCol = () => {
    const savedStudents = localStorage.getItem('students');
    const students = savedStudents ? JSON.parse(savedStudents) : [];
    const newCols = cols + 1;
    const newDeskCount = rows * newCols;
    
    if (newDeskCount < students.length) {
      showNotification('Not enough desks for every student!', 'error');
      return;
    }

    const newDesks = createDesksForGrid(rows, newCols, desks, students);
    setDesks(newDesks);
    setCols(newCols);
    showNotification(`Column added! Now ${rows}x${newCols} (${newDeskCount} desks)`);
  };

  const handleRemoveCol = () => {
    if (cols <= 1) {
      showNotification('Cannot have fewer than 1 column!', 'error');
      return;
    }

    // Check if we'd lose students in the rightmost column
    const occupiedCount = desks.filter(d => d.student).length;
    const newCols = cols - 1;
    const newDeskCount = rows * newCols;
    
    if (newDeskCount < occupiedCount) {
      showNotification('Not enough desks for every student!', 'error');
      return;
    }

    const newDesks = createDesksForGrid(rows, newCols, desks, occupiedCount);
    setDesks(newDesks);
    setCols(newCols);
    showNotification(`Column removed! Now ${rows}x${newCols} (${newDeskCount} desks)`);
  };

  const createDesksForGrid = (newRows, newCols, currentDesks, students) => {
    const newDeskCount = newRows * newCols;
    
    // Collect ALL students from current desks - no student should disappear
    const allStudents = [];
    const studentPositions = new Map(); // Map to preserve position if possible
    
    currentDesks.forEach((desk, index) => {
      if (desk.student) {
        const currentRow = Math.floor(index / cols);
        const currentCol = index % cols;
        allStudents.push(desk.student);
        // Store position info for preservation
        studentPositions.set(desk.student.id, { row: currentRow, col: currentCol });
      }
    });
    
    // Create new desks array (all empty initially)
    const newDesks = Array.from({ length: newDeskCount }, (_, index) => {
      const row = Math.floor(index / newCols);
      const col = index % newCols;
      return {
        id: `desk-${index + 1}`,
        position: { x: col, y: row },
        student: null,
        available: true,
      };
    });
    
    // First pass: Try to preserve existing positions where they fit in new grid
    const placedStudentIds = new Set();
    allStudents.forEach(student => {
      const position = studentPositions.get(student.id);
      if (position && position.row < newRows && position.col < newCols) {
        const newIndex = position.row * newCols + position.col;
        if (newIndex < newDesks.length && !newDesks[newIndex].student) {
          newDesks[newIndex] = {
            ...newDesks[newIndex],
            student,
            available: false,
          };
          placedStudentIds.add(student.id);
        }
      }
    });
    
    // Second pass: Place remaining students in available desks (those that couldn't keep their position)
    let availableIndex = 0;
    allStudents.forEach(student => {
      if (!placedStudentIds.has(student.id)) {
        // Find next available desk
        while (availableIndex < newDesks.length && newDesks[availableIndex].student) {
          availableIndex++;
        }
        if (availableIndex < newDesks.length) {
          newDesks[availableIndex] = {
            ...newDesks[availableIndex],
            student,
            available: false,
          };
          availableIndex++;
        }
      }
    });
    
    return newDesks;
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-950 py-16">
        <div className="w-full px-4 sm:px-6 lg:px-8 space-y-12" style={{ maxWidth: '100%' }}>
          {/* Header */}
          <div className="space-y-8 max-w-6xl mx-auto">
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
                <li>Save captures the current layout; Reset reverts to the saved arrangement.</li>
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
              <Button variant="outline" onClick={showAnalytics ? handleHideAnalytics : handleViewAnalytics}>
                {showAnalytics ? '📊 Hide Analytics' : '📊 View Analytics'}
              </Button>
              <Button variant="outline" onClick={handleExportCSV}>
                📥 Export CSV
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleAddRow}>
                  ➕ Row
                </Button>
                <Button variant="outline" onClick={handleRemoveRow}>
                  ➖ Row
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleAddCol}>
                  ➕ Col
                </Button>
                <Button variant="outline" onClick={handleRemoveCol}>
                  ➖ Col
                </Button>
              </div>
            </div>
          </div>

          {/* Analytics Panel */}
          {showAnalytics && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 max-w-6xl mx-auto">
              <h3 className="text-xl font-semibold text-white mb-6">Student Analytics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                {desks.map(desk => desk.student && (
                  <div key={desk.student.id} className="rounded-lg bg-slate-800 p-4 border border-white/10">
                    <div className="flex items-start gap-3 mb-3">
                      <span className="text-2xl">{desk.student.avatar}</span>
                      <div>
                        <p className="font-semibold text-white">{desk.student.name}</p>
                        <p className="text-xs text-slate-400">{desk.student.grade}</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div>
                        <p className="text-slate-400">Issues:</p>
                        <p className="text-slate-300">{desk.student.issues?.slice(0, 2).join(', ') || 'None'}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Strengths:</p>
                        <p className="text-slate-300">{desk.student.strengths?.slice(0, 2).join(', ') || 'None'}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Learning Goals:</p>
                        <p className="text-slate-300">{desk.student.goals?.slice(0, 2).join(', ') || 'None'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Desk Grid */}
          <DeskGrid initialDesks={desks} onDesksChange={setDesks} cols={cols} />

          {/* Tips Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            <Tip icon="💡" title="Collaboration" description="Pair complementary strengths to unlock peer learning." />
            <Tip icon="🎯" title="Behavior" description="Balance challenging behaviors with stabilizing peers." />
            <Tip icon="📚" title="Support" description="Group similar needs when delivering targeted instruction." />
            <Tip icon="👥" title="Social Flow" description="Rotate seating to keep social dynamics fresh and inclusive." />
          </div>
        </div>
      </div>

      {notification && (
        <Notification 
          message={notification.message} 
          type={notification.type} 
          onClose={() => setNotification(null)} 
        />
      )}
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

