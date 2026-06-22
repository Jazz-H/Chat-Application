import { createContext, useContext } from "react";
import type { Room } from "../rooms";

// The currently open conversation — either a public room or a 1:1 DM.
export type ActiveChat =
  | { kind: "room"; id: string; name: string; icon: string }
  | { kind: "dm"; id: string; name: string; peerUid: string };

/** Deterministic conversation id for a pair of users. */
export function dmId(a: string, b: string): string {
  return [a, b].sort().join("__");
}

/** Firestore path segments to the conversation containing messages/typing. */
export function chatPathFor(active: ActiveChat): string[] {
  return active.kind === "room"
    ? ["rooms", active.id]
    : ["conversations", active.id];
}

export interface ChatContextValue {
  active: ActiveChat;
  openRoom: (room: Room) => void;
  openDm: (peerUid: string, peerName: string) => void;
}

export const ChatContext = createContext<ChatContextValue | null>(null);

export function useChat(): ChatContextValue {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within a ChatProvider");
  return ctx;
}
