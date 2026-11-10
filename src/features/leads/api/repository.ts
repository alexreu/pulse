import "server-only";

import { cookies } from "next/headers";
import { SEED_LEADS } from "@/data/leads";
import { MONTHLY_REVENUE, type MonthlyRevenue } from "@/data/revenue";
import type { Activity, Lead, LeadNote, LeadStatus } from "../types";
import { sortActivities, createdActivity, noteActivity, seedActivities, statusActivity } from "./activity";
import { asOfDate, computeDayOffset, latestSeedDate, rebaseLeads, rebaseRevenue } from "./demo-clock";
import { SESSION_COOKIE, createSessionRegistry, isValidSessionId } from "./session-registry";

/**
 * Dépôt en mémoire. Il tient lieu de base de données pour cette démonstration.
 *
 * Chaque visiteur a sa propre copie du jeu de données, identifiée par un
 * cookie posé dans `src/proxy.ts` : ce qu'un visiteur supprime ou modifie ne
 * touche personne d'autre. Les copies vivent le temps du processus serveur,
 * expirent après quelques heures d'inactivité et repartent du jeu initial,
 * recalé sur la date du jour.
 */
interface Store {
  leads: Lead[];
  activities: Activity[];
  /** Le jour que représente le jeu recalé. */
  asOf: string;
  revenue: MonthlyRevenue[];
  /** Interrupteur de démonstration : fait échouer la prochaine écriture. */
  failNextWrite: boolean;
  sequence: number;
  /** La dernière suppression groupée, gardée pour pouvoir l'annuler. */
  lastDeleted: { leads: Array<{ lead: Lead; index: number }>; activities: Activity[] } | null;
}

/** Garde-fous : la démonstration est publique, sa mémoire doit rester bornée. */
const LIMITS = {
  sessions: 500,
  idleTimeoutMs: 6 * 60 * 60 * 1000,
  leadsPerSession: 300,
  notesPerLead: 100,
} as const;

const LATEST_SEED_DATE = latestSeedDate(SEED_LEADS);

function createStore(now: Date = new Date()): Store {
  const days = computeDayOffset(LATEST_SEED_DATE, now);
  const leads = rebaseLeads(SEED_LEADS, days);
  const asOf = asOfDate(days);
  return {
    leads,
    activities: seedActivities(leads),
    asOf,
    revenue: rebaseRevenue(MONTHLY_REVENUE, asOf),
    failNextWrite: false,
    sequence: SEED_LEADS.length,
    lastDeleted: null,
  };
}

const GLOBAL_KEY = Symbol.for("pulse.sessions");

type Registry = ReturnType<typeof createSessionRegistry<Store>>;

function getRegistry(): Registry {
  const globalScope = globalThis as unknown as Record<symbol, Registry | undefined>;
  globalScope[GLOBAL_KEY] ??= createSessionRegistry(() => createStore(), {
    maxSessions: LIMITS.sessions,
    idleTimeoutMs: LIMITS.idleTimeoutMs,
  });
  return globalScope[GLOBAL_KEY]!;
}

async function getSessionId(): Promise<string | null> {
  const value = (await cookies()).get(SESSION_COOKIE)?.value;
  return isValidSessionId(value) ? value : null;
}

/**
 * Le dépôt du visiteur courant. Une requête sans cookie valide (un appel
 * direct à l'API, par exemple) reçoit une copie jetable : elle lit le jeu
 * initial et ses écritures ne survivent pas à la requête.
 */
async function getStore(): Promise<Store> {
  const sessionId = await getSessionId();
  return sessionId ? getRegistry().get(sessionId) : createStore();
}

export class RepositoryError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "RepositoryError";
  }
}

/** Latence simulée : juste assez pour que les squelettes de chargement existent. */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function consumeFailure(store: Store): void {
  if (!store.failNextWrite) return;
  store.failNextWrite = false;
  throw new RepositoryError("La démonstration d'erreur serveur a été déclenchée.", 500);
}

export async function listLeads(): Promise<Lead[]> {
  await delay(180);
  return structuredClone((await getStore()).leads);
}

export async function getLead(id: string): Promise<Lead> {
  await delay(140);
  const lead = (await getStore()).leads.find((entry) => entry.id === id);
  if (!lead) throw new RepositoryError(`Aucun prospect ne porte l'identifiant ${id}.`, 404);
  return structuredClone(lead);
}

export async function listActivities(): Promise<Activity[]> {
  await delay(160);
  return structuredClone(sortActivities((await getStore()).activities));
}

export async function listActivitiesForLead(leadId: string): Promise<Activity[]> {
  const activities = await listActivities();
  return activities.filter((activity) => activity.leadId === leadId);
}

export interface CreateLeadInput {
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  phone?: string;
  estimatedValue: number;
  status: LeadStatus;
  notes?: string;
}

