import type { GridNode, Position, AnimationStep } from "../types/grid";

// DFS algorithm
// goes as deep as possible before backtracking
export function runDfs(
  grid: GridNode[][],
  start: Position,
  end: Position
): AnimationStep[] {
  const rows = grid.length;
  const cols = grid[0].length;

  const visited: boolean[][] = Array.from({ length: rows }, () =>
    Array(cols).fill(false)
  );

  const prev: (Position | null)[][] = Array.from({ length: rows }, () =>
    Array(cols).fill(null)
  );

  const steps: AnimationStep[] = [];

  const directions: Position[] = [
    { row: -1, col: 0 },
    { row: 1, col: 0 },
    { row: 0, col: -1 },
    { row: 0, col: 1 },
  ];

  function dfs(current: Position): boolean {
    if (visited[current.row][current.col]) return false;

    // mark node as visited
    visited[current.row][current.col] = true;
    steps.push({ type: "visit", row: current.row, col: current.col });

    if (current.row === end.row && current.col === end.col) {
      return true; // found it, stop searching
    }

    // checking neighbors
    for (const dir of directions) {
      const newRow = current.row + dir.row;
      const newCol = current.col + dir.col;

      if (newRow < 0 || newRow >= rows || newCol < 0 || newCol >= cols) continue;
      if (grid[newRow][newCol].isWall) continue; // skip walls
      if (visited[newRow][newCol]) continue; // skip visited

      prev[newRow][newCol] = current;
      const found = dfs({ row: newRow, col: newCol });
      if (found) {
        return true;
      }
    }

    return false;
  }

  dfs(start);

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

