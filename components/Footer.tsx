import Link from "next/link";
import { Zap } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-surface-border bg-surface mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 font-bold text-lg mb-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-500">
                <Zap className="h-4 w-4 text-white" strokeWidth={2.5} />
              </span>
              <span className="text-zinc-100">Liga</span>
              <span className="text-brand-400">Radar</span>
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed">
              Quotenvergleich und Spieler-Statistiken für den deutschen Fußball.
              Bundesliga, 2. Bundesliga & 3. Liga.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-zinc-300 mb-3">Ligen</h3>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li><Link href="/bundesliga/bundesliga" className="hover:text-zinc-200 transition-colors">1. Bundesliga</Link></li>
              <li><Link href="/bundesliga/2-bundesliga" className="hover:text-zinc-200 transition-colors">2. Bundesliga</Link></li>
              <li><Link href="/bundesliga/3-liga" className="hover:text-zinc-200 transition-colors">3. Liga</Link></li>
              <li><Link href="/quoten" className="hover:text-zinc-200 transition-colors">Quoten-Übersicht</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-zinc-300 mb-3">Rechtliches</h3>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li><Link href="/impressum" className="hover:text-zinc-200 transition-colors">Impressum</Link></li>
              <li><Link href="/datenschutz" className="hover:text-zinc-200 transition-colors">Datenschutz</Link></li>
              <li><Link href="/haftungsausschluss" className="hover:text-zinc-200 transition-colors">Haftungsausschluss</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-surface-border flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} Liga Radar. Alle Rechte vorbehalten.
          </p>
          <p className="text-xs text-zinc-600 text-center">
            Quoten ohne Gewähr. Glücksspiel kann süchtig machen.{" "}
            <a
              href="https://www.bzga.de"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-zinc-400 transition-colors"
            >
              Hilfe & Beratung
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
