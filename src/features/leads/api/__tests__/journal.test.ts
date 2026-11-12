// @vitest-environment node
import { describe, expect, it } from "vitest";
import { SEED_LEADS } from "@/data/leads";
import {
  CHUNK_SIZE,
  MAX_CHUNKS,
  createdLeadId,
  decodeJournal,
  encodeJournal,
  replay,
  withoutLastDelete,
  type JournalOp,
} from "../journal";

const NOW = new Date("2026-11-10T15:00:00.000Z");
const T = NOW.getTime();

const create = (lastName: string, t = T): JournalOp => ({
  k: "c",
  t,
  f: "Lucie",
  l: lastName,
  co: "Atelier",
  e: "lucie@atelier.fr",
  v: 3200,
  s: "new",
});

describe("replay", () => {
  it("rend le jeu de départ quand le journal est vide", () => {
    const { leads, activities } = replay([], NOW);
    expect(leads).toHaveLength(SEED_LEADS.length);
    expect(activities.length).toBeGreaterThan(SEED_LEADS.length);
  });

  it("ajoute une fiche créée en tête, avec un identifiant stable", () => {
    const { leads, activities } = replay([create("Marchetti")], NOW);
    expect(leads).toHaveLength(SEED_LEADS.length + 1);
    expect(leads[0]).toMatchObject({ id: createdLeadId(0), lastName: "Marchetti", createdAt: NOW.toISOString() });
    expect(activities[0]).toMatchObject({ leadId: createdLeadId(0), type: "lead_created" });
  });

  it("donne le même résultat à chaque rejeu, quelle que soit l'instance", () => {
    const ops: JournalOp[] = [create("A"), create("B", T + 1000), { k: "n", t: T + 2000, id: createdLeadId(1), b: "Rappel lundi." }];
    expect(replay(ops, NOW)).toEqual(replay(ops, NOW));
  });

  it("applique changements d'étape et notes, et les inscrit à l'historique", () => {
    const { leads, activities } = replay(
      [
        { k: "s", t: T, ids: ["LD-1002"], s: "won" },
        { k: "n", t: T + 1, id: "LD-1002", b: "Contrat signé." },
      ],
      NOW,
    );
    const lead = leads.find((entry) => entry.id === "LD-1002")!;
    expect(lead.status).toBe("won");
    expect(lead.notes.at(-1)?.body).toBe("Contrat signé.");
    expect(activities.filter((activity) => activity.leadId === "LD-1002").slice(0, 2).map((a) => a.type)).toEqual([
      "note_added",
      "status_changed",
    ]);
  });

  it("supprime les fiches et leur historique", () => {
    const { leads, activities } = replay([{ k: "d", t: T, ids: ["LD-1001", "LD-1002"] }], NOW);
    expect(leads.some((lead) => lead.id === "LD-1001")).toBe(false);
    expect(activities.some((activity) => activity.leadId === "LD-1002")).toBe(false);
  });

  it("ignore une opération qui vise une fiche absente", () => {
    expect(() => replay([{ k: "n", t: T, id: "LD-9999", b: "?" }], NOW)).not.toThrow();
  });
});

describe("withoutLastDelete", () => {
  it("annule la dernière suppression et remet les fiches à leur place", () => {
    const before = replay([], NOW).leads.map((lead) => lead.id);
    const ops: JournalOp[] = [{ k: "d", t: T, ids: ["LD-1003", "LD-1010"] }];
    const undone = withoutLastDelete(ops)!;
    expect(undone.ids).toEqual(["LD-1003", "LD-1010"]);
    expect(replay(undone.ops, NOW).leads.map((lead) => lead.id)).toEqual(before);
  });

  it("garde les opérations postérieures à la suppression", () => {
    const ops: JournalOp[] = [{ k: "d", t: T, ids: ["LD-1003"] }, create("Après", T + 1)];
    const undone = withoutLastDelete(ops)!;
    expect(undone.ops).toEqual([create("Après", T + 1)]);
  });

  it("rend null sans suppression à annuler", () => {
    expect(withoutLastDelete([create("X")])).toBeNull();
  });
});

describe("encodeJournal / decodeJournal", () => {
  it("fait l'aller-retour sans perte", () => {
    const ops: JournalOp[] = [create("Marchetti"), { k: "s", t: T, ids: ["LD-1001"], s: "won" }];
    expect(decodeJournal(encodeJournal(ops)!)).toEqual(ops);
  });

  it("écrit un journal vide sans cookie", () => {
    expect(encodeJournal([])).toEqual([]);
    expect(decodeJournal([undefined, undefined])).toEqual([]);
  });

  it("découpe en morceaux sous la limite des navigateurs", () => {
    const ops = Array.from({ length: 30 }, (_, index): JournalOp => ({
      k: "n",
      t: T + index,
      id: "LD-1001",
      b: `${index} ${crypto.randomUUID()} ${crypto.randomUUID()}`,
    }));
    const chunks = encodeJournal(ops)!;
    expect(chunks.length).toBeGreaterThan(0);
    for (const chunk of chunks) expect(chunk.length).toBeLessThanOrEqual(CHUNK_SIZE);
    expect(decodeJournal(chunks)).toEqual(ops);
  });

  it("refuse un journal trop gros plutôt que de dépasser l'en-tête", () => {
    const ops = Array.from({ length: 400 }, (_, index): JournalOp => ({
      k: "n",
      t: T + index,
      id: "LD-1001",
      b: crypto.randomUUID().repeat(4),
    }));
    expect(encodeJournal(ops)).toBeNull();
    expect(MAX_CHUNKS * CHUNK_SIZE).toBeLessThan(12_000);
  });

  it("traite un cookie illisible ou altéré comme un journal vide", () => {
    expect(decodeJournal(["pas-du-base64-valide"])).toEqual([]);
    const forged = encodeJournal([create("X")])!;
    const tampered = Buffer.from(JSON.stringify([{ k: "c", t: "hier" }])).toString("base64url");
    expect(decodeJournal([tampered])).toEqual([]);
    expect(decodeJournal(forged)).toHaveLength(1);
  });
});

describe("modification d'une fiche", () => {
  const edit = (overrides: Partial<Extract<JournalOp, { k: "u" }>> = {}): JournalOp => ({
    k: "u",
    t: T,
    id: "LD-1001",
    f: "Emma",
    l: "Laurent",
    co: "Studio Bloom",
    e: "emma@studio-bloom.fr",
    p: "06 12 44 87 90",
    v: 5200,
    ...overrides,
  });

  it("applique les champs et nomme ce qui a changé dans l'historique", () => {
    const { leads, activities } = replay([edit()], NOW);
    expect(leads.find((lead) => lead.id === "LD-1001")).toMatchObject({
      email: "emma@studio-bloom.fr",
      estimatedValue: 5200,
      status: "qualified",
    });
    expect(activities[0]).toMatchObject({
      type: "lead_updated",
      leadId: "LD-1001",
      summary: "Modification : e-mail et montant.",
    });
  });

  it("n'écrit rien quand rien ne change", () => {
    const before = replay([], NOW).activities.length;
    const { activities } = replay(
      [edit({ e: "emma.laurent@studio-bloom.fr", v: 4500 })],
      NOW,
    );
    expect(activities).toHaveLength(before);
  });

  it("survit à l'encodage dans le cookie", () => {
    expect(decodeJournal(encodeJournal([edit()])!)).toEqual([edit()]);
  });
});
