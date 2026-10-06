import "./App.css";
import { useState, useEffect } from "react";
import type { Agent, Target, ClueType } from "./types/types";
import Map from "./components/Map";
import { createMap, createRandomTarget } from "./data/mapData";
import { initialAgents } from "./data/agentData";
import { markAsSearched } from "./search/search";
import { findPath } from "./pathfinding/pathfinding";
import { createClue } from "./data/clueData";
import { assignDestinations } from "./swarm/swarm";

import {
  initializeProbabilities,
  updateProbabilities,
  updateAfterSearch,
  updateAfterFound,
} from "./ai/bayesian";

function App() {
  // Stores the current state of the map
  const [cells, setCells] = useState(() =>
    initializeProbabilities(createMap()),
  );
  // Creates a random target when the simulation starts
  const [target] = useState<Target>(() => createRandomTarget(cells));
  const [clue] = useState<ClueType>(() => createClue(cells, target));
  const [clueUsed, setClueUsed] = useState(false);
  const [showProbabilities, setShowProbabilities] = useState(false);
  // Stores the agents' current positions
  const [agents, setAgents] = useState<Agent[]>(initialAgents);

  // Stores if target is found
  const [targetFound, setTargetFound] = useState(false);
  const [running, setRunning] = useState(false);

  function step() {
    // 1. Agenter utan väg: sök av rutan de står på, och välj nytt mål
    let updatedCells = cells;
    let found = false;

    const idle = agents.filter((a) => a.path.length === 0);

    // Sök av rutan där en stillastående agent står
    idle.forEach((a) => {
      updatedCells = markAsSearched(updatedCells, a.x, a.y);

      const foundTarget = a.x === target.x && a.y === target.y;

      if (foundTarget) {
        found = true;
        updatedCells = updateAfterFound(updatedCells, a.x, a.y);
      } else {
        updatedCells = updateAfterSearch(updatedCells, a.x, a.y);
      }
    });

    // Välj nya destinationer (med de uppdaterade cellerna)
    const destinations = assignDestinations(agents, updatedCells);

    const nextAgents = agents.map((a, i) => {
      let path = a.path;

      if (path.length === 0) {
        path = findPath(a, destinations[i], updatedCells);
      }

      // Gå ett steg
      const [next, ...rest] = path;
      return next ? { ...a, x: next.x, y: next.y, path: rest } : { ...a, path };
    });

    setCells(updatedCells);
    setAgents(nextAgents);
    if (found) setTargetFound(true);
  }

  useEffect(() => {
    // Stanna om simuleringen är pausad eller målet är hittat
    if (!running || targetFound) return;

    const id = setTimeout(step, 300); // 300 ms mellan varje steg
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, targetFound, agents, cells]);

  return (
    <div>
      <h1>Swarm Intelligence</h1>
      <p>Clue: {clue}</p>
      <div>
        <Map
          cells={cells}
          target={target}
          agents={agents}
          showProbabilities={showProbabilities}
        />
      </div>
      <button
        onClick={() => {
          if (!running && !clueUsed) {
            setCells((currentCells) => updateProbabilities(currentCells, clue));
            setClueUsed(true);
          }

          setRunning((r) => !r);
        }}
      >
        {running ? "Pause" : "Start"}
      </button>
      <button onClick={() => setShowProbabilities((show) => !show)}>
        {showProbabilities ? "Hide probabilities" : "Show probabilities"}
      </button>
      {targetFound && <p>Target found!</p>}
    </div>
  );
}

export default App;
