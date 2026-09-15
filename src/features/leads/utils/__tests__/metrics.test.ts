import { describe, expect, it } from "vitest";
import {
  calculateConversionRate,
  calculatePipelineValue,
  calculateRevenue,
  calculateTrend,
  countLeadsByStage,
  getClients,
  getLeadsByStatus,
} from "../metrics";
import { makeLead } from "./factory";

const LEADS = [
  makeLead({ status: "new", estimatedValue: 1000 }),
  makeLead({ status: "contacted", estimatedValue: 2000 }),
  makeLead({ status: "qualified", estimatedValue: 3000 }),
  makeLead({ status: "proposal", estimatedValue: 4000 }),
  makeLead({ status: "won", estimatedValue: 5000 }),
  makeLead({ status: "won", estimatedValue: 1500 }),
  makeLead({ status: "lost", estimatedValue: 9000 }),
];

describe("calculatePipelineValue", () => {
  it("additionne uniquement les affaires encore ouvertes", () => {
    expect(calculatePipelineValue(LEADS)).toBe(10_000);
  });

  it("exclut le gagné et le perdu", () => {
    const closed = [
      makeLead({ status: "won", estimatedValue: 5000 }),
      makeLead({ status: "lost", estimatedValue: 5000 }),
    ];
    expect(calculatePipelineValue(closed)).toBe(0);
  });

  it("rend 0 sur une base vide", () => {
    expect(calculatePipelineValue([])).toBe(0);
  });
});

describe("calculateRevenue", () => {
  it("additionne les affaires gagnées et elles seules", () => {
    expect(calculateRevenue(LEADS)).toBe(6500);
  });
});

describe("calculateConversionRate", () => {
  it("rend la part de prospects signés, en pourcentage", () => {
    // 2 gagnés sur 7 fiches.
    expect(calculateConversionRate(LEADS)).toBeCloseTo(28.571, 3);
  });

  it("rend 100 quand tout est signé", () => {
    expect(calculateConversionRate([makeLead({ status: "won" })])).toBe(100);
  });

  it("rend 0 sur une base vide plutôt que NaN", () => {
    expect(calculateConversionRate([])).toBe(0);
  });
});

describe("getLeadsByStatus", () => {
  it("ne rend que le statut demandé", () => {
    const qualified = getLeadsByStatus(LEADS, "qualified");
    expect(qualified).toHaveLength(1);
    expect(qualified[0].estimatedValue).toBe(3000);
  });

  it("rend une liste vide pour un statut absent", () => {
    expect(getLeadsByStatus([makeLead({ status: "new" })], "won")).toEqual([]);
  });
});

describe("countLeadsByStage", () => {
  it("rend les cinq étapes du flux, dans l'ordre, sans le perdu", () => {
    const stages = countLeadsByStage(LEADS);
    expect(stages.map((stage) => stage.stage)).toEqual([
      "new",
      "contacted",
      "qualified",
      "proposal",
      "won",
    ]);
    expect(stages.map((stage) => stage.count)).toEqual([1, 1, 1, 1, 2]);
  });

  it("porte la valeur cumulée de chaque étape", () => {
    const stages = countLeadsByStage(LEADS);
    expect(stages.find((stage) => stage.stage === "won")?.value).toBe(6500);
  });
});

describe("getClients", () => {
  it("rend exactement les prospects gagnés", () => {
    expect(getClients(LEADS)).toHaveLength(2);
    expect(getClients(LEADS).every((client) => client.status === "won")).toBe(true);
  });
});

describe("calculateTrend", () => {
  it("mesure une hausse", () => {
    expect(calculateTrend(18_450, 16_400)).toBeCloseTo(12.5, 1);
  });

  it("mesure une baisse avec un signe négatif", () => {
    expect(calculateTrend(124, 127)).toBeCloseTo(-2.36, 2);
  });

  it("rend 0 quand la période précédente est à zéro, sans diviser par zéro", () => {
    expect(calculateTrend(500, 0)).toBe(0);
  });
});
