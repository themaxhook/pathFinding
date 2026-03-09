import type { GridNode, Position } from "../types/grid";

// Simple Breadth-First Search (BFS).
// Treats all edges as equal cost and finds the shortest path in steps.
export function runBfs(
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

  const queue: Position[] = [];
  const visitedOrder: Position[] = [];

  queue.push(start);
  visited[start.row][start.col] = true;

  const directions: Position[] = [
    { row: -1, col: 0 },
    { row: 1, col: 0 },
    { row: 0, col: -1 },
    { row: 0, col: 1 },
  ];

  while (queue.length > 0) {
    const current = queue.shift() as Position;
    visitedOrder.push(current);

    if (current.row === end.row && current.col === end.col) {
      break;
    }

    for (const dir of directions) {
      const newRow = current.row + dir.row;
      const newCol = current.col + dir.col;

      if (newRow < 0 || newRow >= rows || newCol < 0 || newCol >= cols) continue;
      if (grid[newRow][newCol].isWall) continue;
      if (visited[newRow][newCol]) continue;

      visited[newRow][newCol] = true;
      prev[newRow][newCol] = current;
      queue.push({ row: newRow, col: newCol });
    }
  }

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

