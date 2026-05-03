import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Haftungsausschluss",
  description: "Haftungsausschluss von Liga Radar – Keine Gewähr für Quotenangaben.",
  robots: { index: false, follow: false },
};

export default function HaftungsausschlussPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12 animate-fade-in">
      <h1 className="text-3xl font-bold text-zinc-100 mb-2">Haftungsausschluss</h1>
      <p className="text-zinc-500 text-sm mb-10">Disclaimer</p>

      {/* Glücksspiel-Warnung prominent */}
      <div className="mb-10 p-5 rounded-xl border border-amber-700/50 bg-amber-900/20">
        <p className="text-amber-400 font-semibold text-base mb-2">⚠ Wichtiger Hinweis zum Glücksspiel</p>
        <p className="text-amber-200/80 text-sm leading-relaxed">
          Glücksspiel kann süchtig machen. Spielen Sie verantwortungsbewusst und
          nur mit Beträgen, deren Verlust Sie sich leisten können. Das Angebot auf
          Liga Radar richtet sich ausschließlich an Personen, die das{" "}
          <strong>18. Lebensjahr vollendet</strong> haben.
        </p>
        <p className="text-amber-200/80 text-sm mt-3">
          Wenn Sie oder jemand in Ihrem Umfeld ein Problem mit Glücksspiel haben,
          wenden Sie sich an die{" "}
          <a
            href="https://www.bzga.de"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-400 underline hover:text-amber-300 transition-colors font-medium"
          >
            Bundeszentrale für gesundheitliche Aufklärung (BZgA)
          </a>{" "}
          unter der kostenlosen Hotline{" "}
          <a href="tel:08001372700" className="text-amber-400 font-medium hover:text-amber-300 transition-colors">
            0800 137 27 00
          </a>{" "}
          (Mo–Do 10–22 Uhr, Fr–So 10–18 Uhr).
        </p>
      </div>

      <div className="space-y-10 text-zinc-400 text-sm leading-relaxed">

        <Section title="1. Keine Gewähr für die Richtigkeit der Quoten">
          <p>
            Liga Radar ist ein reines Informations- und Vergleichsportal. Die auf
            dieser Website angezeigten Wettquoten werden automatisiert von
            lizenzierten Drittanbietern (Buchmachern) bezogen und dienen
            ausschließlich zu Informations- und Vergleichszwecken.
          </p>
          <p className="mt-3">
            Wir übernehmen <strong className="text-zinc-300">keine Gewähr</strong> für:
          </p>
          <ul className="mt-2 space-y-1 list-disc list-inside text-zinc-500">
            <li>die Richtigkeit, Vollständigkeit oder Aktualität der angezeigten Quoten</li>
            <li>die Verfügbarkeit der Quoten bei den jeweiligen Anbietern</li>
            <li>die Übereinstimmung der angezeigten Quoten mit den tatsächlich gültigen Quoten der Anbieter zum Zeitpunkt einer Wettplatzierung</li>
            <li>technische Verzögerungen oder Übertragungsfehler bei der Quotenaktualisierung</li>
          </ul>
          <p className="mt-3">
            Vor dem Abschluss einer Wette sind stets die aktuellen Quoten direkt beim
            jeweiligen Buchmacher zu überprüfen. Allein der Buchmacher ist für die
            Richtigkeit der angebotenen Quoten und die Abwicklung von Wetten verantwortlich.
          </p>
        </Section>

        <Section title="2. Haftung für Inhalte (§ 7 TMG)">
          <p>
            Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte
            auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach
            §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet,
            übermittelte oder gespeicherte fremde Informationen zu überwachen oder
            nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
          </p>
          <p className="mt-3">
            Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen
            nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche
            Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten
            Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen
            werden wir diese Inhalte umgehend entfernen.
          </p>
        </Section>

        <Section title="3. Haftung für externe Links">
          <p>
            Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte
            wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch
            keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der
            jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
          </p>
          <p className="mt-3">
            Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche
            Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der
            Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle der
            verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung
            nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige
            Links umgehend entfernen.
          </p>
        </Section>

        <Section title="4. Kein Glücksspielanbieter · 18+ Pflicht">
          <p>
            Liga Radar ist <strong className="text-zinc-300">kein Glücksspielanbieter</strong>.
            Die Website nimmt keine Wetten entgegen, betreibt kein Casino und zahlt
            keine Gewinne aus. Es handelt sich ausschließlich um ein vergleichendes
            Informationsportal.
          </p>
          <p className="mt-3">
            Die Nutzung dieser Website sowie das Abschließen von Sportwetten bei
            Drittanbietern ist in Deutschland und den meisten europäischen Ländern
            nur Personen ab <strong className="text-zinc-300">18 Jahren</strong> erlaubt.
            Durch die Nutzung dieser Website bestätigen Sie, dass Sie das 18. Lebensjahr
            vollendet haben.
          </p>
          <p className="mt-3">
            Minderjährige sind von der Nutzung dieser Website und dem Abschluss von
            Sportwetten ausdrücklich ausgeschlossen.
          </p>
        </Section>

        <Section title="5. Glücksspielsucht – Hilfe und Beratung">
          <p>
            Wir unterstützen den verantwortungsvollen Umgang mit Glücksspiel.
            Wenn Sie das Gefühl haben, dass Glücksspiel zu einem Problem für Sie
            oder Ihr Umfeld geworden ist, suchen Sie bitte professionelle Hilfe:
          </p>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <HilfeCard
              name="Bundeszentrale für gesundheitliche Aufklärung (BZgA)"
              detail="Hotline: 0800 137 27 00 (kostenlos)"
              href="https://www.bzga.de"
            />
            <HilfeCard
              name="Bundeszentrale für gesundheitliche Aufklärung – Spielsucht"
              detail="Informationen & Online-Beratung"
              href="https://www.bzga.de/themen/gluecksspielsucht/"
            />
          </div>
        </Section>

        <Section title="6. Zuständige Glücksspielaufsicht">
          <p>
            Die Regulierung von Sportwetten in Deutschland obliegt der{" "}
            <strong className="text-zinc-300">Gemeinsamen Glücksspielbehörde der Länder (GGL)</strong>.
            Wir sind weder ein bei der GGL zugelassener Anbieter noch stehen wir in
            einem Aufsichtsverhältnis zu dieser Behörde, da wir kein Glücksspiel anbieten.
          </p>
        </Section>

        <div className="flex flex-wrap gap-3 pt-4 border-t border-surface-border">
          <Link href="/impressum" className="btn-ghost text-xs">→ Impressum</Link>
          <Link href="/datenschutz" className="btn-ghost text-xs">→ Datenschutzerklärung</Link>
        </div>

        <p className="text-xs text-zinc-600">
          Stand: Mai 2026 · aX Digital Solutions LLC
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
      <div>{children}</div>
    </section>
  );
}

function HilfeCard({ name, detail, href }: { name: string; detail: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-3 bg-surface-elevated border border-surface-border rounded-lg hover:border-zinc-600 transition-colors"
    >
      <p className="text-zinc-300 font-medium text-xs mb-1">{name}</p>
      <p className="text-zinc-500 text-xs">{detail}</p>
    </a>
  );
}
