import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { LIGEN } from "@/lib/types";
import {
  getTeamsByLeague,
  getStandings,
  getTopScorers,
  getTeamNextFixtures,
  getTeamRecentFixtures,
  getSquad,
  teamToSlug,
  playerToSlug,
  roundToSpieltag,
} from "@/lib/football-api";
import { getUpcomingOdds, extractBestOdds, formatOdds } from "@/lib/odds-api";
import { formatDate, formatDateTime, cn } from "@/lib/utils";

export const revalidate = 3600;

interface Props {
  params: Promise<{ slug: string }>;
}

// ─── Find team across all leagues ─────────────────────────────────────────────
async function findTeam(slug: string) {
  for (const liga of LIGEN) {
    const teams = await getTeamsByLeague(liga.apiFootballId, liga.season).catch(() => []);
    const match = teams.find((t) => teamToSlug(t.team.name) === slug);
    if (match) return { teamData: match, liga };
  }
  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const found = await findTeam(slug);
  if (!found) return {};

  const { teamData, liga } = found;
  const { team } = teamData;

  return {
    title: `${team.name} – Kader, Tabelle & Quoten | Liga Radar`,
    description: `Alles über ${team.name}: Tabellenplatz, kompletter Kader, nächste Spiele und aktuelle Wettquoten in der ${liga.name}.`,
    alternates: { canonical: `/verein/${slug}` },
    openGraph: {
      title: `${team.name} | Liga Radar`,
      description: `${liga.name} · Kader, Tabelle & Quoten`,
      images: team.logo ? [{ url: team.logo, width: 200, height: 200 }] : [],
    },
  };
}

