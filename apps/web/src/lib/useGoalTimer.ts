import { useState, useEffect } from "react";

export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
  totalSecondsLeft: number;
}

/** Returns the number of seconds remaining until `endTimestampMs`. */
function calcTimeLeft(endTimestampMs: number): TimeLeft {
  const diff = Math.max(0, endTimestampMs - Date.now());
  const totalSecondsLeft = Math.floor(diff / 1000);
  const expired = diff === 0;

  const days    = Math.floor(diff / 86_400_000);
  const hours   = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1_000);

  return { days, hours, minutes, seconds, expired, totalSecondsLeft };
}

/**
 * Reactive countdown hook.
 * @param endTimestampMs  Unix timestamp in milliseconds for the goal deadline
 * @param tickMs          How often to re-evaluate (default: 1000ms)
 */
export function useGoalTimer(endTimestampMs: number, tickMs = 1_000): TimeLeft {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calcTimeLeft(endTimestampMs));

  useEffect(() => {
    if (timeLeft.expired) return;

    const id = setInterval(() => {
      const next = calcTimeLeft(endTimestampMs);
      setTimeLeft(next);
      if (next.expired) clearInterval(id);
    }, tickMs);

    return () => clearInterval(id);
  }, [endTimestampMs, tickMs]);

  return timeLeft;
}

/** Format a TimeLeft value as a human-readable string. */
export function formatTimeLeft(t: TimeLeft): string {
  if (t.expired) return "Deadline passed";
  if (t.days > 0) return `${t.days}d ${t.hours}h remaining`;
  if (t.hours > 0) return `${t.hours}h ${t.minutes}m remaining`;
  return `${t.minutes}m ${t.seconds}s remaining`;
}
