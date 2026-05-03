import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LIGEN } from "@/lib/types";
import { getLigaBySlug, formatDateTime } from "@/lib/utils";
import {
  getFixturesByRound,
  spieltagToRound,
  roundToSpieltag,
  getFixturesByLeague,
  groupFixturesBySpieltag,
} from "@/lib/football-api";
import { getUpcomingOdds } from "@/lib/odds-api";
import { OddsTable } from "@/components/OddsTable";
import { MatchCard } from "@/components/MatchCard";
import type { OddsEvent } from "@/lib/types";

export const revalidate = 1800;

interface Props {
  params: Promise<{ liga: string; spieltag: string }>;
}

export async function generateStaticParams() {
  const params: { liga: string; spieltag: string }[] = [];

  for (const liga of LIGEN) {
    try {
      const fixtures = await getFixturesByLeague(liga.apiFootballId, liga.season);
      const grouped = groupFixturesBySpieltag(fixtures);
      for (const round of Object.keys(grouped)) {
        params.push({ liga: liga.slug, spieltag: roundToSpieltag(round) });
      }
    } catch {
      // fallback: generate spieltage 1–34
      for (let i = 1; i <= 34; i++) {
        params.push({ liga: liga.slug, spieltag: String(i) });
      }
    }
  }

  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { liga: ligaSlug, spieltag } = await params;
  const liga = getLigaBySlug(ligaSlug);
  if (!liga) return {};

  return {
    title: `${liga.name} – ${spieltag}. Spieltag Quoten & Ergebnisse`,
    description: `Alle Spiele, Ergebnisse und Wettquoten des ${spieltag}. Spieltags der ${liga.name} ${liga.season}/${liga.season + 1}.`,
    alternates: { canonical: `/spieltag/${ligaSlug}/${spieltag}` },
  };
}

export default async function SpieltageePage({ params }: Props) {
  const { liga: ligaSlug, spieltag } = await params;
  const liga = getLigaBySlug(ligaSlug);
  if (!liga) notFound();

  const round = spieltagToRound(spieltag);

  const [fixtures, oddsEvents] = await Promise.allSettled([
    getFixturesByRound(liga.apiFootballId, liga.season, round),
    getUpcomingOdds(liga.oddsApiKey),
  ]);

  const games = fixtures.status === "fulfilled" ? fixtures.value : [];
  const odds = oddsEvents.status === "fulfilled" ? oddsEvents.value : [];

  if (games.length === 0) notFound();

  // Match fixtures to odds by team name
  function findOddsForFixture(homeTeam: string, awayTeam: string): OddsEvent | null {
    return (
      odds.find(
        (o) =>
          o.homeTeam.toLowerCase().includes(homeTeam.toLowerCase().split(" ")[0]) ||
          o.awayTeam.toLowerCase().includes(awayTeam.toLowerCase().split(" ")[0])
      ) ?? null
    );
  }

  const isFinished = games.every((g) => ["FT", "AET", "PEN"].includes(g.fixture.status.short));

  // JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: `${liga.name} ${spieltag}. Spieltag`,
    startDate: games[0]?.fixture.date,
    endDate: games[games.length - 1]?.fixture.date,
    location: { "@type": "Place", name: "Deutschland" },
  };


  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 animate-fade-in">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Header */}
      <div className="mb-8">
        <div className="text-sm text-zinc-500 mb-1">{liga.name} · Saison {liga.season}/{liga.season + 1}</div>
        <h1 className="text-3xl font-bold text-zinc-100">{spieltag}. Spieltag</h1>
        {games[0] && (
          <p className="text-zinc-400 mt-1 text-sm">
            {formatDateTime(games[0].fixture.date)}
            {games.length > 1 && ` – ${formatDateTime(games.at(-1)!.fixture.date)}`}
          </p>
        )}
      </div>

      {/* Odds table (only for upcoming matches) */}
      {!isFinished && odds.length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-zinc-100 mb-4">Wettquoten Vergleich</h2>
          <OddsTable events={odds.slice(0, games.length)} ligaSlug={liga.slug} />
        </section>
      )}

      {/* Match cards */}
      <section>
        <h2 className="text-lg font-semibold text-zinc-100 mb-4">
          {isFinished ? "Ergebnisse" : "Spielpaarungen"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {games.map((fixture) => (
            <MatchCard
              key={fixture.fixture.id}
              fixture={fixture}
              oddsEvent={findOddsForFixture(fixture.teams.home.name, fixture.teams.away.name)}
              ligaSlug={liga.slug}
            />
          ))}
        </div>
      </section>

      {/* Spieltag navigation */}
      <div className="flex items-center justify-between mt-10 pt-6 border-t border-surface-border">
        {parseInt(spieltag) > 1 && (
          <a href={`/spieltag/${liga.slug}/${parseInt(spieltag) - 1}`} className="btn-ghost">
            ← {parseInt(spieltag) - 1}. Spieltag
          </a>
        )}
        <span className="text-zinc-500 text-sm">{spieltag}. Spieltag</span>
        <a href={`/spieltag/${liga.slug}/${parseInt(spieltag) + 1}`} className="btn-ghost">
          {parseInt(spieltag) + 1}. Spieltag →
        </a>
      </div>
    </div>
  );
}
