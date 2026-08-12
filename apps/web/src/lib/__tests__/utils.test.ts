import { describe, it, expect } from "vitest";
import { formatAmount } from "../utils";

describe("formatAmount", () => {
  it("formats whole XLM amounts", () => {
    expect(formatAmount(100)).toMatch(/100/);
  });

  it("handles zero", () => {
    expect(formatAmount(0)).toMatch(/0/);
  });

  it("handles large numbers without crashing", () => {
    const result = formatAmount(1_000_000);
    expect(result).toBeTruthy();
  });
});
