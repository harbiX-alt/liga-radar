import type { OddsEvent, BestOdds, Bookmaker } from "./types";

const BASE = process.env.ODDS_API_BASE_URL!;
const KEY = process.env.ODDS_API_KEY!;

// The Odds API returns snake_case — transform to our camelCase types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformEvent(raw: any): OddsEvent {
  return {
    id: raw.id,
    sportKey: raw.sport_key,
    sportTitle: raw.sport_title,
    commenceTime: raw.commence_time,
    homeTeam: raw.home_team,
    awayTeam: raw.away_team,
    bookmakers: (raw.bookmakers ?? []).map((bm: any) => ({
      key: bm.key,
      title: bm.title,
      lastUpdate: bm.last_update,
      markets: (bm.markets ?? []).map((m: any) => ({
        key: m.key,
        lastUpdate: m.last_update,
        outcomes: m.outcomes ?? [],
      })),
    })),
  };
}

async function oddsGet(path: string, params: Record<string, string> = {}): Promise<OddsEvent[]> {
  const url = new URL(`${BASE}${path}`);
  url.searchParams.set("apiKey", KEY);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

  const res = await fetch(url.toString(), {
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error(`Odds API error ${res.status}: ${await res.text()}`);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw: any[] = await res.json();
  return raw.map(transformEvent);
}

export async function getOddsForSport(
  sportKey: string,
  options: { regions?: string; markets?: string } = {}
): Promise<OddsEvent[]> {
  return oddsGet(`/sports/${sportKey}/odds`, {
    regions: options.regions ?? "eu",
    markets: options.markets ?? "h2h",
    oddsFormat: "decimal",
  });
}

export async function getUpcomingOdds(sportKey: string): Promise<OddsEvent[]> {
  const events = await getOddsForSport(sportKey);
  const now = Date.now();
  return events
    .filter((e) => new Date(e.commenceTime).getTime() > now)
    .sort((a, b) => new Date(a.commenceTime).getTime() - new Date(b.commenceTime).getTime())
    .slice(0, 20);
}

export function extractBestOdds(event: OddsEvent): BestOdds {
  const best: BestOdds = {
    home: { price: 0, bookmaker: "" },
    draw: { price: 0, bookmaker: "" },
    away: { price: 0, bookmaker: "" },
  };

  for (const bm of event.bookmakers) {
    const h2h = bm.markets.find((m) => m.key === "h2h");
    if (!h2h) continue;

    for (const outcome of h2h.outcomes) {
      if (outcome.name === event.homeTeam && outcome.price > best.home.price) {
        best.home = { price: outcome.price, bookmaker: bm.title };
      } else if (outcome.name === event.awayTeam && outcome.price > best.away.price) {
        best.away = { price: outcome.price, bookmaker: bm.title };
      } else if (outcome.name === "Draw" && outcome.price > best.draw.price) {
        best.draw = { price: outcome.price, bookmaker: bm.title };
      }
    }
  }

  return best;
}

export function getOddsForBookmaker(event: OddsEvent, bookmakerKey: string): Bookmaker | undefined {
  return event.bookmakers.find((bm) => bm.key === bookmakerKey);
}

export function formatOdds(price: number): string {
  return price.toFixed(2);
}
