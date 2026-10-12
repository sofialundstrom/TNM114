import type { Cell, ClueType, Target } from "../types/types";

// Creates a clue based on the terrain where the target is located
export function createClue(cells: Cell[], target: Target): ClueType {
  const targetCell = cells.find(
    (cell) => cell.x === target.x && cell.y === target.y,
  );

  if (targetCell?.terrain === "forest") {
    return "i see trees";
  }

  if (targetCell?.terrain === "park") {
    return "i think im in a park";
  }

  if (targetCell?.terrain === "urban") {
    return "there are buildings near me";
  }

  if (targetCell?.terrain === "field") {
    return "the terrain is very open";
  }

  return "the terrain is very open";
}
