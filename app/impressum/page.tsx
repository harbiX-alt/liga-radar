import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impressum",
  description: "Impressum von Liga Radar – Angaben gemäß § 5 TMG.",
  robots: { index: false, follow: false },
};

export default function ImpressumPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12 animate-fade-in">
      <h1 className="text-3xl font-bold text-zinc-100 mb-2">Impressum</h1>
      <p className="text-zinc-500 text-sm mb-10">Angaben gemäß § 5 TMG</p>

      <div className="space-y-10 text-zinc-300 leading-relaxed">

        {/* Betreiber */}
        <Section title="Betreiber und Verantwortlicher">
          <p>
            aX Digital Solutions LLC<br />
            1209 Mountain Road Pl NE Ste N<br />
            Albuquerque, NM 87110<br />
            Vereinigte Staaten von Amerika (USA)
          </p>
          <p className="mt-3">
            <span className="text-zinc-400">E-Mail:</span>{" "}
            <a href="mailto:info@ax-digital.de" className="text-brand-400 hover:text-brand-300 transition-colors">
              info@ax-digital.de
            </a>
          </p>
        </Section>

        {/* Art des Angebots */}
        <Section title="Art des Angebots">
          <p>
            Liga Radar (<strong className="text-zinc-200">ligaradar.de</strong>) ist ein unabhängiges
            Informations- und Quotenvergleichsportal für den deutschen Profifußball
            (1. Bundesliga, 2. Bundesliga, 3. Liga).
          </p>
          <p className="mt-3">
            Das Portal stellt ausschließlich redaktionelle Informationen, Spielerstatistiken,
            Ligatabellen sowie Wettquoten verschiedener lizenzierter Anbieter zu
            Vergleichszwecken bereit. Liga Radar ist <strong className="text-zinc-200">kein Glücksspielanbieter</strong> und
            nimmt keine Wetten entgegen. Alle dargestellten Quoten stammen von Dritten und
            werden lediglich zu Informationszwecken aggregiert und verglichen.
          </p>
          <p className="mt-3">
            Die Nutzung dieses Portals ist ausschließlich Personen gestattet, die das{" "}
            <strong className="text-zinc-200">18. Lebensjahr vollendet</strong> haben.
            Minderjährige sind von der Nutzung ausdrücklich ausgeschlossen.
          </p>
        </Section>

        {/* Keine Glücksspielerlaubnis */}
        <Section title="Kein Glücksspielanbieter">
          <p>
            aX Digital Solutions LLC betreibt Liga Radar ausschließlich als
            vergleichendes Informationsportal. Das Unternehmen verfügt über keine
            Glücksspielerlaubnis und benötigt eine solche auch nicht, da weder Wetten
            entgegengenommen noch Gewinne ausgezahlt werden.
          </p>
          <p className="mt-3">
            Für das Abschließen von Sportwetten verweisen wir auf die jeweils
            verlinkten lizenzierten Anbieter, die eigenverantwortlich unter den
            geltenden nationalen Glücksspielgesetzen operieren.
          </p>
        </Section>

        {/* Verantwortlich für den Inhalt */}
        <Section title="Verantwortlich für den Inhalt (§ 55 Abs. 2 RStV)">
          <p>
            aX Digital Solutions LLC<br />
            1209 Mountain Road Pl NE Ste N<br />
            Albuquerque, NM 87110, USA<br />
            <a href="mailto:info@ax-digital.de" className="text-brand-400 hover:text-brand-300 transition-colors">
              info@ax-digital.de
            </a>
          </p>
        </Section>

        {/* Urheberrecht */}
        <Section title="Urheberrecht">
          <p>
            Die durch den Betreiber erstellten Inhalte und Werke auf diesen Seiten
            unterliegen dem Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung
            und jede Art der Verwertung außerhalb der Grenzen des Urheberrechts bedürfen
            der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
          </p>
          <p className="mt-3">
            Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden,
            werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter
            als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung
            aufmerksam werden, bitten wir um einen entsprechenden Hinweis an{" "}
            <a href="mailto:info@ax-digital.de" className="text-brand-400 hover:text-brand-300 transition-colors">
              info@ax-digital.de
            </a>.
          </p>
        </Section>

        {/* Streitschlichtung */}
        <Section title="Streitschlichtung (EU)">
          <p>
            Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung
            (OS) bereit:{" "}
            <a
              href="https://ec.europa.eu/consumers/odr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-400 hover:text-brand-300 transition-colors"
            >
              https://ec.europa.eu/consumers/odr
            </a>
            . Unsere E-Mail-Adresse finden Sie oben im Impressum. Wir sind nicht
            bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
            Verbraucherschlichtungsstelle teilzunehmen.
          </p>
        </Section>

        <p className="text-xs text-zinc-600 border-t border-surface-border pt-6">
          Stand: Mai 2026
        </p>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-zinc-100 mb-3 pb-2 border-b border-surface-border">
        {title}
      </h2>
      <div className="text-zinc-400 text-sm leading-relaxed space-y-1">{children}</div>
    </section>
  );
}
