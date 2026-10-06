import "./App.css";
import { useState, useEffect } from "react";
import type { Agent, Target, ClueType } from "./types/types";
import Map from "./components/Map";
import { createMap, createRandomTarget } from "./data/mapData";
import { initialAgents } from "./data/agentData";
import { canMoveTo } from "./movement/movement";
import { markAsSearched } from "./search/search";
import { findPath } from "./pathfinding/pathfinding";
import { createClue } from "./data/clueData";
import { assignDestinations } from "./swarm/swarm";

import { initializeProbabilities, updateProbabilities } from "./ai/bayesian";

function App() {
  // Stores the current state of the map
  const [cells, setCells] = useState(() =>
    initializeProbabilities(createMap()),
  );
  // Creates a random target when the simulation starts
  const [target] = useState<Target>(() => createRandomTarget(cells));
  const [clue] = useState<ClueType>(() => createClue(cells, target));

  // Stores the agents' current positions
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  
  // Stores if target is found
  const [targetFound, setTargetFound] = useState(false);
  const [running, setRunning] = useState(false);

  // Updates the probability map based on the clue
  function useClue() {
    setCells((currentCells) => updateProbabilities(currentCells, clue));
  }

  function moveAgents(dx: number, dy: number) {
    setAgents((currentAgents) =>
      currentAgents.map((agent) => {
        // Calculate the position the agent wants to move to
        const newX = agent.x + dx;
        const newY = agent.y + dy;

        // Stay in place if the new position is invalid
        if (!canMoveTo(newX, newY, cells)) {
          return agent;
        }

        // Move to the new position
        return {
          ...agent,
          x: newX,
          y: newY,
        };
      }),
    );
  }

  function search() {
    setCells((currentCells) => {
      let updatedCells = currentCells;

      agents.forEach((agent) => {
        updatedCells = markAsSearched(updatedCells, agent.x, agent.y);
      });

      return updatedCells;
    });
    // Check if an agent searches the target's position

    const found = agents.some(
      (agent) => agent.x === target.x && agent.y === target.y,
    );

    if (found) {
      setTargetFound(true);
    }
  }

  function step() {
      // 1. Agenter utan väg: sök av rutan de står på, och välj nytt mål
  let updatedCells = cells;
  let found = false;

  const idle = agents.filter((a) => a.path.length === 0);

  // Sök av rutan där en stillastående agent står
  idle.forEach((a) => {
    updatedCells = markAsSearched(updatedCells, a.x, a.y);
    if (a.x === target.x && a.y === target.y) found = true;
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
        <Map cells={cells} target={target} agents={agents} />
      </div>
      <button onClick={() => moveAgents(0, -1)}>↑</button>
      <button onClick={() => moveAgents(-1, 0)}>←</button>
      <button onClick={() => moveAgents(1, 0)}>→</button>
      <button onClick={() => moveAgents(0, 1)}>↓</button>
      <button onClick={step}>Step</button>
      <button onClick={() => setRunning((r) => !r)}>
        {running ? "Pause" : "Start"}
      </button>
      <button onClick={search}>Search</button>
      <button onClick={useClue}>Use clue</button>
      {targetFound && <p>Target found!</p>}
    </div>
  );
}

export default App;
