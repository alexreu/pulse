import "server-only";

import { SEED_LEADS } from "@/data/leads";
import type { Activity, Lead, LeadNote, LeadStatus } from "../types";
import { sortActivities, createdActivity, noteActivity, seedActivities, statusActivity } from "./activity";

/**
 * Dépôt en mémoire. Il tient lieu de base de données pour cette démonstration :
 * les écritures vivent le temps du processus serveur et repartent du jeu initial
 * au redémarrage. C'est le seul compromis assumé côté données.
 */
interface Store {
  leads: Lead[];
  activities: Activity[];
  /** Interrupteur de démonstration : fait échouer la prochaine écriture. */
  failNextWrite: boolean;
  sequence: number;
}

const GLOBAL_KEY = Symbol.for("pulse.store");

function createStore(): Store {
  return {
    leads: structuredClone(SEED_LEADS),
    activities: seedActivities(SEED_LEADS),
    failNextWrite: false,
    sequence: SEED_LEADS.length,
  };
}

function getStore(): Store {
  const globalScope = globalThis as unknown as Record<symbol, Store | undefined>;
  globalScope[GLOBAL_KEY] ??= createStore();
  return globalScope[GLOBAL_KEY]!;
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

function consumeFailure(): void {
  const store = getStore();
  if (!store.failNextWrite) return;
  store.failNextWrite = false;
  throw new RepositoryError("La démonstration d'erreur serveur a été déclenchée.", 500);
}

export async function listLeads(): Promise<Lead[]> {
  await delay(180);
  return structuredClone(getStore().leads);
}

export async function getLead(id: string): Promise<Lead> {
  await delay(140);
  const lead = getStore().leads.find((entry) => entry.id === id);
  if (!lead) throw new RepositoryError(`Aucun prospect ne porte l'identifiant ${id}.`, 404);
  return structuredClone(lead);
}

export async function listActivities(): Promise<Activity[]> {
  await delay(160);
  return structuredClone(sortActivities(getStore().activities));
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
  consumeFailure();

  const store = getStore();
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
  consumeFailure();

  const store = getStore();
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
  consumeFailure();

  const store = getStore();
  const lead = store.leads.find((entry) => entry.id === id);
  if (!lead) throw new RepositoryError(`Aucun prospect ne porte l'identifiant ${id}.`, 404);

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
  consumeFailure();

  const store = getStore();
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
  consumeFailure();

  const store = getStore();
  const removed = store.leads.filter((lead) => ids.includes(lead.id)).map((lead) => lead.id);
  store.leads = store.leads.filter((lead) => !ids.includes(lead.id));
  store.activities = store.activities.filter((activity) => !removed.includes(activity.leadId));

  return removed;
}

export function setFailNextWrite(value: boolean): boolean {
  getStore().failNextWrite = value;
  return value;
}

export function getFailNextWrite(): boolean {
  return getStore().failNextWrite;
}

/** Remet le dépôt dans son état initial. Utilisé par les tests de bout en bout. */
export function resetStore(): void {
  const globalScope = globalThis as unknown as Record<symbol, Store | undefined>;
  globalScope[GLOBAL_KEY] = createStore();
}
