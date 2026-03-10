import React, { useState } from "react";
import "./App.css";
import type { GridNode, AnimationStep } from "./types/grid";
import { createInitialGrid } from "./utils/grid";
import { runAlgorithm, type AlgorithmName } from "./algorithms";

function App() {
  // Store the grid as a 2D array of nodes
  const [grid, setGrid] = useState<GridNode[][]>(() => createInitialGrid());

  // Store start and end node positions (row and col) or null if not set
  const [startNode, setStartNode] = useState<{ row: number; col: number } | null>(null);
  const [endNode, setEndNode] = useState<{ row: number; col: number } | null>(null);

  // Store selected algorithm from the dropdown
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmName>("BFS");

  // Store status text shown in the navbar
  const [statusText, setStatusText] = useState<string>("Ready");

  // Store animation speed from the slider (just a number for now)
  const [speed, setSpeed] = useState<number>(50);

  // Track whether an animation is currently running.
  // When true, we will block user interactions.
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  // Track whether we are in "Add Walls" or "Add Weighted Nodes" mode
  const [isWeightMode, setIsWeightMode] = useState<boolean>(false);

  // This function is called whenever a cell is clicked
  const handleCellClick = (row: number, col: number) => {
    // Do not allow editing the grid while an algorithm is running
    if (isAnimating) {
      return;
    }
    // Copy the outer grid array (do not mutate existing state)
    const newGrid = [...grid];

    // Copy the row that we want to change
    const rowArray = [...newGrid[row]];

    // Copy the specific cell (node) that was clicked
    const node = { ...rowArray[col] };

    // Rule: First click sets Start node
    if (!startNode) {
      node.isStart = true;
      node.isEnd = false;
      node.isWall = false;
      node.weight = 1; // Reset weight if it becomes start

      rowArray[col] = node;
      newGrid[row] = rowArray;

      setGrid(newGrid);
      setStartNode({ row, col });
      setStatusText("Start node set");
      return;
    }

    // Rule: Second click sets End node
    if (!endNode) {
      // Do not allow end node on the same cell as start
      if (startNode.row === row && startNode.col === col) {
        setStatusText("End node cannot be on start node");
        return;
      }

      node.isEnd = true;
      node.isStart = false;
      node.isWall = false;
      node.weight = 1; // Reset weight if it becomes end

      rowArray[col] = node;
      newGrid[row] = rowArray;

      setGrid(newGrid);
      setEndNode({ row, col });
      setStatusText("End node set");
      return;
    }

    // After both start and end are set, clicking toggles walls
    // Do not allow start or end to become walls
    if (node.isStart || node.isEnd) {
      setStatusText("Start and End cannot be walls");
      return;
    }//

    if (isWeightMode) {
      // If a node already has a weight > 1, we reset it
      // Otherwise set to random value 5-20
      if (node.weight > 1) {
        node.weight = 1;
        setStatusText("Weight removed");
      } else {
        node.weight = Math.floor(Math.random() * (20 - 5 + 1)) + 5;
        node.isWall = false; // Weighted nodes cannot be walls
        setStatusText(`Weight ${node.weight} added`);
      }
    } else {
      // Wall mode toggling
      node.isWall = !node.isWall;
      if (node.isWall) {
        node.weight = 1; // Walls have no weight
      }
      setStatusText(node.isWall ? "Wall added" : "Wall removed");
    }

    rowArray[col] = node;
    newGrid[row] = rowArray;

    setGrid(newGrid);
  };

  // Clear only visited and path information, keep start, end and walls
  const handleClearPath = () => {
    if (isAnimating) {
      return;
    }
    const newGrid = grid.map((row) =>
      row.map((node) => ({
        ...node,
        isVisited: false,
        isPath: false,
      }))
    );

    setGrid(newGrid);
    setStatusText("Path cleared");
  };

  // Reset everything back to the initial state
  const handleResetGrid = () => {
    if (isAnimating) {
      return;
    }
    setGrid(createInitialGrid());
    setStartNode(null);
    setEndNode(null);
    setStatusText("Ready");
  };

  // Run the selected algorithm and animate the result
  const handleVisualize = () => {
    // Make sure we have a start and end node
    if (!startNode || !endNode) {
      setStatusText("Please set start and end nodes first");
      return;
    }

    // Clear any previous visited / path information before starting
    setGrid((oldGrid) =>
      oldGrid.map((row) =>
        row.map((node) => ({
          ...node,
          isVisited: false,
          isPath: false,
          // We keep the weight
        }))
      )
    );

    setIsAnimating(true);
    setStatusText("Running...");

    // Call the correct algorithm based on the user's selection
    const steps = runAlgorithm(
      selectedAlgorithm,
      grid,
      startNode,
      endNode
    );

    // Convert speed (1-100) to a delay in milliseconds.
    // Higher slider value = faster animation (smaller delay).
    const delay = 110 - speed;

    const animateStep = (step: AnimationStep) => {//blue ya yellow kr raha hai ye
      setGrid((prevGrid) => {
        const newGrid = [...prevGrid];
        const rowArray = [...newGrid[step.row]];
        const node = { ...rowArray[step.col] };

        // Do not change start/end colors
        if (!node.isStart && !node.isEnd) {
          if (step.type === "visit") {
            node.isVisited = true;
          } else if (step.type === "path") {
            node.isPath = true;
          }
        }

        rowArray[step.col] = node;
        newGrid[step.row] = rowArray;
        return newGrid;
      });
    };

    // Schedule all steps
    steps.forEach((step, index) => {
      setTimeout(() => {
        animateStep(step);
      }, index * delay);
    });

    // Re-enable interactions after the animation finishes
    setTimeout(() => {
      setIsAnimating(false);
      setStatusText("Finished");
    }, steps.length * delay);//we set all this to present Finished  after execution
  };

  return (
    <div className="app">
      {/* ===== NAVBAR ===== */}
      <div className="top-box">
        <div className="logo">Pathfinding Visualizer</div>

        <div className="nav-divider"></div>

        <div className="controls">
          <div className="control-group">
            <label className="algo-label">Choose Algorithm</label>
            <select
              value={selectedAlgorithm}
              disabled={isAnimating}
              onChange={(event) =>
                setSelectedAlgorithm(event.target.value as "BFS" | "DFS" | "Dijkstra" | "A*")
              }
            >
              <option value="BFS">BFS</option>
              <option value="DFS">DFS</option>
              <option value="Dijkstra">Dijkstra</option>
              <option value="A*">A*</option>
            </select>
          </div>

          <div className="control-group">
            <label>Speed</label>
            <input
              type="range"
              min={1}
              max={100}
              value={speed}
              disabled={isAnimating}
              onChange={(event) => setSpeed(Number(event.target.value))}
            />
          </div>

          <button
            className="primary-btn"
            onClick={handleVisualize}
            disabled={isAnimating}
          >
            Visualize
          </button>
          <button onClick={handleClearPath} disabled={isAnimating}>
            Clear Path
          </button>
          <button onClick={handleResetGrid} disabled={isAnimating}>
            Reset Grid
          </button>
          <button
            onClick={() => setIsWeightMode(!isWeightMode)}
            disabled={isAnimating}
            style={{ backgroundColor: isWeightMode ? '#f97316' : '#ecf0f1', color: isWeightMode ? 'white' : 'black' }}
          >
            Mode: {isWeightMode ? "Add Weighted Nodes" : "Add Walls"}
          </button>
        </div>

        <div className="nav-divider"></div>

        <div className="status">Status: {statusText}</div>
      </div>

      {/* ===== CONTENT ===== */}
      <div className="content">
        <div className="legend-title">Grid Legend</div>

        <div className="legend-box">
          <div className="legend-item">
            <span className="legend-color unvisited"></span> Unvisited Node
          </div>
          <div className="legend-item">
            <span className="legend-color visited"></span> Visited Node
          </div>
          <div className="legend-item">
            <span className="legend-color path"></span> Shortest Path
          </div>
          <div className="legend-item">
            <span className="legend-color wall"></span> Wall
          </div>
          <div className="legend-item">
            <span className="legend-color start"></span> Start Node
          </div>
          <div className="legend-item">
            <span className="legend-color end"></span> End Node
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: "#f97316" }}></span> Weighted Node
          </div>
        </div>

        <div className="grid-box">
          {/* Render the grid as a set of rows and columns */}
          <div className="grid">
            {grid.map((row, rowIndex) =>
              row.map((node) => {
                const { row, col, isStart, isEnd, isWall, isVisited, isPath, weight } = node;

                // Build class name based on node state
                let className = "node";
                if (isStart) className += " node-start";
                if (isEnd) className += " node-end";
                if (isWall) className += " node-wall";
                if (isVisited) className += " node-visited";
                if (isPath) className += " node-path";

                // Weighted node styles
                const isWeighted = weight > 1 && !isStart && !isEnd && !isWall && !isVisited && !isPath;

                const customStyle: React.CSSProperties = isWeighted ? {
                  backgroundColor: '#f97316', // orange
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: 'white',
                  fontSize: '10px',
                  fontWeight: 'bold',
                } : {};

                return (
                  <div
                    key={`${rowIndex}-${col}`}
                    className={className}
                    style={customStyle}
                    onClick={() => handleCellClick(row, col)}
                  >
                    {isWeighted ? weight : ""}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;