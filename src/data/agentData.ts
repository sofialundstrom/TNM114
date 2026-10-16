import type { Agent, AgentRole } from "../types/types";

// Max antal agenter av varje typ (totalt max 10, så y = i * 2 ryms på kartan)
export const MAX_PER_TYPE = 5;

// Skapar valfritt antal agenter av varje typ
export function createAgents(scoutCount: number, clueCount: number): Agent[] {
  const roles: AgentRole[] = [
    ...Array<AgentRole>(clueCount).fill("clue"),
    ...Array<AgentRole>(scoutCount).fill("scout"),
  ];

  const startPositions = [
    { x: 0, y: 9 },
    { x: 0, y: 10 },
    { x: 0, y: 8 },
    { x: 0, y: 11 },
    { x: 0, y: 7 },
    { x: 0, y: 12 },
    { x: 0, y: 6 },
    { x: 0, y: 13 },
    { x: 0, y: 5 },
    { x: 0, y: 14 },
  ];

  return roles.map(
    (role, i): Agent => ({
      id: i + 1,
      x: startPositions[i].x,
      y: startPositions[i].y,
      path: [],
      role,
    }),
  );
}
