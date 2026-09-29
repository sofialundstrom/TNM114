import "./App.css";
import { useState } from "react";
import type { Agent } from "./types/types";
import Map from "./components/Map";
import { createMap, target } from "./data/mapData";
import { initialAgents } from "./data/agentData";
import { canMoveTo } from "./movement/movement";
import { markAsSearched } from "./search/search";
import { findPath } from "./pathfinding/pathfinding";

import { initializeProbabilities } from "./ai/bayesian";

function App() {
  // Stores the current state of the map
  const [cells, setCells] = useState(() =>
    initializeProbabilities(createMap()),
  );
  // Stores the agents' current positions
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  // Stores if target is found
  const [targetFound, setTargetFound] = useState(false);
  console.log(findPath({ x: 0, y: 0 }, { x: 10, y: 10 }, cells)); // <-- här

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

  return (
    <div>
      <h1>Swarm Intelligence</h1>
      <div>
        <Map cells={cells} target={target} agents={agents} />
      </div>
      <button onClick={() => moveAgents(0, -1)}>↑</button>
      <button onClick={() => moveAgents(-1, 0)}>←</button>
      <button onClick={() => moveAgents(1, 0)}>→</button>
      <button onClick={() => moveAgents(0, 1)}>↓</button>
      <button onClick={search}>Search</button>
      {targetFound && <p>Target found!</p>}
    </div>
  );
}

export default App;
