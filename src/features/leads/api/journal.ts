import { deflateRawSync, inflateRawSync } from "node:zlib";
import { SEED_LEADS } from "@/data/leads";
import type { Activity, Lead, LeadNote, LeadStatus } from "../types";
import { LEAD_STATUSES } from "../types";
import { createdActivity, noteActivity, seedActivities, sortActivities, statusActivity } from "./activity";
import { computeDayOffset, latestSeedDate, rebaseLeads } from "./demo-clock";

/**
 * Le journal des modifications d'un visiteur.
 *
 * L'état n'est pas gardé en mémoire sur le serveur : sur un hébergement sans
 * serveur, la route qui écrit et la page qui relit ne tournent pas forcément
 * dans le même processus, et une écriture gardée en mémoire disparaîtrait.
 * Le visiteur porte donc ses modifications dans un cookie, sous forme d'un
 * journal compact, et chaque requête rejoue ce journal par-dessus le jeu de
 * départ. N'importe quelle instance obtient le même résultat.
 */
export type JournalOp =
  | {
      k: "c";
      t: number;
      f: string;
      l: string;
      co: string;
      e: string;
      p?: string;
      v: number;
      s: LeadStatus;
      n?: string;
    }
  | { k: "s"; t: number; ids: string[]; s: LeadStatus }
  | { k: "n"; t: number; id: string; b: string }
  | { k: "d"; t: number; ids: string[] };

export interface ReplayedState {
  leads: Lead[];
  activities: Activity[];
}

const AUTHOR = "Alex Martin";
const LATEST_SEED_DATE = latestSeedDate(SEED_LEADS);

function iso(time: number): string {
  return new Date(time).toISOString();
}

/** L'identifiant de la n-ième fiche créée par le visiteur, après celles du jeu. */
export function createdLeadId(index: number): string {
  return `LD-${1000 + SEED_LEADS.length + index + 1}`;
}

/** Rejoue le journal sur le jeu de départ, recalé sur la date du jour. */
export function replay(ops: JournalOp[], now: Date = new Date()): ReplayedState {
  let leads = rebaseLeads(SEED_LEADS, computeDayOffset(LATEST_SEED_DATE, now));
  let activities = seedActivities(leads);
  let created = 0;

  for (const op of ops) {
    if (op.k === "c") {
      const id = createdLeadId(created);
      created += 1;
      const createdAt = iso(op.t);
      const notes: LeadNote[] = op.n
        ? [{ id: `${id}-N1`, body: op.n, createdAt, author: AUTHOR }]
        : [];
      const lead: Lead = {
        id,
        firstName: op.f,
        lastName: op.l,
        company: op.co,
        email: op.e,
        phone: op.p,
        estimatedValue: op.v,
        status: op.s,
        createdAt,
        notes,
      };
      leads = [lead, ...leads];
      activities.push(createdActivity(lead));
      for (const note of notes) activities.push(noteActivity(lead, note.id, note.body, note.createdAt));
      continue;
    }

    if (op.k === "s") {
      const at = iso(op.t);
      for (const lead of leads) {
        if (!op.ids.includes(lead.id) || lead.status === op.s) continue;
        const previous = lead.status;
        lead.status = op.s;
        lead.lastContactAt = at;
        activities.push(statusActivity(lead, previous, op.s, at));
      }
      continue;
    }

    if (op.k === "n") {
      const lead = leads.find((entry) => entry.id === op.id);
      if (!lead) continue;
      const at = iso(op.t);
      const note: LeadNote = {
        id: `${lead.id}-N${lead.notes.length + 1}-${op.t}`,
        body: op.b,
        createdAt: at,
        author: AUTHOR,
      };
      lead.notes = [...lead.notes, note];
      lead.lastContactAt = at;
      activities.push(noteActivity(lead, note.id, note.body, at));
      continue;
    }

    const removed = new Set(op.ids);
    leads = leads.filter((lead) => !removed.has(lead.id));
    activities = activities.filter((activity) => !removed.has(activity.leadId));
  }

  return { leads, activities: sortActivities(activities) };
}

/** Le nombre de fiches que le visiteur a créées : il fixe le prochain identifiant. */
export function countCreated(ops: JournalOp[]): number {
  return ops.filter((op) => op.k === "c").length;
}

/** Retire la dernière suppression du journal : la rejouer sans elle remet tout en place. */
export function withoutLastDelete(ops: JournalOp[]): { ops: JournalOp[]; ids: string[] } | null {
  for (let index = ops.length - 1; index >= 0; index -= 1) {
    const op = ops[index];
    if (op.k === "d") return { ops: [...ops.slice(0, index), ...ops.slice(index + 1)], ids: op.ids };
  }
  return null;
}

/* — Sérialisation ———————————————————————————————————————————————— */

/** Taille d'un morceau de cookie, sous la limite de 4 Ko des navigateurs. */
export const CHUNK_SIZE = 3500;
/** Nombre de morceaux au plus : l'en-tête Cookie doit rester bien sous 16 Ko. */
export const MAX_CHUNKS = 3;

/** Le journal compressé, découpé en morceaux de cookie ; `null` s'il est trop gros. */
export function encodeJournal(ops: JournalOp[]): string[] | null {
  if (ops.length === 0) return [];
  const encoded = deflateRawSync(Buffer.from(JSON.stringify(ops))).toString("base64url");
  const chunks: string[] = [];
  for (let start = 0; start < encoded.length; start += CHUNK_SIZE) {
    chunks.push(encoded.slice(start, start + CHUNK_SIZE));
  }
  return chunks.length > MAX_CHUNKS ? null : chunks;
}

function isStatus(value: unknown): value is LeadStatus {
  return typeof value === "string" && (LEAD_STATUSES as readonly string[]).includes(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((entry) => typeof entry === "string");
}

/** Le cookie vient du navigateur : chaque opération est revérifiée avant d'être rejouée. */
function isOp(value: unknown): value is JournalOp {
  if (typeof value !== "object" || value === null) return false;
  const op = value as Record<string, unknown>;
  if (typeof op.t !== "number") return false;
  switch (op.k) {
    case "c":
      return (
        typeof op.f === "string" &&
        typeof op.l === "string" &&
        typeof op.co === "string" &&
        typeof op.e === "string" &&
        (op.p === undefined || typeof op.p === "string") &&
        typeof op.v === "number" &&
        isStatus(op.s) &&
        (op.n === undefined || typeof op.n === "string")
      );
    case "s":
      return isStringArray(op.ids) && isStatus(op.s);
    case "n":
      return typeof op.id === "string" && typeof op.b === "string";
    case "d":
      return isStringArray(op.ids);
    default:
      return false;
  }
}

/** Relit le journal ; un cookie illisible ou altéré vaut un journal vide. */
export function decodeJournal(chunks: Array<string | undefined>): JournalOp[] {
  const encoded = chunks.filter((chunk): chunk is string => Boolean(chunk)).join("");
  if (!encoded) return [];
  try {
    const parsed: unknown = JSON.parse(inflateRawSync(Buffer.from(encoded, "base64url")).toString());
    return Array.isArray(parsed) && parsed.every(isOp) ? parsed : [];
  } catch {
    return [];
  }
}
