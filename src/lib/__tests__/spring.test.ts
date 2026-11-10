import { describe, expect, it } from "vitest";
import { projectMomentum, rubberband } from "../spring";

describe("projectMomentum", () => {
  it("ne projette rien sans élan", () => {
    expect(projectMomentum(0)).toBe(0);
  });

  it("projette dans le sens du geste, proportionnellement à sa vitesse", () => {
    expect(projectMomentum(-1000)).toBeCloseTo(-499, 0);
    expect(projectMomentum(2000)).toBeCloseTo(2 * projectMomentum(1000));
  });
});

describe("rubberband", () => {
  it("résiste de plus en plus sans jamais dépasser la limite physique", () => {
    const small = rubberband(20, 280);
    const large = rubberband(400, 280);
    expect(small).toBeLessThan(20);
    expect(large).toBeLessThan(280 * 0.55 * 2);
    expect(large / 400).toBeLessThan(small / 20);
  });
});
