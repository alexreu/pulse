import { tz } from "@date-fns/tz";
import { format, isSameDay, parseISO, subDays } from "date-fns";
import { fr } from "date-fns/locale";

/**
 * Toutes les dates sont rendues dans un fuseau fixe. Sans lui, le serveur
 * formaterait en UTC et le navigateur dans le fuseau de l'utilisateur : les
 * deux rendus divergeraient et React refuserait l'hydratation.
 */
export const DISPLAY_TIMEZONE = "Europe/Paris";

const zone = { in: tz(DISPLAY_TIMEZONE), locale: fr };

const currency = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

const compactCurrency = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  notation: "compact",
  maximumFractionDigits: 1,
});

const percent = new Intl.NumberFormat("fr-FR", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const integer = new Intl.NumberFormat("fr-FR");

/** 4500 → « 4 500 € ». Le CRM ne montre jamais de centimes. */
export function formatCurrency(value: number): string {
  return currency.format(value);
}

/** 42500 → « 42,5 k€ ». Réservé aux axes de graphique. */
export function formatCompactCurrency(value: number): string {
  return compactCurrency.format(value);
}

/** 24.8 → « 24,8 % ». */
export function formatPercent(value: number): string {
  return `${percent.format(value)} %`;
}

/** 12.5 → « +12,5 % », -2.4 → « −2,4 % ». Le signe fait partie du texte. */
export function formatSignedPercent(value: number): string {
  const sign = value > 0 ? "+" : value < 0 ? "−" : "";
  return `${sign}${percent.format(Math.abs(value))} %`;
}

export function formatNumber(value: number): string {
  return integer.format(value);
}

/** « 03 sept. 2026 » — la date longue des fiches. */
export function formatDate(iso: string): string {
  return format(parseISO(iso), "dd MMM yyyy", zone);
}

/** « 03 sept. » — la date courte des lignes de tableau. */
export function formatShortDate(iso: string): string {
  return format(parseISO(iso), "dd MMM", zone);
}

/** « 03 sept. 2026, 14:30 ». */
export function formatDateTime(iso: string): string {
  return format(parseISO(iso), "dd MMM yyyy, HH:mm", zone);
}

/**
 * « Aujourd'hui », « Hier », sinon la date courte. La comparaison se fait dans
 * le fuseau d'affichage, avec la référence passée en argument pour rester
 * testable.
 *
 * `relative` dit si la valeur rendue est un mot ou une date : seules les dates
 * absolues sont des mesures et prennent la fonte à chasse fixe.
 */
export function formatRelativeDayParts(
  iso: string,
  now: Date = new Date(),
): { label: string; relative: boolean } {
  const date = parseISO(iso);
  const options = { in: tz(DISPLAY_TIMEZONE) };
  if (isSameDay(date, now, options)) return { label: "Aujourd'hui", relative: true };
  if (isSameDay(date, subDays(now, 1, options), options)) return { label: "Hier", relative: true };
  return { label: formatShortDate(iso), relative: false };
}

export function formatRelativeDay(iso: string, now: Date = new Date()): string {
  return formatRelativeDayParts(iso, now).label;
}

export function formatInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function formatFullName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`;
}
