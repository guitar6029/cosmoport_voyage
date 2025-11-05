export type ShipRole =
  | "Explorer"
  | "Interceptor"
  | "Hauler"
  | "Miner"
  | "Medic"
  | "Shuttle"
  | "Stealth"
  | "Freighter"
  | "Racer";

export type Rarity = "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary";

export interface ShipStats {
  speed: number; // 1–100 top speed
  maneuver: number; // 1–100 handling / turn rate
  cargo: number; // capacity units
  shield: number; // 1–100
  hull: number; // 1–100
  jumpRange: number; // light-years per jump
}

export interface Ship {
  id: string;
  name: string;
  role: ShipRole;
  className: string; // e.g., “C-Class”, “S-Class”
  manufacturer: string; // lore flavor
  size: "Small" | "Medium" | "Large";
  rarity: Rarity;
  crewCapacity: number;
  priceCredits: number; // in-game currency
  drive: "Warp" | "Quantum" | "Slipstream";
  hardpoints: number; // weapon/utility slots
  stats: ShipStats;
  tags: string[]; // styling/theme cues for art prompts
  images: {
    default: string;
    side1: string;
    side2: string;
  };
}
