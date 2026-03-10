import type { GridNode, Position, AnimationStep } from "../types/grid";
import { runBfs } from "./bfs";
import { runDfs } from "./dfs";
import { runDijkstra } from "./dijkstra";
import { runAStar } from "./astar";

// All supported algorithm names in one place
export type AlgorithmName = "BFS" | "DFS" | "Dijkstra" | "A*";

// Simple wrapper that calls the correct algorithm based on its name
export function runAlgorithm(
  name: AlgorithmName,
  grid: GridNode[][],
  start: Position,
  end: Position
): AnimationStep[] {
  if (name === "BFS") return runBfs(grid, start, end);
  if (name === "DFS") return runDfs(grid, start, end);
  if (name === "Dijkstra") return runDijkstra(grid, start, end);
  // Default to A* for "A*"
  return runAStar(grid, start, end);
}

