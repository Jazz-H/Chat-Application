import { doc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

function messageRef(chatPath: string[], messageId: string) {
  return doc(db, [...chatPath, "messages", messageId].join("/"));
}

/** Toggle the current user's reaction with `emoji` on a message. */
export function toggleReaction(
  chatPath: string[],
  messageId: string,
  emoji: string,
  reactions: Record<string, string[]> | undefined,
  uid: string
) {
  const next: Record<string, string[]> = {};
  for (const [key, uids] of Object.entries(reactions ?? {})) {
    next[key] = [...uids];
  }

  const users = new Set(next[emoji] ?? []);
  if (users.has(uid)) users.delete(uid);
  else users.add(uid);

  if (users.size === 0) delete next[emoji];
  else next[emoji] = Array.from(users);

  return updateDoc(messageRef(chatPath, messageId), { reactions: next });
}

export function deleteMessage(chatPath: string[], messageId: string) {
  return deleteDoc(messageRef(chatPath, messageId));
}

export function editMessage(
  chatPath: string[],
  messageId: string,
  text: string
) {
  return updateDoc(messageRef(chatPath, messageId), {
    text,
    editedAt: serverTimestamp(),
  });
}
