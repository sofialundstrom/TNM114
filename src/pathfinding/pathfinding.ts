import type { Cell, Position } from "../types/types";
import { canMoveTo } from "../movement/movement";

// Movement cost for each terrain type
function getMovementCost(terrain: Cell["terrain"]): number {
  switch (terrain) {
    case "field":
      return 1;
    case "park":
      return 2;
    case "urban":
      return 2;
    case "forest":
      return 3;
    case "water":
      return Infinity;
  }
}

const key = (p: Position) => `${p.x},${p.y}`;

// Manhattan-avstånd, passar när man bara går upp/ner/vänster/höger
const heuristic = (a: Position, b: Position) =>
  Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

// Returnerar stegen från start till goal (start ingår inte).
// Tom lista = ingen väg finns.
export function findPath(
  start: Position,
  goal: Position,
  cells: Cell[],
): Position[] {
  if (!canMoveTo(goal.x, goal.y, cells)) return [];

  const open: Position[] = [start];
  const cameFrom = new Map<string, Position>();
  const gScore = new Map<string, number>([[key(start), 0]]);
  const fScore = new Map<string, number>([
    [key(start), heuristic(start, goal)],
  ]);

  while (open.length > 0) {
    // Ta noden med lägst fScore
    open.sort((a, b) => fScore.get(key(a))! - fScore.get(key(b))!);
    const current = open.shift()!;

    if (current.x === goal.x && current.y === goal.y) {
      const path: Position[] = [];
      let node: Position | undefined = current;
      while (node && key(node) !== key(start)) {
        path.unshift(node);
        node = cameFrom.get(key(node));
      }
      return path;
    }

    const neighbors: Position[] = [
      { x: current.x + 1, y: current.y },
      { x: current.x - 1, y: current.y },
      { x: current.x, y: current.y + 1 },
      { x: current.x, y: current.y - 1 },
    ];

    for (const n of neighbors) {
      if (!canMoveTo(n.x, n.y, cells)) continue; // undviker vatten

      const nextCell = cells.find((cell) => cell.x === n.x && cell.y === n.y);

      if (!nextCell) continue;

      const tentative =
        gScore.get(key(current))! + getMovementCost(nextCell.terrain);
      if (tentative < (gScore.get(key(n)) ?? Infinity)) {
        cameFrom.set(key(n), current);
        gScore.set(key(n), tentative);
        fScore.set(key(n), tentative + heuristic(n, goal));
        if (!open.some((o) => key(o) === key(n))) open.push(n);
      }
    }
  }

  return [];
}
