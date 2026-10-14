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

// Calculates the probability of a clue based on surrounding terrain
function getLikelihood(cell: Cell, cells: Cell[], clue: ClueType): number {
  const clueWeights: Record<ClueType, number> = {
    trees: 0,
    park: 0,
    buildings: 0,
    open: 0,
  };

  for (const nearbyCell of cells) {
    const distance =
      Math.abs(nearbyCell.x - cell.x) + Math.abs(nearbyCell.y - cell.y);

    // Only consider the current cell and directly adjacent cells
    if (distance > 1 || nearbyCell.terrain === "water") {
      continue;
    }

    const weight = 1 / (distance + 1);

    switch (nearbyCell.terrain) {
      case "forest":
        clueWeights.trees += weight;
        break;
      case "park":
        clueWeights.park += weight;
        break;
      case "urban":
        clueWeights.buildings += weight;
        break;
      case "field":
        clueWeights.open += weight;
        break;
    }
  }

  const totalWeight =
    clueWeights.trees +
    clueWeights.park +
    clueWeights.buildings +
    clueWeights.open;

  if (totalWeight === 0) {
    return 0;
  }

  // Probability of receiving this clue at this position
  return clueWeights[clue] / totalWeight;
}

// Updates probabilities using Bayesian reasoning
export function updateProbabilities(cells: Cell[], clue: ClueType): Cell[] {
  const updatedCells = cells.map((cell) => {
    const likelihood = getLikelihood(cell, cells, clue);

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

// Sets the found target position to probability 1
export function updateAfterFound(cells: Cell[], x: number, y: number): Cell[] {
  return cells.map((cell) => ({
    ...cell,
    probability: cell.x === x && cell.y === y ? 1 : 0,
  }));
}

// Removes the probability from a searched cell
export function updateAfterSearch(cells: Cell[], x: number, y: number): Cell[] {
  const updatedCells = cells.map((cell) => {
    if (cell.x === x && cell.y === y) {
      return {
        ...cell,
        probability: 0,
      };
    }

    return cell;
  });

  return normalizeProbabilities(updatedCells);
}
