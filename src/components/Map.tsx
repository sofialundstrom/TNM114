import type { Cell, Target } from "../types/types";

type MapProps = {
  cells: Cell[];
  target: Target;
};

function Map({ cells, target }: MapProps) {
  return (
    <div className="map">
      {/* Loops through every cell in the array */}
      {cells.map((cell) => {
        // Checks if the target is located in this cell
        const hasTarget = cell.x === target.x && cell.y === target.y;

        // Creates and returns a div for each cell
        return (
          <div
            // Unique key for each cell, e.g. "4-7" for x=4, y=7
            key={`${cell.x}-${cell.y}`}
            // Adds "cell", the terrain type, and "target" if the target is here
            className={`cell ${cell.terrain}`}
          >
            {/* Shows a red X if the target is in this cell */}
            {hasTarget && <span className="target">×</span>}
          </div>
        );
      })}
    </div>
  );
}

export default Map;
