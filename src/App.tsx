import "./App.css";
import Map from "./components/Map";
import { createMap, target } from "./data/mapData";

const cells = createMap();

function App() {
  return (
    <div>
      <h1>Swarm Intelligence</h1>
      <div>
        <Map cells={cells} target={target} />
      </div>
    </div>
  );
}

export default App;
