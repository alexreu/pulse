import { OPEN_STAGES } from "../types";
import type { Lead, LeadStatus } from "../types";
import { calculatePipelineValue } from "./metrics";

const DAY = 86_400_000;

function daysSince(iso: string | undefined, now: Date): number | null {
  if (!iso) return null;
  return Math.floor((now.getTime() - new Date(iso).getTime()) / DAY);
}

export interface PriorityAction {
  id: "stalled-proposals" | "untouched-new" | "aging-qualified";
  label: string;
  /** Ce qui est en jeu, déjà rédigé. */
  detail: string;
  count: number;
  value: number;
  href: string;
}

/**
 * Ce qu'il faut traiter en premier, déduit des dates réelles du portefeuille :
 * aucune donnée nouvelle, seulement une lecture de l'existant.
 */
export function getPriorityActions(leads: Lead[], now: Date = new Date()): PriorityAction[] {
  const actions: PriorityAction[] = [];

  const stalled = leads.filter(
    (lead) => lead.status === "proposal" && (daysSince(lead.lastContactAt, now) ?? 99) >= 5,
  );
  if (stalled.length > 0) {
    actions.push({
      id: "stalled-proposals",
      label: "Relancer les propositions",
      detail: "Sans réponse depuis 5 jours",
      count: stalled.length,
      value: stalled.reduce((total, lead) => total + lead.estimatedValue, 0),
      href: "/leads?status=proposal",
    });
  }

  const untouched = leads.filter(
    (lead) => lead.status === "new" && (daysSince(lead.createdAt, now) ?? 0) >= 3,
  );
  if (untouched.length > 0) {
    actions.push({
      id: "untouched-new",
      label: "Prendre contact",
      detail: "Jamais contactés depuis 3 jours",
      count: untouched.length,
      value: untouched.reduce((total, lead) => total + lead.estimatedValue, 0),
      href: "/leads?status=new",
    });
  }

  const aging = leads.filter(
    (lead) => lead.status === "qualified" && (daysSince(lead.lastContactAt, now) ?? 99) >= 7,
  );
  if (aging.length > 0) {
    actions.push({
      id: "aging-qualified",
      label: "Faire avancer les qualifiés",
      detail: "Sans échange depuis une semaine",
      count: aging.length,
      value: aging.reduce((total, lead) => total + lead.estimatedValue, 0),
      href: "/leads?status=qualified",
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
