import { describe, it, expect } from "vitest";
import type { Timestamp } from "firebase/firestore";
import { isSameDay, formatClockTime, formatDaySeparator } from "./time";

// Minimal Timestamp stand-in (only the methods these helpers use).
const ts = (date: Date): Timestamp =>
  ({
    toDate: () => date,
    toMillis: () => date.getTime(),
  }) as unknown as Timestamp;

describe("isSameDay", () => {
  it("treats pending (null) timestamps as the same day", () => {
    expect(isSameDay(null, ts(new Date()))).toBe(true);
  });

  it("is true for two times on the same calendar day", () => {
    expect(
      isSameDay(ts(new Date(2026, 0, 1, 9)), ts(new Date(2026, 0, 1, 23)))
    ).toBe(true);
  });

  it("is false across different days", () => {
    expect(isSameDay(ts(new Date(2026, 0, 1)), ts(new Date(2026, 0, 2)))).toBe(
      false
    );
  });
});

describe("formatClockTime", () => {
  it("returns 'now' for a pending timestamp", () => {
    expect(formatClockTime(null)).toBe("now");
  });

  it("formats a resolved timestamp as a clock time", () => {
    const result = formatClockTime(ts(new Date(2026, 0, 1, 9, 41)));
    expect(result).not.toBe("now");
    expect(result).toMatch(/\d/);
  });
});

describe("formatDaySeparator", () => {
  it("labels today as 'Today'", () => {
    expect(formatDaySeparator(ts(new Date()))).toBe("Today");
  });

  it("labels yesterday as 'Yesterday'", () => {
    const y = new Date();
    y.setDate(y.getDate() - 1);
    expect(formatDaySeparator(ts(y))).toBe("Yesterday");
  });
});
