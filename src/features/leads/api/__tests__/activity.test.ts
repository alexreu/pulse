// @vitest-environment node
import { describe, expect, it } from "vitest";
import { SEED_LEADS } from "@/data/leads";
import { seedActivities } from "../activity";

describe("seedActivities", () => {
  it("ne raconte rien d'une fiche avant sa création", () => {
    const createdAt = new Map(SEED_LEADS.map((lead) => [lead.id, lead.createdAt]));
    const premature = seedActivities().filter(
      (activity) => activity.createdAt < (createdAt.get(activity.leadId) ?? ""),
    );
    expect(premature).toEqual([]);
  });

  it("date chaque note après la création de sa fiche", () => {
    for (const lead of SEED_LEADS) {
      for (const note of lead.notes) {
        expect(note.createdAt >= lead.createdAt, `${note.id} précède ${lead.id}`).toBe(true);
      }
    }
  });
});
