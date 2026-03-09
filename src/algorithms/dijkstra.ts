import type { GridNode, Position } from "../types/grid";

// Dijkstra implementation that accounts for node weights.
// The queue is sorted at each step to simulate a priority queue.
export function runDijkstra(
  grid: GridNode[][],
  start: Position,
  end: Position
): { visitedOrder: Position[]; path: Position[] } {
  const rows = grid.length;
  const cols = grid[0].length;

  const dist: number[][] = Array.from({ length: rows }, () =>
    Array(cols).fill(Infinity)
  );
  const visited: boolean[][] = Array.from({ length: rows }, () =>
    Array(cols).fill(false)
  );
  const prev: (Position | null)[][] = Array.from({ length: rows }, () =>
    Array(cols).fill(null)
  );

  const visitedOrder: Position[] = [];
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
    // Sort array by distance to ensure we always process the closest node next
    queue.sort((a, b) => dist[a.row][a.col] - dist[b.row][b.col]);
    const current = queue.shift() as Position;

    if (visited[current.row][current.col]) continue;
    visited[current.row][current.col] = true;
    visitedOrder.push(current);

    if (current.row === end.row && current.col === end.col) {
      break;
    }

    for (const dir of directions) {
      const newRow = current.row + dir.row;
      const newCol = current.col + dir.col;

      if (newRow < 0 || newRow >= rows || newCol < 0 || newCol >= cols) continue;
      if (grid[newRow][newCol].isWall) continue;

      const newDist = dist[current.row][current.col] + grid[newRow][newCol].weight;
      if (newDist < dist[newRow][newCol]) {
        dist[newRow][newCol] = newDist;
        prev[newRow][newCol] = current;
        // Check if the node is already in the queue to avoid duplicates
        // This makes the algorithm a bit more efficient with array shifts
        if (!queue.some(node => node.row === newRow && node.col === newCol)) {
          queue.push({ row: newRow, col: newCol });
        }
      }
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

