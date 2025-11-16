'use client';

import { useState, useEffect } from 'react';
import DeskGrid from '../../components/DeskGrid';
import Button from '../../components/Button';
import { Notification } from '../../components/Notification';
import { generateSeatingChart } from '../../lib/rbsbSeating';
import { ProtectedRoute } from '../../lib/ProtectedRoute';
import { getSupabaseClient } from '../../lib/supabaseClient';

export default function ClassroomPage() {
  const [desks, setDesks] = useState([]);
  const [rows, setRows] = useState(4);
  const [cols, setCols] = useState(4);
  const [initialRows, setInitialRows] = useState(4);
  const [initialCols, setInitialCols] = useState(4);
  const [lastSavedState, setLastSavedState] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [notification, setNotification] = useState(null);

  // Helper to set notification with type
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  // Load students from Supabase and initialize desks
  useEffect(() => {
    const init = async () => {
      try {
        const supabase = getSupabaseClient();
        // Fetch all students for the current teacher
        const { data, error } = await supabase
          .from('teacher_students')
          .select('*')
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Error fetching students for classroom:', error);
          setError('Failed to load students for classroom');
          setStudents([]);
        } else {
          const loadedStudents = data || [];
          setStudents(loadedStudents);

          // Load saved seating layout if it exists
          const savedSeating = typeof window !== 'undefined'
            ? window.localStorage.getItem('classroomSeating')
            : null;
          const savedLayout = savedSeating ? JSON.parse(savedSeating) : null;

          if (savedLayout) {
            // Map saved students by id to fresh copies from Supabase
            const studentById = new Map(
              loadedStudents.map((s) => [s.id, s]),
            );

            const placedStudentIds = new Set(
              savedLayout.desks
                .map((d) => d.student?.id)
                .filter(Boolean),
            );

            const newStudents = loadedStudents.filter(
              (s) => !placedStudentIds.has(s.id),
            );

            const currentCapacity =
              savedLayout.rows * savedLayout.cols;
            const neededCapacity =
              placedStudentIds.size + newStudents.length;

            let finalRows = savedLayout.rows;
            let finalCols = savedLayout.cols;

            if (neededCapacity > currentCapacity) {
              finalRows = Math.ceil(
                neededCapacity / savedLayout.cols,
              );
            }

            const newDeskCount = finalRows * finalCols;
            const updatedDesks = Array.from(
              { length: newDeskCount },
              (_, index) => {
                const row = Math.floor(index / finalCols);
                const col = index % finalCols;
                return {
                  id: `desk-${index + 1}`,
                  position: { x: col, y: row },
                  student: null,
                  available: true,
                };
              },
            );

            const usedStudentIds = new Set();

            // Preserve existing positions, but replace embedded student with fresh DB copy
            savedLayout.desks.forEach((oldDesk, oldIndex) => {
              const oldStudentId = oldDesk.student?.id;
              const freshStudent = oldStudentId
                ? studentById.get(oldStudentId)
                : null;

              if (freshStudent) {
                const oldRow = Math.floor(
                  oldIndex / savedLayout.cols,
                );
                const newRow = Math.min(
                  oldRow,
                  finalRows - 1,
                );
                const oldCol = oldIndex % savedLayout.cols;
                const newCol = Math.min(
                  oldCol,
                  finalCols - 1,
                );
                const newIndex =
                  newRow * finalCols + newCol;

                if (
                  newIndex < updatedDesks.length &&
                  !updatedDesks[newIndex].student
                ) {
                  updatedDesks[newIndex] = {
                    ...updatedDesks[newIndex],
                    student: freshStudent,
                    available: false,
                  };
                  usedStudentIds.add(freshStudent.id);
                }
              }
            });

            // Place new students in any remaining available desks
            let availableIndex = 0;
            newStudents.forEach((newStudent) => {
              while (
                availableIndex < updatedDesks.length &&
                updatedDesks[availableIndex].student
              ) {
                availableIndex += 1;
              }
              if (availableIndex < updatedDesks.length) {
                updatedDesks[availableIndex] = {
                  ...updatedDesks[availableIndex],
                  student: newStudent,
                  available: false,
                };
                usedStudentIds.add(newStudent.id);
                availableIndex += 1;
              }
            });

            setDesks(updatedDesks);
            setRows(finalRows);
            setCols(finalCols);
            setInitialRows(finalRows);
            setInitialCols(finalCols);
            setLastSavedState({
              ...savedLayout,
              desks: updatedDesks,
              rows: finalRows,
              cols: finalCols,
            });
          } else {
            // No saved layout: build a fresh grid from Supabase students
            const neededCapacity = loadedStudents.length;
            const initialCapacity = rows * cols;
            const finalRows =
              neededCapacity > initialCapacity
                ? Math.ceil(neededCapacity / cols)
                : rows;

            const initialDesks = Array.from(
              { length: finalRows * cols },
              (_, index) => ({
                id: `desk-${index + 1}`,
                position: {
                  x: index % cols,
                  y: Math.floor(index / cols),
                },
                student: loadedStudents[index] || null,
                available: !loadedStudents[index],
              }),
            );

            setDesks(initialDesks);
            setRows(finalRows);
            setInitialRows(finalRows);
            setInitialCols(cols);
          }
        }
      } catch (err) {
        console.error(
          'Unexpected error initializing classroom:',
          err,
        );
        setError('Failed to load students for classroom');
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []); // Only run once on mount, not when rows/cols change

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

    // Otherwise reset to initial state using current Supabase students
    const resetDesks = Array.from(
      { length: initialRows * initialCols },
      (_, index) => ({
        id: `desk-${index + 1}`,
        position: {
          x: index % initialCols,
          y: Math.floor(index / initialCols),
        },
        student: students[index] || null,
        available: !students[index],
      }),
    );
    
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
    const studentCount = students.length;
    const newRows = rows + 1;
    const newDeskCount = newRows * cols;
    
    if (newDeskCount < studentCount) {
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
    const studentCount = students.length;
    const newCols = cols + 1;
    const newDeskCount = rows * newCols;
    
    if (newDeskCount < studentCount) {
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
      <div className="min-h-screen bg-background-light dark:bg-background-dark py-16 transition-colors">
        <div className="w-full px-4 sm:px-6 lg:px-8 space-y-12" style={{ maxWidth: '100%' }}>
          {/* Header */}
          <div className="space-y-8 max-w-6xl mx-auto">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-text-secondary-light dark:text-text-secondary-dark">Spatial Intelligence</p>
              <h1 className="text-4xl font-semibold text-text-primary-light dark:text-text-primary-dark mt-2">🪑 Classroom Simulation</h1>
              <p className="text-text-secondary-light dark:text-text-secondary-dark text-lg mt-4">
                Drag, drop, and sculpt seating plans that reflect behavior and collaboration goals.
              </p>
            </div>

            {/* Instructions */}
            <div className="rounded-2xl border border-border dark:border-white/10 bg-surface-light dark:bg-surface-dark/50 p-6 transition-colors">
              <p className="font-semibold text-text-primary-light dark:text-text-primary-dark">📝 How to use</p>
              <ul className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-3 space-y-1 ml-4 list-disc">
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
            <div className="rounded-2xl border border-border dark:border-white/10 bg-surface-light dark:bg-surface-dark/50 p-6 max-w-6xl mx-auto transition-colors">
              <h3 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-6">Student Analytics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                {desks.map(desk => desk.student && (
                  <div key={desk.student.id} className="rounded-lg bg-primary-50 dark:bg-primary-900/30 p-4 border border-border dark:border-white/10 transition-colors">
                    <div className="flex items-start gap-3 mb-3">
                      <span className="text-2xl">{desk.student.avatar || '👤'}</span>
                      <div>
                        <p className="font-semibold text-text-primary-light dark:text-text-primary-dark">{desk.student.name}</p>
                        <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">{desk.student.grade}</p>
                      </div>
                    </div>
                    <div className="space-y-3 text-xs">
                      <div>
                        <p className="text-text-secondary-light dark:text-text-secondary-dark mb-1.5 font-semibold">Focus Areas:</p>
                        <div className="flex flex-wrap gap-1">
                          {(Array.isArray(desk.student.issues) ? desk.student.issues : []).length > 0 ? (
                            (Array.isArray(desk.student.issues) ? desk.student.issues : []).map((issue, idx) => (
                              <span key={idx} className="px-1.5 py-0.5 rounded-full bg-rose-500/20 dark:bg-rose-500/30 text-rose-700 dark:text-rose-300 border border-rose-500/40 dark:border-rose-500/50 text-[10px]">
                                {issue}
                              </span>
                            ))
                          ) : (
                            <span className="text-text-secondary-light dark:text-text-secondary-dark">None</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-text-secondary-light dark:text-text-secondary-dark mb-1.5 font-semibold">Strengths:</p>
                        <div className="flex flex-wrap gap-1">
                          {(Array.isArray(desk.student.strengths) ? desk.student.strengths : []).length > 0 ? (
                            (Array.isArray(desk.student.strengths) ? desk.student.strengths : []).map((strength, idx) => (
                              <span key={idx} className="px-1.5 py-0.5 rounded-full bg-primary-200/50 dark:bg-primary-900/60 text-primary-800 dark:text-primary-200 border border-primary-400/50 dark:border-primary-700/50 text-[10px]">
                                {strength}
                              </span>
                            ))
                          ) : (
                            <span className="text-text-secondary-light dark:text-text-secondary-dark">None</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-text-secondary-light dark:text-text-secondary-dark mb-1.5 font-semibold">Learning Goals:</p>
                        <div className="flex flex-wrap gap-1">
                          {(Array.isArray(desk.student.goals) ? desk.student.goals : []).length > 0 ? (
                            (Array.isArray(desk.student.goals) ? desk.student.goals : []).map((goal, idx) => (
                              <span key={idx} className="px-1.5 py-0.5 rounded-full bg-secondary-200/50 dark:bg-secondary-900/60 text-secondary-800 dark:text-secondary-200 border border-secondary-400/50 dark:border-secondary-700/50 text-[10px]">
                                {goal}
                              </span>
                            ))
                          ) : (
                            <span className="text-text-secondary-light dark:text-text-secondary-dark">None</span>
                          )}
                        </div>
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
    <div className="rounded-2xl border border-border dark:border-white/10 bg-surface-light dark:bg-surface-dark/50 p-6 transition-colors">
      <div className="flex items-start space-x-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <h3 className="font-semibold text-text-primary-light dark:text-text-primary-dark">{title}</h3>
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1">{description}</p>
        </div>
      </div>
    </div>
  );
}

