import type { Agent, Cell, Position } from "../types/types";
import { canMoveTo } from "../movement/movement";

// Hur nära en annan agents mål (i rutor) som räknas som "för nära"
const SPREAD_RADIUS = 5;
// Hur mycket poängen minskas om en ruta ligger för nära ett redan valt mål
const SPREAD_PENALTY = 0.2;

const distance = (a: Position, b: Position) =>
  Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

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

      // Hög sannolikhet är bra, långt avstånd är dåligt
      let score = cell.probability / (distance(agent, cell) + 1);

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