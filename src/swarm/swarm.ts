import type { Agent, Cell, Position } from "../types/types";
import { canMoveTo } from "../movement/movement";

// Hur nära en annan agents mål (i rutor) som räknas som "för nära"
const SPREAD_RADIUS = 5;
// Hur mycket poängen minskas om en ruta ligger för nära ett redan valt mål
const SPREAD_PENALTY = 0.5;
// How much the score decreases near another agent
const AGENT_PENALTY = 0.6;
// Encourages agents to continue searching their current local area
const LOCAL_SEARCH_RADIUS = 3;
const LOCAL_SEARCH_BONUS = 1.5;

const distance = (a: Position, b: Position) =>
  Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

// How large an area around a cell should be considered
const AREA_RADIUS = 2;

// Calculates the total probability in the area around a cell
function getAreaProbability(cell: Cell, cells: Cell[]): number {
  return cells
    .filter(
      (otherCell) =>
        otherCell.searched === 0 && distance(cell, otherCell) <= AREA_RADIUS,
    )
    .reduce((sum, otherCell) => sum + otherCell.probability, 0);
}

// Calculates how much of the surrounding area has already been searched

function getAreaCoverage(cell: Cell, cells: Cell[]): number {
  const nearbyCells = cells.filter(
    (otherCell) =>
      otherCell.terrain !== "water" && distance(cell, otherCell) <= AREA_RADIUS,
  );

  if (nearbyCells.length === 0) return 0;

  const searchedCells = nearbyCells.filter(
    (otherCell) => otherCell.searched === 1,
  );

  return searchedCells.length / nearbyCells.length;
}

// Väljer en destination för varje agent.
// Returnerar en lista i samma ordning som agents.
export function assignDestinations(agents: Agent[], cells: Cell[]): Position[] {
  const chosen: Position[] = [];

  for (const agent of agents) {
    let best: Position = { x: agent.x, y: agent.y }; // stanna om inget bättre finns
    let bestScore = -Infinity;

    for (const cell of cells) {
      // Hoppa över sökta rutor och rutor man inte kan gå till (vatten)
      if (cell.searched === 1) continue;
      if (!canMoveTo(cell.x, cell.y, cells)) continue;

      const cellDistance = distance(agent, cell);

      const distancePenalty = 1 + cellDistance * 0.1;

      const areaProbability = getAreaProbability(cell, cells);
      const areaCoverage = getAreaCoverage(cell, cells);

      let score = (cell.probability + areaProbability) / distancePenalty;

      // Prefer areas that have not already been heavily searched
      score *= 1 - areaCoverage * 0.7;

      // Prefer nearby cells so the agent searches an area systematically
      if (cellDistance <= LOCAL_SEARCH_RADIUS) {
        score *= LOCAL_SEARCH_BONUS;
      }

      // Avoid areas where other agents already are
      for (const otherAgent of agents) {
        // Don't compare the agent with itself
        if (otherAgent.id === agent.id) continue;

        // Lower the score if the cell is close to another agent
        if (distance(cell, otherAgent) < SPREAD_RADIUS) {
          score *= AGENT_PENALTY;
        }
      }

      // Sprid ut agenterna: straffa rutor nära mål som redan valts
      for (const target of chosen) {
        if (distance(cell, target) < SPREAD_RADIUS) {
          score *= SPREAD_PENALTY;
        }
      }

      if (score > bestScore) {
        bestScore = score;
        best = { x: cell.x, y: cell.y };
      }
    }

    chosen.push(best);
  }

  return chosen;
}
