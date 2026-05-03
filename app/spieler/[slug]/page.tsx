import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Shield, Target, TrendingUp, Clock, Award, CreditCard } from "lucide-react";
import { LIGEN } from "@/lib/types";
import {
  getTopScorers,
  getTopAssists,
  getPlayerById,
  getTeamNextFixtures,
  slugToPlayerId,
  teamToSlug,
} from "@/lib/football-api";
import { getUpcomingOdds, extractBestOdds, formatOdds } from "@/lib/odds-api";
import { formatDate, formatDateTime } from "@/lib/utils";
import type { PlayerWithStats } from "@/lib/types";
import { STATIC_SPIELER } from "@/data/bundesliga-spieler";
import type { StaticPlayer } from "@/data/bundesliga-spieler";

export const revalidate = 3600;

function staticPlayerToPlayerWithStats(p: StaticPlayer): PlayerWithStats {
  const parts = p.name.split(" ");
  const firstname = parts[0];
  const lastname = parts.slice(1).join(" ") || parts[0];
  return {
    player: {
      id: p.apiId, name: p.name, firstname, lastname,
      age: 0, birth: { date: "", place: "", country: p.nationalitaet },
      nationality: p.nationalitaet, height: "", weight: "", injured: false, photo: "",
    },
    statistics: [{
      team: { id: 0, name: p.verein, code: "", country: "Germany", founded: 0, national: false, logo: "" },
      league: { id: 78, name: "1. Bundesliga", country: "Germany", logo: "", season: 2025 },
      games: { appearences: 0, lineups: 0, minutes: 0, position: p.position, rating: "", captain: false },
      goals: { total: 0, conceded: 0, assists: 0, saves: 0 },
      passes: { total: 0, key: 0, accuracy: 0 },
      shots: { total: 0, on: 0 },
      cards: { yellow: 0, yellowred: 0, red: 0 },
      dribbles: { attempts: 0, success: 0 },
    }],
  };
}

interface Props {
  params: Promise<{ slug: string }>;
}

// ─── Find player across all cached league data ─────────────────────────────────
async function findPlayer(playerId: number): Promise<PlayerWithStats | null> {
  // Step 1: check all cached top-scorer lists (0 extra API calls for pre-built pages)
  const scorerResults = await Promise.allSettled(
    LIGEN.map((l) => getTopScorers(l.apiFootballId, l.season))
  );
  for (const r of scorerResults) {
    if (r.status === "fulfilled") {
      const match = r.value.find((p) => p.player.id === playerId);
      if (match) return match;
    }
  }

  // Step 2: check top-assist lists
  const assistResults = await Promise.allSettled(
    LIGEN.map((l) => getTopAssists(l.apiFootballId, l.season))
  );
  for (const r of assistResults) {
    if (r.status === "fulfilled") {
      const match = r.value.find((p) => p.player.id === playerId);
      if (match) return match;
    }
  }

  // Step 3: fallback to direct API call (for dynamic pages outside top-scorer lists)
  return getPlayerById(playerId, LIGEN[0].season).catch(() => null);
}

