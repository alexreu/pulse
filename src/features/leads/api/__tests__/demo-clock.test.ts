import { describe, expect, it } from "vitest";
import { SEED_LEADS } from "@/data/leads";
import { MONTHLY_REVENUE } from "@/data/revenue";
import {
  asOfDate,
  computeDayOffset,
  describeRevenueRange,
  formatAsOf,
  latestSeedDate,
  rebaseLeads,
  rebaseRevenue,
} from "../demo-clock";

const LATEST = latestSeedDate(SEED_LEADS);

describe("computeDayOffset", () => {
  it("ne décale rien le jour de référence, une fois le dernier évènement passé", () => {
    expect(computeDayOffset(LATEST, new Date("2026-09-15T20:00:00.000Z"))).toBe(0);
  });

  it("avance du nombre de jours écoulés", () => {
    expect(computeDayOffset(LATEST, new Date("2026-11-10T20:00:00.000Z"))).toBe(56);
  });

  it("recule d'un jour tant que l'heure du dernier évènement n'est pas atteinte", () => {
    // Le dernier évènement du jeu tombe en fin de matinée : à 6 h, il serait dans le futur.
    expect(computeDayOffset(LATEST, new Date("2026-11-10T05:00:00.000Z"))).toBe(55);
  });
});

describe("rebaseLeads", () => {
  it("ne place aucune date dans le futur", () => {
    const now = new Date("2026-11-10T05:00:00.000Z");
    const leads = rebaseLeads(SEED_LEADS, computeDayOffset(LATEST, now));
    for (const lead of leads) {
      expect(new Date(lead.createdAt).getTime()).toBeLessThanOrEqual(now.getTime());
      for (const note of lead.notes) {
        expect(new Date(note.createdAt).getTime()).toBeLessThanOrEqual(now.getTime());
      }
    }
  });

  it("garde l'heure murale de Paris malgré le changement d'heure", () => {
    const [lead] = rebaseLeads([SEED_LEADS[0]], 56);
    // 06:02 UTC en septembre (heure d'été) = 08:02 à Paris ; en novembre, 08:02 = 07:02 UTC.
    expect(SEED_LEADS[0].createdAt).toBe("2026-09-15T06:02:00.000Z");
    expect(lead.createdAt).toBe("2026-11-10T07:02:00.000Z");
  });

  it("ne modifie pas le jeu d'origine", () => {
    const before = SEED_LEADS[0].createdAt;
    rebaseLeads(SEED_LEADS, 30);
    expect(SEED_LEADS[0].createdAt).toBe(before);
  });
});

describe("rebaseRevenue", () => {
  it("fait du mois précédent le dernier mois de la série", () => {
    const series = rebaseRevenue(MONTHLY_REVENUE, asOfDate(56));
    expect(series.at(-1)).toMatchObject({ month: "2026-10", label: "Oct.", longLabel: "octobre 2026" });
    expect(series[0]).toMatchObject({ month: "2026-03", label: "Mars" });
    expect(series.map((entry) => entry.revenue)).toEqual(MONTHLY_REVENUE.map((entry) => entry.revenue));
  });

  it("passe l'année proprement", () => {
    const series = rebaseRevenue(MONTHLY_REVENUE, "2027-02-03T11:00:00.000Z");
    expect(series.at(-1)).toMatchObject({ month: "2027-01", year: 2027, label: "Janv." });
    expect(describeRevenueRange(series)).toBe("Juin 2026 à janvier 2027");
  });
});

describe("libellés", () => {
  it("décrit une plage sur une seule année sans répéter l'année", () => {
    expect(describeRevenueRange(rebaseRevenue(MONTHLY_REVENUE, asOfDate(0)))).toBe("Janvier à août 2026");
  });

  it("écrit le jour représenté en toutes lettres", () => {
    expect(formatAsOf(asOfDate(56))).toBe("10 novembre 2026");
  });
});

describe("format des dates recalées", () => {
  it("écrit toujours de l'UTC en Z, pour que le tri par chaîne reste juste", () => {
    for (const lead of rebaseLeads(SEED_LEADS, 56)) {
      expect(lead.createdAt).toMatch(/Z$/);
      if (lead.lastContactAt) expect(lead.lastContactAt).toMatch(/Z$/);
    }
    expect(asOfDate(56)).toMatch(/Z$/);
  });
});
