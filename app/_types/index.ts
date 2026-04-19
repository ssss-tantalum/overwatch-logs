export type Tier =
  | "Bronze"
  | "Silver"
  | "Gold"
  | "Platinum"
  | "Diamond"
  | "Master"
  | "Grandmaster"
  | "Champion";

export type Division = 1 | 2 | 3 | 4 | 5;

export type Rule = "Control" | "Escort" | "Hybrid" | "Push" | "Clash";

export type MatchResult = "VICTORY" | "DEFEAT" | "DRAW";

export interface Rank {
  tier: Tier;
  division: Division;
}

export interface Match {
  id: string;
  date: string;
  season: number;
  rule: Rule;
  map: string;
  result: MatchResult;
  rank: Rank;
}

export interface Settings {
  playerName: string;
  hero: string;
  season: number;
  seasonGoalWins: number;
  initialRank: Rank;
}
