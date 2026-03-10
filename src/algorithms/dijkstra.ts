import type { GridNode, Position, AnimationStep } from "../types/grid";

// Dijkstra implementation that accounts for node weights.
// The queue is sorted at each step to simulate a priority queue.
export function runDijkstra(
  grid: GridNode[][],
  start: Position,
  end: Position
): AnimationStep[] {
  const rows = grid.length;
  const cols = grid[0].length;

  // keep track of shortest distance from start to each node
  const dist: number[][] = Array.from({ length: rows }, () =>
    Array(cols).fill(Infinity)
  );
  const visited: boolean[][] = Array.from({ length: rows }, () =>
    Array(cols).fill(false)
  );
  const prev: (Position | null)[][] = Array.from({ length: rows }, () =>
    Array(cols).fill(null)
  );

  const steps: AnimationStep[] = [];
  const queue: Position[] = [];

  dist[start.row][start.col] = 0;
  queue.push(start);

  const directions: Position[] = [
    { row: -1, col: 0 },
    { row: 1, col: 0 },
    { row: 0, col: -1 },
    { row: 0, col: 1 },
  ];

  while (queue.length > 0) {
    // always pick the closest node next
    queue.sort((a, b) => dist[a.row][a.col] - dist[b.row][b.col]);
    const current = queue.shift() as Position;

    if (visited[current.row][current.col]) continue;

    // mark node as visited
    visited[current.row][current.col] = true;
    steps.push({ type: "visit", row: current.row, col: current.col });

    if (current.row === end.row && current.col === end.col) {
      break; // reached end
    }

    // checking neighbors
    for (const dir of directions) {
      const newRow = current.row + dir.row;
      const newCol = current.col + dir.col;

      if (newRow < 0 || newRow >= rows || newCol < 0 || newCol >= cols) continue;
      if (grid[newRow][newCol].isWall) continue; // pass walls

      const newDist = dist[current.row][current.col] + grid[newRow][newCol].weight;
      if (newDist < dist[newRow][newCol]) {
        // update distance if we found a shorter path
        dist[newRow][newCol] = newDist;
        prev[newRow][newCol] = current;

        // only add to queue if not there already
        if (!queue.some(node => node.row === newRow && node.col === newCol)) {
          queue.push({ row: newRow, col: newCol });
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

