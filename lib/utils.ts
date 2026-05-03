import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { LigaSlug } from "./types";
import { LIGEN } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getLigaBySlug(slug: string) {
  return LIGEN.find((l) => l.slug === slug) ?? null;
}

export function formatDate(iso: string, opts?: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat("de-DE", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    ...opts,
  }).format(new Date(iso));
}

export function formatTime(iso: string): string {
  return new Intl.DateTimeFormat("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Berlin",
  }).format(new Date(iso));
}

export function formatDateTime(iso: string): string {
  return `${formatDate(iso)} ${formatTime(iso)} Uhr`;
}

export function oddsColor(price: number, best: number): string {
  const ratio = best > 0 ? price / best : 0;
  if (ratio >= 1) return "text-odds-best";
  if (ratio >= 0.98) return "text-odds-good";
  if (ratio >= 0.95) return "text-odds-avg";
  return "text-zinc-400";
}

export function impliedProbability(odds: number): string {
  if (odds <= 0) return "—";
  return `${((1 / odds) * 100).toFixed(1)}%`;
}

export function ligaLabel(slug: LigaSlug): string {
  return LIGEN.find((l) => l.slug === slug)?.name ?? slug;
}

export function absoluteUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ligaradar.de";
  return `${base}${path}`;
}
