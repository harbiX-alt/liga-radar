import type { MetadataRoute } from "next";
import { LIGEN } from "@/lib/types";
import {
  getTeamsByLeague,
  getTopScorers,
  getFixturesByLeague,
  groupFixturesBySpieltag,
  roundToSpieltag,
  teamToSlug,
  playerToSlug,
} from "@/lib/football-api";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ligaradar.de";

export const revalidate = 86400; // rebuild sitemap daily

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE}/quoten`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.9 },
  ];

  // Liga pages
  for (const liga of LIGEN) {
    entries.push({
      url: `${BASE}/bundesliga/${liga.slug}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    });
  }

  // Spieltag + Verein + Spieler pages
  for (const liga of LIGEN) {
    try {
      const [teams, scorers, fixtures] = await Promise.allSettled([
        getTeamsByLeague(liga.apiFootballId, liga.season),
        getTopScorers(liga.apiFootballId, liga.season),
        getFixturesByLeague(liga.apiFootballId, liga.season),
      ]);

      if (teams.status === "fulfilled") {
        for (const t of teams.value) {
          entries.push({
            url: `${BASE}/verein/${teamToSlug(t.team.name)}`,
            changeFrequency: "weekly",
            priority: 0.7,
          });
        }
      }

      if (scorers.status === "fulfilled") {
        for (const p of scorers.value) {
          entries.push({
            url: `${BASE}/spieler/${playerToSlug(p.player.firstname, p.player.lastname, p.player.id)}`,
            changeFrequency: "weekly",
            priority: 0.6,
          });
        }
      }

      if (fixtures.status === "fulfilled") {
        const grouped = groupFixturesBySpieltag(fixtures.value);
        for (const round of Object.keys(grouped)) {
          entries.push({
            url: `${BASE}/spieltag/${liga.slug}/${roundToSpieltag(round)}`,
            changeFrequency: "daily",
            priority: 0.8,
          });
        }
      }
    } catch {
      // continue with other leagues
    }
  }

  return entries;
}
