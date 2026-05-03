import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { LIGEN } from "@/lib/types";
import {
  getPlayerById,
  getTopScorers,
  slugToPlayerId,
  playerToSlug,
} from "@/lib/football-api";

export const revalidate = 3600;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  // Pre-generate pages for top scorers from all leagues
  const allScorers = await Promise.allSettled(
    LIGEN.map((l) => getTopScorers(l.apiFootballId, l.season))
  );

  const slugs = new Set<string>();
  for (const result of allScorers) {
    if (result.status === "fulfilled") {
      for (const p of result.value) {
        slugs.add(playerToSlug(p.player.firstname, p.player.lastname, p.player.id));
      }
    }
  }

  return [...slugs].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const playerId = slugToPlayerId(slug);
  if (!playerId) return {};

  const player = await getPlayerById(playerId, LIGEN[0].season).catch(() => null);
  if (!player) return {};

  const { player: p, statistics } = player;
  const stats = statistics[0];
  const teamName = stats?.team?.name ?? "";

  return {
    title: `${p.name} – Statistiken & Profil`,
    description: `Alle Statistiken von ${p.name} (${teamName}) – Tore, Assists, Einsätze und mehr.`,
    alternates: { canonical: `/spieler/${slug}` },
    openGraph: {
      images: p.photo ? [{ url: p.photo }] : [],
    },
  };
}

export default async function SpielerPage({ params }: Props) {
  const { slug } = await params;
  const playerId = slugToPlayerId(slug);
  if (!playerId || isNaN(playerId)) notFound();

  // Fetch stats for all leagues this season
  const playerData = await getPlayerById(playerId, LIGEN[0].season).catch(() => null);
  if (!playerData) notFound();

  const { player, statistics } = playerData;

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: player.name,
    nationality: player.nationality,
    birthDate: player.birth?.date,
    image: player.photo,
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/spieler/${slug}`,
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8 animate-fade-in">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Profile header */}
      <div className="card p-6 flex flex-col sm:flex-row gap-6 mb-8">
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
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-zinc-100">{player.name}</h1>
          <div className="flex flex-wrap gap-4 mt-3 text-sm text-zinc-400">
            <span>🏳️ {player.nationality}</span>
            <span>🎂 {player.birth?.date ? new Date(player.birth.date).toLocaleDateString("de-DE") : "—"} ({player.age} J.)</span>
            <span>📏 {player.height ?? "—"}</span>
            <span>⚖️ {player.weight ?? "—"}</span>
            {player.injured && (
              <span className="badge bg-red-900/40 text-red-400 border border-red-800">Verletzt</span>
            )}
          </div>
        </div>
      </div>

      {/* Stats per league */}
      <h2 className="text-xl font-semibold text-zinc-100 mb-4">Saisonstatistiken</h2>
      <div className="space-y-4">
        {statistics.map((stat, i) => (
          <div key={i} className="card p-5">
            <div className="flex items-center gap-3 mb-4">
              {stat.league.logo && (
                <Image src={stat.league.logo} alt={stat.league.name} width={24} height={24} className="object-contain" />
              )}
              <div>
                <div className="font-semibold text-zinc-100">{stat.league.name}</div>
                <div className="text-xs text-zinc-500">{stat.team.name} · {stat.league.season}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
              <StatBox label="Spiele" value={stat.games.appearences ?? 0} />
              <StatBox label="Minuten" value={stat.games.minutes ?? 0} />
              <StatBox label="Tore" value={stat.goals.total ?? 0} highlight />
              <StatBox label="Assists" value={stat.goals.assists ?? 0} highlight />
              <StatBox label="Schüsse" value={stat.shots.total ?? 0} />
              <StatBox label="Schüsse (Z)" value={stat.shots.on ?? 0} />
              <StatBox label="Pässe" value={stat.passes.total ?? 0} />
              <StatBox label="Schlüsselpässe" value={stat.passes.key ?? 0} />
              <StatBox label="Dribblings" value={stat.dribbles.success ?? 0} />
              <StatBox label="Gelb" value={stat.cards.yellow ?? 0} />
              <StatBox label="Rot" value={stat.cards.red ?? 0} />
              {stat.games.rating && (
                <StatBox label="Ø Bewertung" value={parseFloat(stat.games.rating).toFixed(2)} highlight />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatBox({ label, value, highlight }: { label: string; value: number | string; highlight?: boolean }) {
  return (
    <div className="bg-surface-elevated rounded-lg p-3 text-center">
      <div className={`text-2xl font-bold tabular-nums ${highlight ? "text-brand-400" : "text-zinc-100"}`}>
        {value}
      </div>
      <div className="text-xs text-zinc-500 mt-1">{label}</div>
    </div>
  );
}
