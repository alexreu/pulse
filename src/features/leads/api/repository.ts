import "server-only";

import { cookies, headers } from "next/headers";
import { MONTHLY_REVENUE, type MonthlyRevenue } from "@/data/revenue";
import { SEED_LEADS } from "@/data/leads";
import type { Activity, Lead, LeadStatus } from "../types";
import { asOfDate, computeDayOffset, latestSeedDate, rebaseRevenue } from "./demo-clock";
import {
  MAX_CHUNKS,
  countCreated,
  createdLeadId,
  decodeJournal,
  encodeJournal,
  replay,
  withoutLastDelete,
  type JournalOp,
} from "./journal";

/**
 * Le dépôt de la démonstration. Il tient lieu de base de données.
 *
 * Rien n'est gardé en mémoire sur le serveur : sur Vercel, la route API qui
 * écrit et la page qui relit tournent dans des fonctions distinctes, qui ne
 * partagent pas leur mémoire. Chaque visiteur porte donc le journal de ses
 * modifications dans un cookie (voir `journal.ts`), et chaque lecture le
 * rejoue par-dessus le jeu de départ, recalé sur la date du jour.
 *
 * Conséquences : deux visiteurs ne se voient jamais, et l'état survit aux
 * redémarrages comme au passage d'une instance à l'autre.
 */

const JOURNAL_COOKIE = "pulse_journal";
const FAILURE_COOKIE = "pulse_fail";

/** Garde-fous : la démonstration est publique. */
const LIMITS = {
  leadsTotal: 300,
  notesPerLead: 100,
} as const;

/** `Secure` dès que la requête arrive en HTTPS ; le serveur local de test reste en HTTP. */
async function cookieOptions() {
  const secure = (await headers()).get("x-forwarded-proto") === "https";
  return { httpOnly: true, sameSite: "lax" as const, path: "/", maxAge: 60 * 60 * 24 * 7, secure };
}

const LATEST_SEED_DATE = latestSeedDate(SEED_LEADS);

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

function chunkName(index: number): string {
  return `${JOURNAL_COOKIE}.${index}`;
}

async function readJournal(): Promise<JournalOp[]> {
  const jar = await cookies();
  return decodeJournal(Array.from({ length: MAX_CHUNKS }, (_, index) => jar.get(chunkName(index))?.value));
}

async function readState() {
  const ops = await readJournal();
  return { ops, ...replay(ops) };
}

/** Écrit le journal. Ne s'appelle que depuis une route API, seul endroit où un cookie peut être posé. */
async function writeJournal(ops: JournalOp[]): Promise<void> {
  const chunks = encodeJournal(ops);
  if (!chunks) {
    throw new RepositoryError(
      "La démonstration a atteint le nombre de modifications qu'elle peut garder. Réinitialisez-la depuis les réglages.",
      413,
    );
  }
  const jar = await cookies();
  const options = await cookieOptions();
  for (let index = 0; index < MAX_CHUNKS; index += 1) {
    const chunk = chunks[index];
    if (chunk) jar.set(chunkName(index), chunk, options);
    else if (jar.has(chunkName(index))) jar.delete(chunkName(index));
  }
}

/** L'interrupteur de démonstration : la prochaine écriture échoue, une seule fois. */
async function consumeFailure(): Promise<void> {
  const jar = await cookies();
  if (jar.get(FAILURE_COOKIE)?.value !== "1") return;
  jar.delete(FAILURE_COOKIE);
  throw new RepositoryError("La démonstration d'erreur serveur a été déclenchée.", 500);
}

function notFound(id: string): RepositoryError {
  return new RepositoryError(`Aucun prospect ne porte l'identifiant ${id}.`, 404);
}

/* — Lectures ——————————————————————————————————————————————————— */

export async function listLeads(): Promise<Lead[]> {
  await delay(180);
  return (await readState()).leads;
}

export async function getLead(id: string): Promise<Lead> {
  await delay(140);
  const lead = (await readState()).leads.find((entry) => entry.id === id);
  if (!lead) throw notFound(id);
  return lead;
}

export async function listActivities(): Promise<Activity[]> {
  await delay(160);
  return (await readState()).activities;
}

export async function listActivitiesForLead(leadId: string): Promise<Activity[]> {
  const activities = await listActivities();
  return activities.filter((activity) => activity.leadId === leadId);
}

/** Le jour que représente le jeu et la série mensuelle qui va avec. */
export async function getDemoCalendar(): Promise<{ asOf: string; revenue: MonthlyRevenue[] }> {
  const asOf = asOfDate(computeDayOffset(LATEST_SEED_DATE, new Date()));
  return { asOf, revenue: rebaseRevenue(MONTHLY_REVENUE, asOf) };
}

