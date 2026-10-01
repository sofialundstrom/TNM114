import type { Cell, ClueType, Target } from "../types/types";

// Creates a clue based on the terrain where the target is located
export function createClue(cells: Cell[], target: Target): ClueType {
  const targetCell = cells.find(
    (cell) => cell.x === target.x && cell.y === target.y,
  );

  if (targetCell?.terrain === "forest") {
    return "trees";
  }

  if (targetCell?.terrain === "park") {
    return "park";
  }

  if (targetCell?.terrain === "urban") {
    return "buildings";
  }

  if (targetCell?.terrain === "field") {
    return "open";
  }

  return "open";
}
