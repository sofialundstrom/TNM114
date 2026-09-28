import "./App.css";
import { useState } from "react";
import type { Agent } from "./types/types";
import Map from "./components/Map";
import { createMap, target } from "./data/mapData";
import { initialAgents } from "./data/agentData";

const cells = createMap();

function App() {
  // Stores the agents' current positions
  const [agents, setAgents] = useState<Agent[]>(initialAgents);

  function moveAgents() {
    setAgents((currentAgents) =>
      currentAgents.map((agent) => ({
        ...agent,
        x: agent.x + 1,
      })),
    );
  }

  return (
    <div>
      <h1>Swarm Intelligence</h1>
      <div>
        <Map cells={cells} target={target} agents={agents} />
      </div>
      <button onClick={moveAgents}>Move agents</button>
    </div>
  );
}

export default App;
