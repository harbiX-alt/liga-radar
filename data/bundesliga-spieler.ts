import type { LigaSlug } from "@/lib/types";

export interface StaticPlayer {
  id: number;
  apiId: number;
  name: string;
  slug: string;
  position: "Torwart" | "Abwehr" | "Mittelfeld" | "Sturm";
  verein: string;
  vereinSlug: string;
  liga: LigaSlug;
  nationalitaet: string;
}

export const STATIC_SPIELER: StaticPlayer[] = [
  // ── Bayern München ────────────────────────────────────────────────────────
  { id:  1, apiId: 306005, name: "Manuel Neuer",          slug: "manuel-neuer-306005",          position: "Torwart",    verein: "Bayern München",           vereinSlug: "bayern-muenchen",           liga: "bundesliga", nationalitaet: "Germany" },
  { id:  2, apiId: 284985, name: "Thomas Müller",         slug: "thomas-mueller-284985",         position: "Mittelfeld", verein: "Bayern München",           vereinSlug: "bayern-muenchen",           liga: "bundesliga", nationalitaet: "Germany" },
  { id:  3, apiId:  35845, name: "Harry Kane",            slug: "harry-kane-35845",              position: "Sturm",      verein: "Bayern München",           vereinSlug: "bayern-muenchen",           liga: "bundesliga", nationalitaet: "England" },
  { id:  4, apiId: 521189, name: "Jamal Musiala",         slug: "jamal-musiala-521189",          position: "Mittelfeld", verein: "Bayern München",           vereinSlug: "bayern-muenchen",           liga: "bundesliga", nationalitaet: "Germany" },
  { id:  5, apiId: 277711, name: "Leroy Sané",            slug: "leroy-sane-277711",             position: "Mittelfeld", verein: "Bayern München",           vereinSlug: "bayern-muenchen",           liga: "bundesliga", nationalitaet: "Germany" },
  { id:  6, apiId: 284460, name: "Joshua Kimmich",        slug: "joshua-kimmich-284460",         position: "Mittelfeld", verein: "Bayern München",           vereinSlug: "bayern-muenchen",           liga: "bundesliga", nationalitaet: "Germany" },
  { id:  7, apiId: 154,    name: "Serge Gnabry",          slug: "serge-gnabry-154",              position: "Mittelfeld", verein: "Bayern München",           vereinSlug: "bayern-muenchen",           liga: "bundesliga", nationalitaet: "Germany" },
  { id:  8, apiId: 284472, name: "Alphonso Davies",       slug: "alphonso-davies-284472",        position: "Abwehr",     verein: "Bayern München",           vereinSlug: "bayern-muenchen",           liga: "bundesliga", nationalitaet: "Canada" },
  { id:  9, apiId: 284459, name: "Dayot Upamecano",       slug: "dayot-upamecano-284459",        position: "Abwehr",     verein: "Bayern München",           vereinSlug: "bayern-muenchen",           liga: "bundesliga", nationalitaet: "France" },
  { id: 10, apiId: 521188, name: "Michael Olise",         slug: "michael-olise-521188",          position: "Mittelfeld", verein: "Bayern München",           vereinSlug: "bayern-muenchen",           liga: "bundesliga", nationalitaet: "France" },

  // ── Bayer Leverkusen ──────────────────────────────────────────────────────
  { id: 11, apiId: 284471, name: "Granit Xhaka",          slug: "granit-xhaka-284471",           position: "Mittelfeld", verein: "Bayer Leverkusen",         vereinSlug: "bayer-leverkusen",          liga: "bundesliga", nationalitaet: "Switzerland" },
  { id: 12, apiId: 521190, name: "Florian Wirtz",         slug: "florian-wirtz-521190",          position: "Mittelfeld", verein: "Bayer Leverkusen",         vereinSlug: "bayer-leverkusen",          liga: "bundesliga", nationalitaet: "Germany" },
  { id: 13, apiId: 521191, name: "Alejandro Grimaldo",    slug: "alejandro-grimaldo-521191",     position: "Abwehr",     verein: "Bayer Leverkusen",         vereinSlug: "bayer-leverkusen",          liga: "bundesliga", nationalitaet: "Spain" },
  { id: 14, apiId: 521192, name: "Lukas Hradecky",         slug: "lukas-hradecky-521192",          position: "Torwart",    verein: "Bayer Leverkusen",         vereinSlug: "bayer-leverkusen",          liga: "bundesliga", nationalitaet: "Finland" },
  { id: 15, apiId: 284473, name: "Jonathan Tah",          slug: "jonathan-tah-284473",           position: "Abwehr",     verein: "Bayer Leverkusen",         vereinSlug: "bayer-leverkusen",          liga: "bundesliga", nationalitaet: "Germany" },
  { id: 16, apiId: 521193, name: "Victor Boniface",       slug: "victor-boniface-521193",        position: "Sturm",      verein: "Bayer Leverkusen",         vereinSlug: "bayer-leverkusen",          liga: "bundesliga", nationalitaet: "Nigeria" },

  // ── Borussia Dortmund ─────────────────────────────────────────────────────
  { id: 17, apiId:  19220, name: "Gregor Kobel",          slug: "gregor-kobel-19220",            position: "Torwart",    verein: "Borussia Dortmund",        vereinSlug: "borussia-dortmund",         liga: "bundesliga", nationalitaet: "Switzerland" },
  { id: 18, apiId: 284461, name: "Emre Can",              slug: "emre-can-284461",               position: "Mittelfeld", verein: "Borussia Dortmund",        vereinSlug: "borussia-dortmund",         liga: "bundesliga", nationalitaet: "Germany" },
  { id: 19, apiId: 521194, name: "Serhou Guirassy",       slug: "serhou-guirassy-521194",        position: "Sturm",      verein: "Borussia Dortmund",        vereinSlug: "borussia-dortmund",         liga: "bundesliga", nationalitaet: "Guinea" },
  { id: 20, apiId: 521195, name: "Julian Brandt",         slug: "julian-brandt-521195",          position: "Mittelfeld", verein: "Borussia Dortmund",        vereinSlug: "borussia-dortmund",         liga: "bundesliga", nationalitaet: "Germany" },
  { id: 21, apiId: 521196, name: "Karim Adeyemi",         slug: "karim-adeyemi-521196",          position: "Sturm",      verein: "Borussia Dortmund",        vereinSlug: "borussia-dortmund",         liga: "bundesliga", nationalitaet: "Germany" },
  { id: 22, apiId: 521197, name: "Nico Schlotterbeck",    slug: "nico-schlotterbeck-521197",     position: "Abwehr",     verein: "Borussia Dortmund",        vereinSlug: "borussia-dortmund",         liga: "bundesliga", nationalitaet: "Germany" },

  // ── RB Leipzig ────────────────────────────────────────────────────────────
  { id: 23, apiId: 521198, name: "Lois Openda",           slug: "lois-openda-521198",            position: "Sturm",      verein: "RB Leipzig",               vereinSlug: "rb-leipzig",                liga: "bundesliga", nationalitaet: "Belgium" },
  { id: 24, apiId: 521199, name: "Xavi Simons",           slug: "xavi-simons-521199",            position: "Mittelfeld", verein: "RB Leipzig",               vereinSlug: "rb-leipzig",                liga: "bundesliga", nationalitaet: "Netherlands" },
  { id: 25, apiId: 521200, name: "Antonio Nusa",          slug: "antonio-nusa-521200",           position: "Mittelfeld", verein: "RB Leipzig",               vereinSlug: "rb-leipzig",                liga: "bundesliga", nationalitaet: "Norway" },
  { id: 26, apiId: 284462, name: "Willi Orban",           slug: "willi-orban-284462",            position: "Abwehr",     verein: "RB Leipzig",               vereinSlug: "rb-leipzig",                liga: "bundesliga", nationalitaet: "Hungary" },

  // ── VfB Stuttgart ─────────────────────────────────────────────────────────
  { id: 27, apiId: 521201, name: "Deniz Undav",           slug: "deniz-undav-521201",            position: "Sturm",      verein: "VfB Stuttgart",            vereinSlug: "vfb-stuttgart",             liga: "bundesliga", nationalitaet: "Germany" },
  { id: 28, apiId: 521202, name: "Enzo Millot",           slug: "enzo-millot-521202",            position: "Mittelfeld", verein: "VfB Stuttgart",            vereinSlug: "vfb-stuttgart",             liga: "bundesliga", nationalitaet: "France" },
  { id: 29, apiId: 521203, name: "Chris Führich",         slug: "chris-fuehrich-521203",         position: "Mittelfeld", verein: "VfB Stuttgart",            vereinSlug: "vfb-stuttgart",             liga: "bundesliga", nationalitaet: "Germany" },
  { id: 30, apiId: 521204, name: "Ermedin Demirović",     slug: "ermedin-demirovic-521204",      position: "Sturm",      verein: "VfB Stuttgart",            vereinSlug: "vfb-stuttgart",             liga: "bundesliga", nationalitaet: "Bosnia" },

  // ── Eintracht Frankfurt ───────────────────────────────────────────────────
  { id: 31, apiId: 521205, name: "Omar Marmoush",         slug: "omar-marmoush-521205",          position: "Sturm",      verein: "Eintracht Frankfurt",      vereinSlug: "eintracht-frankfurt",       liga: "bundesliga", nationalitaet: "Egypt" },
  { id: 32, apiId: 521206, name: "Hugo Ekitiké",          slug: "hugo-ekitike-521206",           position: "Sturm",      verein: "Eintracht Frankfurt",      vereinSlug: "eintracht-frankfurt",       liga: "bundesliga", nationalitaet: "France" },
  { id: 33, apiId: 521207, name: "Ansgar Knauff",         slug: "ansgar-knauff-521207",          position: "Mittelfeld", verein: "Eintracht Frankfurt",      vereinSlug: "eintracht-frankfurt",       liga: "bundesliga", nationalitaet: "Germany" },

  // ── SC Freiburg ───────────────────────────────────────────────────────────
  { id: 34, apiId: 521208, name: "Christian Günter",      slug: "christian-guenter-521208",      position: "Abwehr",     verein: "SC Freiburg",              vereinSlug: "sc-freiburg",               liga: "bundesliga", nationalitaet: "Germany" },
  { id: 35, apiId: 521209, name: "Lucas Höler",           slug: "lucas-hoeler-521209",           position: "Sturm",      verein: "SC Freiburg",              vereinSlug: "sc-freiburg",               liga: "bundesliga", nationalitaet: "Germany" },
  { id: 36, apiId: 521210, name: "Matthias Ginter",       slug: "matthias-ginter-521210",        position: "Abwehr",     verein: "SC Freiburg",              vereinSlug: "sc-freiburg",               liga: "bundesliga", nationalitaet: "Germany" },

  // ── Borussia Mönchengladbach ──────────────────────────────────────────────
  { id: 37, apiId: 521211, name: "Tim Kleindienst",       slug: "tim-kleindienst-521211",        position: "Sturm",      verein: "Borussia Mönchengladbach", vereinSlug: "borussia-moenchengladbach", liga: "bundesliga", nationalitaet: "Germany" },
  { id: 38, apiId: 521212, name: "Jonas Omlin",           slug: "jonas-omlin-521212",            position: "Torwart",    verein: "Borussia Mönchengladbach", vereinSlug: "borussia-moenchengladbach", liga: "bundesliga", nationalitaet: "Switzerland" },
  { id: 39, apiId: 521213, name: "Alassane Pléa",         slug: "alassane-plea-521213",          position: "Sturm",      verein: "Borussia Mönchengladbach", vereinSlug: "borussia-moenchengladbach", liga: "bundesliga", nationalitaet: "France" },

  // ── TSG Hoffenheim ────────────────────────────────────────────────────────
  { id: 40, apiId: 521214, name: "Andrej Kramarić",       slug: "andrej-kramaric-521214",        position: "Sturm",      verein: "TSG Hoffenheim",           vereinSlug: "tsg-hoffenheim",            liga: "bundesliga", nationalitaet: "Croatia" },
  { id: 41, apiId: 521215, name: "Tom Bischof",           slug: "tom-bischof-521215",            position: "Mittelfeld", verein: "TSG Hoffenheim",           vereinSlug: "tsg-hoffenheim",            liga: "bundesliga", nationalitaet: "Germany" },

  // ── 1. FC Union Berlin ────────────────────────────────────────────────────
  { id: 42, apiId: 521216, name: "Kevin Vogt",            slug: "kevin-vogt-521216",             position: "Abwehr",     verein: "1. FC Union Berlin",       vereinSlug: "1-fc-union-berlin",         liga: "bundesliga", nationalitaet: "Germany" },
  { id: 43, apiId: 521217, name: "Benedict Hollerbach",   slug: "benedict-hollerbach-521217",    position: "Mittelfeld", verein: "1. FC Union Berlin",       vereinSlug: "1-fc-union-berlin",         liga: "bundesliga", nationalitaet: "Germany" },

  // ── Werder Bremen ─────────────────────────────────────────────────────────
  { id: 44, apiId: 521218, name: "Marvin Ducksch",        slug: "marvin-ducksch-521218",         position: "Sturm",      verein: "Werder Bremen",            vereinSlug: "werder-bremen",             liga: "bundesliga", nationalitaet: "Germany" },
  { id: 45, apiId: 521219, name: "Marco Friedl",          slug: "marco-friedl-521219",           position: "Abwehr",     verein: "Werder Bremen",            vereinSlug: "werder-bremen",             liga: "bundesliga", nationalitaet: "Austria" },

  // ── 1. FSV Mainz 05 ───────────────────────────────────────────────────────
  { id: 46, apiId: 521220, name: "Jonathan Burkardt",     slug: "jonathan-burkardt-521220",      position: "Sturm",      verein: "1. FSV Mainz 05",          vereinSlug: "1-fsv-mainz-05",            liga: "bundesliga", nationalitaet: "Germany" },
  { id: 47, apiId: 521221, name: "Leandro Barreiro",      slug: "leandro-barreiro-521221",       position: "Mittelfeld", verein: "1. FSV Mainz 05",          vereinSlug: "1-fsv-mainz-05",            liga: "bundesliga", nationalitaet: "Luxembourg" },

  // ── VfL Wolfsburg ─────────────────────────────────────────────────────────
  { id: 48, apiId: 521222, name: "Jonas Wind",            slug: "jonas-wind-521222",             position: "Sturm",      verein: "VfL Wolfsburg",            vereinSlug: "vfl-wolfsburg",             liga: "bundesliga", nationalitaet: "Denmark" },
  { id: 49, apiId: 521223, name: "Maximilian Arnold",     slug: "maximilian-arnold-521223",      position: "Mittelfeld", verein: "VfL Wolfsburg",            vereinSlug: "vfl-wolfsburg",             liga: "bundesliga", nationalitaet: "Germany" },

  // ── FC Augsburg ───────────────────────────────────────────────────────────
  { id: 50, apiId: 521224, name: "Alexis Claude-Maurice", slug: "alexis-claude-maurice-521224",  position: "Mittelfeld", verein: "FC Augsburg",              vereinSlug: "fc-augsburg",               liga: "bundesliga", nationalitaet: "France" },
  { id: 51, apiId: 521225, name: "Erwin Monfared",        slug: "erwin-monfared-521225",         position: "Sturm",      verein: "FC Augsburg",              vereinSlug: "fc-augsburg",               liga: "bundesliga", nationalitaet: "Germany" },
];
