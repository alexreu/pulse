import { OPEN_STAGES } from "../types";
import type { Lead, LeadStatus, PriorityId } from "../types";
import { calculatePipelineValue } from "./metrics";

export type { PriorityId };

const DAY = 86_400_000;

function daysSince(iso: string | undefined, now: Date): number | null {
  if (!iso) return null;
  return Math.floor((now.getTime() - new Date(iso).getTime()) / DAY);
}

export interface PriorityAction {
  id: PriorityId;
  label: string;
  /** Ce qui est en jeu, déjà rédigé. */
  detail: string;
  count: number;
  value: number;
  href: string;
}

/**
 * Les trois règles de relance. Le tableau de bord les compte ; le tableau des
 * prospects les applique comme filtre, pour que le lien « 3 fiches » ouvre
 * exactement ces trois fiches.
 */
export const PRIORITY_RULES: Record<
  PriorityId,
  { label: string; detail: string; matches: (lead: Lead, now: Date) => boolean }
> = {
  "stalled-proposals": {
    label: "Relancer les propositions",
    detail: "Sans réponse depuis 5 jours",
    matches: (lead, now) =>
      lead.status === "proposal" && (daysSince(lead.lastContactAt, now) ?? 99) >= 5,
  },
  "untouched-new": {
    label: "Prendre contact",
    detail: "Jamais contactés depuis 3 jours",
    matches: (lead, now) => lead.status === "new" && (daysSince(lead.createdAt, now) ?? 0) >= 3,
  },
  "aging-qualified": {
    label: "Faire avancer les qualifiés",
    detail: "Sans échange depuis une semaine",
    matches: (lead, now) =>
      lead.status === "qualified" && (daysSince(lead.lastContactAt, now) ?? 99) >= 7,
  },
};

export function isPriorityId(value: string): value is PriorityId {
  return Object.hasOwn(PRIORITY_RULES, value);
}

/**
 * Ce qu'il faut traiter en premier, déduit des dates réelles du portefeuille :
 * aucune donnée nouvelle, seulement une lecture de l'existant.
 */
export function getPriorityActions(leads: Lead[], now: Date = new Date()): PriorityAction[] {
  const actions: PriorityAction[] = [];

  for (const id of Object.keys(PRIORITY_RULES) as PriorityId[]) {
    const rule = PRIORITY_RULES[id];
    const matching = leads.filter((lead) => rule.matches(lead, now));
    if (matching.length === 0) continue;
    actions.push({
      id,
      label: rule.label,
      detail: rule.detail,
      count: matching.length,
      value: matching.reduce((total, lead) => total + lead.estimatedValue, 0),
      href: `/leads?priorite=${id}`,
    });
  }

  return actions.sort((a, b) => b.value - a.value);
}

/**
 * La phrase qui interprète le pipeline. Elle nomme l'étape qui pèse le plus
 * et ce que cela veut dire, plutôt que de répéter un chiffre déjà affiché.
 */
export function buildPipelineInsight(leads: Lead[]): { headline: string; reading: string } | null {
  const pipeline = calculatePipelineValue(leads);
  if (pipeline === 0) return null;

  const byStage = new Map<LeadStatus, number>();
  for (const lead of leads) {
    if (!(OPEN_STAGES as readonly LeadStatus[]).includes(lead.status)) continue;
    byStage.set(lead.status, (byStage.get(lead.status) ?? 0) + lead.estimatedValue);
  }

  const [stage, value] = [...byStage.entries()].sort((a, b) => b[1] - a[1])[0] ?? [];
  if (!stage || value === undefined) return null;

  const share = Math.round((value / pipeline) * 100);

  const READINGS: Record<string, string> = {
    new: "Beaucoup d'entrées, peu de conversations : le goulot est à la prise de contact, pas à la vente.",
    contacted:
      "Le portefeuille a été contacté mais pas qualifié : c'est un problème de tri, pas de volume.",
    qualified:
      "Le besoin est confirmé sur l'essentiel du pipeline ; ce qui manque, ce sont des propositions écrites.",
    proposal:
      "L'essentiel du pipeline attend une signature : c'est une question de relance, pas de prospection.",
  };

  const LABELS: Record<string, string> = {
    new: "Les nouveaux prospects",
    contacted: "Les prospects contactés",
    qualified: "Les prospects qualifiés",
    proposal: "Les propositions en attente",
  };

  return {
    headline: `${LABELS[stage]} concentrent ${share} % du pipeline.`,
    reading: READINGS[stage],
  };
}