export async function createLead(input: CreateLeadInput): Promise<Lead> {
  await delay(420);
  const store = await getStore();
  consumeFailure(store);
  if (store.leads.length >= LIMITS.leadsPerSession) {
    throw new RepositoryError(
      `La démonstration est limitée à ${LIMITS.leadsPerSession} fiches. Réinitialisez-la depuis les réglages.`,
      409,
    );
  }
  store.sequence += 1;
  const id = `LD-${1000 + store.sequence}`;
  const now = new Date().toISOString();

  const notes: LeadNote[] = input.notes?.trim()
    ? [{ id: `${id}-N1`, body: input.notes.trim(), createdAt: now, author: "Alex Martin" }]
    : [];

  const lead: Lead = {
    id,
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    company: input.company.trim(),
    email: input.email.trim().toLowerCase(),
    phone: input.phone?.trim() || undefined,
    estimatedValue: input.estimatedValue,
    status: input.status,
    createdAt: now,
    notes,
  };

  store.leads = [lead, ...store.leads];
  store.activities.push(createdActivity(lead));
  for (const note of notes) {
    store.activities.push(noteActivity(lead, note.id, note.body, note.createdAt));
  }

  return structuredClone(lead);
}

export async function updateLeadStatus(id: string, status: LeadStatus): Promise<Lead> {
  await delay(320);
  const store = await getStore();
  consumeFailure(store);
  const lead = store.leads.find((entry) => entry.id === id);
  if (!lead) throw new RepositoryError(`Aucun prospect ne porte l'identifiant ${id}.`, 404);

  const previous = lead.status;
  if (previous === status) return structuredClone(lead);

  const now = new Date().toISOString();
  lead.status = status;
  lead.lastContactAt = now;
  store.activities.push(statusActivity(lead, previous, status, now));

  return structuredClone(lead);
}

export async function addNote(id: string, body: string): Promise<Lead> {
  await delay(280);
  const store = await getStore();
  consumeFailure(store);
  const lead = store.leads.find((entry) => entry.id === id);
  if (!lead) throw new RepositoryError(`Aucun prospect ne porte l'identifiant ${id}.`, 404);
  if (lead.notes.length >= LIMITS.notesPerLead) {
    throw new RepositoryError(`Une fiche de démonstration garde au plus ${LIMITS.notesPerLead} notes.`, 409);
  }

  const now = new Date().toISOString();
  const note: LeadNote = {
    id: `${id}-N${lead.notes.length + 1}-${Date.now()}`,
    body: body.trim(),
    createdAt: now,
    author: "Alex Martin",
  };

  lead.notes = [...lead.notes, note];
  lead.lastContactAt = now;
  store.activities.push(noteActivity(lead, note.id, note.body, now));

  return structuredClone(lead);
}

export async function bulkUpdateStatus(ids: string[], status: LeadStatus): Promise<Lead[]> {
  await delay(380);
  const store = await getStore();
  consumeFailure(store);
  const now = new Date().toISOString();
  const touched: Lead[] = [];

  for (const lead of store.leads) {
    if (!ids.includes(lead.id) || lead.status === status) continue;
    const previous = lead.status;
    lead.status = status;
    lead.lastContactAt = now;
    store.activities.push(statusActivity(lead, previous, status, now));
    touched.push(lead);
  }

  return structuredClone(touched);
}

export async function bulkDelete(ids: string[]): Promise<string[]> {
  await delay(380);
  const store = await getStore();
  consumeFailure(store);

  const wanted = new Set(ids);
  const removedLeads = store.leads
    .map((lead, index) => ({ lead, index }))
    .filter(({ lead }) => wanted.has(lead.id));
  const removed = new Set(removedLeads.map(({ lead }) => lead.id));

  // On garde ce qui part, à sa place d'origine, pour que « Annuler » remette
  // le tableau exactement dans l'état où il était.
  store.lastDeleted = {
    leads: removedLeads,
    activities: store.activities.filter((activity) => removed.has(activity.leadId)),
  };
  store.leads = store.leads.filter((lead) => !removed.has(lead.id));
  store.activities = store.activities.filter((activity) => !removed.has(activity.leadId));

  return [...removed];
}

/** Annule la dernière suppression groupée et rend la liste complète. */
export async function restoreLastDeleted(): Promise<{ leads: Lead[]; restored: number }> {
  await delay(240);
  const store = await getStore();
  const snapshot = store.lastDeleted;
  if (!snapshot) throw new RepositoryError("Il n'y a aucune suppression à annuler.", 409);

  const leads = [...store.leads];
  let restored = 0;
  for (const { lead, index } of snapshot.leads) {
    if (leads.some((entry) => entry.id === lead.id)) continue;
    leads.splice(Math.min(index, leads.length), 0, lead);
    restored += 1;
  }
  store.leads = leads;
  store.activities = [...store.activities, ...snapshot.activities];
  store.lastDeleted = null;

  return { leads: structuredClone(store.leads), restored };
}

export async function setFailNextWrite(value: boolean): Promise<boolean> {
  (await getStore()).failNextWrite = value;
  return value;
}

export async function getFailNextWrite(): Promise<boolean> {
  return (await getStore()).failNextWrite;
}

/** Le jour que représente le jeu du visiteur et la série mensuelle qui va avec. */
export async function getDemoCalendar(): Promise<{ asOf: string; revenue: MonthlyRevenue[] }> {
  const store = await getStore();
  return { asOf: store.asOf, revenue: structuredClone(store.revenue) };
}

/** Remet le jeu du visiteur courant dans son état initial. */
export async function resetStore(): Promise<void> {
  const sessionId = await getSessionId();
  if (sessionId) getRegistry().reset(sessionId);
}
