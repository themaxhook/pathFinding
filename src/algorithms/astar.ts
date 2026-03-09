import type { GridNode, Position } from "../types/grid";

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
): { visitedOrder: Position[]; path: Position[] } {
  const rows = grid.length;
  const cols = grid[0].length;

  const gScore: number[][] = Array.from({ length: rows }, () =>
    Array(cols).fill(Infinity)
  );
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
  const visitedOrder: Position[] = [];

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
    // pick node with smallest fScore
    openSet.sort(
      (a, b) => fScore[a.row][a.col] - fScore[b.row][b.col]
    );
    const current = openSet.shift() as Position;

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

      const tentativeG = gScore[current.row][current.col] + grid[newRow][newCol].weight;
      if (tentativeG < gScore[newRow][newCol]) {
        gScore[newRow][newCol] = tentativeG;
        fScore[newRow][newCol] =
          tentativeG + manhattan({ row: newRow, col: newCol }, end);
        prev[newRow][newCol] = current;

        // We only add to openSet if it's not already there to optimize performance.
        // Even if we push duplicates, the visited[] check handles them safely.
        if (!openSet.some(node => node.row === newRow && node.col === newCol)) {
          openSet.push({ row: newRow, col: newCol });
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

