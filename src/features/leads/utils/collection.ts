import { formatFullName } from "@/lib/format";
import type { Lead, LeadFilters, LeadSort, ValueBracket } from "../types";

/** Les bornes de chaque tranche de montant, en euros. */
export const VALUE_BRACKETS: Record<
  Exclude<ValueBracket, "all">,
  { label: string; min: number; max: number }
> = {
  "under-1000": { label: "Moins de 1 000 €", min: 0, max: 1000 },
  "1000-5000": { label: "1 000 — 5 000 €", min: 1000, max: 5000 },
  "over-5000": { label: "Plus de 5 000 €", min: 5000, max: Number.POSITIVE_INFINITY },
};

export function matchesValueBracket(value: number, bracket: ValueBracket): boolean {
  if (bracket === "all") return true;
  const { min, max } = VALUE_BRACKETS[bracket];
  return value >= min && value < max;
}

/** La recherche porte sur le nom, l'entreprise et l'e-mail, sans accent ni casse. */
function normalize(value: string): string {
  return value
    .toLocaleLowerCase("fr-FR")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

export function matchesSearch(lead: Lead, search: string): boolean {
  const term = normalize(search.trim());
  if (term.length === 0) return true;
  return [formatFullName(lead.firstName, lead.lastName), lead.company, lead.email]
    .map(normalize)
    .some((field) => field.includes(term));
}

/**
 * Applique les filtres du tableau. Les critères se cumulent : un prospect doit
 * satisfaire la recherche, le statut, le montant et la période à la fois.
 */
export function filterLeads(leads: Lead[], filters: LeadFilters): Lead[] {
  return leads.filter((lead) => {
    if (!matchesSearch(lead, filters.search)) return false;
    if (filters.statuses.length > 0 && !filters.statuses.includes(lead.status)) return false;
    if (!matchesValueBracket(lead.estimatedValue, filters.valueBracket)) return false;
    if (filters.createdFrom && lead.createdAt < filters.createdFrom) return false;
    if (filters.createdTo && lead.createdAt > `${filters.createdTo}T23:59:59.999Z`) return false;
    return true;
  });
}

/** Trie sans muter la liste reçue. Le nom se compare selon les règles françaises. */
export function sortLeads(leads: Lead[], sort: LeadSort): Lead[] {
  const collator = new Intl.Collator("fr-FR", { sensitivity: "base" });
  const factor = sort.direction === "asc" ? 1 : -1;

  return [...leads].sort((a, b) => {
    switch (sort.field) {
      case "name":
        return (
          factor *
          collator.compare(
            formatFullName(a.firstName, a.lastName),
            formatFullName(b.firstName, b.lastName),
          )
        );
      case "estimatedValue":
        return factor * (a.estimatedValue - b.estimatedValue);
      case "createdAt":
        return factor * a.createdAt.localeCompare(b.createdAt);
    }
  });
}

/** Les prospects les plus récents d'abord. */
export function getRecentLeads(leads: Lead[], limit: number): Lead[] {
  return sortLeads(leads, { field: "createdAt", direction: "desc" }).slice(0, limit);
}
