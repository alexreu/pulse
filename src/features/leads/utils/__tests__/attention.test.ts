import { describe, expect, it } from "vitest";
import { SEED_LEADS } from "@/data/leads";
import { EMPTY_FILTERS } from "../../types";
import { getPriorityActions } from "../attention";
import { filterLeads } from "../collection";

// Le lendemain du jour de référence du jeu : chaque règle désigne au moins une fiche.
const NOW = new Date("2026-09-16T10:00:00.000Z");

describe("« À faire en premier »", () => {
  it("ouvre exactement les fiches qu'il compte", () => {
    const actions = getPriorityActions(SEED_LEADS, NOW);
    expect(actions.length).toBeGreaterThan(0);
    for (const action of actions) {
      const shown = filterLeads(SEED_LEADS, { ...EMPTY_FILTERS, priority: action.id }, NOW);
      expect(shown).toHaveLength(action.count);
      expect(action.href).toBe(`/leads?priorite=${action.id}`);
    }
  });
});
