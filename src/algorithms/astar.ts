import type { GridNode, Position, AnimationStep } from "../types/grid";

// Manhattan distance heuristic for A* (works well on grids)
function manhattan(a: Position, b: Position): number {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}

// Simple A* search.
// Uses gScore (cost so far) + heuristic to guide search.
export function runAStar(
  grid: GridNode[][],
  start: Position,
  end: Position
): AnimationStep[] {
  const rows = grid.length;
  const cols = grid[0].length;

  // cost from start to current node
  const gScore: number[][] = Array.from({ length: rows }, () =>
    Array(cols).fill(Infinity)
  );
  // estimated total cost from start to end
  const fScore: number[][] = Array.from({ length: rows }, () =>
    Array(cols).fill(Infinity)
  );
  const visited: boolean[][] = Array.from({ length: rows }, () =>
    Array(cols).fill(false)
  );
  const prev: (Position | null)[][] = Array.from({ length: rows }, () =>
    Array(cols).fill(null)
  );

  const openSet: Position[] = [];
  const steps: AnimationStep[] = [];

  gScore[start.row][start.col] = 0;
  fScore[start.row][start.col] = manhattan(start, end);
  openSet.push(start);

  const directions: Position[] = [
    { row: -1, col: 0 },
    { row: 1, col: 0 },
    { row: 0, col: -1 },
    { row: 0, col: 1 },
  ];

  while (openSet.length > 0) {
    // pick the node that looks best
    openSet.sort(
      (a, b) => fScore[a.row][a.col] - fScore[b.row][b.col]
    );
    const current = openSet.shift() as Position;

    if (visited[current.row][current.col]) continue;

    // mark node as visited
    visited[current.row][current.col] = true;
    steps.push({ type: "visit", row: current.row, col: current.col });

    if (current.row === end.row && current.col === end.col) {
      break; // found it
    }

    // checking neighbors
    for (const dir of directions) {
      const newRow = current.row + dir.row;
      const newCol = current.col + dir.col;

      if (newRow < 0 || newRow >= rows || newCol < 0 || newCol >= cols) continue;
      if (grid[newRow][newCol].isWall) continue; // skip walls

      const tentativeG = gScore[current.row][current.col] + grid[newRow][newCol].weight;
      if (tentativeG < gScore[newRow][newCol]) {
        // update scores if we found a better path
        gScore[newRow][newCol] = tentativeG;
        fScore[newRow][newCol] =
          tentativeG + manhattan({ row: newRow, col: newCol }, end);
        prev[newRow][newCol] = current;

        // add to openSet if it's not already tracking
        if (!openSet.some(node => node.row === newRow && node.col === newCol)) {
          openSet.push({ row: newRow, col: newCol });
        }
      }
    }
  }

  if (prev[end.row][end.col] === null) return steps;

  // backtracking to build final path
  const path: Position[] = [];
  let current: Position | null = end;

  while (current) {
    path.push(current);
    current = prev[current.row][current.col];

    if (current && current.row === start.row && current.col === start.col) {
      path.push(start);
      break;
    }
  }

  path.reverse();

  for (const pos of path) {
    steps.push({ type: "path", row: pos.row, col: pos.col });
  }

  return steps;
}

