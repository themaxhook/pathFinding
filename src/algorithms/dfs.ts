import type { GridNode, Position } from "../types/grid";

// Simple Depth-First Search (DFS).
// Explores as far as possible along each branch before backtracking.
export function runDfs(
  grid: GridNode[][],
  start: Position,
  end: Position
): { visitedOrder: Position[]; path: Position[] } {
  const rows = grid.length;
  const cols = grid[0].length;

  const visited: boolean[][] = Array.from({ length: rows }, () =>
    Array(cols).fill(false)
  );

  const prev: (Position | null)[][] = Array.from({ length: rows }, () =>
    Array(cols).fill(null)
  );

  const visitedOrder: Position[] = [];

  const directions: Position[] = [
    { row: -1, col: 0 },
    { row: 1, col: 0 },
    { row: 0, col: -1 },
    { row: 0, col: 1 },
  ];

  // Return true if we reached the end, so we can stop exploring early
  function dfs(current: Position): boolean {
    if (visited[current.row][current.col]) return false;
    visited[current.row][current.col] = true;
    visitedOrder.push(current);

    if (current.row === end.row && current.col === end.col) {
      return true;
    }

    for (const dir of directions) {
      const newRow = current.row + dir.row;
      const newCol = current.col + dir.col;

      if (newRow < 0 || newRow >= rows || newCol < 0 || newCol >= cols) continue;
      if (grid[newRow][newCol].isWall) continue;
      if (visited[newRow][newCol]) continue;

      prev[newRow][newCol] = current;
      const found = dfs({ row: newRow, col: newCol });
      if (found) {
        return true;
      }
    }

    return false;
  }

  dfs(start);

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

  return { visitedOrder, path };
}