// ─── Metadata ─────────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const playerId = slugToPlayerId(slug);
  if (isNaN(playerId)) return {};

  const apiData = await findPlayer(playerId);
  const staticP = !apiData ? STATIC_SPIELER.find((p) => p.apiId === playerId) : null;
  const data = apiData ?? (staticP ? staticPlayerToPlayerWithStats(staticP) : null);
  if (!data) return {};

  const { player, statistics } = data;
  const stats = statistics[0];
  const team = stats?.team?.name ?? "";
  const goals = stats?.goals?.total ?? 0;
  const assists = stats?.goals?.assists ?? 0;

  return {
    title: `${player.name} – Statistiken, Quoten & Profil | Liga Radar`,
    description: `${player.name} (${team}): ${goals} Tore, ${assists} Assists in der aktuellen Saison. Aktuelle Wettquoten und vollständige Spieler-Statistiken.`,
    alternates: { canonical: `/spieler/${slug}` },
    openGraph: {
      title: `${player.name} – Bundesliga Statistiken`,
      description: `${goals} Tore · ${assists} Assists · ${team}`,
      images: player.photo ? [{ url: player.photo, width: 200, height: 200 }] : [],
    },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function SpielerPage({ params }: Props) {
  const { slug } = await params;
  const playerId = slugToPlayerId(slug);
  if (isNaN(playerId)) notFound();

  const apiData = await findPlayer(playerId);
  const staticP = !apiData ? STATIC_SPIELER.find((p) => p.apiId === playerId) : null;
  const data = apiData ?? (staticP ? staticPlayerToPlayerWithStats(staticP) : null);
  if (!data) notFound();

  const { player, statistics } = data;
  const primaryStats = statistics[0];
  const teamId = primaryStats?.team?.id;
  const ligaId = primaryStats?.league?.id;
  const liga = LIGEN.find((l) => l.apiFootballId === ligaId) ?? LIGEN[0];

  // Next match + odds (use cached fixtures)
  const [nextFixtures, oddsEvents] = await Promise.allSettled([
    teamId ? getTeamNextFixtures(teamId, liga.apiFootballId, liga.season, 3) : Promise.resolve([]),
    getUpcomingOdds(liga.oddsApiKey),
  ]);

  const upcoming = nextFixtures.status === "fulfilled" ? nextFixtures.value : [];
  const odds = oddsEvents.status === "fulfilled" ? oddsEvents.value : [];

  // Match first upcoming fixture to odds
  const nextMatch = upcoming[0] ?? null;
  const matchOdds = nextMatch
    ? odds.find(
        (o) =>
          o.homeTeam.toLowerCase().includes(nextMatch.teams.home.name.toLowerCase().split(" ")[0]) ||
          o.awayTeam.toLowerCase().includes(nextMatch.teams.away.name.toLowerCase().split(" ")[0])
      ) ?? null
    : null;
  const bestOdds = matchOdds ? extractBestOdds(matchOdds) : null;

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: player.name,
    givenName: player.firstname,
    familyName: player.lastname,
    nationality: player.nationality,
    birthDate: player.birth?.date,
    image: player.photo,
    jobTitle: primaryStats?.games?.position ?? "Fußballspieler",
    worksFor: primaryStats?.team
      ? { "@type": "SportsTeam", name: primaryStats.team.name }
      : undefined,
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/spieler/${slug}`,
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8 space-y-8 animate-fade-in">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Header ── */}
      <div className="card p-6 flex flex-col sm:flex-row gap-6">
        {player.photo && (
          <div className="flex-none">
            <Image
              src={player.photo}
              alt={player.name}
              width={120}
              height={120}
              className="rounded-xl object-cover border border-surface-border"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-start gap-3 mb-2">
            <h1 className="text-3xl font-bold text-zinc-100">{player.name}</h1>
            {player.injured && (
              <span className="badge bg-red-900/40 text-red-400 border border-red-800 mt-1">
                Verletzt
              </span>
            )}
          </div>

          {/* Key info chips */}
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-zinc-400 mb-4">
            {primaryStats?.games?.position && (
              <span className="flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-brand-400" />
                {primaryStats.games.position}
              </span>
            )}
            {primaryStats?.team && (
              <Link
                href={`/verein/${teamToSlug(primaryStats.team.name)}`}
                className="flex items-center gap-1.5 hover:text-brand-400 transition-colors"
              >
                {primaryStats.team.logo && (
                  <Image
                    src={primaryStats.team.logo}
                    alt={primaryStats.team.name}
                    width={16}
                    height={16}
                    className="object-contain"
                  />
                )}
                {primaryStats.team.name}
              </Link>
            )}
            <span>🏳️ {player.nationality}</span>
            <span>🎂 {player.birth?.date ? formatDate(player.birth.date) : "—"} ({player.age} J.)</span>
            {player.height && <span>📏 {player.height}</span>}
            {player.weight && <span>⚖️ {player.weight}</span>}
          </div>

          {/* Quick stats */}
          {primaryStats && (
            <div className="flex flex-wrap gap-3">
              <QuickStat icon={<Target className="h-4 w-4" />} value={primaryStats.goals.total ?? 0} label="Tore" highlight />
              <QuickStat icon={<TrendingUp className="h-4 w-4" />} value={primaryStats.goals.assists ?? 0} label="Assists" highlight />
              <QuickStat icon={<Clock className="h-4 w-4" />} value={primaryStats.games.appearences ?? 0} label="Spiele" />
              <QuickStat icon={<Award className="h-4 w-4" />} value={primaryStats.games.minutes ?? 0} label="Minuten" />
              <QuickStat icon={<CreditCard className="h-4 w-4" />} value={primaryStats.cards.yellow ?? 0} label="Gelb" />
              {primaryStats.cards.red > 0 && (
                <QuickStat icon={<CreditCard className="h-4 w-4" />} value={primaryStats.cards.red} label="Rot" />
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Next match + odds ── */}
      {nextMatch && (
        <section>
          <h2 className="text-lg font-semibold text-zinc-100 mb-3">Nächstes Spiel</h2>
          <div className="card p-5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {/* Teams */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  {nextMatch.teams.home.logo && (
                    <Image src={nextMatch.teams.home.logo} alt={nextMatch.teams.home.name} width={28} height={28} className="object-contain" />
                  )}
                  <span className={`font-semibold ${nextMatch.teams.home.id === teamId ? "text-brand-400" : "text-zinc-200"}`}>
                    {nextMatch.teams.home.name}
                  </span>
                  <span className="text-zinc-600 text-sm">vs.</span>
                  {nextMatch.teams.away.logo && (
                    <Image src={nextMatch.teams.away.logo} alt={nextMatch.teams.away.name} width={28} height={28} className="object-contain" />
                  )}
                  <span className={`font-semibold ${nextMatch.teams.away.id === teamId ? "text-brand-400" : "text-zinc-200"}`}>
                    {nextMatch.teams.away.name}
                  </span>
                </div>
                <p className="text-xs text-zinc-500">
                  {nextMatch.league.round} · {formatDateTime(nextMatch.fixture.date)}
                </p>
              </div>

              {/* Odds */}
              {bestOdds && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-600 mr-1">Beste Quote:</span>
                  {[
                    { label: "1", price: bestOdds.home.price, bm: bestOdds.home.bookmaker },
                    { label: "X", price: bestOdds.draw.price, bm: bestOdds.draw.bookmaker },
                    { label: "2", price: bestOdds.away.price, bm: bestOdds.away.bookmaker },
                  ].map(({ label, price, bm }) => (
                    <div key={label} className="flex flex-col items-center" title={bm}>
                      <span className="text-[10px] text-zinc-600">{label}</span>
                      <span className="odds-pill-best text-xs">{formatOdds(price)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── Stats per league ── */}
      <section>
        <h2 className="text-lg font-semibold text-zinc-100 mb-3">Saisonstatistiken</h2>
        <div className="space-y-4">
          {statistics.map((stat, i) => (
            <div key={i} className="card p-5">
              {/* League header */}
              <div className="flex items-center gap-3 mb-5 pb-3 border-b border-surface-border">
                {stat.league.logo && (
                  <Image src={stat.league.logo} alt={stat.league.name} width={24} height={24} className="object-contain" />
                )}
                <div>
                  <p className="font-semibold text-zinc-100">{stat.league.name}</p>
                  <p className="text-xs text-zinc-500">
                    {stat.team.name} · Saison {stat.league.season}
                  </p>
                </div>
                {stat.games.rating && (
                  <div className="ml-auto text-right">
                    <p className="text-2xl font-bold text-brand-400 tabular-nums">
                      {parseFloat(stat.games.rating).toFixed(2)}
                    </p>
                    <p className="text-xs text-zinc-600">Ø Bewertung</p>
                  </div>
                )}
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <StatBox label="Spiele" value={stat.games.appearences ?? 0} />
                <StatBox label="Minuten" value={stat.games.minutes ?? 0} />
                <StatBox label="Tore" value={stat.goals.total ?? 0} highlight />
                <StatBox label="Assists" value={stat.goals.assists ?? 0} highlight />
                <StatBox label="Schüsse" value={stat.shots?.total ?? 0} />
                <StatBox label="Schüsse (Z)" value={stat.shots?.on ?? 0} />
                <StatBox label="Pässe" value={stat.passes?.total ?? 0} />
                <StatBox label="Schlüsselpässe" value={stat.passes?.key ?? 0} />
                <StatBox label="Dribbling (E)" value={stat.dribbles?.attempts ?? 0} />
                <StatBox label="Dribbling (E/G)" value={stat.dribbles?.success ?? 0} />
                <StatBox label="Gelbe Karten" value={stat.cards?.yellow ?? 0} />
                <StatBox label="Rote Karten" value={stat.cards?.red ?? 0} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Back link ── */}
      <Link href={`/bundesliga/${liga.slug}`} className="btn-ghost inline-flex">
        ← Zurück zur {liga.name}
      </Link>
    </div>
  );
}

function QuickStat({
  icon,
  value,
  label,
  highlight,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center gap-1.5 bg-surface-elevated rounded-lg px-3 py-1.5">
      <span className={highlight ? "text-brand-400" : "text-zinc-500"}>{icon}</span>
      <span className={`font-bold tabular-nums ${highlight ? "text-zinc-100" : "text-zinc-300"}`}>
        {value}
      </span>
      <span className="text-zinc-500 text-xs">{label}</span>
    </div>
  );
}

function StatBox({ label, value, highlight }: { label: string; value: number | string; highlight?: boolean }) {
  return (
    <div className="bg-surface-elevated rounded-lg p-3 text-center">
      <div className={`text-xl font-bold tabular-nums ${highlight ? "text-brand-400" : "text-zinc-100"}`}>
        {value}
      </div>
      <div className="text-[11px] text-zinc-500 mt-0.5 leading-tight">{label}</div>
    </div>
  );
}
