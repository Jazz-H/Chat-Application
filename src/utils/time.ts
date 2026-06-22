import type { Timestamp } from "firebase/firestore";

function sameCalendarDay(a: Date, b: Date): boolean {
  return a.toDateString() === b.toDateString();
}

/**
 * Whether two messages fall on the same calendar day. Pending (null)
 * timestamps are treated as "same day" so a just-sent message groups with its
 * neighbors instead of triggering a spurious date separator.
 */
export function isSameDay(a: Timestamp | null, b: Timestamp | null): boolean {
  if (!a || !b) return true;
  return sameCalendarDay(a.toDate(), b.toDate());
}

/** Short clock time, e.g. "9:41 AM". */
export function formatClockTime(timestamp: Timestamp | null): string {
  if (!timestamp) return "now";
  return timestamp.toDate().toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

/** Date-separator label: "Today", "Yesterday", or a localized date. */
export function formatDaySeparator(timestamp: Timestamp | null): string {
  if (!timestamp) return "Today";

  const date = timestamp.toDate();
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  if (sameCalendarDay(date, now)) return "Today";
  if (sameCalendarDay(date, yesterday)) return "Yesterday";

  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
