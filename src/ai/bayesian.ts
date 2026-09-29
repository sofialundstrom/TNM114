import type { Cell, ClueType } from "../types/types";

// Gives every searchable cell the same initial probability
export function initializeProbabilities(cells: Cell[]): Cell[] {
  const searchableCells = cells.filter((cell) => cell.terrain !== "water");

  const initialProbability = 1 / searchableCells.length;

  return cells.map((cell) => {
    if (cell.terrain === "water") {
      return {
        ...cell,
        probability: 0,
      };
    }

    return {
      ...cell,
      probability: initialProbability,
    };
  });
}
// Returns how well a terrain matches a specific clue
function getLikelihood(terrain: Cell["terrain"], clue: ClueType): number {
  if (clue === "trees") {
    switch (terrain) {
      case "forest":
        return 1.0;
      case "park":
        return 0.7;
      case "field":
        return 0.3;
      case "urban":
        return 0.15;
      case "water":
        return 0;
    }
  }

  if (clue === "park") {
    switch (terrain) {
      case "forest":
        return 0.5;
      case "park":
        return 1.0;
      case "field":
        return 0.5;
      case "urban":
        return 0.3;
      case "water":
        return 0;
    }
  }
  if (clue === "buildings") {
    switch (terrain) {
      case "forest":
        return 0.1;
      case "park":
        return 0.3;
      case "field":
        return 0.1;
      case "urban":
        return 1.0;
      case "water":
        return 0;
    }
  }

  if (clue === "open") {
    switch (terrain) {
      case "forest":
        return 0.2;
      case "park":
        return 0.5;
      case "field":
        return 1.0;
      case "urban":
        return 0.1;
      case "water":
        return 0;
    }
  }
  return 0;
}
// Updates probabilities based on a clue
export function updateProbabilities(cells: Cell[], clue: ClueType): Cell[] {
  const updatedCells = cells.map((cell) => {
    const likelihood = getLikelihood(cell.terrain, clue);

    return {
      ...cell,
      probability: cell.probability * likelihood,
    };
  });

  return normalizeProbabilities(updatedCells);
}

// Normalizes probabilities so they add up to 1
function normalizeProbabilities(cells: Cell[]): Cell[] {
  const totalProbability = cells.reduce(
    (sum, cell) => sum + cell.probability,
    0,
  );

  // Avoid division by zero
  if (totalProbability === 0) {
    return cells;
  }

  return cells.map((cell) => ({
    ...cell,
    probability: cell.probability / totalProbability,
  }));
}
