import type { Timestamp } from "firebase/firestore";

export interface ChatMessage {
  id: string;
  text: string;
  name: string;
  uid: string;
  // `serverTimestamp()` reads back as null until the server resolves it,
  // then as a Firestore Timestamp.
  timestamp: Timestamp | null;
  // emoji -> list of uids who reacted with it
  reactions?: Record<string, string[]>;
  // set when the author edits the message
  editedAt?: Timestamp | null;
}
