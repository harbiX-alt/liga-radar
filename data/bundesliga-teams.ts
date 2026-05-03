import type { LigaSlug } from "@/lib/types";

export interface StaticTeam {
  id: number;
  apiId: number;
  name: string;
  slug: string;
  liga: LigaSlug;
  founded?: number;
  venue?: { name: string; city: string; capacity?: number };
}

export const STATIC_TEAMS: StaticTeam[] = [
  // ── 1. Bundesliga ──────────────────────────────────────────────────────────
  { id: 1,  apiId: 157, name: "Bayern München",           slug: "bayern-muenchen",           liga: "bundesliga", founded: 1900, venue: { name: "Allianz Arena",                       city: "München",                 capacity: 75024 } },
  { id: 2,  apiId: 168, name: "Bayer Leverkusen",         slug: "bayer-leverkusen",           liga: "bundesliga", founded: 1904, venue: { name: "BayArena",                            city: "Leverkusen",              capacity: 30210 } },
  { id: 3,  apiId: 165, name: "Borussia Dortmund",        slug: "borussia-dortmund",          liga: "bundesliga", founded: 1909, venue: { name: "Signal Iduna Park",                  city: "Dortmund",                capacity: 81365 } },
  { id: 4,  apiId: 173, name: "RB Leipzig",               slug: "rb-leipzig",                 liga: "bundesliga", founded: 2009, venue: { name: "Red Bull Arena",                     city: "Leipzig",                 capacity: 47069 } },
  { id: 5,  apiId: 172, name: "VfB Stuttgart",            slug: "vfb-stuttgart",              liga: "bundesliga", founded: 1893, venue: { name: "MHPArena",                           city: "Stuttgart",               capacity: 60449 } },
  { id: 6,  apiId: 169, name: "Eintracht Frankfurt",      slug: "eintracht-frankfurt",        liga: "bundesliga", founded: 1899, venue: { name: "Deutsche Bank Park",                 city: "Frankfurt am Main",       capacity: 58000 } },
  { id: 7,  apiId: 160, name: "SC Freiburg",              slug: "sc-freiburg",                liga: "bundesliga", founded: 1904, venue: { name: "Europa-Park Stadion",                city: "Freiburg im Breisgau",    capacity: 34700 } },
  { id: 8,  apiId: 163, name: "Borussia Mönchengladbach", slug: "borussia-moenchengladbach",  liga: "bundesliga", founded: 1900, venue: { name: "Borussia-Park",                      city: "Mönchengladbach",         capacity: 54057 } },
  { id: 9,  apiId: 167, name: "TSG Hoffenheim",           slug: "tsg-hoffenheim",             liga: "bundesliga", founded: 1899, venue: { name: "PreZero Arena",                      city: "Sinsheim",                capacity: 30150 } },
  { id: 10, apiId: 182, name: "1. FC Union Berlin",       slug: "1-fc-union-berlin",          liga: "bundesliga", founded: 1906, venue: { name: "Stadion An der Alten Försterei",     city: "Berlin",                  capacity: 22012 } },
  { id: 11, apiId: 162, name: "Werder Bremen",            slug: "werder-bremen",              liga: "bundesliga", founded: 1899, venue: { name: "Weserstadion",                       city: "Bremen",                  capacity: 42100 } },
  { id: 12, apiId: 164, name: "1. FSV Mainz 05",          slug: "1-fsv-mainz-05",             liga: "bundesliga", founded: 1905, venue: { name: "Mewa Arena",                         city: "Mainz",                   capacity: 33305 } },
  { id: 13, apiId: 161, name: "VfL Wolfsburg",            slug: "vfl-wolfsburg",              liga: "bundesliga", founded: 1945, venue: { name: "Volkswagen Arena",                   city: "Wolfsburg",               capacity: 30000 } },
  { id: 14, apiId: 170, name: "FC Augsburg",              slug: "fc-augsburg",                liga: "bundesliga", founded: 1907, venue: { name: "WWK Arena",                          city: "Augsburg",                capacity: 30660 } },
  { id: 15, apiId: 183, name: "FC St. Pauli",             slug: "fc-st-pauli",                liga: "bundesliga", founded: 1910, venue: { name: "Millerntor-Stadion",                 city: "Hamburg",                 capacity: 29546 } },
  { id: 16, apiId: 180, name: "1. FC Heidenheim",         slug: "1-fc-heidenheim",            liga: "bundesliga", founded: 1846, venue: { name: "Voith-Arena",                        city: "Heidenheim an der Brenz", capacity: 15000 } },
  { id: 17, apiId: 178, name: "Hamburger SV",             slug: "hamburger-sv",               liga: "bundesliga", founded: 1887, venue: { name: "Volksparkstadion",                   city: "Hamburg",                 capacity: 57274 } },
  { id: 18, apiId: 159, name: "Fortuna Düsseldorf",       slug: "fortuna-duesseldorf",        liga: "bundesliga", founded: 1895, venue: { name: "Merkur Spiel-Arena",                 city: "Düsseldorf",              capacity: 54600 } },

  // ── 2. Bundesliga ──────────────────────────────────────────────────────────
  { id: 19, apiId: 171, name: "VfL Bochum",               slug: "vfl-bochum",                 liga: "2-bundesliga", founded: 1848, venue: { name: "Vonovia Ruhrstadion",              city: "Bochum",                  capacity: 27599 } },
  { id: 20, apiId: 190, name: "Holstein Kiel",            slug: "holstein-kiel",              liga: "2-bundesliga", founded: 1900, venue: { name: "Holstein-Stadion",                city: "Kiel",                    capacity: 15034 } },
  { id: 21, apiId: 174, name: "FC Schalke 04",            slug: "fc-schalke-04",              liga: "2-bundesliga", founded: 1904, venue: { name: "Veltins-Arena",                   city: "Gelsenkirchen",           capacity: 62271 } },
  { id: 22, apiId: 396, name: "1. FC Kaiserslautern",     slug: "1-fc-kaiserslautern",        liga: "2-bundesliga", founded: 1900, venue: { name: "Fritz Walter Stadion",            city: "Kaiserslautern",          capacity: 49850 } },
  { id: 23, apiId: 176, name: "Hannover 96",              slug: "hannover-96",                liga: "2-bundesliga", founded: 1896, venue: { name: "Heinz von Heiden Arena",          city: "Hannover",                capacity: 49200 } },
  { id: 24, apiId: 379, name: "Hertha BSC",               slug: "hertha-bsc",                 liga: "2-bundesliga", founded: 1892, venue: { name: "Olympiastadion",                  city: "Berlin",                  capacity: 74475 } },
  { id: 25, apiId: 186, name: "SpVgg Greuther Fürth",     slug: "spvgg-greuther-fuerth",      liga: "2-bundesliga", founded: 1903, venue: { name: "Sportpark Ronhof",               city: "Fürth",                   capacity: 17500 } },
  { id: 26, apiId: 184, name: "Karlsruher SC",            slug: "karlsruher-sc",              liga: "2-bundesliga", founded: 1894, venue: { name: "BBBank Wildpark",                city: "Karlsruhe",               capacity: 34302 } },
  { id: 27, apiId: 181, name: "SC Paderborn 07",          slug: "sc-paderborn-07",            liga: "2-bundesliga", founded: 1907, venue: { name: "Benteler Arena",                 city: "Paderborn",               capacity: 15000 } },
  { id: 28, apiId: 177, name: "1. FC Nürnberg",           slug: "1-fc-nuernberg",             liga: "2-bundesliga", founded: 1905, venue: { name: "Max-Morlock-Stadion",            city: "Nürnberg",                capacity: 50000 } },
  { id: 29, apiId: 185, name: "SV Darmstadt 98",          slug: "sv-darmstadt-98",            liga: "2-bundesliga", founded: 1898, venue: { name: "Merck-Stadion am Böllenfalltor", city: "Darmstadt",               capacity: 17810 } },
  { id: 30, apiId: 757, name: "SSV Ulm 1846",             slug: "ssv-ulm-1846",               liga: "2-bundesliga", founded: 1846, venue: { name: "Donaustadion",                   city: "Ulm",                     capacity: 19500 } },
  { id: 31, apiId: 349, name: "1. FC Magdeburg",          slug: "1-fc-magdeburg",             liga: "2-bundesliga", founded: 1965, venue: { name: "MDCC-Arena",                     city: "Magdeburg",               capacity: 27250 } },
  { id: 32, apiId: 703, name: "SV Elversberg",            slug: "sv-elversberg",              liga: "2-bundesliga", founded: 1907, venue: { name: "Ursapharm-Arena an der Kaiserlinde", city: "Spiesen-Elversberg",   capacity: 9800  } },
  { id: 33, apiId: 392, name: "Jahn Regensburg",          slug: "jahn-regensburg",            liga: "2-bundesliga", founded: 1907, venue: { name: "Continental Arena",              city: "Regensburg",              capacity: 15210 } },
  { id: 34, apiId: 753, name: "Preußen Münster",          slug: "preussen-muenster",          liga: "2-bundesliga", founded: 1906, venue: { name: "Preußenstadion",                 city: "Münster",                 capacity: 15000 } },
  { id: 35, apiId: 188, name: "Eintracht Braunschweig",   slug: "eintracht-braunschweig",     liga: "2-bundesliga", founded: 1895, venue: { name: "Eintracht-Stadion",              city: "Braunschweig",            capacity: 23325 } },
  { id: 36, apiId: 189, name: "Wehen Wiesbaden",          slug: "wehen-wiesbaden",            liga: "2-bundesliga", founded: 1926, venue: { name: "BRITA-Arena",                    city: "Wiesbaden",               capacity: 13000 } },

  // ── 3. Liga ────────────────────────────────────────────────────────────────
  { id: 37, apiId: 191, name: "TSV 1860 München",         slug: "tsv-1860-muenchen",          liga: "3-liga", founded: 1860, venue: { name: "Städtisches Stadion an der Grünwalder Str.", city: "München",           capacity: 15000 } },
  { id: 38, apiId: 192, name: "Dynamo Dresden",           slug: "dynamo-dresden",             liga: "3-liga", founded: 1953, venue: { name: "Rudolf-Harbig-Stadion",            city: "Dresden",                 capacity: 32066 } },
  { id: 39, apiId: 193, name: "1. FC Saarbrücken",        slug: "1-fc-saarbruecken",          liga: "3-liga", founded: 1903, venue: { name: "Ludwigsparkstadion",               city: "Saarbrücken",             capacity: 16000 } },
  { id: 40, apiId: 194, name: "Hallescher FC",            slug: "hallescher-fc",              liga: "3-liga", founded: 1900, venue: { name: "Erdgas Sportpark",                 city: "Halle (Saale)",           capacity: 15500 } },
  { id: 41, apiId: 195, name: "Rot-Weiss Essen",          slug: "rot-weiss-essen",            liga: "3-liga", founded: 1907, venue: { name: "Stadion Essen",                    city: "Essen",                   capacity: 19500 } },
  { id: 42, apiId: 196, name: "Viktoria Köln",            slug: "viktoria-koeln",             liga: "3-liga", founded: 1904, venue: { name: "Sportpark Höhenberg",              city: "Köln",                    capacity: 11800 } },
  { id: 43, apiId: 197, name: "SpVgg Unterhaching",       slug: "spvgg-unterhaching",         liga: "3-liga", founded: 1925, venue: { name: "Alpenbauer Sportpark",             city: "Unterhaching",            capacity: 15053 } },
  { id: 44, apiId: 198, name: "SC Verl",                  slug: "sc-verl",                    liga: "3-liga", founded: 1924, venue: { name: "Sportclub-Arena",                  city: "Verl",                    capacity: 7760  } },
  { id: 45, apiId: 199, name: "MSV Duisburg",             slug: "msv-duisburg",               liga: "3-liga", founded: 1902, venue: { name: "Schauinsland-Reisen-Arena",        city: "Duisburg",                capacity: 31500 } },
  { id: 46, apiId: 200, name: "Erzgebirge Aue",           slug: "erzgebirge-aue",             liga: "3-liga", founded: 1946, venue: { name: "Erzgebirgsstadion",                city: "Aue-Bad Schlema",         capacity: 15555 } },
  { id: 47, apiId: 201, name: "FC Ingolstadt 04",         slug: "fc-ingolstadt-04",           liga: "3-liga", founded: 2004, venue: { name: "Audi Sportpark",                   city: "Ingolstadt",              capacity: 15225 } },
  { id: 48, apiId: 202, name: "Waldhof Mannheim",         slug: "waldhof-mannheim",           liga: "3-liga", founded: 1907, venue: { name: "Carl-Benz-Stadion",                city: "Mannheim",                capacity: 27900 } },
  { id: 49, apiId: 203, name: "Energie Cottbus",          slug: "energie-cottbus",            liga: "3-liga", founded: 1963, venue: { name: "Stadion der Freundschaft",          city: "Cottbus",                 capacity: 22500 } },
  { id: 50, apiId: 204, name: "SV Sandhausen",            slug: "sv-sandhausen",              liga: "3-liga", founded: 1916, venue: { name: "BWT-Stadion am Hardtwald",          city: "Sandhausen",              capacity: 15500 } },
  { id: 51, apiId: 205, name: "FC Bayern München II",     slug: "fc-bayern-muenchen-ii",      liga: "3-liga", founded: 1900, venue: { name: "FC Bayern Campus Stadion",          city: "München",                 capacity: 2500  } },
  { id: 52, apiId: 206, name: "Borussia Dortmund II",     slug: "borussia-dortmund-ii",       liga: "3-liga", founded: 1909, venue: { name: "Rund um den Haakon",               city: "Dortmund",                capacity: 10000 } },
  { id: 53, apiId: 207, name: "VfL Osnabrück",            slug: "vfl-osnabrueck",             liga: "3-liga", founded: 1899, venue: { name: "Bremer Brücke",                    city: "Osnabrück",               capacity: 16000 } },
  { id: 54, apiId: 208, name: "Alemannia Aachen",         slug: "alemannia-aachen",           liga: "3-liga", founded: 1900, venue: { name: "Tivoli",                           city: "Aachen",                  capacity: 32960 } },
  { id: 55, apiId: 209, name: "FC Erzgebirge Aue",        slug: "fc-erzgebirge-aue",          liga: "3-liga", founded: 1946, venue: { name: "Erzgebirgsstadion",                city: "Aue",                     capacity: 15555 } },
  { id: 56, apiId: 210, name: "Hansa Rostock",            slug: "hansa-rostock",              liga: "3-liga", founded: 1965, venue: { name: "Ostseestadion",                    city: "Rostock",                 capacity: 29000 } },
];
