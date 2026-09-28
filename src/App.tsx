import "./App.css";
import Map from "./components/Map";
import { createMap, target } from "./data/mapData";
import { initialAgents } from "./data/agentData";

const cells = createMap();

function App() {
  return (
    <div>
      <h1>Swarm Intelligence</h1>
      <div>
        <Map cells={cells} target={target} agents={initialAgents} />
      </div>
    </div>
  );
}

export default App;
