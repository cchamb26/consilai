export interface SeatingStudent {
  id: string;
  academicScore: number;
  behaviorScore: number;
  socialScore: number;
  /**
   * Higher value means higher support needs / more intensive support.
   */
  supportNeeds: number;
  // Other fields can exist but are not used by the algorithm.
}

export interface Position {
  row: number;
  col: number;
}

export interface ImbalanceMetrics {
  local: Record<string, number>;
  global: number;
}

export interface SeatingChartResult {
  seatMap: (ScoredStudent | null)[][];
  compositeScores: Record<string, number>;
  imbalanceMetrics: ImbalanceMetrics;
}

interface ScoredStudent extends SeatingStudent {
  compositeScore: number;
}

type SeatGrid = (ScoredStudent | null)[][];

const ACADEMIC_WEIGHT = 0.5;
const BEHAVIOR_WEIGHT = 0.3;
const SOCIAL_WEIGHT = 0.2;
const SUPPORT_NEEDS_WEIGHT = -0.4;

const DEFAULT_LOCAL_IMBALANCE_THRESHOLD = 0.25;
const DEFAULT_MAX_ITERATIONS = 5;
const EPSILON = 1e-6;

// STEP 1 — COMPOSITE SCORE

export function computeCompositeScore(student: SeatingStudent): number {
  return (
    student.academicScore * ACADEMIC_WEIGHT +
    student.behaviorScore * BEHAVIOR_WEIGHT +
    student.socialScore * SOCIAL_WEIGHT +
    student.supportNeeds * SUPPORT_NEEDS_WEIGHT
  );
}

export function computeAllScores(
  students: SeatingStudent[],
): Record<string, number> {
  const scores: Record<string, number> = {};
  for (const student of students) {
    scores[student.id] = computeCompositeScore(student);
  }
  return scores;
}

// STEP 3 — INITIAL SEATING (SNAKE PATTERN)

export function snakePlaceStudents(
  students: ScoredStudent[],
  rows: number,
  cols: number,
): SeatGrid {
  const grid: SeatGrid = Array.from({ length: rows }, () =>
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

// STEP 4 — LOCAL RADIUS BALANCING HELPERS

export function getNeighbors(
  grid: SeatGrid,
  position: Position,
  radius: number,
): { position: Position; student: ScoredStudent }[] {
  const neighbors: { position: Position; student: ScoredStudent }[] = [];
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

export function computeLocalImbalance(
  grid: SeatGrid,
  position: Position,
  radius = 1,
): number {
  const current = grid[position.row]?.[position.col];
  if (!current) return 0;

  const neighbors = getNeighbors(grid, position, radius);
  if (neighbors.length === 0) return 0;

  const neighborAverage =
    neighbors.reduce(
      (sum, entry) => sum + entry.student.compositeScore,
      0,
    ) / neighbors.length;

  return Math.abs(current.compositeScore - neighborAverage);
}

// STEP 5 — GLOBAL IMBALANCE & SWAP SEARCH

export function computeGlobalImbalance(grid: SeatGrid): number {
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

export function findSwapCandidate(
  grid: SeatGrid,
  position: Position,
  localImbalanceThreshold = DEFAULT_LOCAL_IMBALANCE_THRESHOLD,
): Position | null {
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
      (sum, entry) => sum + entry.student.compositeScore,
      0,
    ) / neighbors.length;

  let bestCandidate: Position | null = null;
  let bestImprovement = 0;

  for (let r = 0; r < numRows; r += 1) {
    for (let c = 0; c < numCols; c += 1) {
      if (r === position.row && c === position.col) continue;
      const candidate = grid[r][c];
      if (!candidate) continue;

      const candidateImbalance = Math.abs(
        candidate.compositeScore - neighborAverage,
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
  grid: SeatGrid,
  maxIterations = DEFAULT_MAX_ITERATIONS,
  localImbalanceThreshold = DEFAULT_LOCAL_IMBALANCE_THRESHOLD,
): SeatGrid {
  const numRows = grid.length;
  const numCols = grid[0]?.length ?? 0;

  for (let iteration = 0; iteration < maxIterations; iteration += 1) {
    let improved = false;
    let baselineGlobal = computeGlobalImbalance(grid);

    for (let r = 0; r < numRows; r += 1) {
      for (let c = 0; c < numCols; c += 1) {
        const seat = grid[r][c];
        if (!seat) continue;

        const fromPos: Position = { row: r, col: c };
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
          // Revert swap if no global improvement.
          const back = grid[fromPos.row][fromPos.col];
          grid[fromPos.row][fromPos.col] = grid[toPos.row][toPos.col];
          grid[toPos.row][toPos.col] = back;
        }
      }
    }

    if (!improved) {
      break;
    }
  }

  return grid;
}

// STEP 6 — TOP-LEVEL GENERATION

export function generateSeatingChart(
  students: SeatingStudent[],
  rows: number,
  cols: number,
): SeatingChartResult {
  const compositeScores = computeAllScores(students);

  const scoredStudents: ScoredStudent[] = students
    .map((s) => ({
      ...s,
      compositeScore: compositeScores[s.id],
    }))
    .sort((a, b) => b.compositeScore - a.compositeScore);

  const initialGrid = snakePlaceStudents(scoredStudents, rows, cols);

  const balancedGrid = applyBalancing(initialGrid);

  const localImbalances: Record<string, number> = {};
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


