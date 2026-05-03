import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, TrendingUp, Users, Calendar } from "lucide-react";
import { LIGEN } from "@/lib/types";
import { getLigaBySlug } from "@/lib/utils";
import {
  getStandings,
  getTopScorers,
  getUpcomingFixtures,
  getCurrentRound,
  roundToSpieltag,
  teamToSlug,
} from "@/lib/football-api";
import { getUpcomingOdds } from "@/lib/odds-api";
import { TeamCard } from "@/components/TeamCard";
import { PlayerCard } from "@/components/PlayerCard";
import { OddsTable } from "@/components/OddsTable";

export const revalidate = 3600;

interface Props {
  params: Promise<{ liga: string }>;
}

export async function generateStaticParams() {
  return LIGEN.map((l) => ({ liga: l.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { liga: ligaSlug } = await params;
  const liga = getLigaBySlug(ligaSlug);
  if (!liga) return {};

  return {
    title: `${liga.name} – Tabelle, Quoten & Statistiken`,
    description: `Aktuelle Tabelle, Torschützen, Wettquoten und Spieltage der ${liga.name} ${liga.season}/${liga.season + 1}.`,
    alternates: { canonical: `/bundesliga/${liga.slug}` },
  };
}

export default async function LigaPage({ params }: Props) {
  const { liga: ligaSlug } = await params;
  const liga = getLigaBySlug(ligaSlug);
  if (!liga) notFound();

  const [standings, topScorers, upcomingFixtures, currentRound, odds] = await Promise.allSettled([
    getStandings(liga.apiFootballId, liga.season),
    getTopScorers(liga.apiFootballId, liga.season),
    getUpcomingFixtures(liga.apiFootballId, liga.season, 8),
    getCurrentRound(liga.apiFootballId, liga.season),
    getUpcomingOdds(liga.oddsApiKey),
  ]);

  const table = standings.status === "fulfilled" ? standings.value : [];
  const scorers = topScorers.status === "fulfilled" ? topScorers.value.slice(0, 5) : [];
  const fixtures = upcomingFixtures.status === "fulfilled" ? upcomingFixtures.value : [];
  const round = currentRound.status === "fulfilled" ? currentRound.value : null;
  const oddsData = odds.status === "fulfilled" ? odds.value.slice(0, 8) : [];

  const currentSpieltag = round ? roundToSpieltag(round) : null;

  // JSON-LD for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsOrganization",
    name: liga.name,
    sport: "Soccer",
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/bundesliga/${liga.slug}`,
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-10 animate-fade-in">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100">{liga.name}</h1>
          <p className="text-zinc-400 mt-1">Saison {liga.season}/{liga.season + 1}</p>
        </div>
        {currentSpieltag && (
          <Link
            href={`/spieltag/${liga.slug}/${currentSpieltag}`}
            className="btn-primary"
          >
            {round} <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>

      {/* Odds */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-brand-400" />
            Beste Quoten
          </h2>
          <Link href="/quoten" className="btn-ghost text-sm">
            Alle <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <OddsTable events={oddsData} ligaSlug={liga.slug} />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Tabelle */}
        <section>
          <h2 className="section-title flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-brand-400" />
            Tabelle
          </h2>
          {table.length > 0 ? (
            <div className="card divide-y divide-surface-border">
              <div className="flex items-center gap-3 px-4 py-2 text-xs text-zinc-600">
                <span className="w-6 text-center">#</span>
                <span className="flex-1">Verein</span>
                <span className="hidden sm:flex gap-4 mr-2 text-center">
                  <span title="Spiele">Sp</span>
                  <span title="Tordifferenz">±</span>
                </span>
                <span className="w-6 text-right">Pkt</span>
              </div>
              {table.map((s) => (
                <TeamCard key={s.team.id} standing={s} ligaSlug={liga.slug} />
              ))}
            </div>
          ) : (
            <div className="card p-8 text-center text-zinc-500">Tabelle nicht verfügbar.</div>
          )}
        </section>

        {/* Torschützen */}
        <section>
          <h2 className="section-title flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-brand-400" />
            Torschützen
          </h2>
          {scorers.length > 0 ? (
            <div className="flex flex-col gap-2">
              {scorers.map((p, i) => (
                <PlayerCard key={p.player.id} data={p} rank={i + 1} />
              ))}
            </div>
          ) : (
            <div className="card p-8 text-center text-zinc-500">Statistiken nicht verfügbar.</div>
          )}
        </section>
      </div>

      {/* Upcoming Spieltage links */}
      {fixtures.length > 0 && (
        <section>
          <h2 className="section-title mb-4">Nächste Spieltage</h2>
          <div className="flex flex-wrap gap-2">
            {[...new Set(fixtures.map((f) => roundToSpieltag(f.league.round)))].map((st) => (
              <Link
                key={st}
                href={`/spieltag/${liga.slug}/${st}`}
                className="btn-ghost text-sm"
              >
                Spieltag {st}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
