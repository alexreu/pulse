import { tz } from "@date-fns/tz";
import { addDays, addMonths, differenceInCalendarDays, differenceInCalendarMonths, format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import type { MonthlyRevenue, SeedMonthlyRevenue } from "@/data/revenue";
import { DISPLAY_TIMEZONE } from "@/lib/format";
import type { Lead } from "../types";

/**
 * Le jeu de données a été écrit autour d'un jour précis. Pour qu'il reste
 * vivant, on le recale sur la date du jour à la création de chaque session :
 * toutes les dates avancent du même nombre de jours, à heure murale
 * constante, et la série de chiffre d'affaires avance du même nombre de mois.
 *
 * Un prospect créé « il y a deux jours » le reste, quel que soit le jour de la
 * visite.
 */
export const SEED_DAY = "2026-09-15T12:00:00+02:00";

const inZone = { in: tz(DISPLAY_TIMEZONE) };

/**
 * Toujours rendre de l'UTC en `Z` : `TZDate.toISOString()` écrirait le décalage
 * (`+01:00`), et les activités se trient en comparant leurs chaînes.
 */
function shiftIso(iso: string, days: number): string {
  return new Date(addDays(parseISO(iso), days, inZone).getTime()).toISOString();
}

/** La date la plus récente du jeu : création, dernier contact ou note. */
export function latestSeedDate(leads: Lead[]): string {
  let latest = 0;
  for (const lead of leads) {
    for (const iso of [lead.createdAt, lead.lastContactAt, ...lead.notes.map((note) => note.createdAt)]) {
      if (iso) latest = Math.max(latest, new Date(iso).getTime());
    }
  }
  return new Date(latest || new Date(SEED_DAY).getTime()).toISOString();
}

/**
 * Le nombre de jours dont il faut avancer le jeu. Si la journée n'a pas encore
 * atteint l'heure du dernier évènement, on recule d'un jour : aucune date ne
 * doit tomber dans le futur.
 */
export function computeDayOffset(latestIso: string, now: Date): number {
  const offset = differenceInCalendarDays(now, parseISO(latestIso), inZone);
  return addDays(parseISO(latestIso), offset, inZone).getTime() > now.getTime() ? offset - 1 : offset;
}

export function rebaseLeads(leads: Lead[], days: number): Lead[] {
  if (days === 0) return structuredClone(leads);
  return leads.map((lead) => ({
    ...lead,
    createdAt: shiftIso(lead.createdAt, days),
    lastContactAt: lead.lastContactAt ? shiftIso(lead.lastContactAt, days) : undefined,
    notes: lead.notes.map((note) => ({ ...note, createdAt: shiftIso(note.createdAt, days) })),
  }));
}

/** Le jour que le jeu recalé représente. */
export function asOfDate(days: number): string {
  return shiftIso(SEED_DAY, days);
}

function capitalize(value: string): string {
  return value.charAt(0).toLocaleUpperCase("fr-FR") + value.slice(1);
}

/**
 * Avance la série mensuelle pour que son dernier mois soit le mois qui précède
 * le jour représenté, et rédige les libellés à partir de la date obtenue.
 */
export function rebaseRevenue(series: SeedMonthlyRevenue[], asOf: string): MonthlyRevenue[] {
  const months = differenceInCalendarMonths(parseISO(asOf), parseISO(SEED_DAY), inZone);
  return series.map((entry) => {
    const date = addMonths(parseISO(`${entry.month}-15T12:00:00+02:00`), months, inZone);
    return {
      month: format(date, "yyyy-MM", inZone),
      label: capitalize(format(date, "MMM", { ...inZone, locale: fr })),
      longLabel: format(date, "MMMM yyyy", { ...inZone, locale: fr }),
      year: Number(format(date, "yyyy", inZone)),
      revenue: entry.revenue,
    };
  });
}

/** « mars à octobre 2026 », ou « novembre 2026 à juin 2027 » à cheval sur deux années. */
export function describeRevenueRange(series: MonthlyRevenue[]): string {
  const first = series[0];
  const last = series[series.length - 1];
  if (!first || !last) return "";
  const firstLabel =
    first.year === last.year ? first.longLabel.replace(` ${first.year}`, "") : first.longLabel;
  return capitalize(`${firstLabel} à ${last.longLabel}`);
}

/** « 10 novembre 2026 ». */
export function formatAsOf(asOf: string): string {
  return format(parseISO(asOf), "d MMMM yyyy", { ...inZone, locale: fr });
}
