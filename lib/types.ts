// ─── Liga / League ───────────────────────────────────────────────────────────

export type LigaSlug = "bundesliga" | "2-bundesliga" | "3-liga";

export interface Liga {
  slug: LigaSlug;
  name: string;
  shortName: string;
  apiFootballId: number;
  oddsApiKey: string;
  season: number;
}

export const LIGEN: Liga[] = [
  {
    slug: "bundesliga",
    name: "1. Bundesliga",
    shortName: "BL1",
    apiFootballId: 78,
    oddsApiKey: "soccer_germany_bundesliga",
    season: 2025,
  },
  {
    slug: "2-bundesliga",
    name: "2. Bundesliga",
    shortName: "BL2",
    apiFootballId: 79,
    oddsApiKey: "soccer_germany_bundesliga2",
    season: 2025,
  },
  {
    slug: "3-liga",
    name: "3. Liga",
    shortName: "3L",
    apiFootballId: 80,
    oddsApiKey: "soccer_germany_liga3",
    season: 2025,
  },
];

// ─── Odds API ─────────────────────────────────────────────────────────────────

export interface Bookmaker {
  key: string;
  title: string;
  lastUpdate: string;
  markets: Market[];
}

export interface Market {
  key: string; // "h2h", "totals", "spreads"
  lastUpdate: string;
  outcomes: Outcome[];
}

export interface Outcome {
  name: string;
  price: number;
  point?: number;
}

export interface OddsEvent {
  id: string;
  sportKey: string;
  sportTitle: string;
  commenceTime: string;
  homeTeam: string;
  awayTeam: string;
  bookmakers: Bookmaker[];
}

export interface BestOdds {
  home: { price: number; bookmaker: string };
  draw: { price: number; bookmaker: string };
  away: { price: number; bookmaker: string };
}

// ─── API-Football ─────────────────────────────────────────────────────────────

export interface Team {
  id: number;
  name: string;
  code: string;
  country: string;
  founded: number;
  national: boolean;
  logo: string;
}

export interface TeamVenue {
  id: number;
  name: string;
  address: string;
  city: string;
  capacity: number;
  surface: string;
  image: string;
}

export interface TeamWithVenue {
  team: Team;
  venue: TeamVenue;
}

export interface Player {
  id: number;
  name: string;
  firstname: string;
  lastname: string;
  age: number;
  birth: { date: string; place: string; country: string };
  nationality: string;
  height: string;
  weight: string;
  injured: boolean;
  photo: string;
}

export interface PlayerStatistics {
  team: Team;
  league: { id: number; name: string; country: string; logo: string; season: number };
  games: {
    appearences: number;
    lineups: number;
    minutes: number;
    position: string;
    rating: string;
    captain: boolean;
  };
  goals: { total: number; conceded: number; assists: number; saves: number };
  passes: { total: number; key: number; accuracy: number };
  shots: { total: number; on: number };
  cards: { yellow: number; yellowred: number; red: number };
  dribbles: { attempts: number; success: number };
}

export interface PlayerWithStats {
  player: Player;
  statistics: PlayerStatistics[];
}

export interface Standing {
  rank: number;
  team: Team;
  points: number;
  goalsDiff: number;
  group: string;
  form: string;
  status: string;
  description: string;
  all: { played: number; win: number; draw: number; lose: number; goals: { for: number; against: number } };
  home: { played: number; win: number; draw: number; lose: number; goals: { for: number; against: number } };
  away: { played: number; win: number; draw: number; lose: number; goals: { for: number; against: number } };
}

export interface FixtureDetails {
  id: number;
  referee: string;
  timezone: string;
  date: string;
  timestamp: number;
  status: { long: string; short: string; elapsed: number | null };
  venue: { id: number; name: string; city: string };
}

// Matches the actual API-Football /fixtures response shape
export interface Fixture {
  fixture: FixtureDetails;
  league: { id: number; name: string; country: string; logo: string; season: number; round: string };
  teams: {
    home: Team & { winner: boolean | null };
    away: Team & { winner: boolean | null };
  };
  goals: { home: number | null; away: number | null };
  score: {
    halftime: { home: number | null; away: number | null };
    fulltime: { home: number | null; away: number | null };
    extratime: { home: number | null; away: number | null };
    penalty: { home: number | null; away: number | null };
  };
}

export interface SquadPlayer {
  id: number;
  name: string;
  age: number;
  number: number | null;
  position: string;
  photo: string;
}

// ─── UI helpers ───────────────────────────────────────────────────────────────

export interface MatchWithOdds {
  fixture: Fixture;
  odds: OddsEvent | null;
  bestOdds: BestOdds | null;
}

export type SpieltageMap = Record<string, Fixture[]>;
