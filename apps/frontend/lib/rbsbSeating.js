// Radius-Based Score Balancing (RBSB) seating algorithm
// Pure, deterministic functions for computing a balanced seating chart.

// STEP 1 — COMPOSITE SCORE
export function computeCompositeScore(student) {
  const {
    academicScore = 0,
    behaviorScore = 0,
    socialScore = 0,
    supportNeeds = 0,
  } = student;

  return (
    academicScore * 0.5 +
    behaviorScore * 0.3 +
    socialScore * 0.2 +
    supportNeeds * -0.4
  );
}

export function computeAllScores(students) {
  const scores = {};
  for (const s of students) {
    scores[s.id] = computeCompositeScore(s);
  }
  return scores;
}

// STEP 3 — INITIAL SEATING (SNAKE PATTERN)
export function snakePlaceStudents(students, rows, cols) {
  const grid = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => null),
  );

  let index = 0;

  for (let r = 0; r < rows; r += 1) {
    const leftToRight = r % 2 === 0;
    if (leftToRight) {
      for (let c = 0; c < cols && index < students.length; c += 1) {
        grid[r][c] = students[index];
        index += 1;
      }
    } else {
      for (let c = cols - 1; c >= 0 && index < students.length; c -= 1) {
        grid[r][c] = students[index];
        index += 1;
      }
    }
  }

  return grid;
}

// HELPERS
function getNeighbors(grid, position, radius) {
  const neighbors = [];
  const { row, col } = position;
  const numRows = grid.length;
  const numCols = grid[0]?.length ?? 0;

  for (let dr = -radius; dr <= radius; dr += 1) {
    for (let dc = -radius; dc <= radius; dc += 1) {
      if (dr === 0 && dc === 0) continue;
      const nr = row + dr;
      const nc = col + dc;
      if (nr < 0 || nr >= numRows || nc < 0 || nc >= numCols) continue;
      const neighbor = grid[nr][nc];
      if (neighbor) {
        neighbors.push({ position: { row: nr, col: nc }, student: neighbor });
      }
    }
  }

  return neighbors;
}

export function computeLocalImbalance(grid, position, radius = 1) {
  const current = grid[position.row]?.[position.col];
  if (!current) return 0;

  const neighbors = getNeighbors(grid, position, radius);
  if (neighbors.length === 0) return 0;

  const neighborAverage =
    neighbors.reduce(
      (sum, entry) => sum + (entry.student.compositeScore ?? 0),
      0,
    ) / neighbors.length;

  return Math.abs((current.compositeScore ?? 0) - neighborAverage);
}

export function computeGlobalImbalance(grid) {
  let total = 0;
  const numRows = grid.length;
  const numCols = grid[0]?.length ?? 0;

  for (let r = 0; r < numRows; r += 1) {
    for (let c = 0; c < numCols; c += 1) {
      const seat = grid[r][c];
      if (!seat) continue;
      total += computeLocalImbalance(grid, { row: r, col: c });
    }
  }

  return total;
}

const DEFAULT_LOCAL_IMBALANCE_THRESHOLD = 0.25;
const DEFAULT_MAX_ITERATIONS = 4;
const EPSILON = 1e-6;

export function findSwapCandidate(
  grid,
  position,
  localImbalanceThreshold = DEFAULT_LOCAL_IMBALANCE_THRESHOLD,
) {
  const numRows = grid.length;
  const numCols = grid[0]?.length ?? 0;
  const current = grid[position.row]?.[position.col];
  if (!current) return null;

  const currentImbalance = computeLocalImbalance(grid, position);
  if (currentImbalance <= localImbalanceThreshold) return null;

  const neighbors = getNeighbors(grid, position, 1);
  if (neighbors.length === 0) return null;

  const neighborAverage =
    neighbors.reduce(
      (sum, entry) => sum + (entry.student.compositeScore ?? 0),
      0,
    ) / neighbors.length;

  let bestCandidate = null;
  let bestImprovement = 0;

  for (let r = 0; r < numRows; r += 1) {
    for (let c = 0; c < numCols; c += 1) {
      if (r === position.row && c === position.col) continue;
      const candidate = grid[r][c];
      if (!candidate) continue;

      const candidateImbalance = Math.abs(
        (candidate.compositeScore ?? 0) - neighborAverage,
      );
      const improvement = currentImbalance - candidateImbalance;

      if (improvement > bestImprovement + EPSILON) {
        bestImprovement = improvement;
        bestCandidate = { row: r, col: c };
      }
    }
  }

  return bestCandidate;
}

export function applyBalancing(
  grid,
  maxIterations = DEFAULT_MAX_ITERATIONS,
  localImbalanceThreshold = DEFAULT_LOCAL_IMBALANCE_THRESHOLD,
) {
  const numRows = grid.length;
  const numCols = grid[0]?.length ?? 0;

  for (let iteration = 0; iteration < maxIterations; iteration += 1) {
    let improved = false;
    let baselineGlobal = computeGlobalImbalance(grid);

    for (let r = 0; r < numRows; r += 1) {
      for (let c = 0; c < numCols; c += 1) {
        const seat = grid[r][c];
        if (!seat) continue;

        const fromPos = { row: r, col: c };
        const toPos = findSwapCandidate(
          grid,
          fromPos,
          localImbalanceThreshold,
        );
        if (!toPos) continue;

        // Simulate swap.
        const temp = grid[fromPos.row][fromPos.col];
        grid[fromPos.row][fromPos.col] = grid[toPos.row][toPos.col];
        grid[toPos.row][toPos.col] = temp;

        const newGlobal = computeGlobalImbalance(grid);

        if (newGlobal + EPSILON < baselineGlobal) {
          baselineGlobal = newGlobal;
          improved = true;
        } else {
          // Revert swap.
          const back = grid[fromPos.row][fromPos.col];
          grid[fromPos.row][fromPos.col] = grid[toPos.row][toPos.col];
          grid[toPos.row][toPos.col] = back;
        }
      }
    }

    if (!improved) break;
  }

  return grid;
}

// High-level generator
export function generateSeatingChart(students, rows, cols) {
  const compositeScores = computeAllScores(students);

  const scoredStudents = students
    .map((s) => ({
      ...s,
      compositeScore: compositeScores[s.id],
    }))
    .sort((a, b) => (b.compositeScore ?? 0) - (a.compositeScore ?? 0));

  const initialGrid = snakePlaceStudents(scoredStudents, rows, cols);
  const balancedGrid = applyBalancing(initialGrid);

  const localImbalances = {};
  const numRows = balancedGrid.length;
  const numCols = balancedGrid[0]?.length ?? 0;

  for (let r = 0; r < numRows; r += 1) {
    for (let c = 0; c < numCols; c += 1) {
      const seat = balancedGrid[r][c];
      if (!seat) continue;
      const imbalance = computeLocalImbalance(balancedGrid, { row: r, col: c });
      localImbalances[seat.id] = imbalance;
    }
  }

  const globalImbalance = computeGlobalImbalance(balancedGrid);

  return {
    seatMap: balancedGrid,
    compositeScores,
    imbalanceMetrics: {
      local: localImbalances,
      global: globalImbalance,
    },
  };
}


