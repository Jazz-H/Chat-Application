import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import type { Timestamp } from "firebase/firestore";
import { auth, db } from "../firebase";

interface TypingIndicatorProps {
  roomId: string;
}

interface TypingEntry {
  uid: string;
  name: string;
  at: number;
}

// A typing entry counts as active only if refreshed within this window, so
// stale entries (e.g. a user who closed their tab) expire on their own.
const STALE_MS = 6000;

function label(names: string[]): string {
  if (names.length === 1) return `${names[0]} is typing`;
  if (names.length === 2) return `${names[0]} and ${names[1]} are typing`;
  return "Several people are typing";
}

const TypingIndicator = ({ roomId }: TypingIndicatorProps) => {
  const [entries, setEntries] = useState<TypingEntry[]>([]);
  // A periodic tick so stale entries expire even without new snapshots.
  const [, setTick] = useState(0);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "rooms", roomId, "typing"),
      (snapshot) => {
        const me = auth.currentUser?.uid;
        const next: TypingEntry[] = [];
        snapshot.forEach((docSnap) => {
          if (docSnap.id === me) return;
          const data = docSnap.data() as {
            name?: string;
            updatedAt?: Timestamp | null;
          };
          next.push({
            uid: docSnap.id,
            name: data.name || "Someone",
            at: data.updatedAt?.toMillis() ?? 0,
          });
        });
        setEntries(next);
      },
      () => undefined
    );
    return () => unsubscribe();
  }, [roomId]);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 2000);
    return () => clearInterval(id);
  }, []);

  const now = Date.now();
  const names = entries.filter((e) => now - e.at < STALE_MS).map((e) => e.name);

  // Reserve a fixed height so the message list doesn't jump.
  return (
    <div className="flex h-6 shrink-0 items-center gap-2 bg-black/40 px-4 text-xs text-white/60 backdrop-blur-sm">
      {names.length > 0 && (
        <>
          <span className="flex gap-0.5">
            {[0, 150, 300].map((delay) => (
              <span
                key={delay}
                className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-400"
                style={{ animationDelay: `${delay}ms` }}
              />
            ))}
          </span>
          <span className="truncate">{label(names)}…</span>
        </>
      )}
    </div>
  );
};

export default TypingIndicator;
