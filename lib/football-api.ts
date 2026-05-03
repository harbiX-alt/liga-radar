import type {
  Team,
  TeamWithVenue,
  PlayerWithStats,
  Standing,
  Fixture,
  SpieltageMap,
} from "./types";

const BASE = process.env.FOOTBALL_API_BASE_URL!;
const KEY = process.env.FOOTBALL_API_KEY!;

interface ApiResponse<T> {
  get: string;
  parameters: Record<string, string>;
  errors: string[];
  results: number;
  paging: { current: number; total: number };
  response: T;
}

async function footballGet<T>(
  path: string,
  params: Record<string, string> = {},
  revalidate = 3600
): Promise<T> {
  const url = new URL(`${BASE}${path}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

  const res = await fetch(url.toString(), {
    headers: {
      "x-rapidapi-host": "v3.football.api-sports.io",
      "x-rapidapi-key": KEY,
    },
    next: { revalidate },
  });

  if (!res.ok) {
    throw new Error(`API-Football error ${res.status}: ${await res.text()}`);
  }

  const data: ApiResponse<T> = await res.json();
  return data.response;
}

// ─── Teams ────────────────────────────────────────────────────────────────────

export async function getTeamsByLeague(leagueId: number, season: number): Promise<TeamWithVenue[]> {
  return footballGet<TeamWithVenue[]>("/teams", {
    league: String(leagueId),
    season: String(season),
  });
}

export async function getTeamById(teamId: number): Promise<TeamWithVenue | null> {
  const res = await footballGet<TeamWithVenue[]>("/teams", { id: String(teamId) });
  return res[0] ?? null;
}

export async function getTeamBySlug(
  slug: string,
  leagueId: number,
  season: number
): Promise<TeamWithVenue | null> {
  const teams = await getTeamsByLeague(leagueId, season);
  return teams.find((t) => teamToSlug(t.team.name) === slug) ?? null;
}

// ─── Players ─────────────────────────────────────────────────────────────────

export async function getTopScorers(leagueId: number, season: number): Promise<PlayerWithStats[]> {
  return footballGet<PlayerWithStats[]>(
    "/players/topscorers",
    { league: String(leagueId), season: String(season) },
    3600
  );
}

export async function getTopAssists(leagueId: number, season: number): Promise<PlayerWithStats[]> {
  return footballGet<PlayerWithStats[]>(
    "/players/topassists",
    { league: String(leagueId), season: String(season) },
    3600
  );
}

export async function getPlayerById(
  playerId: number,
  season: number,
  leagueId?: number
): Promise<PlayerWithStats | null> {
  const params: Record<string, string> = {
    id: String(playerId),
    season: String(season),
  };
  if (leagueId) params.league = String(leagueId);

  const res = await footballGet<PlayerWithStats[]>("/players", params, 3600);
  return res[0] ?? null;
}

export async function searchPlayers(
  name: string,
  leagueId: number,
  season: number
): Promise<PlayerWithStats[]> {
  return footballGet<PlayerWithStats[]>("/players", {
    search: name,
    league: String(leagueId),
    season: String(season),
  });
}

// ─── Standings ────────────────────────────────────────────────────────────────

export async function getStandings(leagueId: number, season: number): Promise<Standing[]> {
  const res = await footballGet<{ league: { standings: Standing[][] } }[]>(
    "/standings",
    { league: String(leagueId), season: String(season) },
    3600
  );
  return res[0]?.league?.standings?.[0] ?? [];
}

// ─── Fixtures ─────────────────────────────────────────────────────────────────

export async function getFixturesByLeague(
  leagueId: number,
  season: number
): Promise<Fixture[]> {
  return footballGet<Fixture[]>(
    "/fixtures",
    { league: String(leagueId), season: String(season) },
    1800
  );
}

export async function getFixturesByRound(
  leagueId: number,
  season: number,
  round: string
): Promise<Fixture[]> {
  return footballGet<Fixture[]>(
    "/fixtures",
    { league: String(leagueId), season: String(season), round },
    1800
  );
}

export async function getUpcomingFixtures(
  leagueId: number,
  season: number,
  limit = 10
): Promise<Fixture[]> {
  const all = await getFixturesByLeague(leagueId, season);
  const now = Date.now();
  return all
    .filter((f) => f.fixture.timestamp * 1000 > now)
    .sort((a, b) => a.fixture.timestamp - b.fixture.timestamp)
    .slice(0, limit);
}

export async function getCurrentRound(leagueId: number, season: number): Promise<string | null> {
  const res = await footballGet<string[]>(
    "/fixtures/rounds",
    { league: String(leagueId), season: String(season), current: "true" },
    600
  );
  return res[0] ?? null;
}

export function groupFixturesBySpieltag(fixtures: Fixture[]): SpieltageMap {
  return fixtures.reduce<SpieltageMap>((acc, f) => {
    const round = f.league.round;
    if (!acc[round]) acc[round] = [];
    acc[round].push(f);
    return acc;
  }, {});
}

// ─── Slug helpers ─────────────────────────────────────────────────────────────

export function teamToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[äöü]/g, (c) => ({ ä: "ae", ö: "oe", ü: "ue" }[c] ?? c))
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9-]/g, "");
}

export function playerToSlug(firstname: string, lastname: string, id: number): string {
  const name = `${firstname}-${lastname}`
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[äöü]/g, (c) => ({ ä: "ae", ö: "oe", ü: "ue" }[c] ?? c))
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9-]/g, "");
  return `${name}-${id}`;
}

export function slugToPlayerId(slug: string): number {
  const parts = slug.split("-");
  return parseInt(parts[parts.length - 1], 10);
}

export function roundToSpieltag(round: string): string {
  // "Regular Season - 12" → "12"
  return round.split(" - ")[1] ?? round.replace(/\D/g, "");
}

export function spieltagToRound(spieltag: string): string {
  return `Regular Season - ${spieltag}`;
}
