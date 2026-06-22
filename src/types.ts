import type { Timestamp } from "firebase/firestore";

export interface ChatMessage {
  id: string;
  text: string;
  name: string;
  uid: string;
  // `serverTimestamp()` reads back as null until the server resolves it,
  // then as a Firestore Timestamp.
  timestamp: Timestamp | null;
}
