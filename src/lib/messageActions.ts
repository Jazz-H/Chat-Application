import { doc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

function messageRef(roomId: string, messageId: string) {
  return doc(db, "rooms", roomId, "messages", messageId);
}

/** Toggle the current user's reaction with `emoji` on a message. */
export function toggleReaction(
  roomId: string,
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

  return updateDoc(messageRef(roomId, messageId), { reactions: next });
}

export function deleteMessage(roomId: string, messageId: string) {
  return deleteDoc(messageRef(roomId, messageId));
}

export function editMessage(roomId: string, messageId: string, text: string) {
  return updateDoc(messageRef(roomId, messageId), {
    text,
    editedAt: serverTimestamp(),
  });
}
