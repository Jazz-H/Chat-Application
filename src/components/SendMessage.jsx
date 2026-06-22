import React, { useState } from "react";
import { auth, db } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

const MAX_LENGTH = 500;

const style = {
  form: `h-14 w-full max-w-[728px] rounded-md sticky bg-black flex items-stretch text-xl absolute bottom-0 z-50`,
  input: `w-full h-14 rounded-md text-xl bg-gray-500 text-white outline-none focus:ring-2 focus:ring-green-400 py-0 px-4 border-none`,
  button: `w-[14%] bg-green-500 hover:bg-green-700 rounded-md text-white z-50 disabled:bg-gray-600 disabled:cursor-not-allowed`,
  error: `absolute -top-8 left-0 right-0 text-sm text-red-300 bg-black/60 rounded px-2 py-1`,
};

const SendMessage = () => {
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const sendMessage = async (e) => {
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
