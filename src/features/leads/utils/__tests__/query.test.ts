import { describe, expect, it } from "vitest";
import { EMPTY_FILTERS } from "../../types";
import { DEFAULT_SORT, parseLeadsQuery, serializeLeadsQuery, type LeadsQueryState } from "../query";

const parse = (query: string) => parseLeadsQuery(new URLSearchParams(query));

describe("parseLeadsQuery", () => {
  it("rend l'état par défaut pour une URL nue", () => {
    expect(parse("")).toEqual({ filters: EMPTY_FILTERS, sort: DEFAULT_SORT, pageSize: 10 });
  });

  it("lit chaque critère", () => {
    const state = parse(
      "q=bloom&status=qualified,proposal&montant=1000-5000&du=2026-10-01&au=2026-10-31&priorite=aging-qualified&tri=name-asc&lignes=50",
    );
    expect(state).toEqual({
      filters: {
        search: "bloom",
        statuses: ["qualified", "proposal"],
        valueBracket: "1000-5000",
        createdFrom: "2026-10-01",
        createdTo: "2026-10-31",
        priority: "aging-qualified",
      },
      sort: { field: "name", direction: "asc" },
      pageSize: 50,
    });
  });

  it("ignore les valeurs inconnues au lieu de casser", () => {
    const state = parse("status=qualified,bidon,qualified&montant=1M&du=hier&priorite=tout&tri=email-up&lignes=7");
    expect(state.filters.statuses).toEqual(["qualified"]);
    expect(state.filters.valueBracket).toBe("all");
    expect(state.filters.createdFrom).toBeUndefined();
    expect(state.filters.priority).toBeUndefined();
    expect(state.sort).toEqual(DEFAULT_SORT);
    expect(state.pageSize).toBe(10);
  });

  it("garde les liens existants du tableau de bord (?status=)", () => {
    expect(parse("status=new").filters.statuses).toEqual(["new"]);
  });
});

describe("serializeLeadsQuery", () => {
  it("n'écrit rien pour l'état par défaut", () => {
    expect(serializeLeadsQuery(parse(""))).toBe("");
  });

  it("fait l'aller-retour sans perte", () => {
    const state: LeadsQueryState = {
      filters: {
        search: "  émilie ",
        statuses: ["won"],
        valueBracket: "over-5000",
        createdFrom: "2026-09-01",
        priority: "stalled-proposals",
      },
      sort: { field: "estimatedValue", direction: "desc" },
      pageSize: 20,
    };
    expect(parse(serializeLeadsQuery(state))).toEqual({
      ...state,
      filters: { ...state.filters, search: "émilie", createdTo: undefined },
    });
  });
});
