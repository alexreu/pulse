import { describe, expect, it } from "vitest";
import { EMPTY_FILTERS } from "../../types";
import {
  filterLeads,
  getRecentLeads,
  matchesSearch,
  matchesValueBracket,
  sortLeads,
} from "../collection";
import { makeLead } from "./factory";

const EMMA = makeLead({
  firstName: "Emma",
  lastName: "Laurent",
  company: "Studio Bloom",
  email: "emma.laurent@studio-bloom.fr",
  status: "qualified",
  estimatedValue: 4500,
  createdAt: "2026-09-15T09:00:00.000Z",
});

const THOMAS = makeLead({
  firstName: "Thomas",
  lastName: "Berger",
  company: "Atelier Nivelle",
  email: "thomas.berger@ateliernivelle.fr",
  status: "proposal",
  estimatedValue: 800,
  createdAt: "2026-08-24T09:00:00.000Z",
});

const CHLOE = makeLead({
  firstName: "Chloé",
  lastName: "Meunier",
  company: "Cabinet Vasseur",
  email: "chloe.meunier@cabinet-vasseur.fr",
  status: "qualified",
  estimatedValue: 8200,
  createdAt: "2026-07-12T09:00:00.000Z",
});

const LEADS = [EMMA, THOMAS, CHLOE];

describe("filterLeads — statut", () => {
  it("ne rend que les prospects des statuts demandés", () => {
    const result = filterLeads(LEADS, { ...EMPTY_FILTERS, statuses: ["qualified"] });
    expect(result).toHaveLength(2);
    expect(result.every((lead) => lead.status === "qualified")).toBe(true);
  });

  it("cumule plusieurs statuts", () => {
    const result = filterLeads(LEADS, {
      ...EMPTY_FILTERS,
      statuses: ["qualified", "proposal"],
    });
    expect(result).toHaveLength(3);
  });

  it("rend toute la base quand aucun statut n'est coché", () => {
    expect(filterLeads(LEADS, EMPTY_FILTERS)).toHaveLength(3);
  });
});

describe("filterLeads — recherche", () => {
  it("trouve par nom", () => {
    expect(filterLeads(LEADS, { ...EMPTY_FILTERS, search: "laurent" })).toEqual([EMMA]);
  });

  it("trouve par entreprise", () => {
    expect(filterLeads(LEADS, { ...EMPTY_FILTERS, search: "vasseur" })).toEqual([CHLOE]);
  });

  it("trouve par e-mail", () => {
    expect(filterLeads(LEADS, { ...EMPTY_FILTERS, search: "@ateliernivelle" })).toEqual([THOMAS]);
  });

  it("ignore les accents et la casse", () => {
    expect(matchesSearch(CHLOE, "CHLOE")).toBe(true);
    expect(matchesSearch(CHLOE, "chloé")).toBe(true);
  });

  it("rend une liste vide quand rien ne correspond", () => {
    expect(filterLeads(LEADS, { ...EMPTY_FILTERS, search: "introuvable" })).toEqual([]);
  });
});

describe("filterLeads — montant", () => {
  it("borne la tranche basse à l'exclusion de 1 000 €", () => {
    expect(matchesValueBracket(999, "under-1000")).toBe(true);
    expect(matchesValueBracket(1000, "under-1000")).toBe(false);
  });

  it("place 1 000 € dans la tranche médiane et 5 000 € dans la haute", () => {
    expect(matchesValueBracket(1000, "1000-5000")).toBe(true);
    expect(matchesValueBracket(5000, "1000-5000")).toBe(false);
    expect(matchesValueBracket(5000, "over-5000")).toBe(true);
  });

  it("filtre la base sur la tranche haute", () => {
    expect(filterLeads(LEADS, { ...EMPTY_FILTERS, valueBracket: "over-5000" })).toEqual([CHLOE]);
  });
});

describe("filterLeads — période et cumul", () => {
  it("borne sur la date de création", () => {
    const result = filterLeads(LEADS, { ...EMPTY_FILTERS, createdFrom: "2026-09-01" });
    expect(result).toEqual([EMMA]);
  });

  it("cumule statut, recherche et montant", () => {
    const result = filterLeads(LEADS, {
      ...EMPTY_FILTERS,
      statuses: ["qualified"],
      valueBracket: "1000-5000",
      search: "studio",
    });
    expect(result).toEqual([EMMA]);
  });
});

describe("sortLeads", () => {
  it("trie par montant croissant", () => {
    const result = sortLeads(LEADS, { field: "estimatedValue", direction: "asc" });
    expect(result.map((lead) => lead.estimatedValue)).toEqual([800, 4500, 8200]);
  });

  it("trie par montant décroissant", () => {
    const result = sortLeads(LEADS, { field: "estimatedValue", direction: "desc" });
    expect(result.map((lead) => lead.estimatedValue)).toEqual([8200, 4500, 800]);
  });

  it("trie par nom selon les règles françaises", () => {
    const result = sortLeads(LEADS, { field: "name", direction: "asc" });
    expect(result.map((lead) => lead.lastName)).toEqual(["Meunier", "Laurent", "Berger"]);
  });

  it("trie par date de création", () => {
    const result = sortLeads(LEADS, { field: "createdAt", direction: "desc" });
    expect(result[0]).toBe(EMMA);
  });

  it("ne mute pas la liste reçue", () => {
    const original = [...LEADS];
    sortLeads(LEADS, { field: "estimatedValue", direction: "asc" });
    expect(LEADS).toEqual(original);
  });
});

describe("getRecentLeads", () => {
  it("rend les plus récents d'abord, dans la limite demandée", () => {
    expect(getRecentLeads(LEADS, 2)).toEqual([EMMA, THOMAS]);
  });
});
