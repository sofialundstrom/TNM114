import type { Cell, ClueType, Target } from "../types/types";

const CLUE_RADIUS = 1;

// Converts terrain to the clue associated with it
function terrainToClue(terrain: Cell["terrain"]): ClueType | null {
  switch (terrain) {
    case "forest":
      return "trees";
    case "park":
      return "park";
    case "urban":
      return "buildings";
    case "field":
      return "open";
    case "water":
      return null;
  }
}

// Creates a clue based on the environment around the target
export function createClue(cells: Cell[], target: Target): ClueType {
  const nearbyCells = cells.filter((cell) => {
    const distance = Math.abs(cell.x - target.x) + Math.abs(cell.y - target.y);

    return distance <= CLUE_RADIUS && cell.terrain !== "water";
  });

  // Give nearby terrain more influence than terrain further away
  const clueWeights: Record<ClueType, number> = {
    trees: 0,
    park: 0,
    buildings: 0,
    open: 0,
  };

  for (const cell of nearbyCells) {
    const clue = terrainToClue(cell.terrain);

    if (!clue) continue;

    const distance = Math.abs(cell.x - target.x) + Math.abs(cell.y - target.y);

    // Closer terrain has a larger influence on the clue
    const weight = 1 / (distance + 1);

    clueWeights[clue] += weight;
  }
  // Randomly choose a clue based on the surrounding terrain
  const totalWeight =
    clueWeights.trees +
    clueWeights.park +
    clueWeights.buildings +
    clueWeights.open;

  let random = Math.random() * totalWeight;

  for (const clue of Object.keys(clueWeights) as ClueType[]) {
    random -= clueWeights[clue];

    if (random <= 0 && clueWeights[clue] > 0) {
      return clue;
    }
  }

  return (
    (Object.keys(clueWeights) as ClueType[]).find(
      (clue) => clueWeights[clue] > 0,
    ) ?? "buildings"
  );
}

// Converts a clue type into text shown to the user
export function getClueText(clue: ClueType): string {
  switch (clue) {
    case "trees":
      return "i see trees";
    case "park":
      return "i think im in a park";
    case "buildings":
      return "there are buildings near me";
    case "open":
      return "the terrain is very open";
  }
}
