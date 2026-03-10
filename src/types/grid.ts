// Basic types for the pathfinding grid
// Each cell is represented as a GridNode

export type GridNode = {
  row: number;
  col: number;
  isStart: boolean;
  isEnd: boolean;
  isWall: boolean;
  isVisited: boolean;
  isPath: boolean;
  weight: number;
};

// Simple row/column position type
export type Position = {
  row: number;
  col: number;
};

// Represents a single step in the animation sequence
export type AnimationStep = {
  type: "visit" | "path";
  row: number;
  col: number;
};

