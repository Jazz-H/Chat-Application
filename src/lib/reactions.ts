/**
 * Pure helper: compute the next reactions map after toggling `uid`'s reaction
 * with `emoji`. Adds the user if absent, removes them if present, and drops an
 * emoji key entirely once it has no users. Never mutates the input.
 */
export function nextReactions(
  reactions: Record<string, string[]> | undefined,
  emoji: string,
  uid: string
): Record<string, string[]> {
  const next: Record<string, string[]> = {};
  for (const [key, uids] of Object.entries(reactions ?? {})) {
    next[key] = [...uids];
  }

  const users = new Set(next[emoji] ?? []);
  if (users.has(uid)) users.delete(uid);
  else users.add(uid);

  if (users.size === 0) delete next[emoji];
  else next[emoji] = Array.from(users);

  return next;
}
