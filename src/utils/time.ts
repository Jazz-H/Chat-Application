import type { Timestamp } from "firebase/firestore";

/**
 * Convert a Firestore Timestamp (or null while serverTimestamp() resolves)
 * into a short, human-friendly relative string: "now", "5m", "3h", "2d",
 * falling back to a localized date for anything older than a week.
 */
export function formatRelativeTime(
  timestamp: Timestamp | null | undefined
): string {
  if (!timestamp) {
    // serverTimestamp() is still pending on a just-sent (optimistic) message.
    return "now";
  }

  const date = timestamp.toDate();
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 45) return "now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d`;

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}
