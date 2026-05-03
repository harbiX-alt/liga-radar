import type { OddsEvent } from "@/lib/types";
import { extractBestOdds, formatOdds } from "@/lib/odds-api";
import { formatDateTime, cn } from "@/lib/utils";

interface Props {
  events: OddsEvent[];
  ligaSlug: string;
}

export function OddsTable({ events, ligaSlug }: Props) {
  if (events.length === 0) {
    return (
      <div className="card p-8 text-center text-zinc-500">
        Keine kommenden Spiele mit Quoten gefunden.
      </div>
    );
  }

  // Derive column bookmakers from actual response data (up to 5, most common across events)
  const bmFrequency = new Map<string, { title: string; count: number }>();
  for (const event of events) {
    for (const bm of event.bookmakers) {
      const entry = bmFrequency.get(bm.key);
      if (entry) entry.count++;
      else bmFrequency.set(bm.key, { title: bm.title, count: 1 });
    }
  }
  const columnBookmakers = [...bmFrequency.entries()]
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5)
    .map(([key, { title }]) => ({ key, label: title }));

  return (
    <div className="overflow-x-auto rounded-xl border border-surface-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-surface-border bg-surface-elevated">
            <th className="text-left px-4 py-3 text-zinc-400 font-medium w-52">Spiel</th>
            <th className="px-3 py-3 text-zinc-400 font-medium text-center">Datum</th>
            <th className="px-3 py-3 text-zinc-400 font-medium text-center">Beste 1</th>
            <th className="px-3 py-3 text-zinc-400 font-medium text-center">Beste X</th>
            <th className="px-3 py-3 text-zinc-400 font-medium text-center">Beste 2</th>
            {columnBookmakers.map((bm) => (
              <th key={bm.key} className="px-3 py-3 text-zinc-400 font-medium text-center hidden lg:table-cell">
                {bm.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-border">
          {events.map((event) => {
            const best = extractBestOdds(event);
            return (
              <tr key={event.id} className="table-row-hover group">
                {/* Match */}
                <td className="px-4 py-3">
                  <div className="font-medium text-zinc-100 group-hover:text-brand-400 transition-colors line-clamp-1">
                    {event.homeTeam}
                  </div>
                  <div className="text-zinc-500 text-xs mt-0.5 line-clamp-1">
                    vs. {event.awayTeam}
                  </div>
                </td>

                {/* Date */}
                <td className="px-3 py-3 text-zinc-400 text-xs text-center whitespace-nowrap">
                  {formatDateTime(event.commenceTime)}
                </td>

                {/* Best odds columns */}
                <BestOddsCell price={best.home.price} bookmaker={best.home.bookmaker} />
                <BestOddsCell price={best.draw.price} bookmaker={best.draw.bookmaker} />
                <BestOddsCell price={best.away.price} bookmaker={best.away.bookmaker} />

                {/* Per-bookmaker columns */}
                {columnBookmakers.map((bm) => {
                  const bmData = event.bookmakers.find((b) => b.key === bm.key);
                  const h2h = bmData?.markets.find((m) => m.key === "h2h");
                  const homeOdds = h2h?.outcomes.find((o) => o.name === event.homeTeam)?.price;
                  const drawOdds = h2h?.outcomes.find((o) => o.name === "Draw")?.price;
                  const awayOdds = h2h?.outcomes.find((o) => o.name === event.awayTeam)?.price;

                  return (
                    <td key={bm.key} className="px-3 py-3 hidden lg:table-cell">
                      <div className="flex gap-1 justify-center">
                        {[
                          { price: homeOdds, best: best.home.price },
                          { price: drawOdds, best: best.draw.price },
                          { price: awayOdds, best: best.away.price },
                        ].map(({ price, best: bestPrice }, i) =>
                          price ? (
                            <span
                              key={i}
                              className={cn(
                                "odds-pill text-xs",
                                price >= bestPrice && "odds-pill-best"
                              )}
                            >
                              {formatOdds(price)}
                            </span>
                          ) : (
                            <span key={i} className="odds-pill text-zinc-600 text-xs">—</span>
                          )
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function BestOddsCell({ price, bookmaker }: { price: number; bookmaker: string }) {
  if (!price) return <td className="px-3 py-3 text-center"><span className="text-zinc-600">—</span></td>;
  return (
    <td className="px-3 py-3 text-center">
      <div className="flex flex-col items-center gap-0.5">
        <span className="odds-pill-best text-sm">{formatOdds(price)}</span>
        <span className="text-[10px] text-zinc-500">{bookmaker}</span>
      </div>
    </td>
  );
}
