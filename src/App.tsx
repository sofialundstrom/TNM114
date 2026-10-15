import "./App.css";
import { useState, useEffect } from "react";
import type { Agent, Target, ClueType } from "./types/types";
import Map from "./components/Map";
import { createMap, createRandomTarget } from "./data/mapData";
import { markAsSearched } from "./search/search";
import { findPath } from "./pathfinding/pathfinding";
import { createClue, getClueText } from "./data/clueData";
import { assignDestinations } from "./swarm/swarm";
import { createAgents, MAX_PER_TYPE } from "./data/agentData";

import {
  initializeProbabilities,
  updateProbabilities,
  updateAfterSearch,
  updateAfterFound,
} from "./ai/bayesian";

// Time required to enter each terrain type
function getMovementTime(terrain: string): number {
  switch (terrain) {
    case "forest":
      return 3;
    case "park":
    case "urban":
      return 2;
    case "field":
      return 1;
    default:
      return Infinity;
  }
}

function App() {
  // Stores the current state of the map
  const [cells, setCells] = useState(() =>
    initializeProbabilities(createMap()),
  );

  // Creates a random target and clue
  const [target] = useState<Target>(() => createRandomTarget(cells));
  const [clue] = useState<ClueType>(() => createClue(cells, target));

  const [clueUsed, setClueUsed] = useState(false);
  const [showProbabilities, setShowProbabilities] = useState(false);

  // Agent controls
  const [scoutCount, setScoutCount] = useState(2);
  const [clueCount, setClueCount] = useState(2);
  const [agents, setAgents] = useState<Agent[]>(() => createAgents(2, 2));

  function updateAgents(scouts: number, clues: number) {
    setScoutCount(scouts);
    setClueCount(clues);
    setAgents(createAgents(scouts, clues));
  }

  // Simulation state
  const [targetFound, setTargetFound] = useState(false);
  const [running, setRunning] = useState(false);

  // Search statistics
  const [totalSteps, setTotalSteps] = useState(0);
  const [searchRounds, setSearchRounds] = useState(0);

  function step() {
    let updatedCells = cells;
    let found = false;

    // Find agents that have reached their destination
    const idle = agents.filter((a) => a.path.length === 0);

    // Search the current cell
    for (const agent of idle) {
      updatedCells = markAsSearched(updatedCells, agent.x, agent.y);

      const foundTarget = agent.x === target.x && agent.y === target.y;

      if (foundTarget) {
        found = true;
        updatedCells = updateAfterFound(updatedCells, agent.x, agent.y);
        break;
      }

      updatedCells = updateAfterSearch(updatedCells, agent.x, agent.y);
    }

    // Count one simulation round
    setSearchRounds((prev) => prev + 1);

    // Stop immediately when the target is found
    if (found) {
      setCells(updatedCells);
      setTargetFound(true);
      setRunning(false);
      return;
    }

    // Assign destinations using swarm intelligence
    const destinations = assignDestinations(agents, updatedCells);

    let movements = 0;

    // Move agents using A* paths
    const nextAgents = agents.map((agent, i) => {
      let path = agent.path;

      if (path.length === 0) {
        path = findPath(agent, destinations[i], updatedCells);
      }

      const [next, ...rest] = path;

      if (next) {
        // Determine how long it takes to enter the next cell
        const nextCell = updatedCells.find(
          (cell) => cell.x === next.x && cell.y === next.y,
        );

        if (!nextCell) return { ...agent, path };

        const moveTime = agent.moveTime ?? getMovementTime(nextCell.terrain);

        // Wait until the movement is completed
        if (moveTime > 1) {
          return {
            ...agent,
            path,
            moveTime: moveTime - 1,
          };
        }

        movements++;

        return {
          ...agent,
          x: next.x,
          y: next.y,
          path: rest,
          moveTime: undefined,
        };
      }

      return {
        ...agent,
        path,
        moveTime: undefined,
      };
    });

    setTotalSteps((prev) => prev + movements);
    setCells(updatedCells);
    setAgents(nextAgents);
  }

  useEffect(() => {
    // Stop when paused or target is found
    if (!running || targetFound || agents.length === 0) return;

    const id = setTimeout(step, 300);

    return () => clearTimeout(id);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, targetFound, agents, cells]);

  // Calculate search statistics
  const cellsSearched = cells.filter((cell) => cell.searched === 1).length;

  const efficiencyScore =
    100 /
    (1 +
      0.003 *
        (searchRounds +
          totalSteps / Math.max(1, agents.length) +
          cellsSearched * 0.3));

  return (
    <div>
      <h1 className="title">Swarm Intelligence</h1>
      <div className="game-layout">
        <div className="map-section">
          <Map
            cells={cells}
            target={target}
            agents={agents}
            showProbabilities={showProbabilities}
          />
        </div>
        <div className="control-section">
          <p className="clue">Clue: {getClueText(clue)}</p>

          {/* Buttons */}
          <div>
            <button
              className="button"
              disabled={agents.length === 0 && !running}
              onClick={() => {
                if (!running && !clueUsed) {
                  setCells((currentCells) =>
                    updateProbabilities(currentCells, clue),
                  );

                  setClueUsed(true);
                }

                setRunning((r) => !r);
              }}
            >
              {running ? "Stop" : "Start"}
            </button>

            <button
              className="button"
              onClick={() => setShowProbabilities((show) => !show)}
            >
              {showProbabilities ? "Hide probabilities" : "Show probabilities"}
            </button>
          </div>

          {/* Agent controls */}
          <div className="sliders">
            <label className="scouts">
              Scouts: {scoutCount}
              <input
                type="range"
                min={0}
                max={MAX_PER_TYPE}
                value={scoutCount}
                disabled={running || clueUsed}
                onChange={(e) =>
                  updateAgents(Number(e.target.value), clueCount)
                }
              />
            </label>

            <label className="scouts">
              Clue agents: {clueCount}
              <input
                type="range"
                min={0}
                max={MAX_PER_TYPE}
                value={clueCount}
                disabled={running || clueUsed}
                onChange={(e) =>
                  updateAgents(scoutCount, Number(e.target.value))
                }
              />
            </label>
          </div>

          {targetFound && <p>Target found!</p>}

          {/* Search statistics */}
          <div className="results">
            <h2>Search Statistics</h2>

            {targetFound && (
              <p>Efficiency Score: {efficiencyScore.toFixed(1)} / 100</p>
            )}

            <p>Total steps: {totalSteps}</p>
            <p>Cells searched: {cellsSearched}</p>
            <p>Search rounds: {searchRounds}</p>
          </div>
        </div>{" "}
        {/* control-section */}
      </div>{" "}
      {/* game-layout */}
    </div>
  );
}

export default App;
