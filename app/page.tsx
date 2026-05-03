import Link from "next/link";
import { ArrowRight, TrendingUp, Users, Calendar } from "lucide-react";
import { LIGEN } from "@/lib/types";
import { getUpcomingOdds, extractBestOdds } from "@/lib/odds-api";
import { getTopScorers, getStandings } from "@/lib/football-api";
import { OddsTable } from "@/components/OddsTable";
import { PlayerCard } from "@/components/PlayerCard";
import { TeamCard } from "@/components/TeamCard";

export const revalidate = 300; // 5 min

async function getHomePageData() {
  const bundesliga = LIGEN[0]; // 1. Bundesliga

  const [odds, topScorers, standings] = await Promise.allSettled([
    getUpcomingOdds(bundesliga.oddsApiKey),
    getTopScorers(bundesliga.apiFootballId, bundesliga.season),
    getStandings(bundesliga.apiFootballId, bundesliga.season),
  ]);

  return {
    odds: odds.status === "fulfilled" ? odds.value.slice(0, 6) : [],
    topScorers: topScorers.status === "fulfilled" ? topScorers.value.slice(0, 5) : [],
    standings: standings.status === "fulfilled" ? standings.value.slice(0, 10) : [],
  };
}

export default async function HomePage() {
  const { odds, topScorers, standings } = await getHomePageData();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-12 animate-fade-in">
      {/* Hero */}
      <section className="text-center py-12 bg-hero-gradient rounded-2xl border border-surface-border">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-medium mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
          Live Quoten · Echtzeit-Updates
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-zinc-100 mb-4">
          Bundesliga{" "}
          <span className="text-brand-400">Quotenvergleich</span>
        </h1>
        <p className="text-zinc-400 text-lg max-w-xl mx-auto mb-8">
          Die besten Wettquoten für 1., 2. und 3. Bundesliga — direkt verglichen von den führenden deutschen Buchmachern.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/quoten" className="btn-primary">
            Alle Quoten anzeigen <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/bundesliga/bundesliga" className="btn-ghost">
            Tabelle & Statistiken
          </Link>
        </div>
      </section>

      {/* Liga quick links */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {LIGEN.map((liga) => (
            <Link
              key={liga.slug}
              href={`/bundesliga/${liga.slug}`}
              className="card p-5 hover:border-brand-500/40 transition-colors group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="badge bg-brand-900/40 text-brand-400 border border-brand-500/20">
                  {liga.shortName}
                </span>
                <ArrowRight className="h-4 w-4 text-zinc-600 group-hover:text-brand-400 group-hover:translate-x-1 transition-all" />
              </div>
              <h2 className="font-semibold text-zinc-100">{liga.name}</h2>
              <p className="text-xs text-zinc-500 mt-1">Quoten · Tabelle · Spieler</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Odds table */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="section-title flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-brand-400" />
              Aktuelle Bundesliga-Quoten
            </h2>
            <p className="section-subtitle mt-1">Nächste Spieltage · 1. Bundesliga</p>
          </div>
          <Link href="/quoten" className="btn-ghost text-sm">
            Alle anzeigen <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {odds.length > 0 ? (
          <OddsTable events={odds} ligaSlug="bundesliga" />
        ) : (
          <div className="card p-8 text-center text-zinc-500">
            Quoten werden geladen – API-Key in .env.local eintragen.
          </div>
        )}
      </section>

      {/* Bottom grid: Tabelle + Torschützen */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Tabelle */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title flex items-center gap-2">
              <Calendar className="h-5 w-5 text-brand-400" />
              Tabelle
            </h2>
            <Link href="/bundesliga/bundesliga" className="btn-ghost text-sm">
              Vollständig <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {standings.length > 0 ? (
            <div className="card divide-y divide-surface-border">
              {/* Header */}
              <div className="flex items-center gap-3 px-4 py-2 text-xs text-zinc-600">
                <span className="w-6 text-center">#</span>
                <span className="flex-1">Verein</span>
                <span className="hidden sm:flex gap-4 mr-2">
                  <span>Sp</span>
                  <span>Diff</span>
                </span>
                <span className="w-6 text-right font-bold">Pkt</span>
              </div>
              {standings.map((s) => (
                <TeamCard key={s.team.id} standing={s} ligaSlug="bundesliga" />
              ))}
            </div>
          ) : (
            <div className="card p-8 text-center text-zinc-500">
              Tabelle – API-Key eintragen.
            </div>
          )}
        </section>

        {/* Torschützen */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title flex items-center gap-2">
              <Users className="h-5 w-5 text-brand-400" />
              Torschützenkönige
            </h2>
            <Link href="/bundesliga/bundesliga" className="btn-ghost text-sm">
              Mehr <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {topScorers.length > 0 ? (
            <div className="flex flex-col gap-2">
              {topScorers.map((p, i) => (
                <PlayerCard key={p.player.id} data={p} rank={i + 1} />
              ))}
            </div>
          ) : (
            <div className="card p-8 text-center text-zinc-500">
              Spielerdaten – API-Key eintragen.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
