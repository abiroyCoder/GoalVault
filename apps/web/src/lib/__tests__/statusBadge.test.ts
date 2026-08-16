import { describe, it, expect } from "vitest";
import { getBadge, BADGE_TIERS } from "../../components/StatusBadge";

describe("getBadge tier resolution", () => {
  it("returns Novice for 0 completed goals", () => {
    const badge = getBadge(0);
    expect(badge.label).toBe("Novice");
  });

  it("returns Builder for 2 completed goals", () => {
    const badge = getBadge(2);
    expect(badge.label).toBe("Builder");
  });

  it("returns Pro for 5 completed goals", () => {
    const badge = getBadge(5);
    expect(badge.label).toBe("Pro");
  });

  it("returns Champion for 10 completed goals", () => {
    const badge = getBadge(10);
    expect(badge.label).toBe("Champion");
  });

  it("returns Legend for 20+ completed goals", () => {
    const badge = getBadge(20);
    expect(badge.label).toBe("Legend");
  });

  it("returns Legend for very high counts", () => {
    const badge = getBadge(999);
    expect(badge.label).toBe("Legend");
  });

  it("BADGE_TIERS last entry is always Novice as ultimate fallback", () => {
    const last = BADGE_TIERS[BADGE_TIERS.length - 1]!;
    expect(last.label).toBe("Novice");
    expect(last.minGoals).toBe(0);
  });
});
