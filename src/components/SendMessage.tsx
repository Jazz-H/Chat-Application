import { useState, type FormEvent } from "react";
import { auth, db } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

const MAX_LENGTH = 500;

const SendIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
    <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
  </svg>
);

interface SendMessageProps {
  roomId: string;
}

const SendMessage = ({ roomId }: SendMessageProps) => {
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const sendMessage = async (e: FormEvent) => {
    e.preventDefault();

    const text = input.trim();
    if (!text || sending) return;

    const user = auth.currentUser;
    if (!user) {
      setError("You must be signed in to send messages.");
      return;
    }

    setSending(true);
    setError("");

    try {
      await addDoc(collection(db, "rooms", roomId, "messages"), {
        text,
        name: user.displayName || "Guest",
        uid: user.uid,
        timestamp: serverTimestamp(),
      });
      setInput("");
    } catch (err) {
      console.error("Failed to send message:", err);
      setError("Couldn’t send your message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <form
      onSubmit={sendMessage}
      className="relative flex shrink-0 items-center gap-2 border-t border-white/10 bg-slate-900/70 p-3 backdrop-blur-xl"
    >
      {error && (
        <p className="absolute -top-9 left-3 right-3 rounded-md bg-red-500/90 px-3 py-1 text-sm text-white">
          {error}
        </p>
      )}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="flex-1 rounded-full bg-white/10 px-4 py-2.5 text-base text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-cyan-400"
        type="text"
        maxLength={MAX_LENGTH}
        placeholder={`Message #${roomId}`}
        aria-label="Message"
        autoComplete="off"
      />
      <button
        type="submit"
        disabled={sending || !input.trim()}
        aria-label="Send message"
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 text-white shadow-lg transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <SendIcon />
      </button>
    </form>
  );
};

export default SendMessage;
