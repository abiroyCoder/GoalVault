import { describe, it, expect } from "vitest";
import { formatTimeLeft } from "../useGoalTimer";
import type { TimeLeft } from "../useGoalTimer";

function make(overrides: Partial<TimeLeft>): TimeLeft {
  return {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    expired: false,
    totalSecondsLeft: 0,
    ...overrides,
  };
}

describe("formatTimeLeft", () => {
  it("returns 'Deadline passed' when expired", () => {
    expect(formatTimeLeft(make({ expired: true }))).toBe("Deadline passed");
  });

  it("shows days and hours when days > 0", () => {
    const result = formatTimeLeft(make({ days: 3, hours: 5 }));
    expect(result).toBe("3d 5h remaining");
  });

  it("shows hours and minutes when no days", () => {
    const result = formatTimeLeft(make({ hours: 2, minutes: 30 }));
    expect(result).toBe("2h 30m remaining");
  });

  it("shows minutes and seconds when under one hour", () => {
    const result = formatTimeLeft(make({ minutes: 14, seconds: 22 }));
    expect(result).toBe("14m 22s remaining");
  });

  it("shows 0m 0s when totalSecondsLeft is 0 and not expired", () => {
    const result = formatTimeLeft(make({ minutes: 0, seconds: 0 }));
    expect(result).toBe("0m 0s remaining");
  });
});
