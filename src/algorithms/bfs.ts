import type { GridNode, Position, AnimationStep } from "../types/grid";

// Simple Breadth-First Search (BFS).
// Treats all edges as equal cost and finds the shortest path in steps.
export function runBfs(
  grid: GridNode[][],
  start: Position,
  end: Position
): AnimationStep[] {
  const rows = grid.length;
  const cols = grid[0].length;

  // track where we've been
  const visited: boolean[][] = Array.from({ length: rows }, () =>
    Array(cols).fill(false)
  );

  // keep track of how we got here to build the path later
  const prev: (Position | null)[][] = Array.from({ length: rows }, () =>
    Array(cols).fill(null)
  );

  const queue: Position[] = [];
  const steps: AnimationStep[] = [];

  // start at the beginning
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

    // mark node as visited for animation
    steps.push({ type: "visit", row: current.row, col: current.col });

    if (current.row === end.row && current.col === end.col) {
      break; // found the end!
    }

    // checking neighbors
    for (const dir of directions) {
      const newRow = current.row + dir.row;
      const newCol = current.col + dir.col;

      if (newRow < 0 || newRow >= rows || newCol < 0 || newCol >= cols) continue;
      if (grid[newRow][newCol].isWall) continue; // skip walls
      if (visited[newRow][newCol]) continue; // already been here

      visited[newRow][newCol] = true;
      prev[newRow][newCol] = current;
      queue.push({ row: newRow, col: newCol });
    }
  }

  // if we couldn't reach the end, just return what we explored
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

