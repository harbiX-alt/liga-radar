import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { LIGEN } from "@/lib/types";
import {
  getTeamsByLeague,
  getStandings,
  getTopScorers,
  getUpcomingFixtures,
  teamToSlug,
  playerToSlug,
} from "@/lib/football-api";
import { PlayerCard } from "@/components/PlayerCard";

export const revalidate = 3600;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  // Pre-generate for all teams in all leagues
  const slugs = new Set<string>();
  for (const liga of LIGEN) {
    try {
      const teams = await getTeamsByLeague(liga.apiFootballId, liga.season);
      for (const t of teams) slugs.add(teamToSlug(t.team.name));
    } catch {
      // skip if API fails during build
    }
  }
  return [...slugs].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  for (const liga of LIGEN) {
    try {
      const teams = await getTeamsByLeague(liga.apiFootballId, liga.season);
      const match = teams.find((t) => teamToSlug(t.team.name) === slug);
      if (match) {
        return {
          title: `${match.team.name} – Kader, Statistiken & Quoten`,
          description: `Alles über ${match.team.name}: Tabellen-Position, Kader, Torschützen und aktuelle Wettquoten.`,
          alternates: { canonical: `/verein/${slug}` },
          openGraph: match.team.logo ? { images: [{ url: match.team.logo }] } : {},
        };
      }
    } catch {}
  }

  return {};
}

export default async function VereinPage({ params }: Props) {
  const { slug } = await params;

  // Find team across all leagues
  let teamData = null;
  let liga = null;

  for (const l of LIGEN) {
    try {
      const teams = await getTeamsByLeague(l.apiFootballId, l.season);
      const match = teams.find((t) => teamToSlug(t.team.name) === slug);
      if (match) {
        teamData = match;
        liga = l;
        break;
      }
    } catch {}
  }

  if (!teamData || !liga) notFound();

  const { team, venue } = teamData;

  const [standings, topScorers, fixtures] = await Promise.allSettled([
    getStandings(liga.apiFootballId, liga.season),
    getTopScorers(liga.apiFootballId, liga.season),
    getUpcomingFixtures(liga.apiFootballId, liga.season, 5),
  ]);

  const tableData = standings.status === "fulfilled" ? standings.value : [];
  const standing = tableData.find((s) => s.team.id === team.id);

  const teamScorers =
    topScorers.status === "fulfilled"
      ? topScorers.value.filter((p) => p.statistics[0]?.team?.id === team.id)
      : [];

  const teamFixtures =
    fixtures.status === "fulfilled"
      ? fixtures.value.filter(
          (f) => f.teams.home.id === team.id || f.teams.away.id === team.id
        )
      : [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsTeam",
    name: team.name,
    sport: "Soccer",
    foundingDate: team.founded ? String(team.founded) : undefined,
    logo: team.logo,
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/verein/${slug}`,
    memberOf: { "@type": "SportsOrganization", name: liga.name },
    location: venue ? { "@type": "Place", name: venue.name, address: venue.city } : undefined,
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8 animate-fade-in">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Header */}
      <div className="card p-6 flex flex-col sm:flex-row gap-6 mb-8">
        {team.logo && (
          <Image src={team.logo} alt={team.name} width={80} height={80} className="object-contain flex-none" />
        )}
        <div className="flex-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-zinc-100">{team.name}</h1>
              <p className="text-zinc-400 mt-1">
                {liga.name} · Gegründet {team.founded ?? "—"}
              </p>
            </div>
            {standing && (
              <div className="text-right">
                <div className="text-4xl font-bold text-brand-400">{standing.rank}.</div>
                <div className="text-xs text-zinc-500">Tabellenplatz</div>
              </div>
            )}
          </div>

          {standing && (
            <div className="flex flex-wrap gap-4 mt-4 text-sm">
              <StatPill label="Punkte" value={standing.points} />
              <StatPill label="Spiele" value={standing.all.played} />
              <StatPill label="Siege" value={standing.all.win} />
              <StatPill label="Unentschieden" value={standing.all.draw} />
              <StatPill label="Niederlagen" value={standing.all.lose} />
              <StatPill label="Tore" value={`${standing.all.goals.for}:${standing.all.goals.against}`} />
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Stadion */}
        {venue && (
          <section className="card p-5">
            <h2 className="text-lg font-semibold text-zinc-100 mb-3">Stadion</h2>
            <div className="space-y-2 text-sm text-zinc-400">
              <div className="flex justify-between">
                <span>Name</span>
                <span className="text-zinc-200">{venue.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Stadt</span>
                <span className="text-zinc-200">{venue.city}</span>
              </div>
              <div className="flex justify-between">
                <span>Kapazität</span>
                <span className="text-zinc-200">{venue.capacity?.toLocaleString("de-DE")} Plätze</span>
              </div>
              <div className="flex justify-between">
                <span>Untergrund</span>
                <span className="text-zinc-200 capitalize">{venue.surface}</span>
              </div>
            </div>
          </section>
        )}

        {/* Top Scorer des Vereins */}
        <section>
          <h2 className="text-lg font-semibold text-zinc-100 mb-3">Torschützen</h2>
          {teamScorers.length > 0 ? (
            <div className="flex flex-col gap-2">
              {teamScorers.slice(0, 5).map((p, i) => (
                <PlayerCard key={p.player.id} data={p} rank={i + 1} />
              ))}
            </div>
          ) : (
            <div className="card p-6 text-center text-zinc-500 text-sm">Keine Daten verfügbar.</div>
          )}
        </section>
      </div>

      {/* Nächste Spiele */}
      {teamFixtures.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold text-zinc-100 mb-3">Nächste Spiele</h2>
          <div className="card divide-y divide-surface-border">
            {teamFixtures.map((f) => (
              <div key={f.fixture.id} className="flex items-center justify-between px-4 py-3">
                <span className="text-sm text-zinc-400">{f.league.round}</span>
                <span className="text-sm font-medium text-zinc-200">
                  {f.teams.home.name} vs. {f.teams.away.name}
                </span>
                <span className="text-xs text-zinc-500">
                  {new Date(f.fixture.date).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" })}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function StatPill({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="bg-surface-elevated rounded-lg px-3 py-2 text-center min-w-[70px]">
      <div className="text-lg font-bold text-zinc-100 tabular-nums">{value}</div>
      <div className="text-xs text-zinc-500">{label}</div>
    </div>
  );
}
