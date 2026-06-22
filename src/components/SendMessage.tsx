import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { auth, db } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useTyping } from "../hooks/useTyping";
import { uploadRoomImage, MAX_IMAGE_BYTES } from "../lib/storage";

const MAX_LENGTH = 500;

const SendIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
    <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
  </svg>
);

const ImageIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="9" cy="9" r="2" />
    <path d="M21 15l-5-5L5 21" />
  </svg>
);

interface SendMessageProps {
  roomId: string;
}

const SendMessage = ({ roomId }: SendMessageProps) => {
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const { notifyTyping, clearTyping } = useTyping(roomId);

  const pickImage = (e: ChangeEvent<HTMLInputElement>) => {
    const chosen = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file
    if (!chosen) return;
    if (!chosen.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (chosen.size > MAX_IMAGE_BYTES) {
      setError("Image must be under 5 MB.");
      return;
    }
    setError("");
    if (preview) URL.revokeObjectURL(preview);
    setFile(chosen);
    setPreview(URL.createObjectURL(chosen));
  };

  const clearImage = () => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
  };

  const sendMessage = async (e: FormEvent) => {
    e.preventDefault();

    const text = input.trim();
    if ((!text && !file) || sending) return;

    const user = auth.currentUser;
    if (!user) {
      setError("You must be signed in to send messages.");
      return;
    }

    setSending(true);
    setError("");

    try {
      let imageUrl: string | undefined;
      if (file) imageUrl = await uploadRoomImage(roomId, file);

      await addDoc(collection(db, "rooms", roomId, "messages"), {
        text,
        name: user.displayName || "Guest",
        uid: user.uid,
        timestamp: serverTimestamp(),
        ...(imageUrl ? { imageUrl } : {}),
      });

      setInput("");
      clearImage();
      clearTyping();
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
      className="flex shrink-0 flex-col gap-2 border-t border-blue-500/20 bg-black/50 p-3 backdrop-blur-xl"
    >
      {error && (
        <p className="rounded-md bg-red-500/90 px-3 py-1 text-sm text-white">
          {error}
        </p>
      )}

      {preview && (
        <div className="relative w-fit">
          <img
            src={preview}
            alt="Selected attachment"
            className="h-20 w-20 rounded-lg object-cover ring-1 ring-white/10"
          />
          <button
            type="button"
            onClick={clearImage}
            aria-label="Remove image"
            className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-slate-800 text-xs text-white ring-1 ring-white/20 hover:bg-slate-700"
          >
            ✕
          </button>
        </div>
      )}

      <div className="flex items-center gap-2">
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          onChange={pickImage}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInput.current?.click()}
          disabled={sending}
          aria-label="Attach image"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white/60 hover:bg-white/10 hover:text-white disabled:opacity-40"
        >
          <ImageIcon />
        </button>

        <input
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            if (e.target.value.trim()) notifyTyping();
            else clearTyping();
          }}
          className="flex-1 rounded-full bg-white/5 px-4 py-2.5 text-base text-white placeholder-white/40 outline-none ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-blue-400"
          type="text"
          maxLength={MAX_LENGTH}
          placeholder={`Message #${roomId}`}
          aria-label="Message"
          autoComplete="off"
        />

        <button
          type="submit"
          disabled={sending || (!input.trim() && !file)}
          aria-label="Send message"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg shadow-blue-500/30 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {sending ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          ) : (
            <SendIcon />
          )}
        </button>
      </div>
    </form>
  );
};

export default SendMessage;
