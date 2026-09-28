export type Terrain = "forest" | "park" | "urban" | "field" | "water";

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
};
