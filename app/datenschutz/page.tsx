import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  description: "Datenschutzerklärung von Liga Radar gemäß DSGVO.",
  robots: { index: false, follow: false },
};

export default function DatenschutzPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12 animate-fade-in">
      <h1 className="text-3xl font-bold text-zinc-100 mb-2">Datenschutzerklärung</h1>
      <p className="text-zinc-500 text-sm mb-10">
        Zuletzt aktualisiert: Mai 2026 · Gemäß DSGVO (EU) 2016/679
      </p>

      <div className="space-y-10 text-zinc-400 text-sm leading-relaxed">

        <Section title="1. Verantwortlicher">
          <p>
            Verantwortlicher im Sinne der DSGVO für die Verarbeitung personenbezogener
            Daten auf dieser Website ist:
          </p>
          <div className="mt-3 p-4 bg-surface-elevated rounded-lg border border-surface-border text-zinc-300">
            aX Digital Solutions LLC<br />
            1209 Mountain Road Pl NE Ste N<br />
            Albuquerque, NM 87110, USA<br />
            E-Mail:{" "}
            <a href="mailto:info@ax-digital.de" className="text-brand-400 hover:text-brand-300 transition-colors">
              info@ax-digital.de
            </a>
          </div>
        </Section>

        <Section title="2. Grundsätze der Datenverarbeitung">
          <p>
            Wir erheben und verwenden personenbezogene Daten unserer Nutzer
            grundsätzlich nur, soweit dies zur Bereitstellung einer funktionsfähigen
            Website sowie unserer Inhalte und Leistungen erforderlich ist. Die
            Erhebung und Verwendung personenbezogener Daten erfolgt regelmäßig nur
            nach Einwilligung des Nutzers oder wenn die Verarbeitung durch gesetzliche
            Vorschriften gestattet ist.
          </p>
        </Section>

        <Section title="3. Automatisch erfasste Daten (Server-Logs)">
          <p>
            Beim Besuch unserer Website werden durch den Webserver automatisch
            folgende Informationen erfasst und temporär in Server-Logfiles gespeichert:
          </p>
          <ul className="mt-3 space-y-1 list-disc list-inside text-zinc-500">
            <li>IP-Adresse des anfragenden Rechners (anonymisiert)</li>
            <li>Datum und Uhrzeit des Zugriffs</li>
            <li>Name und URL der abgerufenen Datei</li>
            <li>Übertragene Datenmenge</li>
            <li>Meldung, ob der Abruf erfolgreich war</li>
            <li>Verwendeter Browser und Betriebssystem</li>
          </ul>
          <p className="mt-3">
            Die Rechtsgrundlage für diese Verarbeitung ist Art. 6 Abs. 1 lit. f DSGVO
            (berechtigtes Interesse). Server-Logs werden nach spätestens 7 Tagen gelöscht.
            Eine Weitergabe an Dritte findet nicht statt.
          </p>
        </Section>

        <Section title="4. Cookies">
          <p>
            Unsere Website verwendet Cookies. Cookies sind kleine Textdateien, die auf
            Ihrem Endgerät gespeichert werden. Wir unterscheiden zwischen:
          </p>
          <div className="mt-3 space-y-3">
            <div className="p-3 bg-surface-elevated rounded-lg border border-surface-border">
              <p className="font-medium text-zinc-300 mb-1">Technisch notwendige Cookies</p>
              <p>
                Diese Cookies sind für den Betrieb der Website erforderlich und können
                nicht deaktiviert werden. Sie speichern keine personenbezogenen Daten.
                Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO.
              </p>
            </div>
            <div className="p-3 bg-surface-elevated rounded-lg border border-surface-border">
              <p className="font-medium text-zinc-300 mb-1">Analyse-Cookies (Google Analytics)</p>
              <p>
                Mit Ihrer Einwilligung setzen wir Google Analytics ein (siehe Abschnitt 5).
                Diese Cookies werden nur nach Ihrer ausdrücklichen Zustimmung aktiviert.
                Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO.
              </p>
            </div>
          </div>
          <p className="mt-3">
            Sie können Cookies in den Einstellungen Ihres Browsers jederzeit löschen
            oder deren Speicherung verhindern. Dies kann die Funktionalität der Website
            einschränken.
          </p>
        </Section>

        <Section title="5. Google Analytics">
          <p>
            Diese Website verwendet Google Analytics, einen Webanalysedienst der
            Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland
            («Google»).
          </p>
          <p className="mt-3">
            Google Analytics verwendet Cookies, die eine Analyse der Benutzung der
            Website ermöglichen. Die durch Cookies erzeugten Informationen über Ihre
            Benutzung dieser Website werden in der Regel an einen Server von Google in
            den USA übertragen und dort gespeichert.
          </p>
          <p className="mt-3">
            Wir haben die IP-Anonymisierung aktiviert, sodass Ihre IP-Adresse von
            Google innerhalb von Mitgliedstaaten der Europäischen Union oder in anderen
            Vertragsstaaten des Abkommens über den Europäischen Wirtschaftsraum zuvor
            gekürzt wird. Nur in Ausnahmefällen wird die volle IP-Adresse an einen
            Server von Google in den USA übertragen und dort gekürzt.
          </p>
          <p className="mt-3">
            Google wird diese Informationen benutzen, um Ihre Nutzung der Website
            auszuwerten, um Reports über die Websiteaktivitäten zusammenzustellen
            und um weitere mit der Websitenutzung und der Internetnutzung verbundene
            Dienstleistungen zu erbringen.
          </p>
          <p className="mt-3">
            Die Datenübertragung in die USA ist auf den
            Standardvertragsklauseln der EU-Kommission gestützt (Art. 46 Abs. 2 lit. c DSGVO).
            Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO (Einwilligung).
          </p>
          <p className="mt-3">
            Sie können die Erfassung der durch den Cookie erzeugten und auf Ihre Nutzung
            der Website bezogenen Daten (inkl. Ihrer IP-Adresse) an Google sowie die
            Verarbeitung dieser Daten durch Google verhindern, indem Sie das unter dem
            folgenden Link verfügbare Browser-Plugin herunterladen und installieren:{" "}
            <a
              href="https://tools.google.com/dlpage/gaoptout"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-400 hover:text-brand-300 transition-colors"
            >
              https://tools.google.com/dlpage/gaoptout
            </a>
          </p>
        </Section>

        <Section title="6. Keine Weitergabe personenbezogener Daten an Dritte">
          <p>
            Wir verkaufen, handeln oder übertragen Ihre personenbezogenen Daten
            <strong className="text-zinc-300"> nicht</strong> an Dritte. Dies gilt nicht
            für vertrauenswürdige Dritte, die uns bei dem Betrieb unserer Website,
            der Durchführung unseres Geschäfts oder der Betreuung unserer Nutzer
            unterstützen, soweit diese Parteien zustimmen, diese Informationen
            vertraulich zu behandeln.
          </p>
          <p className="mt-3">
            Eine Ausnahme gilt, wenn wir glauben, dass eine Weitergabe der Informationen
            angemessen ist, um geltende Gesetze einzuhalten, unsere Website-Richtlinien
            durchzusetzen oder unsere oder die Rechte, das Eigentum oder die Sicherheit
            anderer zu schützen.
          </p>
          <p className="mt-3">
            Die mit Google Analytics übermittelten Daten werden von Google gemäß deren
            eigener Datenschutzrichtlinie verarbeitet:{" "}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-400 hover:text-brand-300 transition-colors"
            >
              policies.google.com/privacy
            </a>
          </p>
        </Section>

        <Section title="7. Hosting (Vercel)">
          <p>
            Diese Website wird gehostet bei Vercel Inc., 340 Pine Street Suite 900,
            San Francisco, CA 94104, USA. Vercel verarbeitet dabei technische Daten
            (Server-Logs, IP-Adressen) im Rahmen des Hostings. Mit Vercel besteht ein
            Data Processing Agreement (DPA) gemäß Art. 28 DSGVO.
          </p>
          <p className="mt-3">
            Weitere Informationen:{" "}
            <a
              href="https://vercel.com/legal/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-400 hover:text-brand-300 transition-colors"
            >
              vercel.com/legal/privacy-policy
            </a>
          </p>
        </Section>

        <Section title="8. Ihre Rechte als betroffene Person">
          <p>Sie haben gegenüber uns folgende Rechte hinsichtlich Ihrer personenbezogenen Daten:</p>
          <ul className="mt-3 space-y-2 list-disc list-inside text-zinc-500">
            <li><strong className="text-zinc-400">Recht auf Auskunft</strong> (Art. 15 DSGVO)</li>
            <li><strong className="text-zinc-400">Recht auf Berichtigung</strong> (Art. 16 DSGVO)</li>
            <li><strong className="text-zinc-400">Recht auf Löschung</strong> (Art. 17 DSGVO)</li>
            <li><strong className="text-zinc-400">Recht auf Einschränkung der Verarbeitung</strong> (Art. 18 DSGVO)</li>
            <li><strong className="text-zinc-400">Recht auf Datenübertragbarkeit</strong> (Art. 20 DSGVO)</li>
            <li><strong className="text-zinc-400">Widerspruchsrecht</strong> (Art. 21 DSGVO)</li>
            <li><strong className="text-zinc-400">Recht auf Widerruf einer Einwilligung</strong> (Art. 7 Abs. 3 DSGVO)</li>
          </ul>
          <p className="mt-3">
            Zur Geltendmachung Ihrer Rechte wenden Sie sich an:{" "}
            <a href="mailto:info@ax-digital.de" className="text-brand-400 hover:text-brand-300 transition-colors">
              info@ax-digital.de
            </a>
          </p>
          <p className="mt-3">
            Sie haben außerdem das Recht, sich bei einer Datenschutz-Aufsichtsbehörde
            über die Verarbeitung Ihrer personenbezogenen Daten durch uns zu beschweren
            (Art. 77 DSGVO).
          </p>
        </Section>

        <Section title="9. Datensicherheit">
          <p>
            Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung
            vertraulicher Inhalte eine SSL- bzw. TLS-Verschlüsselung. Eine verschlüsselte
            Verbindung erkennen Sie daran, dass die Adresszeile des Browsers von «http://»
            auf «https://» wechselt und an dem Schloss-Symbol in Ihrer Browserzeile.
          </p>
        </Section>

        <Section title="10. Änderungen dieser Datenschutzerklärung">
          <p>
            Wir behalten uns vor, diese Datenschutzerklärung anzupassen, damit sie
            stets den aktuellen rechtlichen Anforderungen entspricht oder um Änderungen
            unserer Leistungen in der Datenschutzerklärung umzusetzen. Für Ihren
            erneuten Besuch gilt dann die neue Datenschutzerklärung.
          </p>
        </Section>

        <p className="text-xs text-zinc-600 border-t border-surface-border pt-6">
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
