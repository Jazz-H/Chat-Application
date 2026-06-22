import { useState, useEffect, useRef } from "react";
import Message from "./Message";
import { db } from "../firebase";
import {
  query,
  collection,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import type { ChatMessage } from "../types";

const PAGE_SIZE = 25;

type Status = "loading" | "ready" | "error";

interface ChatProps {
  roomId: string;
}

const style = {
  scroll: `flex-1 overflow-y-auto bg-black/40 backdrop-blur-sm`,
  inner: `flex min-h-full flex-col justify-end px-2 py-4`,
  state: `flex flex-1 flex-col items-center justify-center gap-2 py-16 text-white/70`,
  spinner: `h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-white`,
  loadMore: `mx-auto my-3 rounded-full bg-white/10 px-4 py-1 text-sm text-white/80 hover:bg-white/20 disabled:opacity-50`,
};

const Chat = ({ roomId }: ChatProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageLimit, setMessageLimit] = useState(PAGE_SIZE);
  const [status, setStatus] = useState<Status>("loading");
  const [hasMore, setHasMore] = useState(false);

  const bottomRef = useRef<HTMLSpanElement>(null);
  const lastMessageId = useRef<string | null>(null);

  useEffect(() => {
    // Fetch the most recent `messageLimit` messages (descending), then
    // reverse for natural top-to-bottom display. This avoids loading the
    // entire collection on every mount.
    const q = query(
      collection(db, "rooms", roomId, "messages"),
      orderBy("timestamp", "desc"),
      limit(messageLimit)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map((doc) => ({
          ...(doc.data() as Omit<ChatMessage, "id">),
          id: doc.id,
        }));
        setHasMore(docs.length === messageLimit);
        setMessages(docs.reverse());
        setStatus("ready");
      },
      (error) => {
        // Most commonly a Firestore "permission-denied" if security rules
        // are misconfigured — surface it instead of failing silently.
        console.error("Failed to load messages:", error);
        setStatus("error");
      }
    );

    return () => unsubscribe();
  }, [roomId, messageLimit]);

  // Auto-scroll to the bottom only when a genuinely new message arrives,
  // not when older messages are prepended via "load older".
  useEffect(() => {
    if (messages.length === 0) return;
    const newestId = messages[messages.length - 1].id;
    if (newestId !== lastMessageId.current) {
      lastMessageId.current = newestId;
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (status === "loading") {
    return (
      <div className={style.scroll}>
        <div className={style.state}>
          <div className={style.spinner} />
          <p>Loading messages…</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className={style.scroll}>
        <div className={style.state}>
          <p>Couldn’t load messages. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={style.scroll}>
      <div className={style.inner}>
        {messages.length === 0 ? (
          <div className={style.state}>
            <p className="text-lg">No messages yet</p>
            <p className="text-sm">Be the first to say hi 👋</p>
          </div>
        ) : (
          <>
            {hasMore && (
              <button
                type="button"
                className={style.loadMore}
                onClick={() => setMessageLimit((n) => n + PAGE_SIZE)}
              >
                Load older messages
              </button>
            )}
            {messages.map((message) => (
              <Message key={message.id} message={message} />
            ))}
          </>
        )}
        <span ref={bottomRef}></span>
      </div>
    </div>
  );
};

export default Chat;
