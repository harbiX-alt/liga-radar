import { unstable_cache } from "next/cache";
import type {
  Team,
  TeamWithVenue,
  PlayerWithStats,
  Standing,
  Fixture,
  SpieltageMap,
  SquadPlayer,
} from "./types";

const BASE = process.env.FOOTBALL_API_BASE_URL!;
const KEY = process.env.FOOTBALL_API_KEY!;

interface ApiResponse<T> {
  get: string;
  parameters: Record<string, string>;
  errors: Record<string, string> | string[];
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
    throw new Error(`API-Football HTTP ${res.status}`);
  }

  const data: ApiResponse<T> = await res.json();

  // API returns errors in body (e.g. rate limit) with HTTP 200
  const errors = data.errors;
  if (errors && !Array.isArray(errors) && Object.keys(errors).length > 0) {
    throw new Error(`API-Football error: ${JSON.stringify(errors)}`);
  }

  return data.response;
}

// ─── Teams ────────────────────────────────────────────────────────────────────

// Cached at app level — teams change at most once per season
export const getTeamsByLeague = unstable_cache(
  async (leagueId: number, season: number): Promise<TeamWithVenue[]> =>
    footballGet<TeamWithVenue[]>("/teams", {
      league: String(leagueId),
      season: String(season),
    }),
  ["teams-by-league"],
  { revalidate: 86400 }
);

export async function getTeamById(teamId: number): Promise<TeamWithVenue | null> {
  const res = await footballGet<TeamWithVenue[]>("/teams", { id: String(teamId) });
  return res[0] ?? null;
}

// ─── Squad ────────────────────────────────────────────────────────────────────

export const getSquad = unstable_cache(
  async (teamId: number): Promise<SquadPlayer[]> => {
    const res = await footballGet<{ team: Team; players: SquadPlayer[] }[]>(
      "/players/squads",
      { team: String(teamId) }
    );
    return res[0]?.players ?? [];
  },
  ["squad"],
  { revalidate: 86400 }
);

// ─── Players ─────────────────────────────────────────────────────────────────

// Cache per league — reused by generateStaticParams AND page components
export const getTopScorers = unstable_cache(
  async (leagueId: number, season: number): Promise<PlayerWithStats[]> =>
    footballGet<PlayerWithStats[]>(
      "/players/topscorers",
      { league: String(leagueId), season: String(season) }
    ),
  ["top-scorers"],
  { revalidate: 3600 }
);

export const getTopAssists = unstable_cache(
  async (leagueId: number, season: number): Promise<PlayerWithStats[]> =>
    footballGet<PlayerWithStats[]>(
      "/players/topassists",
      { league: String(leagueId), season: String(season) }
    ),
  ["top-assists"],
  { revalidate: 3600 }
);

// Direct player fetch — only used for dynamic (non-top-scorer) player pages
export async function getPlayerById(
  playerId: number,
  season: number
): Promise<PlayerWithStats | null> {
  const res = await footballGet<PlayerWithStats[]>(
    "/players",
    { id: String(playerId), season: String(season) },
    3600
  );
  return res[0] ?? null;
}

// ─── Standings ────────────────────────────────────────────────────────────────

export const getStandings = unstable_cache(
  async (leagueId: number, season: number): Promise<Standing[]> => {
    const res = await footballGet<{ league: { standings: Standing[][] } }[]>(
      "/standings",
      { league: String(leagueId), season: String(season) }
    );
    return res[0]?.league?.standings?.[0] ?? [];
  },
  ["standings"],
  { revalidate: 3600 }
);

// ─── Fixtures ─────────────────────────────────────────────────────────────────

export const getFixturesByLeague = unstable_cache(
  async (leagueId: number, season: number): Promise<Fixture[]> =>
    footballGet<Fixture[]>(
      "/fixtures",
      { league: String(leagueId), season: String(season) },
      1800
    ),
  ["fixtures-by-league"],
  { revalidate: 1800 }
);

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

export async function getTeamNextFixtures(
  teamId: number,
  leagueId: number,
  season: number,
  limit = 5
): Promise<Fixture[]> {
  const all = await getFixturesByLeague(leagueId, season);
  const now = Date.now();
  return all
    .filter(
      (f) =>
        f.fixture.timestamp * 1000 > now &&
        (f.teams.home.id === teamId || f.teams.away.id === teamId)
    )
    .sort((a, b) => a.fixture.timestamp - b.fixture.timestamp)
    .slice(0, limit);
}

export async function getTeamRecentFixtures(
  teamId: number,
  leagueId: number,
  season: number,
  limit = 5
): Promise<Fixture[]> {
  const all = await getFixturesByLeague(leagueId, season);
  const now = Date.now();
  return all
    .filter(
      (f) =>
        f.fixture.timestamp * 1000 < now &&
        (f.teams.home.id === teamId || f.teams.away.id === teamId) &&
        ["FT", "AET", "PEN"].includes(f.fixture.status.short)
    )
    .sort((a, b) => b.fixture.timestamp - a.fixture.timestamp)
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
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9-]/g, "");
}

export function playerToSlug(firstname: string, lastname: string, id: number): string {
  const name = `${firstname}-${lastname}`
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9-]/g, "");
  return `${name}-${id}`;
}

export function slugToPlayerId(slug: string): number {
  const parts = slug.split("-");
  return parseInt(parts[parts.length - 1], 10);
}

export function roundToSpieltag(round: string): string {
  return round.split(" - ")[1] ?? round.replace(/\D/g, "");
}

export function spieltagToRound(spieltag: string): string {
  return `Regular Season - ${spieltag}`;
}
