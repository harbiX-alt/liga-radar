import Image from "next/image";
import Link from "next/link";
import { TrendingUp, Target, Award } from "lucide-react";
import type { PlayerWithStats } from "@/lib/types";
import { playerToSlug } from "@/lib/football-api";

interface Props {
  data: PlayerWithStats;
  rank?: number;
}

export function PlayerCard({ data, rank }: Props) {
  const { player, statistics } = data;
  const stats = statistics[0];
  const slug = playerToSlug(player.firstname, player.lastname, player.id);

  return (
    <Link href={`/spieler/${slug}`} className="card p-4 flex gap-4 hover:border-brand-500/40 transition-colors group">
      {/* Rank */}
      {rank !== undefined && (
        <div className="flex-none w-6 text-center">
          <span className="text-zinc-500 text-sm font-mono">{rank}</span>
        </div>
      )}

      {/* Photo */}
      <div className="flex-none">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-elevated border border-surface-border">
          {player.photo ? (
            <Image
              src={player.photo}
              alt={player.name}
              width={48}
              height={48}
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-600 text-lg font-bold">
              {player.firstname[0]}{player.lastname[0]}
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-zinc-100 group-hover:text-brand-400 transition-colors truncate">
          {player.name}
        </div>
        <div className="text-xs text-zinc-500 mt-0.5 flex items-center gap-2">
          <span>{stats?.team?.name ?? "—"}</span>
          <span>·</span>
          <span>{stats?.games?.position ?? "—"}</span>
        </div>

        {/* Stats row */}
        {stats && (
          <div className="flex items-center gap-4 mt-2">
            <StatChip
              icon={<Target className="h-3 w-3" />}
              value={stats.goals.total ?? 0}
              label="Tore"
            />
            <StatChip
              icon={<TrendingUp className="h-3 w-3" />}
              value={stats.goals.assists ?? 0}
              label="Assists"
            />
            <StatChip
              icon={<Award className="h-3 w-3" />}
              value={stats.games.appearences ?? 0}
              label="Spiele"
            />
          </div>
        )}
      </div>
    </Link>
  );
}

function StatChip({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
  return (
    <div className="flex items-center gap-1 text-xs">
      <span className="text-brand-400">{icon}</span>
      <span className="font-semibold text-zinc-200 tabular-nums">{value}</span>
      <span className="text-zinc-600">{label}</span>
    </div>
  );
}