export default async function VereinPage({ params }: Props) {
  const { slug } = await params;
  const found = await findTeam(slug);
  if (!found) notFound();

  const { teamData, liga } = found;
  const { team, venue } = teamData;

  // All data in parallel — all heavy calls use unstable_cache
  const [standingsRes, scorersRes, squadRes, upcomingRes, recentRes, oddsRes] =
    await Promise.allSettled([
      getStandings(liga.apiFootballId, liga.season),
      getTopScorers(liga.apiFootballId, liga.season),
      getSquad(team.id),
      getTeamNextFixtures(team.id, liga.apiFootballId, liga.season, 5),
      getTeamRecentFixtures(team.id, liga.apiFootballId, liga.season, 5),
      getUpcomingOdds(liga.oddsApiKey),
    ]);

  const standings = standingsRes.status === "fulfilled" ? standingsRes.value : [];
  const allScorers = scorersRes.status === "fulfilled" ? scorersRes.value : [];
  const squad = squadRes.status === "fulfilled" ? squadRes.value : [];
  const upcoming = upcomingRes.status === "fulfilled" ? upcomingRes.value : [];
  const recent = recentRes.status === "fulfilled" ? recentRes.value : [];
  const odds = oddsRes.status === "fulfilled" ? oddsRes.value : [];

  const standing = standings.find((s) => s.team.id === team.id);
  const teamScorers = allScorers.filter((p) => p.statistics[0]?.team?.id === team.id);

  // Compute form from recent results (most recent first)
  const form = recent
    .map((f) => {
      const isHome = f.teams.home.id === team.id;
      const homeGoals = f.goals.home ?? 0;
      const awayGoals = f.goals.away ?? 0;
      if (isHome) {
        return homeGoals > awayGoals ? "W" : homeGoals < awayGoals ? "L" : "D";
      } else {
        return awayGoals > homeGoals ? "W" : awayGoals < homeGoals ? "L" : "D";
      }
    })
    .reverse(); // chronological order

  // Match upcoming fixtures to odds
  function getFixtureOdds(fixture: (typeof upcoming)[0]) {
    return (
      odds.find(
        (o) =>
          o.homeTeam.toLowerCase().includes(fixture.teams.home.name.toLowerCase().split(" ")[0]) ||
          o.awayTeam.toLowerCase().includes(fixture.teams.away.name.toLowerCase().split(" ")[0])
      ) ?? null
    );
  }

  // Group squad by position
  const squadByPosition = {
    Goalkeeper: squad.filter((p) => p.position === "Goalkeeper"),
    Defender: squad.filter((p) => p.position === "Defender"),
    Midfielder: squad.filter((p) => p.position === "Midfielder"),
    Attacker: squad.filter((p) => p.position === "Attacker"),
  };
  const positionLabels: Record<string, string> = {
    Goalkeeper: "Torhüter",
    Defender: "Abwehr",
    Midfielder: "Mittelfeld",
    Attacker: "Angriff",
  };

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
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 space-y-10 animate-fade-in">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ── Header ── */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row gap-6">
          {team.logo && (
            <Image
              src={team.logo}
              alt={team.name}
              width={88}
              height={88}
              className="object-contain flex-none"
            />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-zinc-100">{team.name}</h1>
                <p className="text-zinc-400 mt-1 text-sm">
                  <Link href={`/bundesliga/${liga.slug}`} className="hover:text-brand-400 transition-colors">
                    {liga.name}
                  </Link>
                  {team.founded && <> · Gegründet {team.founded}</>}
                  {venue && <> · {venue.city}</>}
                </p>
              </div>
              {standing && (
                <div className="text-right flex-none">
                  <div className="text-5xl font-bold text-brand-400 tabular-nums">{standing.rank}.</div>
                  <div className="text-xs text-zinc-500 mt-0.5">Tabellenplatz</div>
                </div>
              )}
            </div>

            {/* Season stats */}
            {standing && (
              <div className="flex flex-wrap gap-3 mt-4">
                {[
                  { label: "Punkte", value: standing.points, highlight: true },
                  { label: "Spiele", value: standing.all.played },
                  { label: "Siege", value: standing.all.win },
                  { label: "Unentsch.", value: standing.all.draw },
                  { label: "Niederl.", value: standing.all.lose },
                  { label: "Tore", value: `${standing.all.goals.for}:${standing.all.goals.against}` },
                  {
                    label: "Diff.",
                    value: standing.goalsDiff > 0 ? `+${standing.goalsDiff}` : standing.goalsDiff,
                    highlight: standing.goalsDiff > 0,
                  },
                ].map((s) => (
                  <div key={s.label} className="bg-surface-elevated rounded-lg px-3 py-2 text-center min-w-[56px]">
                    <div className={`text-lg font-bold tabular-nums ${s.highlight ? "text-brand-400" : "text-zinc-100"}`}>
                      {s.value}
                    </div>
                    <div className="text-[11px] text-zinc-500">{s.label}</div>
                  </div>
                ))}

                {/* Form */}
                {form.length > 0 && (
                  <div className="bg-surface-elevated rounded-lg px-3 py-2">
                    <div className="flex items-center gap-1">
                      {form.map((r, i) => (
                        <span
                          key={i}
                          className={cn(
                            "w-5 h-5 rounded text-[10px] font-bold flex items-center justify-center",
                            r === "W" && "bg-brand-500/20 text-brand-400",
                            r === "D" && "bg-zinc-700 text-zinc-400",
                            r === "L" && "bg-red-900/40 text-red-400"
                          )}
                        >
                          {r === "W" ? "S" : r === "L" ? "N" : "U"}
                        </span>
                      ))}
                    </div>
                    <div className="text-[11px] text-zinc-500 mt-1">Form</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Nächste Spiele + Quoten ── */}
      {upcoming.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-zinc-100 mb-4">Nächste Spiele & Quoten</h2>
          <div className="space-y-3">
            {upcoming.map((fixture) => {
              const fixOdds = getFixtureOdds(fixture);
              const best = fixOdds ? extractBestOdds(fixOdds) : null;
              const spieltag = roundToSpieltag(fixture.league.round);
              const isHome = fixture.teams.home.id === team.id;
              const opponent = isHome ? fixture.teams.away : fixture.teams.home;

              return (
                <div key={fixture.fixture.id} className="card p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {opponent.logo && (
                      <Image src={opponent.logo} alt={opponent.name} width={32} height={32} className="object-contain flex-none" />
                    )}
                    <div>
                      <p className="font-medium text-zinc-100">
                        {isHome ? (
                          <><span className="text-brand-400">{team.name}</span> vs. {opponent.name}</>
                        ) : (
                          <>{opponent.name} vs. <span className="text-brand-400">{team.name}</span></>
                        )}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {fixture.league.round} · {formatDateTime(fixture.fixture.date)}
                        {isHome ? " · Heimspiel" : " · Auswärtsspiel"}
                      </p>
                    </div>
                  </div>

                  {best ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-zinc-600">Beste Quote:</span>
                      {[
                        { label: "1", price: best.home.price, bm: best.home.bookmaker },
                        { label: "X", price: best.draw.price, bm: best.draw.bookmaker },
                        { label: "2", price: best.away.price, bm: best.away.bookmaker },
                      ].map(({ label, price, bm }) => (
                        <div key={label} className="flex flex-col items-center" title={bm}>
                          <span className="text-[10px] text-zinc-600">{label}</span>
                          <span className="odds-pill-best text-xs">{formatOdds(price)}</span>
                        </div>
                      ))}
                      <Link href={`/spieltag/${liga.slug}/${spieltag}`} className="text-xs text-brand-400 hover:text-brand-300 ml-1">
                        Alle →
                      </Link>
                    </div>
                  ) : (
                    <Link href={`/spieltag/${liga.slug}/${spieltag}`} className="text-xs text-brand-400 hover:text-brand-300">
                      Spieltag {spieltag} →
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── Top Torschützen ── */}
        <section className="lg:col-span-1">
          <h2 className="text-xl font-semibold text-zinc-100 mb-4">Torschützen</h2>
          {teamScorers.length > 0 ? (
            <div className="flex flex-col gap-2">
              {teamScorers.slice(0, 8).map((p, i) => (
                <Link
                  key={p.player.id}
                  href={`/spieler/${playerToSlug(p.player.firstname, p.player.lastname, p.player.id)}`}
                  className="card px-4 py-3 flex items-center gap-3 hover:border-brand-500/40 transition-colors group"
                >
                  <span className="text-zinc-600 text-xs w-4 text-right flex-none">{i + 1}</span>
                  {p.player.photo && (
                    <Image src={p.player.photo} alt={p.player.name} width={32} height={32} className="rounded-full object-cover flex-none" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-200 group-hover:text-brand-400 transition-colors truncate">
                      {p.player.name}
                    </p>
                    <p className="text-xs text-zinc-500">{p.statistics[0]?.games?.position}</p>
                  </div>
                  <div className="flex gap-3 text-xs tabular-nums flex-none">
                    <span title="Tore" className="font-bold text-brand-400">{p.statistics[0]?.goals?.total ?? 0} T</span>
                    <span title="Assists" className="text-zinc-400">{p.statistics[0]?.goals?.assists ?? 0} A</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="card p-6 text-center text-zinc-500 text-sm">Keine Daten verfügbar.</div>
          )}

          {/* Stadion */}
          {venue && (
            <div className="card p-4 mt-4 space-y-2 text-sm">
              <h3 className="font-semibold text-zinc-300 mb-2">Stadion</h3>
              {[
                ["Name", venue.name],
                ["Stadt", venue.city],
                ["Kapazität", venue.capacity ? `${venue.capacity.toLocaleString("de-DE")} Plätze` : "—"],
                ["Untergrund", venue.surface],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-zinc-500">{k}</span>
                  <span className="text-zinc-300 capitalize">{v}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── Kader ── */}
        <section className="lg:col-span-2">
          <h2 className="text-xl font-semibold text-zinc-100 mb-4">
            Kader{squad.length > 0 && <span className="text-zinc-500 text-base ml-2">({squad.length} Spieler)</span>}
          </h2>
          {squad.length > 0 ? (
            <div className="space-y-5">
              {Object.entries(squadByPosition).map(([pos, players]) => {
                if (players.length === 0) return null;
                return (
                  <div key={pos}>
                    <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 px-1">
                      {positionLabels[pos]}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {players.map((p) => {
                        // Try to find stats for this player from top scorers list
                        const scorerData = allScorers.find((s) => s.player.id === p.id);
                        const goals = scorerData?.statistics[0]?.goals?.total ?? null;
                        const assists = scorerData?.statistics[0]?.goals?.assists ?? null;
                        // Construct slug using squad player data (no firstname/lastname available here)
                        const nameParts = p.name.split(". "); // e.g. "H. Kane" → need full name
                        const playerSlug = scorerData
                          ? playerToSlug(scorerData.player.firstname, scorerData.player.lastname, p.id)
                          : p.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

                        return (
                          <Link
                            key={p.id}
                            href={`/spieler/${playerSlug}`}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-surface-elevated transition-colors group"
                          >
                            {p.photo ? (
                              <Image src={p.photo} alt={p.name} width={32} height={32} className="rounded-full object-cover flex-none border border-surface-border" />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-surface-elevated border border-surface-border flex items-center justify-center text-zinc-600 text-xs flex-none">
                                {p.name[0]}
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-zinc-200 group-hover:text-brand-400 transition-colors truncate">
                                {p.name}
                              </p>
                              <p className="text-xs text-zinc-600">{p.age} J.{p.number ? ` · #${p.number}` : ""}</p>
                            </div>
                            {(goals !== null || assists !== null) && (
                              <div className="text-xs tabular-nums text-zinc-500 flex-none">
                                {goals !== null && <span className="text-brand-400 font-medium">{goals}T</span>}
                                {assists !== null && <span className="ml-1">{assists}A</span>}
                              </div>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="card p-8 text-center text-zinc-500 text-sm">Kader nicht verfügbar.</div>
          )}
        </section>
      </div>

      {/* ── Letzte Spiele ── */}
      {recent.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-zinc-100 mb-4">Letzte Spiele</h2>
          <div className="card divide-y divide-surface-border">
            {recent.map((f) => {
              const isHome = f.teams.home.id === team.id;
              const homeGoals = f.goals.home ?? 0;
              const awayGoals = f.goals.away ?? 0;
              const won = isHome ? homeGoals > awayGoals : awayGoals > homeGoals;
              const lost = isHome ? homeGoals < awayGoals : awayGoals < homeGoals;

              return (
                <div key={f.fixture.id} className="flex items-center gap-3 px-4 py-3">
                  <span
                    className={cn(
                      "w-5 h-5 rounded text-[10px] font-bold flex items-center justify-center flex-none",
                      won && "bg-brand-500/20 text-brand-400",
                      lost && "bg-red-900/40 text-red-400",
                      !won && !lost && "bg-zinc-700 text-zinc-400"
                    )}
                  >
                    {won ? "S" : lost ? "N" : "U"}
                  </span>
                  <span className="text-xs text-zinc-500 flex-none w-20 hidden sm:block">
                    {formatDate(f.fixture.date, { day: "2-digit", month: "2-digit" })}
                  </span>
                  <span className="text-sm text-zinc-300 flex-1 truncate">
                    {f.teams.home.name} vs. {f.teams.away.name}
                  </span>
                  <span className="font-mono font-bold text-zinc-100 flex-none">
                    {homeGoals} : {awayGoals}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
