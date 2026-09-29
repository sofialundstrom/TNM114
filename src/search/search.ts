import type { Cell } from "../types/types";

// Marks a specific cell as searched
export function markAsSearched(cells: Cell[], x: number, y: number): Cell[] {
  return cells.map((cell) => {
    if (cell.x === x && cell.y === y) {
      return {
        ...cell,
        searched: 1,
      };
    }

    return cell;
  });
}
