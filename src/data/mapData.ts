import type { Cell, Terrain, Target } from "../types/types";

const MAP_WIDTH = 20;
const MAP_HEIGHT = 20;

// Creates a target at a random searchable position
export function createRandomTarget(cells: Cell[]): Target {
  const searchableCells = cells.filter((cell) => cell.terrain !== "water");

  const randomIndex = Math.floor(Math.random() * searchableCells.length);
  const randomCell = searchableCells[randomIndex];

  return {
    x: randomCell.x,
    y: randomCell.y,
  };
}

function getTerrain(x: number, y: number): Terrain {
  if (x < 7 && y < 10) {
    return "forest";
  }
  if (x >= 7 && x < 13 && y < 8) {
    return "park";
  }
  if (x > 15) {
    return "water";
  }
  if (y > 14 && x <= 15) {
    return "field";
  }
  return "urban";
}

export function createMap(): Cell[] {
  const cells: Cell[] = [];

  for (let y = 0; y < MAP_HEIGHT; y++) {
    for (let x = 0; x < MAP_WIDTH; x++) {
      cells.push({
        x,
        y,
        terrain: getTerrain(x, y),
        probability: 0,
        searched: 0,
      });
    }
  }

  return cells;
}
