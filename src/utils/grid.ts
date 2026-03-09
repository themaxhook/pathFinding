import type { GridNode } from "../types/grid";

// Creates the initial 20 x 40 grid
// All nodes start as empty, non-wall, non-visited, non-path
export function createInitialGrid(): GridNode[][] {
  const rows = 20;
  const cols = 40;

  const newGrid: GridNode[][] = [];

  for (let row = 0; row < rows; row++) {
    const currentRow: GridNode[] = [];

    for (let col = 0; col < cols; col++) {
      currentRow.push({
        row,
        col,
        isStart: false,
        isEnd: false,
        isWall: false,
        isVisited: false,
        isPath: false,
        weight: 1,
      });
    }

    newGrid.push(currentRow);
  }

  return newGrid;
}

