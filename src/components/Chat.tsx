import { useState, useEffect, useRef } from "react";
import Message from "./Message";
import SendMessage from "./SendMessage";
import { db } from "../firebase";
import {
  query,
  collection,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import SidebarNav from "./SidebarNav";
import type { ChatMessage } from "../types";

const PAGE_SIZE = 25;

type Status = "loading" | "ready" | "error";

const style = {
  main: `flex flex-col z-0 px-2 pb-2`,
  state: `flex flex-col items-center justify-center gap-2 py-16 text-white/70`,
  spinner: `h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-white`,
  loadMore: `mx-auto my-3 rounded-full bg-white/10 px-4 py-1 text-sm text-white/80 hover:bg-white/20 disabled:opacity-50`,
};

const Chat = () => {
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
      collection(db, "ChatMessages"),
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
  }, [messageLimit]);

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

  return (
    <>
      <SidebarNav />
      <div className="backdrop-blur-sm bg-black/20 mt-20 shadow rounded-2xl">
        <main className={style.main}>
          {status === "loading" && (
            <div className={style.state}>
              <div className={style.spinner} />
              <p>Loading messages…</p>
            </div>
          )}

          {status === "error" && (
            <div className={style.state}>
              <p>Couldn’t load messages. Please try again.</p>
            </div>
          )}

          {status === "ready" && messages.length === 0 && (
            <div className={style.state}>
              <p className="text-lg">No messages yet</p>
              <p className="text-sm">Be the first to say hi 👋</p>
            </div>
          )}

          {status === "ready" && messages.length > 0 && (
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
        </main>

        <SendMessage />
        <span ref={bottomRef}></span>
      </div>
    </>
  );
};

export default Chat;
