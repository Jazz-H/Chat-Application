import { useState, type FormEvent } from "react";
import { auth, db } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

const MAX_LENGTH = 500;

const style = {
  form: `relative flex h-14 w-full shrink-0 items-stretch bg-black text-xl`,
  input: `h-14 w-full border-none bg-gray-500 px-4 text-xl text-white outline-none focus:ring-2 focus:ring-inset focus:ring-green-400`,
  button: `w-24 shrink-0 bg-green-500 text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-600`,
  error: `absolute -top-8 left-0 right-0 rounded bg-black/60 px-2 py-1 text-sm text-red-300`,
};

const SendMessage = () => {
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
      await addDoc(collection(db, "ChatMessages"), {
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
    <form onSubmit={sendMessage} className={style.form}>
      {error && <p className={style.error}>{error}</p>}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className={style.input}
        type="text"
        maxLength={MAX_LENGTH}
        placeholder="Message"
        id="message"
        aria-label="Message"
        autoComplete="off"
      />
      <button
        className={style.button}
        type="submit"
        disabled={sending || !input.trim()}
      >
        {sending ? "…" : "Send"}
      </button>
    </form>
  );
};

export default SendMessage;
