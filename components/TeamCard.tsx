import Image from "next/image";
import Link from "next/link";
import type { Standing } from "@/lib/types";
import { teamToSlug } from "@/lib/football-api";
import { cn } from "@/lib/utils";

interface Props {
  standing: Standing;
  ligaSlug: string;
  highlight?: boolean;
}

export function TeamCard({ standing, ligaSlug, highlight }: Props) {
  const { team, points, all, goalsDiff, form } = standing;
  const slug = teamToSlug(team.name);

  return (
    <Link
      href={`/verein/${slug}`}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors group",
        highlight
          ? "bg-brand-900/30 border border-brand-500/30 hover:border-brand-500/60"
          : "hover:bg-surface-elevated"
      )}
    >
      {/* Rank */}
      <span className="w-6 text-center text-sm font-mono text-zinc-500 flex-none">
        {standing.rank}
      </span>

      {/* Logo */}
      <div className="flex-none w-8 h-8">
        {team.logo ? (
          <Image src={team.logo} alt={team.name} width={32} height={32} className="object-contain" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-surface-elevated border border-surface-border" />
        )}
      </div>

      {/* Name */}
      <span className="flex-1 font-medium text-zinc-200 group-hover:text-zinc-100 truncate text-sm">
        {team.name}
      </span>

      {/* Form */}
      <div className="hidden sm:flex items-center gap-0.5">
        {(form ?? "").slice(-5).split("").map((r, i) => (
          <span
            key={i}
            className={cn(
              "w-4 h-4 rounded-sm text-[10px] font-bold flex items-center justify-center",
              r === "W" && "bg-brand-500/20 text-brand-400",
              r === "D" && "bg-zinc-700 text-zinc-400",
              r === "L" && "bg-red-900/40 text-red-400"
            )}
          >
            {r === "W" ? "S" : r === "L" ? "N" : "U"}
          </span>
        ))}
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 text-xs tabular-nums text-zinc-500 ml-2">
        <span title="Spiele">{all.played}</span>
        <span title="Tordifferenz" className={cn(goalsDiff > 0 && "text-brand-400", goalsDiff < 0 && "text-red-400")}>
          {goalsDiff > 0 ? "+" : ""}{goalsDiff}
        </span>
        <span className="font-bold text-zinc-200 w-6 text-right">{points}</span>
      </div>
    </Link>
  );
}
