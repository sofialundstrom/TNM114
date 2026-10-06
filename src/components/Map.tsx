import type { Cell, Target, Agent as AgentType } from "../types/types";
import Agent from "./Agent";

type MapProps = {
  cells: Cell[];
  target: Target;
  agents: AgentType[];
  showProbabilities: boolean;
};
function Map({ cells, target, agents, showProbabilities }: MapProps) {
  return (
    <div className="map">
      {/* Loops through every cell in the array */}
      {cells.map((cell) => {
        // Checks if the target is located in this cell
        const hasTarget = cell.x === target.x && cell.y === target.y;

        const agent = agents.find(
          (agent) => agent.x === cell.x && agent.y === cell.y,
        );

        // Creates and returns a div for each cell
        return (
          <div
            // Unique key for each cell, e.g. "4-7" for x=4, y=7
            key={`${cell.x}-${cell.y}`}
            // Adds "cell", the terrain type, and "target" if the target is here
            className={`cell ${cell.terrain} ${cell.searched === 1 ? "searched" : ""}`}
          >
            {showProbabilities && (
              <span className="probability">
                {(cell.probability * 100).toFixed(1)}
              </span>
            )}
            {/* Shows a red X if the target is in this cell */}
            {hasTarget && <span className="target">×</span>}
            {agent && <Agent agent={agent} />}
          </div>
        );
      })}
    </div>
  );
}

export default Map;
