export type Terrain = "forest" | "park" | "urban" | "field" | "water";
export type ClueType = "i see trees" | "i think im in a park" | "there are buildings near me" | "the terrain is very open";
export type AgentRole = "scout" | "clue";

// one cell in the grid
export type Cell = {
  x: number;
  y: number;
  terrain: Terrain;
  probability: number;
  searched: number;
};

// person that should be found
export type Target = {
  x: number;
  y: number;
};

export type Agent = {
  id: number;
  x: number;
  y: number;
  path: Position[];
  role: AgentRole;
}

export type Position = {
  x: number;
  y: number;
}