import { OPEN_STAGES, PIPELINE_STAGES } from "../types";
import type { Lead, LeadStatus, PipelineStage } from "../types";

/**
 * Valeur du pipeline : le montant estimé de toutes les affaires encore
 * ouvertes. Une affaire gagnée est du chiffre d'affaires, plus du pipeline ;
 * une affaire perdue ne vaut rien.
 */
export function calculatePipelineValue(leads: Lead[]): number {
  return leads
    .filter((lead) => (OPEN_STAGES as readonly LeadStatus[]).includes(lead.status))
    .reduce((total, lead) => total + lead.estimatedValue, 0);
}

/** Chiffre d'affaires : la somme des affaires gagnées. */
export function calculateRevenue(leads: Lead[]): number {
  return leads
    .filter((lead) => lead.status === "won")
    .reduce((total, lead) => total + lead.estimatedValue, 0);
}

/**
 * Taux de conversion, en pourcentage : la part des prospects qui ont signé.
 * Une base vide convertit à 0, jamais NaN.
 */
export function calculateConversionRate(leads: Lead[]): number {
  if (leads.length === 0) return 0;
  const won = leads.filter((lead) => lead.status === "won").length;
  return (won / leads.length) * 100;
}

/** Les prospects d'un statut donné. */
export function getLeadsByStatus(leads: Lead[], status: LeadStatus): Lead[] {
  return leads.filter((lead) => lead.status === status);
}

export interface StageCount {
  stage: PipelineStage;
  count: number;
  value: number;
}

/** Le pipeline étape par étape, dans l'ordre du flux, `lost` exclu. */
export function countLeadsByStage(leads: Lead[]): StageCount[] {
  return PIPELINE_STAGES.map((stage) => {
    const stageLeads = getLeadsByStatus(leads, stage);
    return {
      stage,
      count: stageLeads.length,
      value: stageLeads.reduce((total, lead) => total + lead.estimatedValue, 0),
    };
  });
}

/** Les clients : exactement les prospects gagnés. */
export function getClients(leads: Lead[]): Lead[] {
  return getLeadsByStatus(leads, "won");
}

/**
 * Évolution en pourcentage d'une période à l'autre.
 * Une période précédente à zéro n'a pas d'évolution mesurable : on rend 0.
 */
export function calculateTrend(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}
