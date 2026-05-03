import Image from "next/image";
import Link from "next/link";
import type { Fixture, OddsEvent } from "@/lib/types";
import { extractBestOdds, formatOdds } from "@/lib/odds-api";
import { formatDateTime, formatTime } from "@/lib/utils";
import { roundToSpieltag } from "@/lib/football-api";

interface Props {
  fixture: Fixture;
  oddsEvent?: OddsEvent | null;
  ligaSlug: string;
}

export function MatchCard({ fixture, oddsEvent, ligaSlug }: Props) {
  const { teams, goals, league, fixture: f } = fixture;
  const isFinished = ["FT", "AET", "PEN"].includes(f.status.short);
  const isLive = f.status.short === "1H" || f.status.short === "2H" || f.status.short === "HT";
  const bestOdds = oddsEvent ? extractBestOdds(oddsEvent) : null;
  const spieltag = roundToSpieltag(league.round);

  return (
    <div className="card p-4 hover:border-zinc-700 transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 text-xs text-zinc-500">
        <span>{league.round}</span>
        <span className="flex items-center gap-1">
          {isLive && (
            <span className="inline-flex items-center gap-1 text-brand-400">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
              LIVE {f.status.elapsed}&apos;
            </span>
          )}
          {!isLive && formatDateTime(f.date)}
        </span>
      </div>

      {/* Teams & Score */}
      <div className="flex items-center justify-between gap-4">
        {/* Home */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {teams.home.logo && (
            <Image src={teams.home.logo} alt={teams.home.name} width={28} height={28} className="object-contain flex-none" />
          )}
          <span className="font-semibold text-sm text-zinc-100 truncate">{teams.home.name}</span>
        </div>

        {/* Score / Time */}
        <div className="flex-none text-center min-w-[60px]">
          {isFinished || isLive ? (
            <span className="text-xl font-bold font-mono text-zinc-100">
              {goals.home ?? 0} : {goals.away ?? 0}
            </span>
          ) : (
            <span className="text-sm text-zinc-400 font-mono">{formatTime(f.date)}</span>
          )}
        </div>

        {/* Away */}
        <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
          <span className="font-semibold text-sm text-zinc-100 truncate text-right">{teams.away.name}</span>
          {teams.away.logo && (
            <Image src={teams.away.logo} alt={teams.away.name} width={28} height={28} className="object-contain flex-none" />
          )}
        </div>
      </div>

      {/* Odds row */}
      {bestOdds && !isFinished && (
        <div className="mt-3 pt-3 border-t border-surface-border flex items-center gap-2">
          <span className="text-xs text-zinc-600 flex-1">Beste Quote</span>
          <div className="flex gap-2">
            <OddsBadge label="1" price={bestOdds.home.price} bookmaker={bestOdds.home.bookmaker} />
            <OddsBadge label="X" price={bestOdds.draw.price} bookmaker={bestOdds.draw.bookmaker} />
            <OddsBadge label="2" price={bestOdds.away.price} bookmaker={bestOdds.away.bookmaker} />
          </div>
          <Link
            href={`/spieltag/${ligaSlug}/${spieltag}`}
            className="text-xs text-brand-400 hover:text-brand-300 ml-2"
          >
            Alle Quoten →
          </Link>
        </div>
      )}
    </div>
  );
}

function OddsBadge({ label, price, bookmaker }: { label: string; price: number; bookmaker: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-[10px] text-zinc-600">{label}</span>
      <span className="odds-pill-best text-xs" title={`Beste Quote bei ${bookmaker}`}>
        {formatOdds(price)}
      </span>
    </div>
  );
}
