import type { Metadata } from "next";
import { LIGEN } from "@/lib/types";
import { getUpcomingOdds } from "@/lib/odds-api";
import { OddsTable } from "@/components/OddsTable";
import { TrendingUp } from "lucide-react";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Wettquoten Vergleich – Bundesliga, 2. Bundesliga & 3. Liga",
  description:
    "Vergleiche aktuelle Wettquoten aller deutschen Buchbacher für Bundesliga, 2. Bundesliga und 3. Liga. Finde die besten Quoten auf einen Blick.",
  alternates: { canonical: "/quoten" },
};

async function getAllOdds() {
  const results = await Promise.allSettled(
    LIGEN.map(async (liga) => ({
      liga,
      events: await getUpcomingOdds(liga.oddsApiKey),
    }))
  );

  return results
    .filter((r) => r.status === "fulfilled")
    .map((r) => (r as PromiseFulfilledResult<{ liga: (typeof LIGEN)[0]; events: Awaited<ReturnType<typeof getUpcomingOdds>> }>).value);
}

export default async function QuotenPage() {
  const sections = await getAllOdds();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-10 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-zinc-100 flex items-center gap-3">
          <TrendingUp className="h-7 w-7 text-brand-400" />
          Quotenvergleich
        </h1>
        <p className="text-zinc-400 mt-2">
          Aktuelle Wettquoten für alle deutschen Ligen — automatisch aktualisiert alle 5 Minuten.
        </p>
      </div>

      {sections.map(({ liga, events }) => (
        <section key={liga.slug}>
          <div className="flex items-center gap-3 mb-4">
            <h2 className="section-title">{liga.name}</h2>
            <span className="badge bg-surface-elevated border border-surface-border text-zinc-400">
              {events.length} Spiele
            </span>
          </div>
          <OddsTable events={events} ligaSlug={liga.slug} />
        </section>
      ))}

      {sections.every((s) => s.events.length === 0) && (
        <div className="card p-12 text-center">
          <p className="text-zinc-500">Keine Quoten verfügbar. Bitte Odds API-Key in <code className="text-brand-400">.env.local</code> eintragen.</p>
        </div>
      )}

      {/* Disclaimer */}
      <p className="text-xs text-zinc-600 text-center border-t border-surface-border pt-6">
        Alle Quoten ohne Gewähr. Stand: laufend aktualisiert. Glücksspiel ist erst ab 18 Jahren erlaubt.
        18+ · Spielen Sie verantwortungsbewusst.
      </p>
    </div>
  );
}
