import {
  EMPTY_FILTERS,
  LEAD_STATUSES,
  type LeadFilters,
  type LeadSort,
  type LeadStatus,
  type SortField,
  type ValueBracket,
} from "../types";
import { isPriorityId } from "./attention";

/**
 * L'état du tableau des prospects tel qu'il voyage dans l'URL : recherche,
 * étapes (les onglets ne sont qu'un raccourci vers elles), tranche, période,
 * règle de relance, tri et taille de page. Ce qui est à sa
 * valeur par défaut n'est pas écrit — `/leads` reste `/leads`.
 */
export interface LeadsQueryState {
  filters: LeadFilters;
  sort: LeadSort;
  pageSize: number;
}

export const DEFAULT_SORT: LeadSort = { field: "createdAt", direction: "desc" };
export const PAGE_SIZES = [10, 20, 50] as const;
const BRACKETS: readonly ValueBracket[] = ["all", "under-1000", "1000-5000", "over-5000"];
const SORT_FIELDS: readonly SortField[] = ["name", "estimatedValue", "createdAt"];
const DAY = /^\d{4}-\d{2}-\d{2}$/;

function isStatus(value: string): value is LeadStatus {
  return (LEAD_STATUSES as readonly string[]).includes(value);
}

/**
 * Lit l'URL sans jamais lui faire confiance : une valeur inconnue retombe sur
 * le défaut au lieu de casser le tableau.
 */
export function parseLeadsQuery(params: URLSearchParams): LeadsQueryState {
  const statuses = (params.get("status") ?? "").split(",").filter(isStatus);
  const bracket = params.get("montant") as ValueBracket | null;
  const from = params.get("du");
  const to = params.get("au");
  const priority = params.get("priorite");
  const [field, direction] = (params.get("tri") ?? "").split("-");
  const size = Number(params.get("lignes"));

  return {
    filters: {
      ...EMPTY_FILTERS,
      search: (params.get("q") ?? "").slice(0, 100),
      statuses: [...new Set(statuses)],
      valueBracket: bracket && BRACKETS.includes(bracket) ? bracket : "all",
      createdFrom: from && DAY.test(from) ? from : undefined,
      createdTo: to && DAY.test(to) ? to : undefined,
      priority: priority && isPriorityId(priority) ? priority : undefined,
    },
    sort:
      SORT_FIELDS.includes(field as SortField) && (direction === "asc" || direction === "desc")
        ? { field: field as SortField, direction }
        : DEFAULT_SORT,
    pageSize: (PAGE_SIZES as readonly number[]).includes(size) ? size : PAGE_SIZES[0],
  };
}

/** Écrit l'état en chaîne de requête, sans le `?`, et sans les valeurs par défaut. */
export function serializeLeadsQuery(state: LeadsQueryState): string {
  const params = new URLSearchParams();
  const { filters, sort, pageSize } = state;
  const search = filters.search.trim();

  if (search) params.set("q", search);
  if (filters.statuses.length > 0) params.set("status", filters.statuses.join(","));
  if (filters.valueBracket !== "all") params.set("montant", filters.valueBracket);
  if (filters.createdFrom) params.set("du", filters.createdFrom.slice(0, 10));
  if (filters.createdTo) params.set("au", filters.createdTo.slice(0, 10));
  if (filters.priority) params.set("priorite", filters.priority);
  if (sort.field !== DEFAULT_SORT.field || sort.direction !== DEFAULT_SORT.direction) {
    params.set("tri", `${sort.field}-${sort.direction}`);
  }
  if (pageSize !== PAGE_SIZES[0]) params.set("lignes", String(pageSize));

  return params.toString();
}
