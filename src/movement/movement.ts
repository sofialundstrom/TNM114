import type { Cell } from "../types/types";

// Checks if an agent is allowed to move to a position
export function canMoveTo(x: number, y: number, cells: Cell[]) {
  const cell = cells.find((cell) => cell.x === x && cell.y === y);

  // The position is valid if the cell exists and is not water
  return cell !== undefined && cell.terrain !== "water";
}
