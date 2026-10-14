import type { Agent, AgentRole } from "../types/types";

// Max antal agenter av varje typ (totalt max 10, så y = i * 2 ryms på kartan)
export const MAX_PER_TYPE = 5;

// Skapar valfritt antal agenter av varje typ
export function createAgents(scoutCount: number, clueCount: number): Agent[] {
  const roles: AgentRole[] = [
    ...Array<AgentRole>(clueCount).fill("clue"),
    ...Array<AgentRole>(scoutCount).fill("scout"),
  ];

  return roles.map(
    (role, i): Agent => ({
      id: i + 1,
      x: 0,
      y: i * 2, // spridda längs vänstra kanten
      path: [],
      role,
    }),
  );
}