import type { Lead, LeadStatus } from "../../types";

let sequence = 0;

/** Un prospect minimal, complété au cas par cas dans les tests. */
export function makeLead(overrides: Partial<Lead> = {}): Lead {
  sequence += 1;
  return {
    id: `T-${sequence}`,
    firstName: "Camille",
    lastName: "Durand",
    company: "Atelier Durand",
    email: "camille.durand@atelier-durand.fr",
    estimatedValue: 1000,
    status: "new" as LeadStatus,
    createdAt: "2026-06-01T09:00:00.000Z",
    notes: [],
    ...overrides,
  };
}
