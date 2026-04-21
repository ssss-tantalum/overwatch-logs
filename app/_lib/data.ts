import type { Rank, Tier } from "../_types";

export const TIERS: Tier[] = [
  "Bronze",
  "Silver",
  "Gold",
  "Platinum",
  "Diamond",
  "Master",
  "Grandmaster",
  "Champion",
];

export const DIVISIONS = [1, 2, 3, 4, 5] as const;

export const RULES = ["Control", "Flashpoint", "Escort", "Hybrid", "Push"] as const;

export const MAPS_BY_RULE: Record<string, string[]> = {
  Control: [
    "Antarctic Peninsula",
    "Busan",
    "Ilios",
    "Lijiang Tower",
    "Nepal",
    "Oasis",
    "Samoa",
  ],
  Escort: [
    "Circuit Royal",
    "Dorado",
    "Havana",
    "Junkertown",
    "Rialto",
    "Route 66",
    "Shambali Monastery",
    "Watchpoint: Gibraltar",
  ],
  Hybrid: [
    "Blizzard World",
    "Eichenwalde",
    "Hollywood",
    "King's Row",
    "Midtown",
    "Numbani",
    "Paraíso",
  ],
  Push: ["Colosseo", "Esperança", "New Queen Street", "Runasapi"],
  Flashpoint: ["Aatlis", "New Junk City", "Suravasa"],
};

export const HEROES = [
  // Tank
  "Reinhardt",
].sort();

export function rankToNumber(rank: Rank): number {
  const tierIndex = TIERS.indexOf(rank.tier);
  return tierIndex * 5 + (6 - rank.division);
}

export function rankLabel(rank: Rank): string {
  return `${rank.tier} ${rank.division}`;
}
