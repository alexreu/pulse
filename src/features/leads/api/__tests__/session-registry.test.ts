import { describe, expect, it } from "vitest";
import { createSessionRegistry, isValidSessionId } from "../session-registry";

function setup(maxSessions = 3, idleTimeoutMs = 1000) {
  let clock = 0;
  let created = 0;
  const registry = createSessionRegistry(() => ({ id: (created += 1), items: [] as string[] }), {
    maxSessions,
    idleTimeoutMs,
    now: () => clock,
  });
  return { registry, advance: (ms: number) => (clock += ms) };
}

describe("createSessionRegistry", () => {
  it("rend la même copie à un même visiteur", () => {
    const { registry } = setup();
    registry.get("a").items.push("x");
    expect(registry.get("a").items).toEqual(["x"]);
  });

  it("isole deux visiteurs", () => {
    const { registry } = setup();
    registry.get("a").items.push("supprimé");
    expect(registry.get("b").items).toEqual([]);
  });

  it("repart d'une copie neuve après expiration", () => {
    const { registry, advance } = setup();
    const first = registry.get("a");
    advance(1500);
    expect(registry.get("a")).not.toBe(first);
  });

  it("garde une session active au-delà du délai tant qu'elle sert", () => {
    const { registry, advance } = setup();
    const first = registry.get("a");
    advance(800);
    registry.get("a");
    advance(800);
    expect(registry.get("a")).toBe(first);
  });

  it("évince la session la moins récemment utilisée au-delà du plafond", () => {
    const { registry } = setup(2);
    const a = registry.get("a");
    registry.get("b");
    registry.get("a");
    registry.get("c");
    expect(registry.size).toBe(2);
    expect(registry.get("a")).toBe(a);
  });

  it("réinitialise une session à la demande", () => {
    const { registry } = setup();
    registry.get("a").items.push("x");
    expect(registry.reset("a").items).toEqual([]);
    expect(registry.get("a").items).toEqual([]);
  });
});

describe("isValidSessionId", () => {
  it("n'accepte qu'un UUID", () => {
    expect(isValidSessionId("6f1c2c4e-8b1a-4c1e-9d9a-0b7e2f3a4c5d")).toBe(true);
    expect(isValidSessionId(undefined)).toBe(false);
    expect(isValidSessionId("../../etc")).toBe(false);
    expect(isValidSessionId("x".repeat(36))).toBe(false);
  });
});
