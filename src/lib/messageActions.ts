import { doc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { nextReactions } from "./reactions";

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
  return updateDoc(messageRef(chatPath, messageId), {
    reactions: nextReactions(reactions, emoji, uid),
  });
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