export async function getFailNextWrite(): Promise<boolean> {
  return (await cookies()).get(FAILURE_COOKIE)?.value === "1";
}

/* — Écritures (routes API uniquement) ———————————————————————————— */

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
  await consumeFailure();
  const { ops, leads } = await readState();
  if (leads.length >= LIMITS.leadsTotal) {
    throw new RepositoryError(
      `La démonstration est limitée à ${LIMITS.leadsTotal} fiches. Réinitialisez-la depuis les réglages.`,
      409,
    );
  }

  const op: JournalOp = {
    k: "c",
    t: Date.now(),
    f: input.firstName.trim(),
    l: input.lastName.trim(),
    co: input.company.trim(),
    e: input.email.trim().toLowerCase(),
    v: input.estimatedValue,
    s: input.status,
  };
  if (input.phone?.trim()) op.p = input.phone.trim();
  if (input.notes?.trim()) op.n = input.notes.trim();

  const next = [...ops, op];
  await writeJournal(next);

  const id = createdLeadId(countCreated(ops));
  const lead = replay(next).leads.find((entry) => entry.id === id);
  if (!lead) throw new RepositoryError("Le prospect n'a pas pu être enregistré.", 500);
  return lead;
}

export async function updateLeadStatus(id: string, status: LeadStatus): Promise<Lead> {
  await delay(320);
  await consumeFailure();
  const { ops, leads } = await readState();
  const lead = leads.find((entry) => entry.id === id);
  if (!lead) throw notFound(id);
  if (lead.status === status) return lead;

  const next: JournalOp[] = [...ops, { k: "s", t: Date.now(), ids: [id], s: status }];
  await writeJournal(next);
  return replay(next).leads.find((entry) => entry.id === id)!;
}

export async function addNote(id: string, body: string): Promise<Lead> {
  await delay(280);
  await consumeFailure();
  const { ops, leads } = await readState();
  const lead = leads.find((entry) => entry.id === id);
  if (!lead) throw notFound(id);
  if (lead.notes.length >= LIMITS.notesPerLead) {
    throw new RepositoryError(`Une fiche de démonstration garde au plus ${LIMITS.notesPerLead} notes.`, 409);
  }

  const next: JournalOp[] = [...ops, { k: "n", t: Date.now(), id, b: body.trim() }];
  await writeJournal(next);
  return replay(next).leads.find((entry) => entry.id === id)!;
}

export async function bulkUpdateStatus(ids: string[], status: LeadStatus): Promise<Lead[]> {
  await delay(380);
  await consumeFailure();
  const { ops, leads } = await readState();
  const touched = leads
    .filter((lead) => ids.includes(lead.id) && lead.status !== status)
    .map((lead) => lead.id);
  if (touched.length === 0) return [];

  const next: JournalOp[] = [...ops, { k: "s", t: Date.now(), ids: touched, s: status }];
  await writeJournal(next);
  return replay(next).leads.filter((lead) => touched.includes(lead.id));
}

export async function bulkDelete(ids: string[]): Promise<string[]> {
  await delay(380);
  await consumeFailure();
  const { ops, leads } = await readState();
  const removed = leads.filter((lead) => ids.includes(lead.id)).map((lead) => lead.id);
  if (removed.length === 0) return [];

  await writeJournal([...ops, { k: "d", t: Date.now(), ids: removed }]);
  return removed;
}

/**
 * Annule la dernière suppression groupée. Le journal la retire, et le rejouer
 * sans elle remet les fiches à leur place, avec leur historique.
 */
export async function restoreLastDeleted(): Promise<{ leads: Lead[]; restored: number }> {
  await delay(240);
  const ops = await readJournal();
  const undone = withoutLastDelete(ops);
  if (!undone) throw new RepositoryError("Il n'y a aucune suppression à annuler.", 409);

  await writeJournal(undone.ops);
  return { leads: replay(undone.ops).leads, restored: undone.ids.length };
}

export async function setFailNextWrite(value: boolean): Promise<boolean> {
  const jar = await cookies();
  if (value) jar.set(FAILURE_COOKIE, "1", await cookieOptions());
  else jar.delete(FAILURE_COOKIE);
  return value;
}

/** Remet le jeu du visiteur dans son état de départ. */
export async function resetStore(): Promise<void> {
  await writeJournal([]);
  (await cookies()).delete(FAILURE_COOKIE);
}
