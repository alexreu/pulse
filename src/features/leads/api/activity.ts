import { SEED_LEADS } from "@/data/leads";
import type { Activity, Lead, LeadStatus } from "../types";
import { STATUS_CONFIG } from "../utils/status";

function subtractHours(iso: string, hours: number): string {
  return new Date(new Date(iso).getTime() - hours * 3_600_000).toISOString();
}

/** L'étape qui précède celle-ci dans le flux, pour raconter un changement. */
const PREVIOUS_STAGE: Partial<Record<LeadStatus, LeadStatus>> = {
  contacted: "new",
  qualified: "contacted",
  proposal: "qualified",
  won: "proposal",
  lost: "contacted",
};

export function createdActivity(lead: Lead): Activity {
  return {
    id: `${lead.id}-AC`,
    leadId: lead.id,
    leadName: `${lead.firstName} ${lead.lastName}`,
    company: lead.company,
    type: "lead_created",
    createdAt: lead.createdAt,
    summary: "Prospect ajouté à la base.",
  };
}

export function noteActivity(lead: Lead, noteId: string, body: string, createdAt: string): Activity {
  return {
    id: `${noteId}-AN`,
    leadId: lead.id,
    leadName: `${lead.firstName} ${lead.lastName}`,
    company: lead.company,
    type: "note_added",
    createdAt,
    summary: body,
  };
}

export function statusActivity(
  lead: Lead,
  from: LeadStatus,
  to: LeadStatus,
  createdAt: string,
): Activity {
  return {
    id: `${lead.id}-AS-${createdAt}`,
    leadId: lead.id,
    leadName: `${lead.firstName} ${lead.lastName}`,
    company: lead.company,
    type: "status_changed",
    createdAt,
    fromStatus: from,
    toStatus: to,
    summary: `Statut passé de « ${STATUS_CONFIG[from].label} » à « ${STATUS_CONFIG[to].label} ».`,
  };
}

/**
 * Les e-mails et rendez-vous sont fictifs et écrits à la main : ils n'existent
 * ni dans une boîte mail ni dans un agenda, ils illustrent la timeline.
 */
const SCRIPTED: Array<{
  leadId: string;
  type: "email_sent" | "meeting_scheduled";
  hoursBefore: number;
  summary: string;
}> = [
  { leadId: "LD-1001", type: "email_sent", hoursBefore: 30, summary: "Proposition commerciale envoyée par e-mail." },
  { leadId: "LD-1001", type: "meeting_scheduled", hoursBefore: 6, summary: "Point de décision programmé avec Emma Laurent." },
  { leadId: "LD-1003", type: "meeting_scheduled", hoursBefore: 20, summary: "Atelier de cadrage planifié avec le DSI." },
  { leadId: "LD-1005", type: "email_sent", hoursBefore: 14, summary: "Récapitulatif des deux lots envoyé." },
  { leadId: "LD-1007", type: "email_sent", hoursBefore: 48, summary: "Audit technique transmis en pièce jointe." },
  { leadId: "LD-1010", type: "meeting_scheduled", hoursBefore: 72, summary: "Réunion d'arbitrage budgétaire fixée." },
  { leadId: "LD-1013", type: "email_sent", hoursBefore: 36, summary: "Accès API demandés au prestataire actuel." },
  { leadId: "LD-1017", type: "meeting_scheduled", hoursBefore: 26, summary: "Présentation des maquettes programmée." },
  { leadId: "LD-1028", type: "email_sent", hoursBefore: 52, summary: "Cahier des charges du configurateur envoyé." },
  { leadId: "LD-1034", type: "meeting_scheduled", hoursBefore: 18, summary: "Démonstration technique calée avec l'exploitation." },
  { leadId: "LD-1038", type: "email_sent", hoursBefore: 40, summary: "Chiffrage définitif adressé à la direction." },
  { leadId: "LD-1041", type: "email_sent", hoursBefore: 96, summary: "Étude de faisabilité envoyée pour relecture." },
];

/**
 * Reconstitue le journal d'activité à partir du jeu de prospects :
 * une création par fiche, une note par note, un changement d'étape déduit du
 * dernier contact, plus les échanges scriptés ci-dessus.
 */
export function seedActivities(leads: Lead[] = SEED_LEADS): Activity[] {
  const byId = new Map(leads.map((lead) => [lead.id, lead]));
  const activities: Activity[] = [];

  for (const lead of leads) {
    activities.push(createdActivity(lead));

    for (const note of lead.notes) {
      activities.push(noteActivity(lead, note.id, note.body, note.createdAt));
    }

    const previous = PREVIOUS_STAGE[lead.status];
    if (previous && lead.lastContactAt) {
      activities.push(statusActivity(lead, previous, lead.status, lead.lastContactAt));
    }
  }

  for (const entry of SCRIPTED) {
    const lead = byId.get(entry.leadId);
    if (!lead) continue;
    const anchor = lead.lastContactAt ?? lead.createdAt;
    activities.push({
      id: `${entry.leadId}-${entry.type}-${entry.hoursBefore}`,
      leadId: lead.id,
      leadName: `${lead.firstName} ${lead.lastName}`,
      company: lead.company,
      type: entry.type,
      createdAt: subtractHours(anchor, entry.hoursBefore),
      summary: entry.summary,
    });
  }

  return sortActivities(activities);
}

/** Toujours du plus récent au plus ancien. */
export function sortActivities(activities: Activity[]): Activity[] {
  return [...activities].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
