import type { Ship } from "./Ship";
import type { VoyageStatus } from "./VoyageStatus";

export interface Voyage {
  id: number;
  name: string;
  description: string;
  origin: string;
  destination: string;
  difficulty: "Easy" | "Moderate" | "Hard" | null;
  recommendedShip: "Scout" | "Freighter" | "Explorer" | "Fighter";
  reward: number;
  status?: VoyageStatus;
  imageUrl: string;
}



export type VoyageSetup = {
  voyage: Voyage | null;
  ship: Ship | null;
};
